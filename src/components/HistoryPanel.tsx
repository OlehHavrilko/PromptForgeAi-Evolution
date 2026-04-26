import { useState } from 'react';
import { useGenerationHistory, GenerationHistoryItem } from '@/hooks/useGenerationHistory';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  History, 
  Wand2, 
  Image, 
  FileText, 
  Trash2, 
  Copy, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru, uk, enUS } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface HistoryPanelProps {
  onSelectItem?: (item: GenerationHistoryItem) => void;
}

export function HistoryPanel({ onSelectItem }: HistoryPanelProps) {
  const { history, loading, deleteFromHistory, fetchHistory } = useGenerationHistory();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const t = {
    title: { en: 'History', ru: 'История', ua: 'Історія' },
    all: { en: 'All', ru: 'Все', ua: 'Усе' },
    generator: { en: 'Generator', ru: 'Генератор', ua: 'Генератор' },
    humanizer: { en: 'Humanizer', ru: 'Гуманизатор', ua: 'Гуманізатор' },
    detector: { en: 'Detector', ru: 'Детектор', ua: 'Детектор' },
    imageAnalyzer: { en: 'Images', ru: 'Изображения', ua: 'Зображення' },
    empty: { en: 'No history yet', ru: 'История пуста', ua: 'Історія порожня' },
    copied: { en: 'Copied!', ru: 'Скопировано!', ua: 'Скопійовано!' },
    deleted: { en: 'Deleted', ru: 'Удалено', ua: 'Видалено' }
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

  const filteredHistory = activeTab === 'all' 
    ? history 
    : history.filter(item => item.tool_type === activeTab);

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

  const handleSelect = (item: GenerationHistoryItem) => {
    onSelectItem?.(item);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="w-4 h-4" />
          {t.title[language]}
          {history.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {history.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg glass-strong border-border/50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            {t.title[language]}
          </SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full grid grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-xs">{t.all[language]}</TabsTrigger>
            <TabsTrigger value="generator" className="text-xs">{t.generator[language]}</TabsTrigger>
            <TabsTrigger value="humanizer" className="text-xs">{t.humanizer[language]}</TabsTrigger>
            <TabsTrigger value="image_analyzer" className="text-xs">{t.imageAnalyzer[language]}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{t.empty[language]}</p>
                </div>
              ) : (
                <div className="space-y-2 pr-4">
                  {filteredHistory.map((item) => {
                    const Icon = getToolIcon(item.tool_type);
                    return (
                      <div
                        key={item.id}
                        className="group p-3 rounded-lg glass hover:bg-accent/10 transition-colors cursor-pointer"
                        onClick={() => handleSelect(item)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.input_text.slice(0, 60)}{item.input_text.length > 60 ? '...' : ''}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {item.generated_prompt.slice(0, 100)}...
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs h-5">
                                  {getToolLabel(item.tool_type)}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(item.created_at), { 
                                    addSuffix: true,
                                    locale: getLocale()
                                  })}
                                </span>
                                {item.version > 1 && (
                                  <Badge variant="secondary" className="text-xs h-5">
                                    v{item.version}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(item.generated_prompt);
                              }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
