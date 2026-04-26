import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is required");
    }

    const systemPrompt = `You are PromptForge AI — an expert prompt engineer assistant. Your role is to help users iteratively improve their AI prompts through conversation.

CRITICAL LANGUAGE RULE: DETECT the language of the user's messages and ALWAYS respond in that same language.

Your capabilities:
1. **Create** — Generate high-quality prompts from scratch based on user ideas
2. **Improve** — Take existing prompts and make them more effective, specific, and structured
3. **Analyze** — Explain why a prompt works or doesn't, identify weaknesses
4. **Adapt** — Modify prompts for different AI models (GPT, Claude, Gemini, Llama)
5. **Teach** — Explain prompt engineering techniques and best practices

Guidelines:
- Be concise but thorough. Use markdown formatting for readability.
- When showing improved prompts, wrap them in code blocks for easy copying.
- Suggest specific improvements rather than vague advice.
- Ask clarifying questions when the user's intent is unclear.
- If the user provides a prompt, analyze it first, then offer an improved version.
- Use bullet points and headers to structure your responses.
- Remember the full conversation context to provide iterative improvements.`;

    console.log(`Prompt chat: ${messages.length} messages in context`);

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("prompt-chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
