import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { UserMenu } from "@/components/UserMenu";
import ReactMarkdown from "react-markdown";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Bot,
  User,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompt-chat`;

const SUGGESTIONS: Record<string, string[]> = {
  en: [
    "Help me write a prompt for code review",
    "Improve this prompt: 'Write me a blog post about AI'",
    "What makes a great prompt? Teach me the basics",
    "Create a prompt for generating marketing copy",
  ],
  ru: [
    "Помоги написать промпт для код-ревью",
    "Улучши этот промпт: 'Напиши статью про AI'",
    "Что делает промпт отличным? Научи основам",
    "Создай промпт для генерации маркетингового текста",
  ],
  ua: [
    "Допоможи написати промпт для код-рев'ю",
    "Покращ цей промпт: 'Напиши статтю про AI'",
    "Що робить промпт відмінним? Навчи основам",
    "Створи промпт для генерації маркетингового тексту",
  ],
};

const PromptChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = {
    title: { en: "Prompt Chat", ru: "Чат с промптами", ua: "Чат з промптами" },
    subtitle: {
      en: "Iteratively improve your prompts through dialogue",
      ru: "Итеративно улучшайте промпты через диалог",
      ua: "Ітеративно покращуйте промпти через діалог",
    },
    placeholder: {
      en: "Describe what you need or paste a prompt to improve...",
      ru: "Опишите задачу или вставьте промпт для улучшения...",
      ua: "Опишіть завдання або вставте промпт для покращення...",
    },
    send: { en: "Send", ru: "Отправить", ua: "Надіслати" },
    clear: { en: "Clear chat", ru: "Очистить чат", ua: "Очистити чат" },
    back: { en: "Back", ru: "Назад", ua: "Назад" },
    welcome: {
      en: "👋 Hi! I'm your prompt engineering assistant. Tell me what you need or paste a prompt — I'll help improve it step by step.",
      ru: "👋 Привет! Я ваш ассистент по промпт-инженерии. Расскажите, что вам нужно, или вставьте промпт — я помогу его улучшить пошагово.",
      ua: "👋 Привіт! Я ваш асистент з промпт-інженерії. Розкажіть, що вам потрібно, або вставте промпт — я допоможу покращити його покроково.",
    },
    suggestions: { en: "Try asking:", ru: "Попробуйте:", ua: "Спробуйте:" },
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const streamChat = useCallback(async (allMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (resp.status === 429) {
      toast.error(language === "en" ? "Too many requests, please wait" : language === "ua" ? "Забагато запитів, зачекайте" : "Слишком много запросов, подождите");
      return;
    }
    if (resp.status === 402) {
      toast.error(language === "en" ? "Usage limit reached" : language === "ua" ? "Ліміт вичерпано" : "Лимит исчерпан");
      return;
    }
    if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";
    let streamDone = false;

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) upsert(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) upsert(content);
        } catch { /* ignore */ }
      }
    }
  }, [language]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg: Message = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(updated);
    } catch (e) {
      console.error(e);
      toast.error(language === "en" ? "Something went wrong" : language === "ua" ? "Щось пішло не так" : "Что-то пошло не так");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const copyMessage = async (content: string, idx: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/app")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">{t.title[language]}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{t.subtitle[language]}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={() => setMessages([])}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.clear[language]}</span>
              </Button>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10">
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="p-4 rounded-2xl bg-primary/10 mb-6">
                <Wand2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gradient">{t.title[language]}</h2>
              <p className="text-muted-foreground max-w-md mb-8">{t.welcome[language]}</p>

              <div className="w-full max-w-lg space-y-3">
                <p className="text-sm text-muted-foreground font-medium">{t.suggestions[language]}</p>
                {(SUGGESTIONS[language] || SUGGESTIONS.en).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="w-full text-left p-3 rounded-xl glass-card hover:border-primary/30 transition-colors text-sm text-foreground/80 hover:text-foreground"
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-2 text-primary" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="shrink-0 mt-1">
                    <div className="p-1.5 rounded-lg bg-primary/15">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm overflow-hidden min-w-0",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass-card rounded-bl-md"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1 prose-pre:my-2 prose-code:text-primary prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/50 overflow-x-auto [&_pre]:overflow-x-auto [&_code]:break-words [&_table]:block [&_table]:overflow-x-auto">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {/* Copy button */}
                  <button
                    onClick={() => copyMessage(msg.content, i)}
                    className={cn(
                      "absolute -bottom-3 right-2 p-1 rounded-md bg-muted/80 border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity",
                      msg.role === "user" && "bg-primary-foreground/20"
                    )}
                  >
                    {copiedIdx === i ? (
                      <Check className="w-3 h-3 text-primary" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                {msg.role === "user" && (
                  <div className="shrink-0 mt-1">
                    <div className="p-1.5 rounded-lg bg-muted">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Streaming indicator */}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="p-1.5 rounded-lg bg-primary/15 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder[language]}
              className="min-h-[44px] max-h-[160px] resize-none bg-muted/50 border-border/50"
              rows={1}
              disabled={isLoading}
            />
            <Button
              variant="gradient"
              size="icon"
              className="shrink-0 h-11 w-11"
              onClick={() => send()}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PromptChat;
