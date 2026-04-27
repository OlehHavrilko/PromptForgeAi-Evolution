import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Wand2,
  Zap,
  Image,
  FileText,
  Shield,
  Globe,
  Sparkles,
  Target,
  Layers,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Rocket,
  Clock,
  TrendingUp,
  Command,
  Play,
  Copy,
  MousePointerClick,
} from "lucide-react";

const Promo = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [demoInput, setDemoInput] = useState("");
  const [demoResult, setDemoResult] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    setDemoResult("");
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-prompt`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          input: demoInput,
          length: 'Balanced',
          tone: 'neutral',
          style: 'default',
          targetModel: 'auto',
        }),
      });
      if (!resp.ok || !resp.body) throw new Error('Failed');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed

  const t = {
    badge: { en: "AI Prompt Engineering Platform", ru: "Платформа AI-промпт инженерии", ua: "Платформа AI-промпт інженерії" },
    heroTitle1: { en: "Craft Perfect", ru: "Создавайте идеальные", ua: "Створюйте ідеальні" },
    heroTitle2: { en: "AI Prompts", ru: "AI промпты", ua: "AI промпти" },
    heroTitle3: { en: "in Seconds", ru: "за секунды", ua: "за секунди" },
    heroSubtitle: {
      en: "Transform vague ideas into precision-engineered prompts that deliver 10× better AI responses. No guesswork. No wasted tokens.",
      ru: "Превращайте расплывчатые идеи в точно спроектированные промпты, которые дают в 10 раз лучшие ответы от AI.",
      ua: "Перетворюйте розпливчасті ідеї на точно спроектовані промпти, що дають у 10 разів кращі відповіді від AI.",
    },
    startFree: { en: "Start Free", ru: "Начать бесплатно", ua: "Почати безкоштовно" },
    liveDemo: { en: "Live Demo", ru: "Демо", ua: "Демо" },
    trustedBy: { en: "Trusted by prompt engineers worldwide", ru: "Доверяют промпт-инженеры по всему миру", ua: "Довіряють промпт-інженери по всьому світу" },
    howTitle: { en: "How It Works", ru: "Как это работает", ua: "Як це працює" },
    toolkitTitle: { en: "Complete AI Toolkit", ru: "Полный AI набор", ua: "Повний AI набір" },
    toolkitSub: { en: "Six powerful tools in one platform", ru: "Шесть мощных инструментов в одной платформе", ua: "Шість потужних інструментів в одній платформі" },
    tryTitle: { en: "Try It Right Now", ru: "Попробуйте прямо сейчас", ua: "Спробуйте прямо зараз" },
    trySub: { en: "No signup required. Enter an idea, get a professional prompt.", ru: "Без регистрации. Введите идею, получите профессиональный промпт.", ua: "Без реєстрації. Введіть ідею, отримайте професійний промпт." },
    ctaTitle: { en: "Your AI Deserves Better Prompts", ru: "Ваш AI заслуживает лучших промптов", ua: "Ваш AI заслуговує кращих промптів" },
    ctaSub: { en: "Join thousands who get better results every day.", ru: "Присоединяйтесь к тысячам, кто получает лучшие результаты каждый день.", ua: "Приєднуйтесь до тисяч, хто отримує кращі результати щодня." },
    getStarted: { en: "Get Started Free", ru: "Начать бесплатно", ua: "Почати безкоштовно" },
    noCard: { en: "No credit card · Free forever plan", ru: "Без карты · Бесплатный план навсегда", ua: "Без картки · Безкоштовний план назавжди" },
  };

  const stats = [
    { value: "10×", label: { en: "Better AI output", ru: "Лучше результат", ua: "Кращий результат" } },
    { value: "<30s", label: { en: "Per prompt", ru: "На промпт", ua: "На промпт" } },
    { value: "50K+", label: { en: "Prompts crafted", ru: "Промптов создано", ua: "Промптів створено" } },
    { value: "6", label: { en: "AI tools", ru: "AI инструментов", ua: "AI інструментів" } },
  ];

  const steps = [
    {
      num: "01",
      title: { en: "Describe your idea", ru: "Опишите идею", ua: "Опишіть ідею" },
      desc: { en: "Type what you want in plain language", ru: "Напишите что хотите простым языком", ua: "Напишіть що хочете простою мовою" },
      icon: MousePointerClick,
    },
    {
      num: "02",
      title: { en: "AI optimizes", ru: "AI оптимизирует", ua: "AI оптимізує" },
      desc: { en: "Our engine structures and enhances your prompt", ru: "Наш движок структурирует и улучшает промпт", ua: "Наш рушій структурує та покращує промпт" },
      icon: Wand2,
    },
    {
      num: "03",
      title: { en: "Get results", ru: "Получите результат", ua: "Отримайте результат" },
      desc: { en: "Copy your polished prompt and use anywhere", ru: "Скопируйте готовый промпт и используйте", ua: "Скопіюйте готовий промпт і використовуйте" },
      icon: Rocket,
    },
  ];

  const features = [
    { icon: Wand2, title: { en: "Smart Generator", ru: "Умный генератор", ua: "Розумний генератор" }, desc: { en: "Transform ideas into structured prompts with tone, length and model targeting", ru: "Превращайте идеи в структурированные промпты с настройкой тона, длины и модели", ua: "Перетворюйте ідеї на структуровані промпти з налаштуванням тону, довжини та моделі" }, accent: true },
    { icon: Image, title: { en: "Image Analyzer", ru: "Анализ изображений", ua: "Аналіз зображень" }, desc: { en: "Upload images, get AI-powered descriptions and prompts", ru: "Загружайте изображения, получайте AI описания и промпты", ua: "Завантажуйте зображення, отримуйте AI описи та промпти" } },
    { icon: Shield, title: { en: "AI Detector", ru: "AI Детектор", ua: "AI Детектор" }, desc: { en: "Check if text was written by AI or a human", ru: "Проверяйте, написан ли текст AI или человеком", ua: "Перевіряйте, написаний текст AI чи людиною" } },
    { icon: FileText, title: { en: "Humanizer", ru: "Гуманизатор", ua: "Гуманізатор" }, desc: { en: "Make AI-generated text sound natural", ru: "Делайте AI тексты естественными", ua: "Робіть AI тексти природними" } },
    { icon: BarChart3, title: { en: "Quality Scoring", ru: "Оценка качества", ua: "Оцінка якості" }, desc: { en: "Instant scores with improvement suggestions", ru: "Мгновенные оценки с рекомендациями", ua: "Миттєві оцінки з рекомендаціями" } },
    { icon: Layers, title: { en: "24+ Templates", ru: "24+ шаблонов", ua: "24+ шаблонів" }, desc: { en: "Ready-made templates for any use case", ru: "Готовые шаблоны для любых задач", ua: "Готові шаблони для будь-яких задач" } },
  ];

  const logos = ["ChatGPT", "Claude", "Gemini", "Midjourney", "DALL·E"];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="container max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Command className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">PromptForge</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground">
                {language === 'en' ? 'Sign In' : language === 'ua' ? 'Увійти' : 'Войти'}
              </Button>
              <Button variant="gradient" size="sm" onClick={() => navigate("/app")} className="gap-1.5">
                {language === 'en' ? 'Open App' : language === 'ua' ? 'Відкрити' : 'Открыть'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="container max-w-7xl mx-auto px-6 pt-20 pb-8 md:pt-32 md:pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary/80 tracking-wide uppercase">{t.badge[language]}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8 animate-slide-up">
              <span className="text-foreground">{t.heroTitle1[language]}</span>
              <br />
              <span className="text-gradient">{t.heroTitle2[language]}</span>
              <br />
              <span className="text-muted-foreground/60">{t.heroTitle3[language]}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up delay-100">
              {t.heroSubtitle[language]}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-slide-up delay-200">
              <Button variant="gradient" size="xl" onClick={() => navigate("/app")} className="gap-3 min-w-[220px] glow-button">
                <Zap className="w-5 h-5" />
                {t.startFree[language]}
              </Button>
              <Button variant="glass" size="lg" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} className="gap-2 min-w-[160px]">
                <Play className="w-4 h-4" />
                {t.liveDemo[language]}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/50 animate-fade-in delay-300">{t.noCard[language]}</p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="container max-w-5xl mx-auto px-6 py-16 animate-fade-in delay-400">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl glass-card">
                <div className="text-3xl md:text-4xl font-black text-gradient tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.label[language]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Compatibility strip */}
        <section className="py-8 border-y border-border/10">
          <div className="container max-w-5xl mx-auto px-6">
            <p className="text-center text-xs text-muted-foreground/40 uppercase tracking-widest mb-5">{t.trustedBy[language]}</p>
            <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
              {logos.map((name) => (
                <span key={name} className="text-sm font-semibold text-muted-foreground/30 tracking-wide">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container max-w-6xl mx-auto px-6 py-28">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-16">
            <span className="text-gradient">{t.howTitle[language]}</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-primary/15 leading-none">{step.num}</span>
                    <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-3">{step.title[language]}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc[language]}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 w-6 h-6 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Toolkit */}
        <section className="container max-w-6xl mx-auto px-6 py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              {t.toolkitTitle[language]}
            </h2>
            <p className="text-muted-foreground text-lg">{t.toolkitSub[language]}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                  f.accent
                    ? 'border-gradient bg-primary/[0.03] md:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-between'
                    : 'glass-card'
                }`}
              >
                <div>
                  <div className={`p-3 rounded-xl w-fit mb-5 transition-all duration-300 ${
                    f.accent ? 'bg-primary/15' : 'bg-muted/50 group-hover:bg-primary/10'
                  }`}>
                    <f.icon className={`w-6 h-6 ${f.accent ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} transition-colors`} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2">{f.title[language]}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc[language]}</p>
                </div>
                {f.accent && (
                  <Button variant="gradient" size="sm" className="mt-6 gap-2 w-fit" onClick={() => navigate("/app")}>
                    {language === 'en' ? 'Try now' : language === 'ua' ? 'Спробувати' : 'Попробовать'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Live Demo */}
        <section id="demo" className="container max-w-3xl mx-auto px-6 py-28">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent/80 uppercase tracking-wide">
                {language === 'en' ? 'Interactive Demo' : language === 'ua' ? 'Інтерактивне демо' : 'Интерактивное демо'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">{t.tryTitle[language]}</h2>
            <p className="text-muted-foreground">{t.trySub[language]}</p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
            {/* Fake window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-card/60">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-3 text-xs text-muted-foreground/50 font-mono">promptforge.app</span>
            </div>

            <div className="p-6 space-y-4">
              <Textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Write a marketing email for a product launch...' :
                             language === 'ua' ? 'напр. Напиши маркетинговий лист для запуску продукту...' :
                             'напр. Напиши маркетинговое письмо для запуска продукта...'}
                className="min-h-[90px] bg-background/60 border-border/40 focus-visible:border-primary/40 resize-none"
              />

              <Button
                variant="gradient"
                className="w-full gap-2"
                onClick={handleDemo}
                disabled={demoLoading || !demoInput.trim()}
              >
                {demoLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    {language === 'en' ? 'Generating...' : language === 'ua' ? 'Генерація...' : 'Генерация...'}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    {language === 'en' ? 'Generate Prompt' : language === 'ua' ? 'Згенерувати' : 'Сгенерировать'}
                  </>
                )}
              </Button>

              {demoResult && (
                <div className="rounded-xl bg-accent/5 border border-accent/20 p-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-medium text-accent/70 uppercase tracking-wide">Result</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 text-xs text-muted-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(demoResult);
                        toast.success(language === 'en' ? 'Copied!' : language === 'ua' ? 'Скопійовано!' : 'Скопировано!');
                      }}
                    >
                      <Copy className="w-3 h-3" />
                      {language === 'en' ? 'Copy' : language === 'ua' ? 'Копіювати' : 'Копировать'}
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap font-mono">{demoResult}</p>
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <Button variant="gradient" size="sm" className="gap-2" onClick={() => navigate("/app")}>
                      {language === 'en' ? 'Open full app' : language === 'ua' ? 'Відкрити додаток' : 'Открыть приложение'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container max-w-4xl mx-auto px-6 py-28">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[100px]" />

            <div className="relative border border-border/30 rounded-3xl p-12 md:p-20 text-center backdrop-blur-xl">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-5">{t.ctaTitle[language]}</h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10">{t.ctaSub[language]}</p>
              <Button variant="gradient" size="xl" onClick={() => navigate("/app")} className="gap-3 min-w-[260px] glow-button">
                <Sparkles className="w-5 h-5" />
                {t.getStarted[language]}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground/50 mt-8">{t.noCard[language]}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/15 py-8">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Command className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">PromptForge</span>
              </div>
              <p className="text-xs text-muted-foreground/50">
                © 2024 PromptForge. {language === 'en' ? 'All rights reserved.' : language === 'ua' ? 'Всі права захищені.' : 'Все права защищены.'}
              </p>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground/40">EN · RU · UA</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Promo;
