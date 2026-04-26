import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { trace, getUserIdFromAuth, getActivePromptVersion } from "../_shared/trace.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FALLBACK_SYSTEM = `You are an elite prompt optimization specialist. Your task is to take an existing prompt and dramatically improve it while preserving the original intent.

CRITICAL: Detect the language of the input prompt and write the entire enhanced version in that same language.

Return ONLY the enhanced prompt — no meta-commentary.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  const userId = await getUserIdFromAuth(req.headers.get("Authorization"));
  const provider = "gemini";
  let model = "gemini-2.5-flash";
  let promptVersionId: string | null = null;

  try {
    const { prompt } = await req.json();
    if (!prompt || !prompt.trim()) throw new Error("Prompt is required");

    const version = await getActivePromptVersion("enhance-system");
    const systemPrompt = version?.system_prompt ?? FALLBACK_SYSTEM;
    promptVersionId = version?.id ?? null;
    if (version?.default_params && typeof (version.default_params as any).model === "string") {
      model = (version.default_params as any).model;
    }

    const userPrompt = `Enhance and optimize this prompt:\n\n${prompt}`;
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GEMINI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw { status: 429, message: "Rate limit exceeded. Please try again later." };
      if (res.status === 402) throw { status: 402, message: "Payment required." };
      throw new Error("AI gateway error");
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content;
    const usage = data.usage ?? {};

    await trace({
      user_id: userId,
      function_name: "enhance-prompt",
      provider,
      model,
      prompt_version_id: promptVersionId,
      input_tokens: usage.prompt_tokens ?? null,
      output_tokens: usage.completion_tokens ?? null,
      total_tokens: usage.total_tokens ?? null,
      latency_ms: Date.now() - startedAt,
      status: "success",
    });

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("enhance-prompt error:", error);
    const status = error?.status || 500;
    const message = error?.message || (error instanceof Error ? error.message : "Unknown error");

    await trace({
      user_id: userId,
      function_name: "enhance-prompt",
      provider,
      model,
      prompt_version_id: promptVersionId,
      latency_ms: Date.now() - startedAt,
      status: "error",
      error_code: String(status),
      error_message: message,
    });

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
