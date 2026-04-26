import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface UserTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  default_input: string;
  category: string;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export type CreateTemplateData = Pick<UserTemplate, "title" | "description" | "default_input" | "category" | "is_public">;
export type UpdateTemplateData = Partial<CreateTemplateData>;

export function useUserTemplates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const templatesQuery = useQuery({
    queryKey: ["user-templates", user?.id],
    queryFn: async (): Promise<UserTemplate[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_templates")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as UserTemplate[];
    },
    enabled: !!user,
  });

  const publicTemplatesQuery = useQuery({
    queryKey: ["public-templates"],
    queryFn: async (): Promise<UserTemplate[]> => {
      const { data, error } = await supabase
        .from("user_templates")
        .select("*")
        .eq("is_public", true)
        .order("usage_count", { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data ?? []) as UserTemplate[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (templateData: CreateTemplateData) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_templates")
        .insert({
          user_id: user.id,
          ...templateData,
        })
        .select()
        .single();

      if (error) throw error;
      return data as UserTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-templates"] });
      toast({ title: "Шаблон создан", description: "Ваш шаблон успешно сохранён" });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTemplateData }) => {
      const { data, error } = await supabase
        .from("user_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as UserTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-templates"] });
      toast({ title: "Шаблон обновлён" });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-templates"] });
      toast({ title: "Шаблон удалён" });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const incrementUsageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: template } = await supabase
        .from("user_templates")
        .select("usage_count")
        .eq("id", id)
        .single();
      
      if (template) {
        await supabase
          .from("user_templates")
          .update({ usage_count: ((template as { usage_count: number }).usage_count || 0) + 1 })
          .eq("id", id);
      }
    },
  });

  return {
    templates: templatesQuery.data ?? [],
    publicTemplates: publicTemplatesQuery.data ?? [],
    isLoading: templatesQuery.isLoading,
    isPublicLoading: publicTemplatesQuery.isLoading,
    createTemplate: createMutation.mutateAsync,
    updateTemplate: updateMutation.mutateAsync,
    deleteTemplate: deleteMutation.mutateAsync,
    incrementUsage: incrementUsageMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
