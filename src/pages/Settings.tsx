import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, User, Globe, Award, Save, Loader2
} from 'lucide-react';
import { ApiKeysSettings } from '@/components/ApiKeysSettings';

const Settings = () => {
  const { user, profile, loading: authLoading, updateProfile } = useAuth();
  const { t, language: currentLang, setLanguage: setContextLanguage } = useLanguage();
  const [displayName, setDisplayName] = useState('');
  const [userLevel, setUserLevel] = useState<'beginner' | 'advanced' | 'expert'>('beginner');
  const [language, setLanguage] = useState<'en' | 'ru' | 'ua'>('ru');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUserLevel(profile.user_level);
      setLanguage(profile.preferred_language);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const changed = 
        displayName !== (profile.display_name || '') ||
        userLevel !== profile.user_level ||
        language !== profile.preferred_language;
      setHasChanges(changed);
    }
  }, [displayName, userLevel, language, profile]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      const { error } = await updateProfile({
        display_name: displayName,
        user_level: userLevel,
        preferred_language: language
      });

      if (error) throw error;

      // Update context language immediately
      setContextLanguage(language);

      toast({
        title: t('settingsSaved'),
        description: currentLang === 'en' ? 'Profile settings updated' :
                     currentLang === 'ua' ? 'Налаштування профілю оновлено' :
                     'Настройки профиля обновлены'
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: t('errorOccurred'),
        description: currentLang === 'en' ? 'Could not save settings' :
                     currentLang === 'ua' ? 'Не вдалося зберегти налаштування' :
                     'Не удалось сохранить настройки',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const levelLabels = {
    beginner: { en: 'Beginner', ru: 'Новичок', ua: 'Початківець' },
    advanced: { en: 'Advanced', ru: 'Продвинутый', ua: 'Просунутий' },
    expert: { en: 'Expert', ru: 'Эксперт', ua: 'Експерт' }
  };

  const levelDescriptions = {
    beginner: {
      en: 'Basic interface with tips and templates',
      ru: 'Базовый интерфейс с подсказками и шаблонами',
      ua: 'Базовий інтерфейс з підказками та шаблонами'
    },
    advanced: {
      en: 'Extended settings and additional options',
      ru: 'Расширенные настройки и дополнительные опции',
      ua: 'Розширені налаштування та додаткові опції'
    },
    expert: {
      en: 'Full access to all features and API',
      ru: 'Полный доступ ко всем функциям и API',
      ua: 'Повний доступ до всіх функцій та API'
    }
  };

  const languageLabels: Record<string, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇬🇧' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    ua: { name: 'Українська', flag: '🇺🇦' }
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
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/app')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentLang === 'en' ? 'Back' : currentLang === 'ua' ? 'Назад' : 'Назад'}
        </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('settingsTitle')}</h1>
            <p className="text-sm text-muted-foreground">
              {currentLang === 'en' ? 'Account management and personalization' :
               currentLang === 'ua' ? 'Управління акаунтом та персоналізація' :
               'Управление аккаунтом и персонализация'}
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {currentLang === 'en' ? 'Account Info' : currentLang === 'ua' ? 'Інформація про акаунт' : 'Информация об аккаунте'}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {currentLang === 'en' ? 'Email cannot be changed' : 
                   currentLang === 'ua' ? 'Email не можна змінити' : 
                   'Email нельзя изменить'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">{t('displayName')}</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder={t('displayNamePlaceholder')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* User Level */}
          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {t('userLevel')}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{currentLang === 'en' ? 'Your experience level' : 
                        currentLang === 'ua' ? 'Ваш рівень досвіду' : 
                        'Ваш уровень опыта'}</Label>
                <Select 
                  value={userLevel} 
                  onValueChange={(v) => setUserLevel(v as typeof userLevel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center gap-2">
                        <span>🌱</span>
                        <span>{levelLabels.beginner[currentLang]}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center gap-2">
                        <span>🚀</span>
                        <span>{levelLabels.advanced[currentLang]}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="expert">
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>{levelLabels.expert[currentLang]}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {levelDescriptions[userLevel][currentLang]}
                </p>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              {t('interfaceLanguage')}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{currentLang === 'en' ? 'Preferred language' : 
                        currentLang === 'ua' ? 'Бажана мова' : 
                        'Предпочитаемый язык'}</Label>
                <Select 
                  value={language} 
                  onValueChange={(v) => setLanguage(v as typeof language)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageLabels).map(([code, { name, flag }]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{flag}</span>
                          <span>{name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {currentLang === 'en' ? 'Affects interface language and default generation language' :
                   currentLang === 'ua' ? 'Впливає на мову інтерфейсу та генерації за замовчуванням' :
                   'Влияет на язык интерфейса и генерации по умолчанию'}
                </p>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <ApiKeysSettings />

          {/* Save Button */}
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('savingSettings')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('saveSettings')}
              </>
            )}
          </Button>

          {/* Account Stats */}
          {profile && (
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground text-center">
                {currentLang === 'en' ? 'Account created: ' : 
                 currentLang === 'ua' ? 'Акаунт створено: ' : 
                 'Аккаунт создан: '}
                {new Date(profile.created_at).toLocaleDateString(
                  currentLang === 'en' ? 'en-US' : currentLang === 'ua' ? 'uk-UA' : 'ru-RU',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Settings;