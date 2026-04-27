import {
  Wand2,
  MessageSquare,
  Image,
  Type,
  BookMarked,
  LayoutGrid,
  FileText,
  Store,
  BarChart3,
  Settings,
  LogOut,
  User,
  Zap,
  Clock,
  Activity,
  Sparkles,
  FlaskConical,
  Key,
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();

  const t = (en: string, ru: string, ua: string) =>
    language === "en" ? en : language === "ua" ? ua : ru;

  const mainItems: NavItem[] = [
    { title: t("Generator", "Генератор", "Генератор"), url: "/app", icon: Wand2 },
    { title: t("Chat", "Чат", "Чат"), url: "/chat", icon: MessageSquare },
    { title: t("Image Analyzer", "Анализ изображений", "Аналіз зображень"), url: "/app/images", icon: Image },
    { title: t("Text Tools", "Текстовые инструменты", "Текстові інструменти"), url: "/app/text-tools", icon: Type },
  ];

  const libraryItems: NavItem[] = [
    { title:

  const analyticsItems: NavItem[] = [
    { title: t("Dashboard", "Дашборд", "Дашборд"), url: "/dashboard", icon: BarChart3 },
    { title: t("History", "История", "Історія"), url: "/history", icon: Clock },
  ];

  const adminItems: NavItem[] = [
    { title: t("Observability", "Observability", "Observability"), url: "/admin/observability", icon: Activity },
    { title: t("Prompt Registry", "Реестр промптов", "Реєстр промптів"), url: "/admin/prompts", icon: Sparkles },
    { title: t("Evals", "Оценки", "Оцінки"), url: "/admin/evals", icon: FlaskConical },
    { title: t("API Keys", "API ключи", "API ключі"), url: "/admin/api-keys", icon: Key },
  ];

  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-gradient">PromptForge</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {renderGroup(t("Tools", "Инструменты", "Інструменти"), mainItems)}
        {renderGroup(t("Library", "Библиотека", "Бібліотека"), libraryItems)}
        {renderGroup(t("Analytics", "Аналитика", "Аналітика"), analyticsItems)}
        {isAdmin && renderGroup(t("Admin", "Админ", "Адмін"), adminItems)}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        {user ? (
          <div className="space-y-1">
            <SidebarMenuButton asChild>
              <NavLink
                to="/settings"
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <Settings className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{t("Settings", "Настройки", "Налаштування")}</span>}
              </NavLink>
            </SidebarMenuButton>
            <button
              onClick={signOut}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t("Sign Out", "Выход", "Вихід")}</span>}
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="w-full gap-2"
          >
            <User className="w-4 h-4" />
            {!collapsed && t("Sign In", "Войти", "Увійти")}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
