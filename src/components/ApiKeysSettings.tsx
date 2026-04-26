import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Key, Eye, EyeOff, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

interface ApiKey {
  id: string;
  provider: string;
  is_active: boolean;
  created_at: string;
  hasKey: boolean;
}

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    placeholder: 'sk-...',
    description: {
      en: 'GPT-4o, GPT-4, GPT-3.5 models',
      ru: 'Модели GPT-4o, GPT-4, GPT-3.5',
      ua: 'Моделі GPT-4o, GPT-4, GPT-3.5',
    },
    baseUrl: 'https://api.openai.com/v1/chat/completions',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    placeholder: 'sk-ant-...',
    description: {
      en: 'Claude 3.5 Sonnet, Claude 3 Opus models',
      ru: 'Модели Claude 3.5 Sonnet, Claude 3 Opus',
      ua: 'Моделі Claude 3.5 Sonnet, Claude 3 Opus',
    },
    baseUrl: 'https://api.anthropic.com/v1/messages',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🌐',
    placeholder: 'sk-or-...',
    description: {
      en: 'Access to 100+ models via single API',
      ru: 'Доступ к 100+ моделям через единый API',
      ua: 'Доступ до 100+ моделей через єдиний API',
    },
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
  },
];

export function ApiKeysSettings() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const labels = {
    en: {
      title: 'AI Providers',
      subtitle: 'Connect your own API keys for direct model access',
      save: 'Save',
      delete: 'Remove',
      connected: 'Connected',
      notConnected: 'Not connected',
      active: 'Active',
      saved: 'API key saved successfully',
      deleted: 'API key removed',
      error: 'Failed to save API key',
    },
    ru: {
      title: 'AI-провайдеры',
      subtitle: 'Подключите свои API-ключи для прямого доступа к моделям',
      save: 'Сохранить',
      delete: 'Удалить',
      connected: 'Подключён',
      notConnected: 'Не подключён',
      active: 'Активен',
      saved: 'API-ключ сохранён',
      deleted: 'API-ключ удалён',
      error: 'Не удалось сохранить API-ключ',
    },
    ua: {
      title: 'AI-провайдери',
      subtitle: "Підключіть свої API-ключі для прямого доступу до моделей",
      save: 'Зберегти',
      delete: 'Видалити',
      connected: "Підключено",
      notConnected: "Не підключено",
      active: 'Активний',
      saved: 'API-ключ збережено',
      deleted: 'API-ключ видалено',
      error: 'Не вдалося зберегти API-ключ',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  useEffect(() => {
    if (user) fetchKeys();
  }, [user]);

  const fetchKeys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('id, provider, is_active, created_at')
      .eq('user_id', user!.id);

    if (!error && data) {
      setKeys(data.map((k: any) => ({ ...k, hasKey: true })));
    }
    setLoading(false);
  };

  const handleSave = async (providerId: string) => {
    const value = inputValues[providerId]?.trim();
    if (!value) return;

    setSaving((p) => ({ ...p, [providerId]: true }));
    try {
      const { error } = await supabase
        .from('user_api_keys')
        .upsert(
          {
            user_id: user!.id,
            provider: providerId,
            api_key_encrypted: value,
            is_active: true,
          },
          { onConflict: 'user_id,provider' }
        );

      if (error) throw error;

      toast({ title: t.saved });
      setInputValues((p) => ({ ...p, [providerId]: '' }));
      await fetchKeys();
    } catch {
      toast({ title: t.error, variant: 'destructive' });
    } finally {
      setSaving((p) => ({ ...p, [providerId]: false }));
    }
  };

  const handleDelete = async (providerId: string) => {
    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', user!.id)
      .eq('provider', providerId);

    if (!error) {
      toast({ title: t.deleted });
      await fetchKeys();
    }
  };

  const handleToggle = async (providerId: string, active: boolean) => {
    await supabase
      .from('user_api_keys')
      .update({ is_active: active })
      .eq('user_id', user!.id)
      .eq('provider', providerId);
    await fetchKeys();
  };

  if (loading) {
    return (
      <div className="glass-strong rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
        <Key className="w-5 h-5 text-primary" />
        {t.title}
      </h2>
      <p className="text-sm text-muted-foreground mb-5">{t.subtitle}</p>

      <div className="space-y-4">
        {PROVIDERS.map((provider) => {
          const existing = keys.find((k) => k.provider === provider.id);
          const isSaving = saving[provider.id];

          return (
            <div
              key={provider.id}
              className="border border-border/50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-medium text-foreground">{provider.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {provider.description[language as keyof typeof provider.description] || provider.description.en}
                    </p>
                  </div>
                </div>
                {existing ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{t.connected}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">{t.notConnected}</span>
                )}
              </div>

              {existing ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <Switch
                      checked={existing.is_active}
                      onCheckedChange={(v) => handleToggle(provider.id, v)}
                    />
                    <span className="text-sm text-muted-foreground">{t.active}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(provider.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t.delete}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showValues[provider.id] ? 'text' : 'password'}
                      placeholder={provider.placeholder}
                      value={inputValues[provider.id] || ''}
                      onChange={(e) =>
                        setInputValues((p) => ({ ...p, [provider.id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowValues((p) => ({ ...p, [provider.id]: !p[provider.id] }))
                      }
                    >
                      {showValues[provider.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    onClick={() => handleSave(provider.id)}
                    disabled={!inputValues[provider.id]?.trim() || isSaving}
                    size="sm"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : t.save}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
