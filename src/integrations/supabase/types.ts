export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      eval_cases: {
        Row: {
          created_at: string
          dataset_id: string
          id: string
          input_text: string
          reference_output: string | null
          rubric: string | null
          tags: string[] | null
          weight: number
        }
        Insert: {
          created_at?: string
          dataset_id: string
          id?: string
          input_text: string
          reference_output?: string | null
          rubric?: string | null
          tags?: string[] | null
          weight?: number
        }
        Update: {
          created_at?: string
          dataset_id?: string
          id?: string
          input_text?: string
          reference_output?: string | null
          rubric?: string | null
          tags?: string[] | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "eval_cases_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "eval_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      eval_datasets: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          task_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          task_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      eval_results: {
        Row: {
          case_id: string
          cost_usd: number | null
          created_at: string
          error_message: string | null
          generated_output: string | null
          id: string
          input_tokens: number | null
          judge_reasoning: string | null
          judge_score: number | null
          latency_ms: number | null
          output_tokens: number | null
          run_id: string
          status: string
        }
        Insert: {
          case_id: string
          cost_usd?: number | null
          created_at?: string
          error_message?: string | null
          generated_output?: string | null
          id?: string
          input_tokens?: number | null
          judge_reasoning?: string | null
          judge_score?: number | null
          latency_ms?: number | null
          output_tokens?: number | null
          run_id: string
          status?: string
        }
        Update: {
          case_id?: string
          cost_usd?: number | null
          created_at?: string
          error_message?: string | null
          generated_output?: string | null
          id?: string
          input_tokens?: number | null
          judge_reasoning?: string | null
          judge_score?: number | null
          latency_ms?: number | null
          output_tokens?: number | null
          run_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "eval_results_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "eval_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eval_results_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "eval_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      eval_runs: {
        Row: {
          avg_score: number | null
          completed_cases: number
          created_at: string
          created_by: string | null
          dataset_id: string
          error_message: string | null
          finished_at: string | null
          id: string
          judge_model: string
          model: string
          notes: string | null
          p50_latency_ms: number | null
          p95_latency_ms: number | null
          prompt_version_id: string | null
          status: string
          total_cases: number
          total_cost_usd: number | null
        }
        Insert: {
          avg_score?: number | null
          completed_cases?: number
          created_at?: string
          created_by?: string | null
          dataset_id: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          judge_model?: string
          model: string
          notes?: string | null
          p50_latency_ms?: number | null
          p95_latency_ms?: number | null
          prompt_version_id?: string | null
          status?: string
          total_cases?: number
          total_cost_usd?: number | null
        }
        Update: {
          avg_score?: number | null
          completed_cases?: number
          created_at?: string
          created_by?: string | null
          dataset_id?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          judge_model?: string
          model?: string
          notes?: string | null
          p50_latency_ms?: number | null
          p95_latency_ms?: number | null
          prompt_version_id?: string | null
          status?: string
          total_cases?: number
          total_cost_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eval_runs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "eval_datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eval_runs_prompt_version_id_fkey"
            columns: ["prompt_version_id"]
            isOneToOne: false
            referencedRelation: "prompt_template_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_history: {
        Row: {
          created_at: string
          generated_prompt: string
          id: string
          input_text: string
          length_setting: string | null
          metadata: Json | null
          parent_id: string | null
          style: string | null
          target_model: string | null
          tone: string | null
          tool_type: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          generated_prompt: string
          id?: string
          input_text: string
          length_setting?: string | null
          metadata?: Json | null
          parent_id?: string | null
          style?: string | null
          target_model?: string | null
          tone?: string | null
          tool_type?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          generated_prompt?: string
          id?: string
          input_text?: string
          length_setting?: string | null
          metadata?: Json | null
          parent_id?: string | null
          style?: string | null
          target_model?: string | null
          tone?: string | null
          tool_type?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "generation_history_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "generation_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_traces: {
        Row: {
          cost_usd: number | null
          created_at: string
          error_code: string | null
          error_message: string | null
          function_name: string
          id: string
          input_tokens: number | null
          latency_ms: number | null
          metadata: Json | null
          model: string
          output_tokens: number | null
          prompt_version_id: string | null
          provider: string
          status: string
          total_tokens: number | null
          ttft_ms: number | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          function_name: string
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          metadata?: Json | null
          model: string
          output_tokens?: number | null
          prompt_version_id?: string | null
          provider: string
          status?: string
          total_tokens?: number | null
          ttft_ms?: number | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          function_name?: string
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          metadata?: Json | null
          model?: string
          output_tokens?: number | null
          prompt_version_id?: string | null
          provider?: string
          status?: string
          total_tokens?: number | null
          ttft_ms?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "llm_traces_prompt_version_id_fkey"
            columns: ["prompt_version_id"]
            isOneToOne: false
            referencedRelation: "prompt_template_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          preferred_language: string | null
          updated_at: string | null
          user_level: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          preferred_language?: string | null
          updated_at?: string | null
          user_level?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          preferred_language?: string | null
          updated_at?: string | null
          user_level?: string | null
        }
        Relationships: []
      }
      prompt_template_versions: {
        Row: {
          created_at: string
          created_by: string | null
          default_params: Json
          id: string
          is_active: boolean
          notes: string | null
          system_prompt: string
          template_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          default_params?: Json
          id?: string
          is_active?: boolean
          notes?: string | null
          system_prompt: string
          template_id: string
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          default_params?: Json
          id?: string
          is_active?: boolean
          notes?: string | null
          system_prompt?: string
          template_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_prompts: {
        Row: {
          created_at: string | null
          generated_prompt: string
          id: string
          input_text: string
          is_favorite: boolean | null
          length_setting: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          generated_prompt: string
          id?: string
          input_text: string
          is_favorite?: boolean | null
          length_setting?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          generated_prompt?: string
          id?: string
          input_text?: string
          is_favorite?: boolean | null
          length_setting?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_ratings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "user_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_limits: {
        Row: {
          created_at: string
          daily_generations_used: number
          daily_limit: number
          id: string
          last_daily_reset: string
          last_monthly_reset: string
          monthly_generations_used: number
          monthly_limit: number
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_generations_used?: number
          daily_limit?: number
          id?: string
          last_daily_reset?: string
          last_monthly_reset?: string
          monthly_generations_used?: number
          monthly_limit?: number
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_generations_used?: number
          daily_limit?: number
          id?: string
          last_daily_reset?: string
          last_monthly_reset?: string
          monthly_generations_used?: number
          monthly_limit?: number
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          api_key_encrypted: string
          created_at: string
          id: string
          is_active: boolean
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          created_at?: string
          id?: string
          is_active?: boolean
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          created_at?: string
          id?: string
          is_active?: boolean
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_templates: {
        Row: {
          avg_rating: number | null
          category: string | null
          created_at: string
          default_input: string
          description: string | null
          id: string
          is_public: boolean
          rating_count: number | null
          title: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          default_input: string
          description?: string | null
          id?: string
          is_public?: boolean
          rating_count?: number | null
          title: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          avg_rating?: number | null
          category?: string | null
          created_at?: string
          default_input?: string
          description?: string | null
          id?: string
          is_public?: boolean
          rating_count?: number | null
          title?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
