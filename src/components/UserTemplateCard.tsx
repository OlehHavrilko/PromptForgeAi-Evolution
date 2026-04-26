import { useState } from "react";
import { Edit2, Trash2, Globe, Lock, Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { UserTemplate } from "@/hooks/useUserTemplates";

interface UserTemplateCardProps {
  template: UserTemplate;
  onEdit: (template: UserTemplate) => void;
  onDelete: (id: string) => void;
  onUse: (template: UserTemplate) => void;
  isOwner?: boolean;
}

export function UserTemplateCard({ template, onEdit, onDelete, onUse, isOwner = true }: UserTemplateCardProps) {
  const { language } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(template.id);
    setIsDeleting(false);
  };

  const labels = {
    use: language === "en" ? "Use" : language === "ua" ? "Використати" : "Использовать",
    edit: language === "en" ? "Edit" : language === "ua" ? "Редагувати" : "Редактировать",
    delete: language === "en" ? "Delete" : language === "ua" ? "Видалити" : "Удалить",
    deleteConfirm: language === "en" ? "Delete template?" : language === "ua" ? "Видалити шаблон?" : "Удалить шаблон?",
    deleteDesc: language === "en" 
      ? "This action cannot be undone." 
      : language === "ua" 
      ? "Цю дію неможливо скасувати." 
      : "Это действие нельзя отменить.",
    cancel: language === "en" ? "Cancel" : language === "ua" ? "Скасувати" : "Отмена",
    public: language === "en" ? "Public" : language === "ua" ? "Публічний" : "Публичный",
    private: language === "en" ? "Private" : language === "ua" ? "Приватний" : "Приватный",
    uses: language === "en" ? "uses" : language === "ua" ? "використань" : "использований",
  };

  return (
    <Card className="glass border-border/40 hover:border-primary/40 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{template.title}</CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            {template.is_public ? (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Globe className="w-3 h-3" />
                {labels.public}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-xs">
                <Lock className="w-3 h-3" />
                {labels.private}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {template.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
        )}
        
        <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
          <p className="text-sm font-mono line-clamp-3">{template.default_input}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {template.usage_count} {labels.uses}
          </span>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={() => onUse(template)} className="gap-1">
              <Play className="w-3 h-3" />
              {labels.use}
            </Button>
            
            {isOwner && (
              <>
                <Button size="icon" variant="ghost" onClick={() => onEdit(template)} className="h-8 w-8">
                  <Edit2 className="w-4 h-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{labels.deleteConfirm}</AlertDialogTitle>
                      <AlertDialogDescription>{labels.deleteDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {labels.delete}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
