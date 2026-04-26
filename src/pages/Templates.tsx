import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "@/components/TemplateCard";
import { UserMenu } from "@/components/UserMenu";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  templates,
  categories,
  getLocalizedTemplate,
  getLocalizedCategory,
  type TemplateCategory,
} from "@/lib/templates/templateData";
import { cn } from "@/lib/utils";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredTemplates = selectedCategory === "all"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateClick = (template: typeof templates[0]) => {
    const localized = getLocalizedTemplate(template, language);
    
    // Store template in sessionStorage and navigate to home
    sessionStorage.setItem("selectedTemplate", JSON.stringify({
      input: localized.defaultInput + " ",
      title: localized.title,
    }));
    
    toast({
      title: language === 'en' ? 'Template loaded' : language === 'ua' ? 'Шаблон завантажено' : 'Шаблон загружен',
      description: localized.title,
    });
    
    navigate("/");
  };

  const pageTitle = language === "en" ? "Template Library" : language === "ua" ? "Бібліотека шаблонів" : "Библиотека шаблонов";
  const pageSubtitle = language === "en" 
    ? "Choose a template to kickstart your prompt" 
    : language === "ua" 
    ? "Оберіть шаблон для швидкого старту" 
    : "Выберите шаблон для быстрого старта";
  const allLabel = language === "en" ? "All" : language === "ua" ? "Усі" : "Все";
  const backLabel = language === "en" ? "Back" : language === "ua" ? "Назад" : "Назад";

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-12">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
          <UserMenu />
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Wand2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {templates.length} {language === 'en' ? 'templates' : language === 'ua' ? 'шаблонів' : 'шаблонов'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{pageTitle}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </header>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            {allLabel}
          </Button>
          {categories.map((category) => {
            const localized = getLocalizedCategory(category, language);
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-full gap-2",
                  selectedCategory === category.id && category.color
                )}
              >
                <Icon className="w-4 h-4" />
                {localized.label}
              </Button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const localized = getLocalizedTemplate(template, language);
            const Icon = template.icon;
            return (
              <TemplateCard
                key={template.id}
                title={localized.title}
                description={localized.description}
                icon={Icon}
                example={localized.example}
                onClick={() => handleTemplateClick(template)}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {language === 'en' ? 'No templates found' : language === 'ua' ? 'Шаблони не знайдено' : 'Шаблоны не найдены'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Templates;
