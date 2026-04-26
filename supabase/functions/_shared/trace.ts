// Shared LLM telemetry + prompt registry helpers for edge functions.
// Imported by generate-prompt, enhance-prompt, etc.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export interface PromptVersion {
  id: string;
  version: number;
  system_prompt: string;
  default_params: Record<string, unknown>;
}

// Rough cost table (USD per 1M tokens). Approximate — refined per provider.
const COST_TABLE: Record<string, { input: number; output: number }> = {
  "gemini-2.5-flash": { input: 0.075, output: 0.30 },
  "gemini-2.5-pro": { input: 1.25, output: 5.00 },
  "gemini-2.5-flash-lite": { input: 0.04, output: 0.15 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "gpt-5-mini": { input: 0.25, output: 1.00 },
  "claude-3-5-sonnet-20241022": { input: 3.00, output: 15.00 },
};

export function estimateCostUsd(model: string, inputTokens?: number, outputTokens?: number): number | null {
  const rates = COST_TABLE[model];
  if (!rates || inputTokens == null || outputTokens == null) return null;
  return Number((((inputTokens * rates.input) + (outputTokens * rates.output)) / 1_000_000).toFixed(6));
}

function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

export async function getUserIdFromAuth(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  try {
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data } = await client.auth.getClaims(authHeader.replace("Bearer ", ""));
    return (data?.claims?.sub as string) ?? null;
  } catch {
    return null;
  }
}

export async function getActivePromptVersion(templateName: string): Promise<PromptVersion | null> {
  try {
    const supabase = getServiceClient();
    const { data: template } = await supabase
      .from("prompt_templates")
      .select("id")
      .eq("name", templateName)
      .maybeSingle();
    if (!template) return null;
    const { data: version } = await supabase
      .from("prompt_template_versions")
      .select("id, version, system_prompt, default_params")
      .eq("template_id", template.id)
      .eq("is_active", true)
      .maybeSingle();
    return version as PromptVersion | null;
  } catch (e) {
    console.error("getActivePromptVersion failed:", e);
    return null;
  }
}

export interface TraceParams {
  user_id?: string | null;
  function_name: string;
  provider: string;
  model: string;
  prompt_version_id?: string | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  total_tokens?: number | null;
  latency_ms?: number | null;
  ttft_ms?: number | null;
  status?: "success" | "error" | "stream";
  error_code?: string | null;
  error_message?: string | null;
  metadata?: Record<string, unknown>;
}

export async function trace(params: TraceParams): Promise<void> {
  try {
    const supabase = getServiceClient();
    const cost_usd = estimateCostUsd(params.model, params.input_tokens ?? undefined, params.output_tokens ?? undefined);
    await supabase.from("llm_traces").insert({
      user_id: params.user_id ?? null,
      function_name: params.function_name,
      provider: params.provider,
      model: params.model,
      prompt_version_id: params.prompt_version_id ?? null,
      input_tokens: params.input_tokens ?? null,
      output_tokens: params.output_tokens ?? null,
      total_tokens: params.total_tokens ?? (params.input_tokens != null && params.output_tokens != null ? params.input_tokens + params.output_tokens : null),
      cost_usd,
      latency_ms: params.latency_ms ?? null,
      ttft_ms: params.ttft_ms ?? null,
      status: params.status ?? "success",
      error_code: params.error_code ?? null,
      error_message: params.error_message ?? null,
      metadata: params.metadata ?? {},
    });
  } catch (e) {
    console.error("trace insert failed:", e);
  }
}
