import { useNavigate } from "react-router-dom";
import { useGenerationHistory, GenerationHistoryItem } from "@/hooks/useGenerationHistory";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/UserMenu";
import { 
  History, 
  ArrowLeft, 
  Wand2, 
  Image, 
  FileText, 
  Trash2, 
  Copy, 
  Clock,
  ExternalLink,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru, uk, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { history, loading, deleteFromHistory } = useGenerationHistory();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");

  const t = {
    title: { en: 'Generation History', ru: 'История генераций', ua: 'Історія генерацій' },
    back: { en: 'Back', ru: 'Назад', ua: 'Назад' },
    all: { en: 'All', ru: 'Все', ua: 'Усе' },
    generator: { en: 'Generator', ru: 'Генератор', ua: 'Генератор' },
    humanizer: { en: 'Humanizer', ru: 'Гуманизатор', ua: 'Гуманізатор' },
    detector: { en: 'Detector', ru: 'Детектор', ua: 'Детектор' },
    imageAnalyzer: { en: 'Images', ru: 'Изображения', ua: 'Зображення' },
    empty: { en: 'No history yet', ru: 'История пуста', ua: 'Історія порожня' },
    emptyDescription: { 
      en: 'Start generating prompts to see them here', 
      ru: 'Начните генерировать промпты, чтобы увидеть их здесь', 
      ua: 'Почніть генерувати промпти, щоб побачити їх тут' 
    },
    copied: { en: 'Copied!', ru: 'Скопировано!', ua: 'Скопійовано!' },
    deleted: { en: 'Deleted', ru: 'Удалено', ua: 'Видалено' },
    openInApp: { en: 'Open in app', ru: 'Открыть в приложении', ua: 'Відкрити в додатку' },
    signInRequired: { en: 'Sign in to view history', ru: 'Войдите для просмотра истории', ua: 'Увійдіть для перегляду історії' },
    filterBy: { en: 'Filter by type', ru: 'Фильтр по типу', ua: 'Фільтр за типом' }
  };

  const getLocale = () => {
    switch (language) {
      case 'ru': return ru;
      case 'ua': return uk;
      default: return enUS;
    }
  };

  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case 'generator': return Wand2;
      case 'image_analyzer': return Image;
      default: return FileText;
    }
  };

  const getToolLabel = (toolType: string) => {
    const labels: Record<string, Record<string, string>> = {
      generator: t.generator,
      humanizer: t.humanizer,
      detector: t.detector,
      image_analyzer: t.imageAnalyzer
    };
    return labels[toolType]?.[language] || toolType;
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.tool_type === filter);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: t.copied[language] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteFromHistory(id);
    if (!error) {
      toast({ title: t.deleted[language] });
    }
  };

  const handleOpenInApp = (item: GenerationHistoryItem) => {
    sessionStorage.setItem("historyItem", JSON.stringify(item));
    navigate("/app");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg text-muted-foreground">{t.signInRequired[language]}</p>
          <Button variant="macos" className="mt-4" onClick={() => navigate("/auth")}>
            {language === 'en' ? 'Sign In' : language === 'ua' ? 'Увійти' : 'Войти'}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-12">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/app")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back[language]}
          </Button>
          <UserMenu />
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <History className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t.title[language]}</h1>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-3 mt-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue placeholder={t.filterBy[language]} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all[language]}</SelectItem>
                <SelectItem value="generator">{t.generator[language]}</SelectItem>
                <SelectItem value="humanizer">{t.humanizer[language]}</SelectItem>
                <SelectItem value="detector">{t.detector[language]}</SelectItem>
                <SelectItem value="image_analyzer">{t.imageAnalyzer[language]}</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-2">
              {filteredHistory.length} {language === 'en' ? 'items' : language === 'ua' ? 'записів' : 'записей'}
            </Badge>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-20 glass-strong rounded-2xl">
            <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-medium text-foreground mb-2">{t.empty[language]}</h3>
            <p className="text-muted-foreground mb-6">{t.emptyDescription[language]}</p>
            <Button variant="macos" onClick={() => navigate("/app")}>
              {language === 'en' ? 'Start Generating' : language === 'ua' ? 'Почати генерацію' : 'Начать генерацию'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const Icon = getToolIcon(item.tool_type);
              return (
                <div
                  key={item.id}
                  className="group p-4 rounded-xl glass-strong hover:bg-accent/10 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {item.input_text}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                            {item.generated_prompt}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenInApp(item)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopy(item.generated_prompt)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {getToolLabel(item.tool_type)}
                        </Badge>
                        {item.length_setting && (
                          <Badge variant="secondary" className="text-xs">
                            {item.length_setting}
                          </Badge>
                        )}
                        {item.version > 1 && (
                          <Badge className="text-xs bg-primary/20 text-primary">
                            v{item.version}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(item.created_at), { 
                            addSuffix: true,
                            locale: getLocale()
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
