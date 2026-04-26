import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setDescription("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setDescription("");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64: image, userPrompt: "Опиши это изображение подробно:" },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setDescription(data.description);
      toast({
        title: "Готово!",
        description: "Изображение успешно проанализировано",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось проанализировать изображение",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Анализ изображения</h3>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!image ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 group"
        >
          <div className="p-3 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors">
            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
              Нажмите для загрузки
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              PNG, JPG, WEBP до 10MB
            </p>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-48 object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            variant="gradient"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Анализирую...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Получить описание
              </>
            )}
          </Button>
        </div>
      )}

      {description && (
        <div className={cn(
          "p-4 rounded-xl border transition-all duration-300",
          "border-accent/30 bg-accent/5"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Описание</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
