import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserMenu } from '@/components/UserMenu';
import {
  ArrowLeft, Search, Star, Copy, Store, Users,
  TrendingUp, Loader2
} from 'lucide-react';

interface MarketplaceTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  default_input: string;
  category: string | null;
  usage_count: number;
  avg_rating: number;
  rating_count: number;
  created_at: string;
  profiles?: { display_name: string | null } | null;
}

const Marketplace = () => {
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState<string | null>(null);

  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const t = {
    title: { en: 'Template Marketplace', ru: 'Маркетплейс шаблонов', ua: 'Маркетплейс шаблонів' },
    back: { en: 'Back', ru: 'Назад', ua: 'Назад' },
    search: { en: 'Search templates...', ru: 'Поиск шаблонов...', ua: 'Пошук шаблонів...' },
    all: { en: 'All', ru: 'Все', ua: 'Усе' },
    popular: { en: 'Popular', ru: 'Популярные', ua: 'Популярні' },
    topRated: { en: 'Top Rated', ru: 'Лучшие', ua: 'Найкращі' },
    newest: { en: 'Newest', ru: 'Новые', ua: 'Нові' },
    uses: { en: 'uses', ru: 'использований', ua: 'використань' },
    clone: { en: 'Clone', ru: 'Клонировать', ua: 'Клонувати' },
    cloned: { en: 'Template cloned!', ru: 'Шаблон клонирован!', ua: 'Шаблон клоновано!' },
    rated: { en: 'Rating saved!', ru: 'Оценка сохранена!', ua: 'Оцінку збережено!' },
    signInToRate: { en: 'Sign in to rate', ru: 'Войдите для оценки', ua: 'Увійдіть для оцінки' },
    signInToClone: { en: 'Sign in to clone', ru: 'Войдите для клонирования', ua: 'Увійдіть для клонування' },
    empty: { en: 'No public templates yet', ru: 'Пока нет публичных шаблонов', ua: 'Поки немає публічних шаблонів' },
    by: { en: 'by', ru: 'от', ua: 'від' },
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('user_templates')
      .select('*, profiles(display_name)')
      .eq('is_public', true)
      .order('usage_count', { ascending: false })
      .limit(100);

    if (!error && data) {
      setTemplates(data as unknown as MarketplaceTemplate[]);
    }
    setLoading(false);
  };

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category).filter(Boolean)))];

  const filtered = templates
    .filter(tmpl => {
      const matchSearch = !search || 
        tmpl.title.toLowerCase().includes(search.toLowerCase()) ||
        tmpl.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || tmpl.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.usage_count - a.usage_count;
      if (sortBy === 'rating') return (b.avg_rating || 0) - (a.avg_rating || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleRate = async (templateId: string, rating: number) => {
    if (!user) { toast({ title: t.signInToRate[language] }); return; }
    setRatingLoading(templateId);
    
    const { error } = await supabase
      .from('template_ratings')
      .upsert({ template_id: templateId, user_id: user.id, rating }, { onConflict: 'template_id,user_id' });

    if (!error) {
      // Recalculate avg
      const { data: ratings } = await supabase
        .from('template_ratings')
        .select('rating')
        .eq('template_id', templateId);
      
      if (ratings && ratings.length > 0) {
        const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        await supabase.from('user_templates')
          .update({ avg_rating: Math.round(avg * 100) / 100, rating_count: ratings.length })
          .eq('id', templateId);
        
        setTemplates(prev => prev.map(tmpl => 
          tmpl.id === templateId ? { ...tmpl, avg_rating: Math.round(avg * 100) / 100, rating_count: ratings.length } : tmpl
        ));
      }
      toast({ title: t.rated[language] });
    }
    setRatingLoading(null);
  };

  const handleClone = async (template: MarketplaceTemplate) => {
    if (!user) { toast({ title: t.signInToClone[language] }); return; }

    const { error } = await supabase.from('user_templates').insert({
      user_id: user.id,
      title: template.title,
      description: template.description,
      default_input: template.default_input,
      category: template.category || 'custom',
      is_public: false,
    });

    if (!error) {
      // Increment usage count
      await supabase.from('user_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', template.id);
      toast({ title: t.cloned[language] });
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/app')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {t.back[language]}
          </Button>
          <UserMenu />
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t.title[language]}</h1>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.search[language]}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {([['popular', t.popular], ['rating', t.topRated], ['newest', t.newest]] as const).map(([key, labels]) => (
              <Button
                key={key}
                variant={sortBy === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(key)}
              >
                {labels[language]}
              </Button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setCategory(cat)}
              >
                {cat === 'all' ? t.all[language] : cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass-strong rounded-2xl">
            <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-xl text-muted-foreground">{t.empty[language]}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(tmpl => (
              <div key={tmpl.id} className="glass-strong rounded-xl p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{tmpl.title}</h3>
                    {tmpl.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tmpl.description}</p>
                    )}
                  </div>
                  {tmpl.category && (
                    <Badge variant="secondary" className="text-xs shrink-0">{tmpl.category}</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 bg-background/50 rounded-lg p-2">
                  {tmpl.default_input}
                </p>

                {/* Stats & Rating */}
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> {tmpl.usage_count} {t.uses[language]}
                  </span>
                  {tmpl.rating_count > 0 && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      {(tmpl.avg_rating || 0).toFixed(1)} ({tmpl.rating_count})
                    </span>
                  )}
                  {tmpl.profiles?.display_name && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {t.by[language]} {tmpl.profiles.display_name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/50">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRate(tmpl.id, star)}
                        disabled={ratingLoading === tmpl.id}
                        className="p-0.5 hover:scale-110 transition-transform disabled:opacity-50"
                      >
                        <Star className={`w-4 h-4 ${star <= Math.round(tmpl.avg_rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="ml-auto gap-1.5" onClick={() => handleClone(tmpl)}>
                    <Copy className="w-3.5 h-3.5" />
                    {t.clone[language]}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Marketplace;
