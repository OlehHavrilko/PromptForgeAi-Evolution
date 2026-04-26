import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Braces, Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PromptVariablesProps {
  prompt: string;
  onFilledPrompt: (filled: string) => void;
}

function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2).trim()))];
}

export function PromptVariables({ prompt, onFilledPrompt }: PromptVariablesProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const variables = useMemo(() => extractVariables(prompt), [prompt]);

  const filledPrompt = useMemo(() => {
    let result = prompt;
    for (const v of variables) {
      const val = values[v]?.trim();
      if (val) {
        result = result.split(`{{${v}}}`).join(val);
      }
    }
    return result;
  }, [prompt, variables, values]);

  const allFilled = variables.length > 0 && variables.every((v) => values[v]?.trim());

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(filledPrompt);
    setCopied(true);
    onFilledPrompt(filledPrompt);
    setTimeout(() => setCopied(false), 2000);
  }, [filledPrompt, onFilledPrompt]);

  const handleReset = () => setValues({});

  if (variables.length === 0) return null;

  const labels = {
    en: { title: "Variables", apply: "Copy filled prompt", reset: "Reset" },
    ru: { title: "Переменные", apply: "Скопировать заполненный", reset: "Сброс" },
    ua: { title: "Змінні", apply: "Скопіювати заповнений", reset: "Скинути" },
  };
  const t = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Braces className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.title} ({variables.length})
          </span>
        </div>
        {Object.keys(values).length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 text-[10px] gap-1 text-muted-foreground">
            <RotateCcw className="w-3 h-3" />
            {t.reset}
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        {variables.map((v) => (
          <div key={v} className="flex items-center gap-2">
            <code className="shrink-0 text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded-md min-w-[80px] text-center">
              {`{{${v}}}`}
            </code>
            <Input
              value={values[v] || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
              placeholder={v}
              className="h-7 text-xs bg-card/50 border-border/50"
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={!allFilled}
        className={cn(
          "w-full gap-2 h-8 text-xs transition-all",
          allFilled && "border-primary/40 text-primary hover:bg-primary/10"
        )}
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
        ) : (
          <><Copy className="w-3.5 h-3.5" /><span>{t.apply}</span></>
        )}
      </Button>
    </div>
  );
}
