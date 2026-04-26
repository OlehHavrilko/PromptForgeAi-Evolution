import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Plus, RefreshCw, Trash2, Upload, GitCompare } from "lucide-react";
import { toast } from "sonner";

// --- CSV parser (handles quoted fields, escaped quotes, newlines in quotes) ---
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (ch === "\r") { /* skip */ }
      else cur += ch;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

interface ParsedCase {
  input_text: string;
  reference_output: string | null;
  rubric: string | null;
  weight: number;
  tags: string[] | null;
}

function casesFromCSV(text: string): ParsedCase[] {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (k: string) => header.indexOf(k);
  const iIn = idx("input_text");
  if (iIn < 0) throw new Error("CSV must have header column 'input_text'");
  const iRef = idx("reference_output");
  const iRub = idx("rubric");
  const iW = idx("weight");
  const iT = idx("tags");
  return rows.slice(1).map((r) => ({
    input_text: r[iIn] ?? "",
    reference_output: iRef >= 0 && r[iRef] ? r[iRef] : null,
    rubric: iRub >= 0 && r[iRub] ? r[iRub] : null,
    weight: iW >= 0 && r[iW] ? Number(r[iW]) || 1 : 1,
    tags: iT >= 0 && r[iT] ? r[iT].split("|").map((s) => s.trim()).filter(Boolean) : null,
  })).filter((c) => c.input_text.trim());
}

function casesFromJSON(text: string): ParsedCase[] {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : Array.isArray((data as any).cases) ? (data as any).cases : [];
  return arr.map((c: any) => ({
    input_text: String(c.input_text ?? c.input ?? ""),
    reference_output: c.reference_output ?? c.reference ?? null,
    rubric: c.rubric ?? null,
    weight: Number(c.weight) || 1,
    tags: Array.isArray(c.tags) ? c.tags : null,
  })).filter((c: ParsedCase) => c.input_text.trim());
}

type Dataset = { id: string; name: string; description: string | null; task_type: string; created_at: string };
type EvalCase = { id: string; dataset_id: string; input_text: string; reference_output: string | null; rubric: string | null; weight: number; tags: string[] | null };
type Run = {
  id: string; dataset_id: string; prompt_version_id: string | null; model: string; judge_model: string;
  status: string; total_cases: number; completed_cases: number; avg_score: number | null;
  p50_latency_ms: number | null; p95_latency_ms: number | null; total_cost_usd: number | null;
  notes: string | null; created_at: string; finished_at: string | null; error_message: string | null;
};
type Result = {
  id: string; case_id: string; generated_output: string | null; judge_score: number | null;
  judge_reasoning: string | null; latency_ms: number | null; cost_usd: number | null;
  status: string; error_message: string | null;
};

const MODELS = [
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "openai/gpt-5",
  "openai/gpt-5-mini",
];

export default function AdminEvals() {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDs, setSelectedDs] = useState<Dataset | null>(null);
  const [cases, setCases] = useState<EvalCase[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [casesByCaseId, setCasesByCaseId] = useState<Record<string, EvalCase>>({});
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  // New dataset form
  const [newDs, setNewDs] = useState({ name: "", description: "", task_type: "generator" });
  const [dsDialogOpen, setDsDialogOpen] = useState(false);

  // New case form
  const [newCase, setNewCase] = useState({ input_text: "", reference_output: "", rubric: "", weight: 1 });
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);

  // Run form
  const [runForm, setRunForm] = useState({ model: MODELS[0], judge_model: "google/gemini-2.5-pro", notes: "" });
  const [runDialogOpen, setRunDialogOpen] = useState(false);

  // Import
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importBusy, setImportBusy] = useState(false);

  // Compare
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [resultsA, setResultsA] = useState<Result[]>([]);
  const [resultsB, setResultsB] = useState<Result[]>([]);

  const loadDatasets = async () => {
    const { data } = await supabase.from("eval_datasets").select("*").order("created_at", { ascending: false });
    setDatasets((data ?? []) as Dataset[]);
    setLoading(false);
  };

  const loadCases = async (dsId: string) => {
    const { data } = await supabase.from("eval_cases").select("*").eq("dataset_id", dsId).order("created_at");
    setCases((data ?? []) as EvalCase[]);
  };

  const loadRuns = async (dsId: string) => {
    const { data } = await supabase.from("eval_runs").select("*").eq("dataset_id", dsId).order("created_at", { ascending: false });
    setRuns((data ?? []) as Run[]);
  };

  const loadResults = async (runId: string) => {
    const { data } = await supabase.from("eval_results").select("*").eq("run_id", runId).order("created_at");
    setResults((data ?? []) as Result[]);
  };

  useEffect(() => { if (isAdmin) loadDatasets(); }, [isAdmin]);
  useEffect(() => {
    if (selectedDs) {
      loadCases(selectedDs.id);
      loadRuns(selectedDs.id);
    }
  }, [selectedDs]);
  useEffect(() => {
    if (selectedRun) loadResults(selectedRun.id);
  }, [selectedRun]);

  // Build map of case_id -> case for results display
  useEffect(() => {
    const m: Record<string, EvalCase> = {};
    cases.forEach((c) => { m[c.id] = c; });
    setCasesByCaseId(m);
  }, [cases]);

  // Auto-poll active run
  useEffect(() => {
    if (!selectedRun || (selectedRun.status !== "running" && selectedRun.status !== "pending")) return;
    const t = setInterval(async () => {
      const { data } = await supabase.from("eval_runs").select("*").eq("id", selectedRun.id).maybeSingle();
      if (data) {
        setSelectedRun(data as Run);
        loadResults(selectedRun.id);
        if (selectedDs) loadRuns(selectedDs.id);
      }
    }, 3000);
    return () => clearInterval(t);
  }, [selectedRun, selectedDs]);

  const createDataset = async () => {
    if (!newDs.name.trim()) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("eval_datasets").insert({
      name: newDs.name, description: newDs.description || null, task_type: newDs.task_type, created_by: u.user?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Датасет создан");
    setDsDialogOpen(false);
    setNewDs({ name: "", description: "", task_type: "generator" });
    loadDatasets();
  };

  const createCase = async () => {
    if (!selectedDs || !newCase.input_text.trim()) return;
    const { error } = await supabase.from("eval_cases").insert({
      dataset_id: selectedDs.id,
      input_text: newCase.input_text,
      reference_output: newCase.reference_output || null,
      rubric: newCase.rubric || null,
      weight: newCase.weight,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Кейс добавлен");
    setCaseDialogOpen(false);
    setNewCase({ input_text: "", reference_output: "", rubric: "", weight: 1 });
    loadCases(selectedDs.id);
  };

  const deleteCase = async (id: string) => {
    await supabase.from("eval_cases").delete().eq("id", id);
    if (selectedDs) loadCases(selectedDs.id);
  };

  const deleteDataset = async (id: string) => {
    if (!confirm("Удалить датасет со всеми кейсами и прогонами?")) return;
    await supabase.from("eval_datasets").delete().eq("id", id);
    setSelectedDs(null);
    loadDatasets();
  };

  const startRun = async () => {
    if (!selectedDs) return;
    if (cases.length === 0) { toast.error("Сначала добавьте кейсы"); return; }
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("run-eval", {
        body: { dataset_id: selectedDs.id, model: runForm.model, judge_model: runForm.judge_model, notes: runForm.notes },
      });
      if (error) throw error;
      toast.success("Прогон запущен");
      setRunDialogOpen(false);
      loadRuns(selectedDs.id);
      if (data?.run_id) {
        const { data: run } = await supabase.from("eval_runs").select("*").eq("id", data.run_id).maybeSingle();
        if (run) setSelectedRun(run as Run);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Ошибка запуска");
    } finally {
      setRunning(false);
    }
  };

  const importCases = async () => {
    if (!selectedDs || !importText.trim()) return;
    setImportBusy(true);
    try {
      const trimmed = importText.trim();
      const parsed: ParsedCase[] = trimmed.startsWith("{") || trimmed.startsWith("[")
        ? casesFromJSON(trimmed)
        : casesFromCSV(trimmed);
      if (!parsed.length) { toast.error("Не нашли валидных кейсов"); return; }
      const rows = parsed.map((p) => ({ ...p, dataset_id: selectedDs.id }));
      const { error } = await supabase.from("eval_cases").insert(rows);
      if (error) throw error;
      toast.success(`Импортировано: ${parsed.length}`);
      setImportOpen(false);
      setImportText("");
      loadCases(selectedDs.id);
    } catch (e: any) {
      toast.error(e?.message ?? "Ошибка парсинга");
    } finally {
      setImportBusy(false);
    }
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    setImportText(text);
  };

  const loadCompareResults = async (runId: string, slot: "A" | "B") => {
    const { data } = await supabase.from("eval_results").select("*").eq("run_id", runId);
    if (slot === "A") setResultsA((data ?? []) as Result[]);
    else setResultsB((data ?? []) as Result[]);
  };

  useEffect(() => { if (compareA) loadCompareResults(compareA, "A"); else setResultsA([]); }, [compareA]);
  useEffect(() => { if (compareB) loadCompareResults(compareB, "B"); else setResultsB([]); }, [compareB]);

  const runA = runs.find((r) => r.id === compareA) ?? null;
  const runB = runs.find((r) => r.id === compareB) ?? null;

  const compareRows = (() => {
    const mapA = new Map(resultsA.map((r) => [r.case_id, r]));
    const mapB = new Map(resultsB.map((r) => [r.case_id, r]));
    const ids = new Set<string>([...mapA.keys(), ...mapB.keys()]);
    return Array.from(ids).map((cid) => {
      const a = mapA.get(cid);
      const b = mapB.get(cid);
      const sA = a?.judge_score != null ? Number(a.judge_score) : null;
      const sB = b?.judge_score != null ? Number(b.judge_score) : null;
      const delta = sA != null && sB != null ? sB - sA : null;
      return { case_id: cid, a, b, sA, sB, delta };
    }).sort((x, y) => Math.abs(y.delta ?? 0) - Math.abs(x.delta ?? 0));
  })();

  if (adminLoading) return <div className="p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return <div className="p-8 text-muted-foreground">Доступ только для администраторов.</div>;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Evaluation Harness</h1>
          <p className="text-sm text-muted-foreground">Датасеты, прогоны и LLM-as-judge оценки качества промптов.</p>
        </div>
        <Dialog open={dsDialogOpen} onOpenChange={setDsDialogOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Новый датасет</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Создать датасет</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Название" value={newDs.name} onChange={(e) => setNewDs({ ...newDs, name: e.target.value })} />
              <Textarea placeholder="Описание" value={newDs.description} onChange={(e) => setNewDs({ ...newDs, description: e.target.value })} />
              <Select value={newDs.task_type} onValueChange={(v) => setNewDs({ ...newDs, task_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="generator">generator</SelectItem>
                  <SelectItem value="enhance">enhance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button onClick={createDataset}>Создать</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left: dataset list */}
        <Card className="col-span-3">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Датасеты</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {datasets.map((d) => (
              <button key={d.id} onClick={() => setSelectedDs(d)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted/50 ${selectedDs?.id === d.id ? "bg-primary/10 text-primary" : ""}`}>
                <div className="font-medium truncate">{d.name}</div>
                <div className="text-[10px] text-muted-foreground">{d.task_type}</div>
              </button>
            ))}
            {!loading && datasets.length === 0 && <p className="text-xs text-muted-foreground">Пусто</p>}
          </CardContent>
        </Card>

        {/* Right: details */}
        <div className="col-span-9 space-y-4">
          {!selectedDs ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Выберите датасет слева или создайте новый.</CardContent></Card>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{selectedDs.name}</CardTitle>
                    <CardDescription>{selectedDs.description || "—"}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={runDialogOpen} onOpenChange={setRunDialogOpen}>
                      <DialogTrigger asChild><Button size="sm" className="gap-2"><Play className="h-4 w-4" />Запустить прогон</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Запустить прогон</DialogTitle></DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-muted-foreground">Модель генерации</label>
                            <Select value={runForm.model} onValueChange={(v) => setRunForm({ ...runForm, model: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Модель-судья</label>
                            <Select value={runForm.judge_model} onValueChange={(v) => setRunForm({ ...runForm, judge_model: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <Textarea placeholder="Заметки (опц.)" value={runForm.notes} onChange={(e) => setRunForm({ ...runForm, notes: e.target.value })} />
                          <p className="text-xs text-muted-foreground">Будет использована активная версия системного промпта `generate-prompt`.</p>
                        </div>
                        <DialogFooter><Button onClick={startRun} disabled={running}>{running && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Запустить</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="ghost" onClick={() => deleteDataset(selectedDs.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="cases">
                <TabsList>
                  <TabsTrigger value="cases">Кейсы ({cases.length})</TabsTrigger>
                  <TabsTrigger value="runs">Прогоны ({runs.length})</TabsTrigger>
                  <TabsTrigger value="compare" className="gap-1"><GitCompare className="h-3.5 w-3.5" />A/B</TabsTrigger>
                </TabsList>

                <TabsContent value="cases">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Тестовые кейсы</CardTitle>
                      <div className="flex gap-2">
                        <Dialog open={importOpen} onOpenChange={setImportOpen}>
                          <DialogTrigger asChild><Button size="sm" variant="outline" className="gap-2"><Upload className="h-4 w-4" />Импорт</Button></DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader><DialogTitle>Импорт кейсов (CSV / JSON)</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div><b>CSV:</b> заголовок с колонками <code>input_text,reference_output,rubric,weight,tags</code> (tags через <code>|</code>). Обязательна только <code>input_text</code>.</div>
                                <div><b>JSON:</b> массив <code>{`{ input_text, reference_output?, rubric?, weight?, tags? }`}</code> или <code>{`{ cases: [...] }`}</code>.</div>
                              </div>
                              <Input type="file" accept=".csv,.json,.txt" onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])} />
                              <Textarea rows={10} className="font-mono text-xs" placeholder="...или вставь содержимое сюда" value={importText} onChange={(e) => setImportText(e.target.value)} />
                            </div>
                            <DialogFooter><Button onClick={importCases} disabled={importBusy}>{importBusy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Импортировать</Button></DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
                          <DialogTrigger asChild><Button size="sm" variant="outline" className="gap-2"><Plus className="h-4 w-4" />Кейс</Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Новый кейс</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                              <Textarea placeholder="Входной текст (что вводит пользователь)" rows={4} value={newCase.input_text} onChange={(e) => setNewCase({ ...newCase, input_text: e.target.value })} />
                              <Textarea placeholder="Эталонный ответ (опц.)" rows={3} value={newCase.reference_output} onChange={(e) => setNewCase({ ...newCase, reference_output: e.target.value })} />
                              <Textarea placeholder="Рубрика оценки (опц.)" rows={2} value={newCase.rubric} onChange={(e) => setNewCase({ ...newCase, rubric: e.target.value })} />
                            </div>
                            <DialogFooter><Button onClick={createCase}>Добавить</Button></DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {cases.length === 0 ? <p className="text-sm text-muted-foreground">Кейсов пока нет.</p> : (
                        <Table>
                          <TableHeader><TableRow><TableHead>Input</TableHead><TableHead>Reference</TableHead><TableHead className="w-16">Вес</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                          <TableBody>
                            {cases.map((c) => (
                              <TableRow key={c.id}>
                                <TableCell className="max-w-[300px] truncate text-xs">{c.input_text}</TableCell>
                                <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">{c.reference_output ?? "—"}</TableCell>
                                <TableCell>{c.weight}</TableCell>
                                <TableCell><Button size="icon" variant="ghost" onClick={() => deleteCase(c.id)}><Trash2 className="h-3 w-3" /></Button></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="runs">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">История прогонов</CardTitle>
                        <Button size="icon" variant="ghost" onClick={() => selectedDs && loadRuns(selectedDs.id)}><RefreshCw className="h-4 w-4" /></Button>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        {runs.map((r) => (
                          <button key={r.id} onClick={() => setSelectedRun(r)}
                            className={`w-full text-left p-2 rounded text-xs hover:bg-muted/50 ${selectedRun?.id === r.id ? "bg-primary/10" : ""}`}>
                            <div className="flex items-center justify-between">
                              <Badge variant={r.status === "completed" ? "default" : r.status === "failed" ? "destructive" : "secondary"}>{r.status}</Badge>
                              <span className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                            </div>
                            <div className="mt-1 text-muted-foreground">{r.model}</div>
                            <div className="mt-1 flex gap-3">
                              <span>📊 {r.avg_score?.toFixed(2) ?? "—"}/5</span>
                              <span>⏱ p95 {r.p95_latency_ms ?? "—"}ms</span>
                              <span>💰 ${r.total_cost_usd?.toFixed(4) ?? "—"}</span>
                            </div>
                            <div className="text-muted-foreground mt-0.5">{r.completed_cases}/{r.total_cases} кейсов</div>
                          </button>
                        ))}
                        {runs.length === 0 && <p className="text-xs text-muted-foreground">Нет прогонов</p>}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="text-base">Детали прогона</CardTitle></CardHeader>
                      <CardContent>
                        {!selectedRun ? <p className="text-xs text-muted-foreground">Выберите прогон</p> : (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-muted-foreground">Модель:</span> {selectedRun.model}</div>
                              <div><span className="text-muted-foreground">Судья:</span> {selectedRun.judge_model}</div>
                              <div><span className="text-muted-foreground">Avg score:</span> {selectedRun.avg_score?.toFixed(2) ?? "—"}/5</div>
                              <div><span className="text-muted-foreground">Cost:</span> ${selectedRun.total_cost_usd?.toFixed(4) ?? "—"}</div>
                              <div><span className="text-muted-foreground">p50:</span> {selectedRun.p50_latency_ms ?? "—"} ms</div>
                              <div><span className="text-muted-foreground">p95:</span> {selectedRun.p95_latency_ms ?? "—"} ms</div>
                            </div>
                            {selectedRun.error_message && <p className="text-xs text-destructive">{selectedRun.error_message}</p>}
                            <div className="space-y-2 max-h-[400px] overflow-auto">
                              {results.map((r) => (
                                <details key={r.id} className="border border-border rounded p-2 text-xs">
                                  <summary className="cursor-pointer flex items-center gap-2">
                                    <Badge variant={r.status === "success" ? "default" : "destructive"} className="text-[10px]">{r.judge_score ?? "—"}/5</Badge>
                                    <span className="truncate flex-1">{casesByCaseId[r.case_id]?.input_text?.slice(0, 60) ?? r.case_id}</span>
                                  </summary>
                                  <div className="mt-2 space-y-2">
                                    <div><span className="text-muted-foreground">Reasoning:</span> {r.judge_reasoning ?? "—"}</div>
                                    <div className="bg-muted/30 p-2 rounded whitespace-pre-wrap max-h-40 overflow-auto">{r.generated_output ?? r.error_message ?? "—"}</div>
                                    <div className="text-muted-foreground">latency {r.latency_ms}ms · ${r.cost_usd?.toFixed(5) ?? "—"}</div>
                                  </div>
                                </details>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="compare">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Сравнение прогонов</CardTitle>
                      <CardDescription>Выбери два completed-прогона — увидишь дельты по avg score, p95, cost и разницу по каждому кейсу.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Run A (baseline)</label>
                          <Select value={compareA ?? ""} onValueChange={(v) => setCompareA(v || null)}>
                            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              {runs.filter((r) => r.status === "completed").map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {new Date(r.created_at).toLocaleString()} · {r.model} · {r.avg_score?.toFixed(2) ?? "—"}/5
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Run B (candidate)</label>
                          <Select value={compareB ?? ""} onValueChange={(v) => setCompareB(v || null)}>
                            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              {runs.filter((r) => r.status === "completed").map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {new Date(r.created_at).toLocaleString()} · {r.model} · {r.avg_score?.toFixed(2) ?? "—"}/5
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {runA && runB && (
                        <>
                          <div className="grid grid-cols-3 gap-3">
                            {([
                              { label: "Avg score", a: runA.avg_score, b: runB.avg_score, fmt: (n: number) => `${n.toFixed(2)}/5`, higherBetter: true },
                              { label: "p95 latency", a: runA.p95_latency_ms, b: runB.p95_latency_ms, fmt: (n: number) => `${Math.round(n)}ms`, higherBetter: false },
                              { label: "Total cost", a: runA.total_cost_usd, b: runB.total_cost_usd, fmt: (n: number) => `$${Number(n).toFixed(4)}`, higherBetter: false },
                            ] as const).map((m) => {
                              const aV = m.a == null ? null : Number(m.a);
                              const bV = m.b == null ? null : Number(m.b);
                              const delta = aV != null && bV != null ? bV - aV : null;
                              const better = delta == null ? null : (m.higherBetter ? delta > 0 : delta < 0);
                              return (
                                <div key={m.label} className="border border-border rounded p-3 text-xs">
                                  <div className="text-muted-foreground mb-1">{m.label}</div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-muted-foreground">{aV != null ? m.fmt(aV) : "—"}</span>
                                    <span>→</span>
                                    <span className="font-semibold">{bV != null ? m.fmt(bV) : "—"}</span>
                                  </div>
                                  {delta != null && (
                                    <div className={`mt-1 font-mono ${better ? "text-emerald-500" : "text-destructive"}`}>
                                      {delta > 0 ? "+" : ""}{m.fmt(Math.abs(delta) * (delta < 0 ? -1 : 1))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Кейс</TableHead>
                                <TableHead className="w-20 text-right">A</TableHead>
                                <TableHead className="w-20 text-right">B</TableHead>
                                <TableHead className="w-20 text-right">Δ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {compareRows.map((row) => (
                                <TableRow key={row.case_id}>
                                  <TableCell className="text-xs max-w-[400px] truncate">
                                    {casesByCaseId[row.case_id]?.input_text?.slice(0, 80) ?? row.case_id}
                                  </TableCell>
                                  <TableCell className="text-right text-xs">{row.sA?.toFixed(2) ?? "—"}</TableCell>
                                  <TableCell className="text-right text-xs">{row.sB?.toFixed(2) ?? "—"}</TableCell>
                                  <TableCell className={`text-right text-xs font-mono ${row.delta == null ? "" : row.delta > 0 ? "text-emerald-500" : row.delta < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                                    {row.delta == null ? "—" : `${row.delta > 0 ? "+" : ""}${row.delta.toFixed(2)}`}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {compareRows.length === 0 && (
                                <TableRow><TableCell colSpan={4} className="text-xs text-muted-foreground text-center">Нет данных</TableCell></TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
