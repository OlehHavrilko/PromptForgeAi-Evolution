import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { UserTemplate, CreateTemplateData } from "@/hooks/useUserTemplates";

const templateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  default_input: z.string().min(1, "Default input is required").max(5000),
  category: z.string().default("custom"),
  is_public: z.boolean().default(false),
});

type FormData = z.infer<typeof templateSchema>;

interface UserTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTemplateData) => Promise<void>;
  initialData?: UserTemplate | null;
  isLoading?: boolean;
}

const CATEGORIES = [
  { value: "custom", labelEn: "Custom", labelUa: "Власний", labelRu: "Пользовательский" },
  { value: "programming", labelEn: "Programming", labelUa: "Програмування", labelRu: "Программирование" },
  { value: "marketing", labelEn: "Marketing", labelUa: "Маркетинг", labelRu: "Маркетинг" },
  { value: "writing", labelEn: "Writing", labelUa: "Написання", labelRu: "Написание" },
  { value: "business", labelEn: "Business", labelUa: "Бізнес", labelRu: "Бизнес" },
  { value: "education", labelEn: "Education", labelUa: "Освіта", labelRu: "Образование" },
];

export function UserTemplateForm({ open, onOpenChange, onSubmit, initialData, isLoading }: UserTemplateFormProps) {
  const { language } = useLanguage();

  const form = useForm<FormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      default_input: initialData?.default_input ?? "",
      category: initialData?.category ?? "custom",
      is_public: initialData?.is_public ?? false,
    },
  });

  const handleSubmit = async (data: FormData) => {
    await onSubmit({
      title: data.title,
      description: data.description || null,
      default_input: data.default_input,
      category: data.category,
      is_public: data.is_public,
    });
    form.reset();
    onOpenChange(false);
  };

  const labels = {
    createTitle: language === "en" ? "Create Template" : language === "ua" ? "Створити шаблон" : "Создать шаблон",
    editTitle: language === "en" ? "Edit Template" : language === "ua" ? "Редагувати шаблон" : "Редактировать шаблон",
    title: language === "en" ? "Title" : language === "ua" ? "Назва" : "Название",
    titlePlaceholder: language === "en" ? "My awesome template" : language === "ua" ? "Мій чудовий шаблон" : "Мой отличный шаблон",
    description: language === "en" ? "Description" : language === "ua" ? "Опис" : "Описание",
    descriptionPlaceholder: language === "en" ? "What this template does..." : language === "ua" ? "Що робить цей шаблон..." : "Что делает этот шаблон...",
    defaultInput: language === "en" ? "Default Input" : language === "ua" ? "Текст за замовчуванням" : "Текст по умолчанию",
    defaultInputPlaceholder: language === "en" ? "Enter default prompt text..." : language === "ua" ? "Введіть текст промпту..." : "Введите текст промпта...",
    category: language === "en" ? "Category" : language === "ua" ? "Категорія" : "Категория",
    isPublic: language === "en" ? "Public template" : language === "ua" ? "Публічний шаблон" : "Публичный шаблон",
    isPublicDesc: language === "en" ? "Allow others to use this template" : language === "ua" ? "Дозволити іншим використовувати" : "Позволить другим использовать",
    save: language === "en" ? "Save" : language === "ua" ? "Зберегти" : "Сохранить",
    cancel: language === "en" ? "Cancel" : language === "ua" ? "Скасувати" : "Отмена",
  };

  const getCategoryLabel = (cat: typeof CATEGORIES[0]) => {
    return language === "en" ? cat.labelEn : language === "ua" ? cat.labelUa : cat.labelRu;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? labels.editTitle : labels.createTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.title}</FormLabel>
                  <FormControl>
                    <Input placeholder={labels.titlePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.description}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={labels.descriptionPlaceholder} 
                      className="resize-none" 
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.defaultInput}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={labels.defaultInputPlaceholder} 
                      className="resize-none font-mono text-sm" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.category}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {getCategoryLabel(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>{labels.isPublic}</FormLabel>
                    <FormDescription className="text-xs">{labels.isPublicDesc}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {labels.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {labels.save}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
