import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const PRICING: Record<string, { in: number; out: number }> = {
  "gemini-2.5-pro": { in: 1.25 / 1e6, out: 10 / 1e6 },
  "gemini-2.5-flash": { in: 0.075 / 1e6, out: 0.3 / 1e6 },
  "gemini-2.5-flash-lite": { in: 0.0375 / 1e6, out: 0.15 / 1e6 },
  "gpt-4o-mini": { in: 0.15 / 1e6, out: 0.6 / 1e6 },
  "gpt-5-mini": { in: 0.25 / 1e6, out: 2 / 1e6 },
};

function calcCost(model: string, inTok: number, outTok: number): number {
  const p = PRICING[model] ?? PRICING["gemini-2.5-flash"];
  return inTok * p.in + outTok * p.out;
}

async function callAI(model: string, messages: any[], tools?: any[], toolChoice?: any) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const body: any = { model, messages };
  if (tools) body.tools = tools;
  if (toolChoice) body.tool_choice = toolChoice;
  const t0 = Date.now();
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const latency = Date.now() - t0;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI ${res.status}: ${text}`);
  }
  const data = await res.json();
  return { data, latency };
}

const JUDGE_TOOL = [{
  type: "function",
  function: {
    name: "submit_evaluation",
    description: "Submit numeric evaluation of the candidate output.",
    parameters: {
      type: "object",
      properties: {
        score: { type: "number", description: "Score from 1 (poor) to 5 (excellent)" },
        reasoning: { type: "string", description: "Concise justification (1-3 sentences)" },
      },
      required: ["score", "reasoning"],
      additionalProperties: false,
    },
  },
}];

function percentile(arr: number[], p: number): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { dataset_id, prompt_version_id, model = "gemini-2.5-flash", judge_model = "gemini-2.5-pro", notes } = await req.json();
    if (!dataset_id) return new Response(JSON.stringify({ error: "dataset_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Load cases
    const { data: cases, error: casesErr } = await admin.from("eval_cases").select("*").eq("dataset_id", dataset_id);
    if (casesErr) throw casesErr;
    if (!cases?.length) return new Response(JSON.stringify({ error: "Dataset has no cases" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Load active prompt version (or specified)
    let version: any = null;
    if (prompt_version_id) {
      const { data } = await admin.from("prompt_template_versions").select("*").eq("id", prompt_version_id).maybeSingle();
      version = data;
    } else {
      const { data: tpl } = await admin.from("prompt_templates").select("id").eq("name", "generate-prompt").maybeSingle();
      if (tpl) {
        const { data } = await admin.from("prompt_template_versions").select("*").eq("template_id", tpl.id).eq("is_active", true).maybeSingle();
        version = data;
      }
    }
    if (!version) return new Response(JSON.stringify({ error: "No active prompt version found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Create run
    const { data: run, error: runErr } = await admin.from("eval_runs").insert({
      dataset_id,
      prompt_version_id: version.id,
      model,
      judge_model,
      status: "running",
      total_cases: cases.length,
      created_by: user.id,
      notes,
    }).select().single();
    if (runErr) throw runErr;

    // Process synchronously (small datasets); for large -> background
    const work = async () => {
      const latencies: number[] = [];
      const scores: number[] = [];
      let totalCost = 0;
      let completed = 0;

      for (const c of cases) {
        try {
          // Generate candidate
          const { data: genData, latency } = await callAI(model, [
            { role: "system", content: version.system_prompt },
            { role: "user", content: c.input_text },
          ]);
          const output = genData.choices?.[0]?.message?.content ?? "";
          const inTok = genData.usage?.prompt_tokens ?? 0;
          const outTok = genData.usage?.completion_tokens ?? 0;
          const genCost = calcCost(model, inTok, outTok);

          // Judge
          const judgePrompt = `You are an impartial AI evaluator. Score the candidate output on a 1–5 scale where 5 = excellent, 1 = poor.

# Task input
${c.input_text}

${c.reference_output ? `# Reference (gold) output\n${c.reference_output}\n` : ""}
${c.rubric ? `# Rubric\n${c.rubric}\n` : "# Rubric\nClarity, completeness, faithfulness to the task, and overall usefulness."}

# Candidate output
${output}

Call submit_evaluation with your score and brief reasoning.`;

          const { data: judgeData } = await callAI(judge_model, [
            { role: "system", content: "You are a strict but fair evaluator of AI prompt outputs." },
            { role: "user", content: judgePrompt },
          ], JUDGE_TOOL, { type: "function", function: { name: "submit_evaluation" } });

          const toolCall = judgeData.choices?.[0]?.message?.tool_calls?.[0];
          let score = 0;
          let reasoning = "";
          if (toolCall) {
            const args = JSON.parse(toolCall.function.arguments);
            score = Number(args.score) || 0;
            reasoning = args.reasoning ?? "";
          }
          const jIn = judgeData.usage?.prompt_tokens ?? 0;
          const jOut = judgeData.usage?.completion_tokens ?? 0;
          const judgeCost = calcCost(judge_model, jIn, jOut);
          const cost = genCost + judgeCost;

          await admin.from("eval_results").insert({
            run_id: run.id,
            case_id: c.id,
            generated_output: output,
            judge_score: score,
            judge_reasoning: reasoning,
            latency_ms: latency,
            input_tokens: inTok + jIn,
            output_tokens: outTok + jOut,
            cost_usd: cost,
            status: "success",
          });

          latencies.push(latency);
          scores.push(score);
          totalCost += cost;
          completed++;
          await admin.from("eval_runs").update({ completed_cases: completed }).eq("id", run.id);
        } catch (e: any) {
          await admin.from("eval_results").insert({
            run_id: run.id,
            case_id: c.id,
            status: "error",
            error_message: String(e?.message ?? e),
          });
        }
      }

      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      await admin.from("eval_runs").update({
        status: "completed",
        completed_cases: completed,
        avg_score: avg,
        p50_latency_ms: percentile(latencies, 50),
        p95_latency_ms: percentile(latencies, 95),
        total_cost_usd: totalCost,
        finished_at: new Date().toISOString(),
      }).eq("id", run.id);
    };

    // Background processing
    // @ts-ignore EdgeRuntime available in Supabase
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(work());
    } else {
      work().catch(async (e) => {
        await admin.from("eval_runs").update({ status: "failed", error_message: String(e?.message ?? e) }).eq("id", run.id);
      });
    }

    return new Response(JSON.stringify({ run_id: run.id, status: "running" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("run-eval error", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
