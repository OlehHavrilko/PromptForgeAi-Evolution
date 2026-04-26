-- Datasets
CREATE TABLE public.eval_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL DEFAULT 'generator',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.eval_datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage datasets" ON public.eval_datasets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_eval_datasets_updated_at
  BEFORE UPDATE ON public.eval_datasets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Cases
CREATE TABLE public.eval_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID NOT NULL REFERENCES public.eval_datasets(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  reference_output TEXT,
  rubric TEXT,
  weight NUMERIC NOT NULL DEFAULT 1,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_eval_cases_dataset ON public.eval_cases(dataset_id);

ALTER TABLE public.eval_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage cases" ON public.eval_cases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Runs
CREATE TABLE public.eval_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID NOT NULL REFERENCES public.eval_datasets(id) ON DELETE CASCADE,
  prompt_version_id UUID REFERENCES public.prompt_template_versions(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  judge_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-pro',
  status TEXT NOT NULL DEFAULT 'pending',
  total_cases INTEGER NOT NULL DEFAULT 0,
  completed_cases INTEGER NOT NULL DEFAULT 0,
  avg_score NUMERIC,
  p50_latency_ms INTEGER,
  p95_latency_ms INTEGER,
  total_cost_usd NUMERIC,
  error_message TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE INDEX idx_eval_runs_dataset ON public.eval_runs(dataset_id);
CREATE INDEX idx_eval_runs_version ON public.eval_runs(prompt_version_id);

ALTER TABLE public.eval_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage runs" ON public.eval_runs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Results
CREATE TABLE public.eval_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.eval_runs(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.eval_cases(id) ON DELETE CASCADE,
  generated_output TEXT,
  judge_score NUMERIC,
  judge_reasoning TEXT,
  latency_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_usd NUMERIC,
  status TEXT NOT NULL DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_eval_results_run ON public.eval_results(run_id);

ALTER TABLE public.eval_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view results" ON public.eval_results
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));