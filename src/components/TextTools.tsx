import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ScanSearch, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TextTools() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<"humanize" | "detect" | null>(null);
  const { toast } = useToast();

  const handleAction = async (action: "humanize" | "detect") => {
    if (!inputText.trim()) {
      toast({
        title: "Введите текст",
        description: "Пожалуйста, введите текст для обработки.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setActiveAction(action);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke("text-tools", {
        body: { text: inputText, action },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
      toast({
        title: action === "humanize" ? "Текст гуманизирован" : "Анализ завершён",
        description: action === "humanize" ? "Текст успешно переписан." : "AI-детекция завершена.",
      });
    } catch (error) {
      console.error("Text tools error:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при обработке.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Скопировано",
        description: "Результат скопирован в буфер обмена.",
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать текст.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Текстовые инструменты</h3>
      </div>

      <Textarea
        placeholder="Вставьте текст для гуманизации или проверки на AI..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none"
      />

      <div className="flex gap-3">
        <Button
          onClick={() => handleAction("humanize")}
          disabled={isLoading}
          className={cn(
            "flex-1 gap-2",
            "bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent"
          )}
        >
          {isLoading && activeAction === "humanize" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Гуманизировать
        </Button>
        
        <Button
          onClick={() => handleAction("detect")}
          disabled={isLoading}
          variant="outline"
          className="flex-1 gap-2 border-border/50 hover:bg-secondary/50"
        >
          {isLoading && activeAction === "detect" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ScanSearch className="w-4 h-4" />
          )}
          AI Детектор
        </Button>
      </div>

      {result && (
        <div className="relative">
          <div className="p-4 rounded-lg bg-background/30 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Результат
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {result}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
