import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, Search, Star, Copy, Trash2, Zap, 
  FileText, Clock, Tag, X, Plus, Filter,
  Download, Upload
} from 'lucide-react';

interface SavedPrompt {
  id: string;
  title: string;
  input_text: string;
  generated_prompt: string;
  length_setting: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
}

const SavedPrompts = () => {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchPrompts();
  }, [user]);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('saved_prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: t('errorOccurred'), variant: 'destructive' });
    } else {
      setPrompts(data || []);
    }
    setIsLoading(false);
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    prompts.forEach(p => (p.tags || []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [prompts]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFavorite = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('saved_prompts')
      .update({ is_favorite: !currentValue })
      .eq('id', id);
    if (!error) {
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, is_favorite: !currentValue } : p));
    }
  };

  const deletePrompt = async (id: string) => {
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('id', id);
    if (!error) {
      setPrompts(prev => prev.filter(p => p.id !== id));
      toast({ title: t('promptDeleted') });
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t('promptCopied') });
  };

  const updateTags = async (id: string, newTags: string[]) => {
    const { error } = await supabase
      .from('saved_prompts')
      .update({ tags: newTags })
      .eq('id', id);
    if (!error) {
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, tags: newTags } : p));
    }
  };

  // Export all prompts as JSON
  const exportPrompts = () => {
    const data = prompts.map(({ id, title, input_text, generated_prompt, tags, length_setting, is_favorite, created_at }) => ({
      title, input_text, generated_prompt, tags, length_setting, is_favorite, created_at
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptforge-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: language === 'en' ? 'Exported!' : language === 'ua' ? 'Експортовано!' : 'Экспортировано!' });
  };

  // Export as Markdown
  const exportMarkdown = () => {
    const md = prompts.map(p => 
      `## ${p.title}\n\n**Input:** ${p.input_text}\n\n**Prompt:**\n${p.generated_prompt}\n\n**Tags:** ${(p.tags || []).join(', ') || '—'}\n**Length:** ${p.length_setting}\n**Date:** ${new Date(p.created_at).toLocaleDateString()}\n\n---\n`
    ).join('\n');
    const blob = new Blob([`# PromptForge Export\n\n${md}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptforge-export-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: language === 'en' ? 'Exported!' : language === 'ua' ? 'Експортовано!' : 'Экспортировано!' });
  };

  // Import from JSON
  const importPrompts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !user) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text) as Array<{
          title: string; input_text: string; generated_prompt: string;
          tags?: string[]; length_setting?: string; is_favorite?: boolean;
        }>;
        let imported = 0;
        for (const item of data) {
          if (!item.title || !item.input_text || !item.generated_prompt) continue;
          const { error } = await supabase.from('saved_prompts').insert({
            user_id: user.id,
            title: item.title,
            input_text: item.input_text,
            generated_prompt: item.generated_prompt,
            tags: item.tags || [],
            length_setting: item.length_setting || 'Balanced',
            is_favorite: item.is_favorite || false,
          });
          if (!error) imported++;
        }
        toast({
          title: language === 'en' ? `Imported ${imported} prompts` :
                 language === 'ua' ? `Імпортовано ${imported} промптів` :
                 `Импортировано ${imported} промптов`
        });
        fetchPrompts();
      } catch {
        toast({ title: t('errorOccurred'), variant: 'destructive' });
      }
    };
    input.click();
  };

  // Filter by search + selected tags
  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => (p.tags || []).includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [prompts, searchQuery, selectedTags]);

  const favoritePrompts = filteredPrompts.filter(p => p.is_favorite);
  const regularPrompts = filteredPrompts.filter(p => !p.is_favorite);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back' : 'Назад'}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('savedPromptsTitle')}</h1>
              <p className="text-sm text-muted-foreground">
                {prompts.length} {language === 'en' ? 'saved prompts' : 
                                  language === 'ua' ? 'збережених промптів' : 
                                  'сохранённых промптов'}
              </p>
            </div>
          </div>
          {prompts.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportPrompts} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> JSON
              </Button>
              <Button variant="outline" size="sm" onClick={exportMarkdown} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> MD
              </Button>
              <Button variant="outline" size="sm" onClick={importPrompts} className="gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                {language === 'en' ? 'Import' : language === 'ua' ? 'Імпорт' : 'Импорт'}
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'en' ? 'Search prompts or tags...' : 
                        language === 'ua' ? 'Пошук промптів або тегів...' : 
                        'Поиск промптов или тегов...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {language === 'en' ? 'Filter by tags' : language === 'ua' ? 'Фільтр за тегами' : 'Фильтр по тегам'}
              </span>
              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" className="h-5 px-1.5 text-xs" onClick={() => setSelectedTags([])}>
                  {language === 'en' ? 'Clear' : language === 'ua' ? 'Скинути' : 'Сбросить'}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors hover:bg-primary/20"
                  onClick={() => toggleTag(tag)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {prompts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('noSavedPrompts')}</h3>
            <p className="text-muted-foreground mb-4">{t('noSavedPromptsDescription')}</p>
            <Button variant="gradient" onClick={() => navigate('/app')}>
              <Zap className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Create Prompt' : language === 'ua' ? 'Створити промпт' : 'Создать промпт'}
            </Button>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {language === 'en' ? 'No prompts match your filters' : 
               language === 'ua' ? 'Немає промптів за обраними фільтрами' : 
               'Нет промптов по выбранным фильтрам'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {favoritePrompts.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {language === 'en' ? 'Favorites' : language === 'ua' ? 'Обране' : 'Избранное'}
                </h2>
                <div className="space-y-3">
                  {favoritePrompts.map(prompt => (
                    <PromptCard 
                      key={prompt.id} prompt={prompt} language={language}
                      onToggleFavorite={toggleFavorite} onDelete={deletePrompt}
                      onCopy={copyPrompt} onUpdateTags={updateTags}
                    />
                  ))}
                </div>
              </div>
            )}

            {regularPrompts.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {language === 'en' ? 'All Prompts' : language === 'ua' ? 'Усі промпти' : 'Все промпты'}
                </h2>
                <div className="space-y-3">
                  {regularPrompts.map(prompt => (
                    <PromptCard 
                      key={prompt.id} prompt={prompt} language={language}
                      onToggleFavorite={toggleFavorite} onDelete={deletePrompt}
                      onCopy={copyPrompt} onUpdateTags={updateTags}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

function PromptCard({ prompt, language, onToggleFavorite, onDelete, onCopy, onUpdateTags }: { 
  prompt: SavedPrompt; language: string;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onCopy: (text: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !(prompt.tags || []).includes(tag)) {
      onUpdateTags(prompt.id, [...(prompt.tags || []), tag]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    onUpdateTags(prompt.id, (prompt.tags || []).filter(t => t !== tag));
  };

  return (
    <div className="glass-strong rounded-xl p-4 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{prompt.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{prompt.input_text}</p>
          
          {isExpanded && (
            <div className="mt-3 p-3 bg-background/50 rounded-lg">
              <p className="text-sm text-foreground whitespace-pre-wrap">{prompt.generated_prompt}</p>
            </div>
          )}
          
          {/* Tags */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {(prompt.tags || []).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs gap-1">
                {tag}
                {isEditingTags && (
                  <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                )}
              </Badge>
            ))}
            
            {isEditingTags ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder={language === 'en' ? 'New tag...' : language === 'ua' ? 'Новий тег...' : 'Новый тег...'}
                  className="h-6 w-24 text-xs px-2"
                />
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsEditingTags(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" size="sm" 
                className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditingTags(true)}
              >
                <Plus className="w
            )}

                <span className="text-xs px-2 py-0.5 rounded-full text-primary ml-auto" style={{backgroundColor: 'hsl(var(--accent))'}}>
                {prompt.length_setting}
              </span>
            <span className="text-xs text-muted-foreground">
              {new Date(prompt.created_at).toLocaleDateString(
                language === 'en' ? 'en-US' : language === 'ua' ? 'uk-UA' : 'ru-RU'
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(prompt.id, prompt.is_favorite)}>
            <Star className={`w-4 h-4 ${prompt.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onCopy(prompt.generated_prompt)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(prompt.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded 
          ? (language === 'en' ? 'Collapse' : language === 'ua' ? 'Згорнути' : 'Свернуть')
          : (language === 'en' ? 'Show prompt' : language === 'ua' ? 'Показати промпт' : 'Показать промпт')}
      </Button>
    </div>
  );
}

export default SavedPrompts;
