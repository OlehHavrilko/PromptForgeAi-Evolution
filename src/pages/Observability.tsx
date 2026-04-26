import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ShieldAlert } from "lucide-react";

interface Trace {
  id: string;
  function_name: string;
  provider: string;
  model: string;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  latency_ms: number | null;
  ttft_ms: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface AggRow {
  function_name: string;
  count: number;
  avgLatency: number;
  p95Latency: number;
  errorRate: number;
  totalCost: number;
}

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export default function Observability() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    (async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      const admin = !!roles;
      setIsAdmin(admin);

      const { data } = await supabase
        .from("llm_traces")
        .select("id, function_name, provider, model, input_tokens, output_tokens, cost_usd, latency_ms, ttft_ms, status, error_message, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      setTraces((data ?? []) as Trace[]);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
        <ShieldAlert className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Только для администраторов</h2>
        <p className="text-muted-foreground max-w-md">
          Этот раздел доступен только пользователям с ролью <code>admin</code>.
        </p>
      </div>
    );
  }

  const grouped = new Map<string, Trace[]>();
  for (const t of traces) {
    const arr = grouped.get(t.function_name) ?? [];
    arr.push(t);
    grouped.set(t.function_name, arr);
  }
  const aggregates: AggRow[] = Array.from(grouped.entries()).map(([fn, arr]) => {
    const latencies = arr.map(a => a.latency_ms ?? 0).filter(n => n > 0).sort((a, b) => a - b);
    const errors = arr.filter(a => a.status === "error").length;
    const cost = arr.reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
    return {
      function_name: fn,
      count: arr.length,
      avgLatency: latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
      p95Latency: percentile(latencies, 95),
      errorRate: arr.length ? (errors / arr.length) * 100 : 0,
      totalCost: cost,
    };
  });

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold">Observability</h1>
        <p className="text-sm text-muted-foreground">Телеметрия LLM-вызовов: латентность, токены, стоимость, ошибки.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {aggregates.map(a => (
          <Card key={a.function_name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono">{a.function_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Calls</span><span>{a.count}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Avg latency</span><span>{a.avgLatency} ms</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">p95 latency</span><span>{a.p95Latency} ms</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Error rate</span><span className={a.errorRate > 0 ? "text-destructive" : ""}>{a.errorRate.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span>${a.totalCost.toFixed(4)}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Последние трейсы (200)</CardTitle></CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Время</TableHead>
                <TableHead>Функция</TableHead>
                <TableHead>Провайдер / модель</TableHead>
                <TableHead className="text-right">Tokens (in/out)</TableHead>
                <TableHead className="text-right">Latency</TableHead>
                <TableHead className="text-right">TTFT</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traces.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleTimeString()}</TableCell>
                  <TableCell className="font-mono text-xs">{t.function_name}</TableCell>
                  <TableCell className="text-xs">{t.provider} / {t.model}</TableCell>
                  <TableCell className="text-right text-xs">{t.input_tokens ?? "—"} / {t.output_tokens ?? "—"}</TableCell>
                  <TableCell className="text-right text-xs">{t.latency_ms ?? "—"} ms</TableCell>
                  <TableCell className="text-right text-xs">{t.ttft_ms ?? "—"} ms</TableCell>
                  <TableCell className="text-right text-xs">{t.cost_usd != null ? `$${Number(t.cost_usd).toFixed(5)}` : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "success" ? "secondary" : "destructive"}>{t.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
