import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Settings, BookMarked, LayoutGrid, Megaphone, FileText, BarChart3, Store } from 'lucide-react';

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: language === 'en' ? 'Goodbye!' : language === 'ua' ? 'До побачення!' : 'До свидания!',
      description: language === 'en' ? 'You have been signed out' : 
                   language === 'ua' ? 'Ви вийшли з акаунту' : 
                   'Вы вышли из аккаунта'
    });
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/auth')}
        className="gap-2"
      >
        <User className="w-4 h-4" />
        {t('signIn')}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3 h-3 text-primary" />
          </div>
          <span className="max-w-[100px] truncate">
            {profile?.display_name || user.email?.split('@')[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{profile?.display_name || (language === 'en' ? 'User' : language === 'ua' ? 'Користувач' : 'Пользователь')}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/promo')}>
          <Megaphone className="w-4 h-4 mr-2" />
          {language === 'en' ? 'About' : language === 'ua' ? 'Про нас' : 'О нас'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/templates')}>
          <LayoutGrid className="w-4 h-4 mr-2" />
          {t('templates')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/my-templates')}>
          <FileText className="w-4 h-4 mr-2" />
          {language === 'en' ? 'My Templates' : language === 'ua' ? 'Мої шаблони' : 'Мои шаблоны'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/marketplace')}>
          <Store className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Marketplace' : language === 'ua' ? 'Маркетплейс' : 'Маркетплейс'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/prompts')}>
          <BookMarked className="w-4 h-4 mr-2" />
          {t('savedPrompts')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <BarChart3 className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Dashboard' : language === 'ua' ? 'Дашборд' : 'Дашборд'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}