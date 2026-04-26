import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Server, Globe, User, ShieldCheck, AlertCircle } from "lucide-react";

type Source = "secret" | "env" | "user";

interface KeyRecord {
  name: string;
  source: Source;
  purpose: string;
  functions: string[];
  managed?: boolean;
  publicSafe?: boolean;
}

const KEY_REGISTRY: KeyRecord[] = [
  {
    name: "OPENROUTER_API_KEY",
    source: "secret",
    purpose: "OpenRouter (Gemini, GPT, Claude, …) — генерация, оценка, чат, eval-judge",
    functions: [
      "enhance-prompt",
      "generate-prompt",
      "score-prompt",
      "text-tools",
      "analyze-image",
      "prompt-chat",
      "run-eval",
    ],
    managed: true,
  },
  {
    name: "SUPABASE_URL",
    source: "secret",
    purpose: "URL backend для серверного клиента в edge-функциях",
    functions: ["check-subscription", "create-checkout", "customer-portal", "run-eval", "generate-prompt", "enhance-prompt"],
    managed: true,
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    source: "secret",
    purpose: "Service role — обход RLS для записи трейсов, eval-результатов, биллинга",
    functions: ["run-eval", "generate-prompt", "enhance-prompt", "check-subscription", "create-checkout"],
    managed: true,
  },
  {
    name: "SUPABASE_ANON_KEY",
    source: "secret",
    purpose: "Анонимный ключ — серверный клиент с пользовательским JWT",
    functions: ["check-subscription", "create-checkout", "customer-portal"],
    managed: true,
  },
  {
    name: "SUPABASE_PUBLISHABLE_KEY",
    source: "secret",
    purpose: "Publishable ключ для серверных операций от имени юзера",
    functions: ["—"],
    managed: true,
  },
  {
    name: "SUPABASE_DB_URL",
    source: "secret",
    purpose: "Прямой DB connection string (миграции, внутренние операции)",
    functions: ["—"],
    managed: true,
  },
  {
    name: "VITE_SUPABASE_URL",
    source: "env",
    purpose: "URL backend для клиента в браузере",
    functions: ["client (браузер)"],
    publicSafe: true,
  },
  {
    name: "VITE_SUPABASE_PUBLISHABLE_KEY",
    source: "env",
    purpose: "Публичный ключ Supabase для клиента (анти-RLS не даёт)",
    functions: ["client (браузер)"],
    publicSafe: true,
  },
  {
    name: "VITE_SUPABASE_PROJECT_ID",
    source: "env",
    purpose: "ID проекта для конфигурации",
    functions: ["client (браузер)"],
    publicSafe: true,
  },
];

const USER_PROVIDERS: { provider: string; label: string; routedVia: string }[] = [
  { provider: "openai", label: "OpenAI (GPT-4, GPT-5 через свой ключ)", routedVia: "Custom routing in edge functions" },
  { provider: "anthropic", label: "Anthropic (Claude через свой ключ)", routedVia: "Custom routing in edge functions" },
  { provider: "openrouter", label: "OpenRouter (любая модель через свой ключ)", routedVia: "Custom routing in edge functions" },
];

const sourceMeta: Record<Source, { label: string; icon: any; className: string }> = {
  secret: { label: "Server Secret", icon: Server, className: "bg-primary/15 text-primary border-primary/30" },
  env: { label: "Public ENV", icon: Globe, className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  user: { label: "User-Provided", icon: User, className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
};

export default function AdminApiKeys() {
  const { isAdmin, loading } = useIsAdmin();
  const [userKeyCounts, setUserKeyCounts] = useState<Record<string, number>>({});
  const [totalUserKeys, setTotalUserKeys] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data, error } = await supabase
        .from("user_api_keys")
        .select("provider, is_active");
      if (error) return;
      const counts: Record<string, number> = {};
      let total = 0;
      data?.forEach((row: any) => {
        if (!row.is_active) return;
        counts[row.provider] = (counts[row.provider] ?? 0) + 1;
        total += 1;
      });
      setUserKeyCounts(counts);
      setTotalUserKeys(total);
    })();
  }, [isAdmin]);

  if (loading) return <div className="p-6 text-muted-foreground">Loading…</div>;
  if (!isAdmin) return <Navigate to="/app" replace />;

  const serverSecrets = KEY_REGISTRY.filter((k) => k.source === "secret");
  const envKeys = KEY_REGISTRY.filter((k) => k.source === "env");

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Key className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">API Keys Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Реестр всех ключей, источников и edge-функций, которые их используют
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Server Secrets</CardDescription>
            <CardTitle className="text-3xl">{serverSecrets.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Хранятся в Lovable Cloud secrets
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Public ENV</CardDescription>
            <CardTitle className="text-3xl">{envKeys.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Безопасно жить в клиентском коде
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>User-Provided Keys</CardDescription>
            <CardTitle className="text-3xl">{totalUserKeys}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Активных ключей в user_api_keys
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Все ключи</TabsTrigger>
          <TabsTrigger value="secrets">Server Secrets</TabsTrigger>
          <TabsTrigger value="env">Public ENV</TabsTrigger>
          <TabsTrigger value="user">User-Provided</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <KeyTable rows={KEY_REGISTRY} />
        </TabsContent>
        <TabsContent value="secrets" className="mt-4">
          <KeyTable rows={serverSecrets} />
        </TabsContent>
        <TabsContent value="env" className="mt-4">
          <Card className="mb-4 border-blue-500/30 bg-blue-500/5">
            <CardContent className="pt-4 flex gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                VITE_* префикс делает переменные публичными — они попадают в bundle.
                Это безопасно для publishable/anon ключей Supabase, защищённых RLS.
              </span>
            </CardContent>
          </Card>
          <KeyTable rows={envKeys} />
        </TabsContent>
        <TabsContent value="user" className="mt-4">
          <Card className="mb-4 border-purple-500/30 bg-purple-500/5">
            <CardContent className="pt-4 flex gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Ключи юзеров шифруются и хранятся в таблице <code className="text-foreground">user_api_keys</code>.
                Роутятся в edge-функциях, если юзер настроил кастомного провайдера в Settings → API Keys.
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Активные пользовательские ключи по провайдерам</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Провайдер</TableHead>
                    <TableHead>Активных ключей</TableHead>
                    <TableHead>Маршрутизация</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USER_PROVIDERS.map((p) => (
                    <TableRow key={p.provider}>
                      <TableCell className="font-medium">{p.label}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{userKeyCounts[p.provider] ?? 0}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.routedVia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KeyTable({ rows }: { rows: KeyRecord[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ключ</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Назначение</TableHead>
              <TableHead>Используется в функциях</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const meta = sourceMeta[row.source];
              const Icon = meta.icon;
              return (
                <TableRow key={row.name}>
                  <TableCell>
                    <div className="font-mono text-xs font-medium">{row.name}</div>
                    {row.managed && (
                      <Badge variant="outline" className="mt-1 text-[10px] py-0 h-4">managed</Badge>
                    )}
                    {row.publicSafe && (
                      <Badge variant="outline" className="mt-1 text-[10px] py-0 h-4 border-blue-500/30 text-blue-400">
                        public-safe
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={meta.className}>
                      <Icon className="w-3 h-3 mr-1" />
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">{row.purpose}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.functions.map((fn) => (
                        <Badge key={fn} variant="secondary" className="text-[10px] font-mono">
                          {fn}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
