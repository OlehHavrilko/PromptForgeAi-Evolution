
-- ============ ROLES SYSTEM ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PROMPT REGISTRY ============
CREATE TABLE public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read templates" ON public.prompt_templates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage templates" ON public.prompt_templates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.prompt_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.prompt_templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  system_prompt TEXT NOT NULL,
  default_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (template_id, version)
);

ALTER TABLE public.prompt_template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read versions" ON public.prompt_template_versions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage versions" ON public.prompt_template_versions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_versions_template_active ON public.prompt_template_versions(template_id, is_active) WHERE is_active = true;

-- Ensure only one active version per template
CREATE UNIQUE INDEX idx_versions_one_active ON public.prompt_template_versions(template_id) WHERE is_active = true;

-- ============ TELEMETRY ============
CREATE TABLE public.llm_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  function_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version_id UUID REFERENCES public.prompt_template_versions(id) ON DELETE SET NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  cost_usd NUMERIC(10, 6),
  latency_ms INTEGER,
  ttft_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'success',
  error_code TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.llm_traces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own traces" ON public.llm_traces
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Inserts happen from edge functions using service role; no client INSERT policy needed.

CREATE INDEX idx_llm_traces_user_created ON public.llm_traces(user_id, created_at DESC);
CREATE INDEX idx_llm_traces_function_created ON public.llm_traces(function_name, created_at DESC);
CREATE INDEX idx_llm_traces_provider_created ON public.llm_traces(provider, created_at DESC);

-- ============ SEED INITIAL PROMPT VERSIONS ============
INSERT INTO public.prompt_templates (name, description, category) VALUES
  ('generator-system', 'System prompt for /generate-prompt edge function', 'system'),
  ('enhance-system', 'System prompt for /enhance-prompt edge function', 'system');

INSERT INTO public.prompt_template_versions (template_id, version, system_prompt, default_params, is_active, notes)
SELECT id, 1,
'You are a world-class prompt engineer with deep expertise in LLM behavior, instruction design, and output optimization. Your sole task is to transform a user''s rough idea into a precisely engineered, production-ready prompt.

CRITICAL: DETECT the language of the user''s input and write the ENTIRE output in that same language.

LENGTH: {{LENGTH_INSTRUCTION}}
TONE: {{TONE_INSTRUCTION}}
STYLE: {{STYLE_INSTRUCTION}}
TARGET MODEL: {{MODEL_INSTRUCTION}}

## Prompt Engineering Framework

Follow this structure when crafting the prompt:

1. **Role & Persona** — Assign a clear expert identity with relevant domain expertise. Be specific (e.g., "You are a senior data scientist with 10 years of experience in NLP" rather than "You are an AI assistant").

2. **Context & Background** — Provide necessary context that frames the task. Include domain knowledge, audience, or situational details that shape the response.

3. **Task Definition** — State the objective precisely. Use action verbs. Break complex tasks into numbered steps or sub-tasks when appropriate.

4. **Constraints & Boundaries** — Define what to include AND what to avoid. Set scope limits, word counts, formatting rules, or content restrictions.

5. **Output Specification** — Describe the exact format, structure, and style of the desired output. Include examples of the expected format when it adds clarity.

6. **Quality Criteria** — Specify what makes the output excellent: accuracy, depth, originality, actionability, etc.

## Rules

- Return ONLY the generated prompt — no meta-commentary, no introductions, no "Here''s your prompt:"
- Never use filler phrases or generic instructions that add no value
- Every sentence must serve a functional purpose in guiding the AI
- Prefer specific, measurable instructions over vague ones ("List 5 strategies" vs "List some strategies")
- Use markdown formatting (headers, lists, bold) to improve readability and structure
- Anticipate edge cases and add guardrails where the AI might go off-track
- If the task is creative, encourage originality; if analytical, emphasize rigor and evidence',
  '{"model": "google/gemini-2.5-flash", "temperature": 0.7}'::jsonb,
  true,
  'Initial seed from hardcoded prompt in generate-prompt/index.ts'
FROM public.prompt_templates WHERE name = 'generator-system';

INSERT INTO public.prompt_template_versions (template_id, version, system_prompt, default_params, is_active, notes)
SELECT id, 1,
'You are an expert prompt refiner. Take the user''s prompt and improve it by:
- Adding clarity and structure
- Specifying role, context, task, constraints, and output format
- Removing ambiguity while preserving the original intent
- Detecting the input language and responding in the same language

Return ONLY the improved prompt, no commentary.',
  '{"model": "google/gemini-2.5-flash", "temperature": 0.6}'::jsonb,
  true,
  'Initial seed for enhance-prompt'
FROM public.prompt_templates WHERE name = 'enhance-system';
