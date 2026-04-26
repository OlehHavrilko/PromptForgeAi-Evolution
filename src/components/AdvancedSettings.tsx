import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdvancedSettingsValues {
  tone: string;
  style: string;
  targetModel: string;
}

interface AdvancedSettingsProps {
  values: AdvancedSettingsValues;
  onChange: (values: AdvancedSettingsValues) => void;
}

const toneOptions = [
  { id: "neutral", en: "Neutral", ru: "Нейтральный", ua: "Нейтральний" },
  { id: "formal", en: "Formal", ru: "Формальный", ua: "Формальний" },
  { id: "creative", en: "Creative", ru: "Креативный", ua: "Креативний" },
  { id: "technical", en: "Technical", ru: "Технический", ua: "Технічний" },
  { id: "friendly", en: "Friendly", ru: "Дружелюбный", ua: "Дружній" },
];

const styleOptions = [
  { id: "default", en: "Default", ru: "По умолчанию", ua: "За замовчуванням" },
  { id: "instructional", en: "Instructional", ru: "Инструктивный", ua: "Інструктивний" },
  { id: "conversational", en: "Conversational", ru: "Разговорный", ua: "Розмовний" },
  { id: "academic", en: "Academic", ru: "Академический", ua: "Академічний" },
  { id: "storytelling", en: "Storytelling", ru: "Нарративный", ua: "Наративний" },
];

const modelOptions = [
  { id: "auto", en: "Auto (Best Match)", ru: "Авто (Лучший)", ua: "Авто (Найкращий)" },
  { id: "gpt", en: "GPT (OpenAI)", ru: "GPT (OpenAI)", ua: "GPT (OpenAI)" },
  { id: "claude", en: "Claude (Anthropic)", ru: "Claude (Anthropic)", ua: "Claude (Anthropic)" },
  { id: "gemini", en: "Gemini (Google)", ru: "Gemini (Google)", ua: "Gemini (Google)" },
  { id: "llama", en: "Llama (Meta)", ru: "Llama (Meta)", ua: "Llama (Meta)" },
];

export const AdvancedSettings = ({ values, onChange }: AdvancedSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();

  const labels = {
    en: {
      title: "Advanced Settings",
      tone: "Tone",
      style: "Style",
      targetModel: "Target AI Model",
    },
    ru: {
      title: "Расширенные настройки",
      tone: "Тон",
      style: "Стиль",
      targetModel: "Целевая AI-модель",
    },
    ua: {
      title: "Розширені налаштування",
      tone: "Тон",
      style: "Стиль",
      targetModel: "Цільова AI-модель",
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  const getOptionLabel = (option: { id: string; en: string; ru: string; ua: string }) => {
    return option[language as keyof typeof option] || option.en;
  };

  const handleChange = (key: keyof AdvancedSettingsValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-muted-foreground hover:text-foreground"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          <span>{t.title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50 animate-fade-in">
          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t.tone}</label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChange("tone", option.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    values.tone === option.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {getOptionLabel(option)}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t.style}</label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChange("style", option.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    values.style === option.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background border-border hover:border-accent/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {getOptionLabel(option)}
                </button>
              ))}
            </div>
          </div>

          {/* Target Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t.targetModel}</label>
            <div className="flex flex-wrap gap-2">
              {modelOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChange("targetModel", option.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    values.targetModel === option.id
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-background border-border hover:border-secondary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {getOptionLabel(option)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
