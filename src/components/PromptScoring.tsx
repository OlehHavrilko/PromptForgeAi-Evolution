import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Loader2, Lightbulb, ThumbsUp, ArrowUp, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptScoringProps {
  prompt: string;
}

interface CriteriaScore {
  score: number;
  comment: string;
}

interface ScoringResult {
  overall_score: number;
  criteria: {
    clarity: CriteriaScore;
    specificity: CriteriaScore;
    structure: CriteriaScore;
    context: CriteriaScore;
    actionability: CriteriaScore;
  };
  strengths: string[];
  improvements: string[];
  improved_prompt: string;
}

export const PromptScoring = ({ prompt }: PromptScoringProps) => {
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleScore = async () => {
    if (!prompt.trim()) return;

    setIsScoring(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('score-prompt', {
        body: { prompt }
      });

      if (error) throw error;

      if (data?.result) {
        setResult(data.result);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Score prompt error:', error);
      toast({
        title: t('errorOccurred'),
        description: error instanceof Error ? error.message : t('errorOccurred'),
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };

  const handleCopyImproved = async () => {
    if (!result?.improved_prompt) return;
    
    try {
      await navigator.clipboard.writeText(result.improved_prompt);
      setCopied(true);
      toast({
        title: t('promptCopied'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const criteriaLabels: Record<string, Record<string, string>> = {
    en: {
      clarity: "Clarity",
      specificity: "Specificity",
      structure: "Structure",
      context: "Context",
      actionability: "Actionability"
    },
    ru: {
      clarity: "Ясность",
      specificity: "Конкретность",
      structure: "Структура",
      context: "Контекст",
      actionability: "Действенность"
    },
    ua: {
      clarity: "Ясність",
      specificity: "Конкретність",
      structure: "Структура",
      context: "Контекст",
      actionability: "Дієвість"
    }
  };

  const labels = criteriaLabels[language] || criteriaLabels.en;

  const sectionLabels = {
    en: {
      score: "Prompt Score",
      analyze: "Analyze Quality",
      analyzing: "Analyzing...",
      strengths: "Strengths",
      improvements: "Improvements",
      improvedPrompt: "Improved Prompt"
    },
    ru: {
      score: "Оценка промпта",
      analyze: "Анализ качества",
      analyzing: "Анализ...",
      strengths: "Сильные стороны",
      improvements: "Рекомендации",
      improvedPrompt: "Улучшенный промпт"
    },
    ua: {
      score: "Оцінка промпту",
      analyze: "Аналіз якості",
      analyzing: "Аналіз...",
      strengths: "Сильні сторони",
      improvements: "Рекомендації",
      improvedPrompt: "Покращений промпт"
    }
  };

  const sectionText = sectionLabels[language as keyof typeof sectionLabels] || sectionLabels.en;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{sectionText.score}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleScore}
          disabled={isScoring || !prompt.trim()}
          className="gap-2"
        >
          {isScoring ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {sectionText.analyzing}
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4" />
              {sectionText.analyze}
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Overall Score */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className={cn("text-4xl font-bold", getScoreColor(result.overall_score))}>
              {result.overall_score}
            </div>
            <div className="flex-1">
              <Progress 
                value={result.overall_score} 
                className="h-3"
              />
            </div>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>

          {/* Criteria Scores */}
          <div className="grid gap-3">
            {Object.entries(result.criteria).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{labels[key]}</span>
                  <span className={cn("font-medium", getScoreColor(value.score * 10))}>
                    {value.score}/10
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", getProgressColor(value.score))}
                      style={{ width: `${value.score * 10}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{value.comment}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ThumbsUp className="w-4 h-4 text-green-500" />
                {sectionText.strengths}
              </div>
              <ul className="space-y-1">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {sectionText.improvements}
              </div>
              <ul className="space-y-1">
                {result.improvements.map((improvement, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ArrowUp className="w-3 h-3 text-yellow-500 mt-1 shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improved Prompt */}
          {result.improved_prompt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ArrowUp className="w-4 h-4 text-primary" />
                  {sectionText.improvedPrompt}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyImproved}
                  className="gap-2 h-7"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? t('copied') : t('copy')}
                </Button>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground max-h-40 overflow-y-auto">
                {result.improved_prompt}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
