import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useGenerationHistory } from '@/hooks/useGenerationHistory';
import { UserMenu } from '@/components/UserMenu';
import {
  ArrowLeft, BarChart3, Wand2, Image, FileText,
  TrendingUp, Calendar, Zap, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(142 76% 36%)',
  'hsl(38 92% 50%)',
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { history, loading } = useGenerationHistory();
  const { language } = useLanguage();

  const t = {
    title: { en: 'Dashboard', ru: 'Дашборд', ua: 'Дашборд' },
    back: { en: 'Back', ru: 'Назад', ua: 'Назад' },
    totalGenerations: { en: 'Total Generations', ru: 'Всего генераций', ua: 'Всього генерацій' },
    thisWeek: { en: 'This Week', ru: 'За неделю', ua: 'За тиждень' },
    thisMonth: { en: 'This Month', ru: 'За месяц', ua: 'За місяць' },
    byTool: { en: 'By Tool', ru: 'По инструментам', ua: 'За інструментами' },
    activity: { en: 'Activity (last 30 days)', ru: 'Активность (30 дней)', ua: 'Активність (30 днів)' },
    topStyles: { en: 'Popular Styles', ru: 'Популярные стили', ua: 'Популярні стилі' },
    topLengths: { en: 'Length Distribution', ru: 'Распределение длины', ua: 'Розподіл довжини' },
    signIn: { en: 'Sign in to view stats', ru: 'Войдите для просмотра', ua: 'Увійдіть для перегляду' },
    empty: { en: 'No data yet', ru: 'Нет данных', ua: 'Немає даних' },
    generator: { en: 'Generator', ru: 'Генератор', ua: 'Генератор' },
    humanizer: { en: 'Humanizer', ru: 'Гуманизатор', ua: 'Гуманізатор' },
    detector: { en: 'Detector', ru: 'Детектор', ua: 'Детектор' },
    imageAnalyzer: { en: 'Images', ru: 'Изображения', ua: 'Зображення' },
  };

  const stats = useMemo(() => {
    if (!history.length) return null;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = history.filter(h => new Date(h.created_at) >= weekAgo).length;
    const thisMonth = history.filter(h => new Date(h.created_at) >= monthAgo).length;

    // By tool type
    const toolCounts: Record<string, number> = {};
    history.forEach(h => { toolCounts[h.tool_type] = (toolCounts[h.tool_type] || 0) + 1; });
    const toolLabels: Record<string, Record<string, string>> = {
      generator: t.generator, humanizer: t.humanizer, 
      detector: t.detector, image_analyzer: t.imageAnalyzer,
    };
    const byTool = Object.entries(toolCounts).map(([tool, count]) => ({
      name: toolLabels[tool]?.[language] || tool,
      value: count
    }));

    // Activity last 30 days
    const dailyMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = 0;
    }
    history.forEach(h => {
      const key = h.created_at.split('T')[0];
      if (dailyMap[key] !== undefined) dailyMap[key]++;
    });
    const dailyActivity = Object.entries(dailyMap).map(([date, count]) => ({
      date: date.slice(5), // MM-DD
      count
    }));

    // Style distribution
    const styleCounts: Record<string, number> = {};
    history.forEach(h => {
      if (h.style) styleCounts[h.style] = (styleCounts[h.style] || 0) + 1;
    });
    const topStyles = Object.entries(styleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Length distribution
    const lengthCounts: Record<string, number> = {};
    history.forEach(h => {
      if (h.length_setting) lengthCounts[h.length_setting] = (lengthCounts[h.length_setting] || 0) + 1;
    });
    const lengthDist = Object.entries(lengthCounts)
      .map(([name, value]) => ({ name, value }));

    return { thisWeek, thisMonth, byTool, dailyActivity, topStyles, lengthDist };
  }, [history, language]);

  if (!user && !authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg text-muted-foreground">{t.signIn[language]}</p>
          <Button variant="gradient" className="mt-4" onClick={() => navigate('/auth')}>
            {language === 'en' ? 'Sign In' : 'Войти'}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-12">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/app')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {t.back[language]}
          </Button>
          <UserMenu />
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t.title[language]}</h1>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !stats ? (
          <div className="text-center py-20 glass-strong rounded-2xl">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-xl text-muted-foreground">{t.empty[language]}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<Zap className="w-5 h-5" />}
                label={t.totalGenerations[language]}
                value={history.length}
              />
              <StatCard
                icon={<Calendar className="w-5 h-5" />}
                label={t.thisWeek[language]}
                value={stats.thisWeek}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label={t.thisMonth[language]}
                value={stats.thisMonth}
              />
            </div>

            {/* Activity Chart */}
            <div className="glass-strong rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {t.activity[language]}
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={stats.dailyActivity}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* By Tool */}
              <div className="glass-strong rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">{t.byTool[language]}</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={stats.byTool} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.byTool.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Length Distribution */}
              <div className="glass-strong rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">{t.topLengths[language]}</h2>
                {stats.lengthDist.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.lengthDist}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))'
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">{t.empty[language]}</p>
                )}
              </div>
            </div>

            {/* Top Styles */}
            {stats.topStyles.length > 0 && (
              <div className="glass-strong rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">{t.topStyles[language]}</h2>
                <div className="space-y-3">
                  {stats.topStyles.map((style, i) => (
                    <div key={style.name} className="flex items-center gap-3">
                      <Badge variant="outline" className="min-w-[24px] justify-center">{i + 1}</Badge>
                      <span className="text-sm flex-1">{style.name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(style.value / stats.topStyles[0].value) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{style.value}</span>
                    </div>
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-strong rounded-xl p-5">
      <div className="flex items-center gap-3 mb-2 text-primary">{icon}</div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default Dashboard;
