import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/PromptInput";
import { OptionSlider } from "@/components/OptionSlider";
import { GeneratedPrompt } from "@/components/GeneratedPrompt";
import { PromptScoring } from "@/components/PromptScoring";

import { AdvancedSettings, AdvancedSettingsValues } from "@/components/AdvancedSettings";
import { templates, getLocalizedTemplate } from "@/lib/templates/templateData";
import { TemplateCard } from "@/components/TemplateCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import { Wand2, Save, ArrowRight, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [input, setInput] = useState("");
  const [length, setLength] = useState("Balanced");
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettingsValues>({
    tone: "neutral",
    style: "default",
    targetModel: "auto",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToHistory } = useGenerationHistory();

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedTemplate");
    if (stored) {
      try {
        const { input: templateInput } = JSON.parse(stored);
        setInput(templateInput);
        sessionStorage.removeItem("selectedTemplate");
      } catch { /* ignore */ }
    }
  }, []);

  const lengthOptions = language === 'en' 
    ? ["Concise", "Balanced", "Detailed"]
    : language === 'ua'
    ? ["Стислий", "Збалансований", "Детальний"]
    : ["Краткий", "Сбалансированный", "Детальный"];

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      toast({ title: t('errorOccurred'), description: t('enterIdea'), variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setGeneratedPrompt("");

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-prompt`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ input, length, tone: advancedSettings.tone, style: advancedSettings.style, targetModel: advancedSettings.targetModel }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullResult = "";
      let streamDone = false;

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
            if (content) {
              fullResult += content;
              setGeneratedPrompt(fullResult);
            }
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
            if (content) {
              fullResult += content;
              setGeneratedPrompt(fullResult);
            }
          } catch { /* ignore */ }
        }
      }

      if (fullResult && user) {
        await addToHistory({ input_text: input, generated_prompt: fullResult, tool_type: 'generator', length_setting: length, tone: advancedSettings.tone, style: advancedSettings.style, target_model: advancedSettings.targetModel, parent_id: null });
      }
      if (fullResult) {
        toast({ title: t('promptGenerated'), description: language === 'en' ? "Your optimized prompt is ready." : language === 'ua' ? "Ваш промпт готовий." : "Ваш промпт готов." });
      }
    } catch (error) {
      console.error('Generate prompt error:', error);
      toast({ title: t('errorOccurred'), description: error instanceof Error ? error.message : t('errorOccurred'), variant: "destructive" });
    } finally { setIsGenerating(false); }
  }, [input, length, advancedSettings, toast, t, language, user, limits, canGenerate, incrementUsage, addToHistory]);

  const handleSavePrompt = async () => {
    if (!user) { toast({ title: t('signInRequired'), description: t('signInRequired'), variant: "destructive" }); return; }
    if (!generatedPrompt) { toast({ title: t('errorOccurred'), description: t('noPromptYet'), variant: "destructive" }); return; }
    setIsSaving(true);
    try {
      const title = input.slice(0, 50) + (input.length > 50 ? '...' : '');
      const { error } = await supabase.from('saved_prompts').insert({ user_id: user.id, title, input_text: input, generated_prompt: generatedPrompt, length_setting: length });
      if (error) throw error;
      toast({ title: t('promptSaved'), description: language === 'en' ? "Prompt saved" : language === 'ua' ? "Промпт збережено" : "Промпт сохранён" });
    } catch { toast({ title: t('errorOccurred'), description: t('errorOccurred'), variant: "destructive" }); }
    finally { setIsSaving(false); }
  };

  const handleTemplateClick = (template: typeof templates[0]) => {
    const localized = getLocalizedTemplate(template, language);
    setInput(localized.defaultInput + " ");
  };

  const displayedTemplates = templates.slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      {/* Main generator area */}
      <div className="flex-1 grid lg:grid-cols-2 gap-0 min-h-0">
        {/* Left: Input panel */}
        <div className="flex flex-col border-r border-border/30 p-5 gap-4 overflow-auto">
          <PromptInput value={input} onChange={setInput} placeholder={t('enterIdea')} />
          <OptionSlider label={t('length')} options={lengthOptions} selected={length} onSelect={setLength} />
          <AdvancedSettings values={advancedSettings} onChange={setAdvancedSettings} />
          <Button variant="gradient" size="xl" className="w-full mt-auto" onClick={handleGenerate} disabled={isGenerating}>
            <Wand2 className="w-5 h-5" />
            {isGenerating ? t('generating') : t('generate')}
          </Button>
        </div>

        {/* Right: Output panel */}
        <div className="flex flex-col p-5 gap-4 overflow-auto">
          <div className="relative flex-1 flex flex-col">
            <GeneratedPrompt prompt={generatedPrompt} isGenerating={isGenerating} inputText={input} title={input.slice(0, 50) || "Generated Prompt"} onEnhance={(enhanced) => setGeneratedPrompt(enhanced)} />
            {generatedPrompt && (
              <Button variant="outline" size="sm" className="absolute top-3 right-3 gap-1.5" onClick={handleSavePrompt} disabled={isSaving}>
                <Save className="w-3.5 h-3.5" />
                {isSaving ? t('saving') : t('save')}
              </Button>
            )}
          </div>
          {generatedPrompt && (
            <div className="glass-strong rounded-xl p-4">
              <PromptScoring prompt={generatedPrompt} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Templates strip */}
      <div className="border-t border-border/30 p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('templates')}</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/templates")} className="gap-1.5 text-xs h-7">
            <LayoutGrid className="w-3 h-3" />
            {language === 'en' ? 'All' : language === 'ua' ? 'Усі' : 'Все'}
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {displayedTemplates.map((template) => {
            const localized = getLocalizedTemplate(template, language);
            return (
              <TemplateCard key={template.id} title={localized.title} description={localized.description} icon={template.icon} example={localized.example} onClick={() => handleTemplateClick(template)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
