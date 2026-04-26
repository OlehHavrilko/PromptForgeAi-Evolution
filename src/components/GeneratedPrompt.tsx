import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Check, Wand2, Download, FileText, FileJson, FileCode, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ApiCodeExport } from "@/components/ApiCodeExport";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedPromptProps {
  prompt: string;
  isGenerating: boolean;
  inputText?: string;
  title?: string;
  onEnhance?: (enhanced: string) => void;
}

type ExportFormat = "txt" | "json" | "md";

export function GeneratedPrompt({ prompt, isGenerating, inputText = "", title = "Generated Prompt", onEnhance }: GeneratedPromptProps) {
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!prompt || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-prompt', {
        body: { prompt },
      });
      if (error) throw error;
      if (data?.result) {
        onEnhance?.(data.result);
        toast.success("Prompt enhanced!");
      } else if (data?.error) throw new Error(data.error);
    } catch (e: any) {
      console.error("Enhance error:", e);
      toast.error(e?.message || "Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateExportContent = (format: ExportFormat): string => {
    const timestamp = new Date().toISOString();
    switch (format) {
      case "txt":
        return `${title}\n${"=".repeat(title.length)}\n\nGenerated: ${timestamp}\n\n--- Original Input ---\n${inputText || "N/A"}\n\n--- Generated Prompt ---\n${prompt}`;
      case "json":
        return JSON.stringify({ title, generatedAt: timestamp, inputText: inputText || null, generatedPrompt: prompt, metadata: { version: "1.0", source: "PromptForge" } }, null, 2);
      case "md":
        return `# ${title}\n\n**Generated:** ${timestamp}\n\n## Original Input\n\n\`\`\`\n${inputText || "N/A"}\n\`\`\`\n\n## Generated Prompt\n\n\`\`\`\n${prompt}\n\`\`\`\n\n---\n*Exported from PromptForge*`;
      default:
        return prompt;
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (!prompt) return;
    const content = generateExportContent(format);
    const mimeTypes: Record<ExportFormat, string> = { txt: "text/plain", json: "application/json", md: "text/markdown" };
    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">Generated Prompt</span>
        </div>
        {prompt && (
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEnhance} 
              disabled={isEnhancing}
              className="gap-1.5 h-7 text-xs text-primary hover:text-primary"
            >
              {isEnhancing ? (
                <><Sparkles className="w-3 h-3 animate-spin" /><span>Enhancing...</span></>
              ) : (
                <><Sparkles className="w-3 h-3" /><span>Enhance</span></>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 h-7 text-xs">
              {copied ? <><Check className="w-3 h-3 text-primary" /><span className="text-primary">Copied</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
            </Button>
            <ApiCodeExport prompt={prompt} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs">
                  <Download className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("txt")} className="gap-2 cursor-pointer text-xs">
                  <FileText className="w-3.5 h-3.5" /> TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")} className="gap-2 cursor-pointer text-xs">
                  <FileJson className="w-3.5 h-3.5" /> JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("md")} className="gap-2 cursor-pointer text-xs">
                  <FileCode className="w-3.5 h-3.5" /> Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className={cn(
        "relative flex-1 min-h-[160px] rounded-lg border transition-all duration-300",
        prompt ? "border-accent/30 bg-accent/5" : "border-border/50 bg-card/30"
      )}>
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Wand2 className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-muted-foreground animate-pulse">Crafting your prompt...</p>
            </div>
          </div>
        ) : prompt ? (
          <div className="p-4 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap overflow-auto h-full">
            {prompt}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground/50 text-xs">Your optimized prompt will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
