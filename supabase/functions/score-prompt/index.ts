import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!prompt || !prompt.trim()) {
      throw new Error("Prompt is required");
    }

    const systemPrompt = `You are an expert in prompt engineering and AI prompt analysis. Analyze the given prompt and provide a quality score with detailed feedback.

CRITICAL LANGUAGE RULE: DETECT the language of the input prompt and respond ONLY in that same language.
- If prompt is in Russian → respond entirely in Russian
- If prompt is in English → respond entirely in English
- If prompt is in Ukrainian → respond entirely in Ukrainian
- And so on for ANY language

Evaluate the prompt on these criteria (each scored 0-10):
1. CLARITY - How clear and unambiguous is the prompt?
2. SPECIFICITY - How specific and detailed is the task description?
3. STRUCTURE - How well-organized and formatted is the prompt?
4. CONTEXT - Does the prompt provide sufficient context and constraints?
5. ACTIONABILITY - How actionable are the instructions for the AI?

Respond in this EXACT JSON format (translate labels to detected language):
{
  "overall_score": <number 0-100>,
  "criteria": {
    "clarity": {"score": <0-10>, "comment": "<brief comment>"},
    "specificity": {"score": <0-10>, "comment": "<brief comment>"},
    "structure": {"score": <0-10>, "comment": "<brief comment>"},
    "context": {"score": <0-10>, "comment": "<brief comment>"},
    "actionability": {"score": <0-10>, "comment": "<brief comment>"}
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "improved_prompt": "<your improved version of the prompt>"
}

Be constructive and helpful. Provide specific, actionable improvements.`;

    console.log(`Scoring prompt of ${prompt.length} characters`);

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;

    // Parse JSON from the response, handling potential markdown code blocks
    let result;
    try {
      let jsonStr = resultText;
      // Remove markdown code blocks if present
      const jsonMatch = resultText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", resultText);
      throw new Error("Failed to parse scoring response");
    }

    console.log("Prompt scoring completed successfully");

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("score-prompt error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
