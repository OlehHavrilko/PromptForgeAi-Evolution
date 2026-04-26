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
    const { text, action } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!text || !text.trim()) {
      throw new Error("Text is required");
    }

    let systemPrompt = "";
    
    if (action === "humanize") {
      systemPrompt = `You are an expert in deep text rewriting. Your task is to COMPLETELY rewrite the source text in your own words so it sounds natural and human-like.

CRITICAL RULES:
- DETECT the language of the input text and respond ONLY in that same language
- If text is in Russian → respond in Russian
- If text is in English → respond in English  
- If text is in Spanish → respond in Spanish
- And so on for ANY language

Content rules:
- Preserve the original meaning, facts, and author's tone
- Completely rephrase every sentence without adding introductions or conclusions
- DO NOT add phrases like "Here is the rewritten text:", no comments, explanations or conclusions
- DO NOT duplicate the source text, work only with new formulations
- Make the text more lively, natural and human-like
- Vary sentence length and structure, avoid template AI phrases

Return ONLY the new rewritten text without any explanations or additional phrases before or after it.`;
    } else if (action === "detect") {
      systemPrompt = `You are an expert in analyzing text for AI generation. Analyze the text and determine the likelihood that it was written by artificial intelligence.

CRITICAL LANGUAGE RULE: DETECT the language of the input text and respond ONLY in that same language.
- If text is in Russian → respond entirely in Russian
- If text is in English → respond entirely in English
- If text is in Spanish → respond entirely in Spanish
- And so on for ANY language

Analysis criteria:
- Template structure and phrases
- Excessive formality or perfection of text
- Lack of personal opinions and emotions
- Typical AI patterns in sentence construction
- Repetitive constructions

Respond in this format (translated to the detected language):
🤖 AI Probability: XX%

📊 AI Signs:
- [sign 1]
- [sign 2]
...

✍️ Human Signs:
- [sign 1]
- [sign 2]
...

📝 Conclusion: [brief conclusion]`;
    } else {
      throw new Error("Invalid action. Use 'humanize' or 'detect'");
    }

    console.log(`Processing ${action} request for text of ${text.length} characters`);

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
          { role: "user", content: text }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Требуется пополнение баланса." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    console.log(`${action} completed successfully`);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("text-tools error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
