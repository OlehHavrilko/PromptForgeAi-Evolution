import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserMenu } from "@/components/UserMenu";
import { UserTemplateCard } from "@/components/UserTemplateCard";
import { UserTemplateForm } from "@/components/UserTemplateForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useUserTemplates, type UserTemplate, type CreateTemplateData } from "@/hooks/useUserTemplates";

const MyTemplates = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const {
    templates,
    publicTemplates,
    isLoading,
    isPublicLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isCreating,
    isUpdating,
  } = useUserTemplates();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UserTemplate | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleCreate = async (data: CreateTemplateData) => {
    await createTemplate(data);
  };

  const handleUpdate = async (data: CreateTemplateData) => {
    if (editingTemplate) {
      await updateTemplate({ id: editingTemplate.id, updates: data });
      setEditingTemplate(null);
    }
  };

  const handleEdit = (template: UserTemplate) => {
    setEditingTemplate(template);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
  };

  const handleUse = (template: UserTemplate) => {
    sessionStorage.setItem("selectedTemplate", JSON.stringify({
      input: template.default_input + " ",
      title: template.title,
    }));
    navigate("/app");
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingTemplate(null);
  };

  const labels = {
    pageTitle: language === "en" ? "My Templates" : language === "ua" ? "Мої шаблони" : "Мои шаблоны",
    pageSubtitle: language === "en" 
      ? "Create and manage your custom prompt templates" 
      : language === "ua" 
      ? "Створюйте та керуйте власними шаблонами промптів" 
      : "Создавайте и управляйте своими шаблонами промптов",
    back: language === "en" ? "Back" : language === "ua" ? "Назад" : "Назад",
    createNew: language === "en" ? "New Template" : language === "ua" ? "Новий шаблон" : "Новый шаблон",
    myTab: language === "en" ? "My Templates" : language === "ua" ? "Мої" : "Мои",
    publicTab: language === "en" ? "Public" : language === "ua" ? "Публічні" : "Публичные",
    emptyMy: language === "en" 
      ? "You haven't created any templates yet" 
      : language === "ua" 
      ? "Ви ще не створили жодного шаблону" 
      : "Вы ещё не создали ни одного шаблона",
    emptyPublic: language === "en" 
      ? "No public templates available" 
      : language === "ua" 
      ? "Немає публічних шаблонів" 
      : "Нет публичных шаблонов",
    createFirst: language === "en" 
      ? "Create your first template to get started" 
      : language === "ua" 
      ? "Створіть свій перший шаблон" 
      : "Создайте свой первый шаблон",
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button variant="ghost" onClick={() => navigate("/app")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {labels.back}
          </Button>
          <UserMenu />
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="text-gradient">{labels.pageTitle}</span>
              </h1>
              <p className="text-lg text-muted-foreground">{labels.pageSubtitle}</p>
            </div>
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {labels.createNew}
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="my" className="space-y-6">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="my" className="gap-2">
              <User className="w-4 h-4" />
              {labels.myTab}
            </TabsTrigger>
            <TabsTrigger value="public" className="gap-2">
              <Users className="w-4 h-4" />
              {labels.publicTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-muted-foreground">{labels.emptyMy}</p>
                <p className="text-sm text-muted-foreground/70">{labels.createFirst}</p>
                <Button onClick={() => setFormOpen(true)} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {labels.createNew}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <UserTemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUse={handleUse}
                    isOwner={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="public">
            {isPublicLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : publicTemplates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{labels.emptyPublic}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicTemplates.map((template) => (
                  <UserTemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUse={handleUse}
                    isOwner={user?.id === template.user_id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Dialog */}
      <UserTemplateForm
        open={formOpen}
        onOpenChange={handleFormClose}
        onSubmit={editingTemplate ? handleUpdate : handleCreate}
        initialData={editingTemplate}
        isLoading={isCreating || isUpdating}
      />
    </main>
  );
};

export default MyTemplates;
