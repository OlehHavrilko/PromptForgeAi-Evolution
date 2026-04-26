import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Loader2,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Plus,
  Eye,
  Sparkles,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  updated_at: string;
}

interface Version {
  id: string;
  template_id: string;
  version: number;
  system_prompt: string;
  default_params: Record<string, unknown>;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export default function AdminPrompts() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const [previewVersion, setPreviewVersion] = useState<Version | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSystemPrompt, setNewSystemPrompt] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newActivate, setNewActivate] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: tpls }, { data: vers }] = await Promise.all([
      supabase.from("prompt_templates").select("*").order("name"),
      supabase
        .from("prompt_template_versions")
        .select("*")
        .order("template_id")
        .order("version", { ascending: false }),
    ]);
    setTemplates((tpls as Template[]) || []);
    setVersions((vers as Version[]) || []);
    if (!selectedTemplateId && tpls && tpls.length) {
      setSelectedTemplateId(tpls[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || null,
    [templates, selectedTemplateId]
  );

  const templateVersions = useMemo(
    () =>
      versions
        .filter((v) => v.template_id === selectedTemplateId)
        .sort((a, b) => b.version - a.version),
    [versions, selectedTemplateId]
  );

  const activeVersion = templateVersions.find((v) => v.is_active) || null;
  const nextVersionNumber =
    templateVersions.length > 0 ? Math.max(...templateVersions.map((v) => v.version)) + 1 : 1;

  const fetchBestScore = async (versionId: string): Promise<number | null> => {
    const { data } = await supabase
      .from("eval_runs")
      .select("avg_score")
      .eq("prompt_version_id", versionId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.avg_score != null ? Number(data.avg_score) : null;
  };

  const promote = async (version: Version) => {
    if (!selectedTemplateId) return;

    // Regression gate: if both active and target have eval scores, warn on regression
    if (activeVersion && activeVersion.id !== version.id) {
      const [activeScore, targetScore] = await Promise.all([
        fetchBestScore(activeVersion.id),
        fetchBestScore(version.id),
      ]);
      if (activeScore != null && targetScore != null && targetScore < activeScore) {
        const drop = (activeScore - targetScore).toFixed(2);
        const ok = confirm(
          `⚠️ Regression detected\n\n` +
          `Active v${activeVersion.version}: ${activeScore.toFixed(2)}/5\n` +
          `Target v${version.version}: ${targetScore.toFixed(2)}/5\n` +
          `Δ −${drop}\n\n` +
          `Promote anyway?`
        );
        if (!ok) return;
      } else if (targetScore == null) {
        const ok = confirm(
          `Target v${version.version} has no completed eval runs.\n` +
          `Recommended: run an eval first to validate quality.\n\n` +
          `Promote anyway?`
        );
        if (!ok) return;
      }
    }

    setBusy(version.id);
    // Deactivate all versions of this template, then activate the chosen one
    const { error: deactErr } = await supabase
      .from("prompt_template_versions")
      .update({ is_active: false })
      .eq("template_id", selectedTemplateId);
    if (deactErr) {
      toast.error("Failed to deactivate previous version: " + deactErr.message);
      setBusy(null);
      return;
    }
    const { error: actErr } = await supabase
      .from("prompt_template_versions")
      .update({ is_active: true })
      .eq("id", version.id);
    setBusy(null);
    if (actErr) {
      toast.error("Failed to activate version: " + actErr.message);
      return;
    }
    toast.success(`Version ${version.version} is now active`);
    loadAll();
  };

  const createVersion = async () => {
    if (!selectedTemplateId || !user) return;
    if (!newSystemPrompt.trim()) {
      toast.error("System prompt is required");
      return;
    }
    setBusy("create");
    // Insert new version
    const { data: inserted, error } = await supabase
      .from("prompt_template_versions")
      .insert({
        template_id: selectedTemplateId,
        version: nextVersionNumber,
        system_prompt: newSystemPrompt,
        notes: newNotes || null,
        is_active: false,
        created_by: user.id,
        default_params: (activeVersion?.default_params || {}) as never,
      })
      .select()
      .single();

    if (error || !inserted) {
      setBusy(null);
      toast.error("Failed to create version: " + (error?.message || "unknown"));
      return;
    }

    if (newActivate) {
      await supabase
        .from("prompt_template_versions")
        .update({ is_active: false })
        .eq("template_id", selectedTemplateId);
      await supabase
        .from("prompt_template_versions")
        .update({ is_active: true })
        .eq("id", inserted.id);
    }
    setBusy(null);
    setCreateOpen(false);
    setNewSystemPrompt("");
    setNewNotes("");
    setNewActivate(true);
    toast.success(
      `Version ${nextVersionNumber} created${newActivate ? " and activated" : ""}`
    );
    loadAll();
  };

  const cloneFromActive = () => {
    if (activeVersion) setNewSystemPrompt(activeVersion.system_prompt);
    setCreateOpen(true);
  };

  if (roleLoading || (isAdmin && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 max-w-md">
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-lg font-semibold">Admin access required</h2>
            <p className="text-sm text-muted-foreground">
              You need the admin role to manage prompt versions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Prompt Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system prompts as immutable versions. Promote and rollback without redeploying.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Templates list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Templates</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-1 p-2">
                {templates.length === 0 && (
                  <p className="text-xs text-muted-foreground p-3">No templates yet.</p>
                )}
                {templates.map((tpl) => {
                  const active = versions.find(
                    (v) => v.template_id === tpl.id && v.is_active
                  );
                  const isSelected = tpl.id === selectedTemplateId;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="text-sm font-medium truncate">{tpl.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {tpl.category}
                        </Badge>
                        {active && (
                          <span className="text-[10px] text-muted-foreground">
                            v{active.version} active
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Versions panel */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between gap-3 space-y-0">
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {selectedTemplate?.name || "Select a template"}
              </CardTitle>
              {selectedTemplate?.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedTemplate.description}
                </p>
              )}
            </div>
            {selectedTemplate && (
              <div className="flex gap-2 shrink-0">
                {activeVersion && (
                  <Button size="sm" variant="outline" onClick={cloneFromActive}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Clone active
                  </Button>
                )}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      New version
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>
                        New version v{nextVersionNumber} — {selectedTemplate.name}
                      </DialogTitle>
                      <DialogDescription>
                        Versions are immutable. Edits create a new version you can promote.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="sysprompt" className="text-xs">
                          System prompt
                        </Label>
                        <Textarea
                          id="sysprompt"
                          value={newSystemPrompt}
                          onChange={(e) => setNewSystemPrompt(e.target.value)}
                          rows={16}
                          className="font-mono text-xs mt-1"
                          placeholder="You are a prompt-engineering expert…"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes" className="text-xs">
                          Notes (changelog)
                        </Label>
                        <Input
                          id="notes"
                          value={newNotes}
                          onChange={(e) => setNewNotes(e.target.value)}
                          placeholder="What changed and why"
                          className="mt-1"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newActivate}
                          onChange={(e) => setNewActivate(e.target.checked)}
                        />
                        Activate immediately
                      </label>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCreateOpen(false)}
                        disabled={busy === "create"}
                      >
                        Cancel
                      </Button>
                      <Button onClick={createVersion} disabled={busy === "create"}>
                        {busy === "create" && (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        )}
                        Create version
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!selectedTemplate ? (
              <p className="text-sm text-muted-foreground">
                Pick a template on the left.
              </p>
            ) : templateVersions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No versions yet. Create the first one.
              </p>
            ) : (
              <div className="space-y-2">
                {templateVersions.map((v) => (
                  <div
                    key={v.id}
                    className={`border rounded-lg p-3 transition-colors ${
                      v.is_active ? "border-primary/50 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-semibold">
                            v{v.version}
                          </span>
                          {v.is_active ? (
                            <Badge className="text-[10px] gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              Inactive
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(v.created_at).toLocaleString()}
                          </span>
                        </div>
                        {v.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {v.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground/70 mt-1 font-mono line-clamp-2">
                          {v.system_prompt.slice(0, 160)}
                          {v.system_prompt.length > 160 ? "…" : ""}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewVersion(v)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        {!v.is_active && (
                          <Button
                            size="sm"
                            onClick={() => promote(v)}
                            disabled={busy === v.id}
                          >
                            {busy === v.id ? (
                              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : activeVersion && v.version < activeVersion.version ? (
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            )}
                            {activeVersion && v.version < activeVersion.version
                              ? "Rollback"
                              : "Promote"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview dialog */}
      <Dialog
        open={!!previewVersion}
        onOpenChange={(o) => !o && setPreviewVersion(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate?.name} — v{previewVersion?.version}
              {previewVersion?.is_active && (
                <Badge className="ml-2 text-[10px]">Active</Badge>
              )}
            </DialogTitle>
            {previewVersion?.notes && (
              <DialogDescription>{previewVersion.notes}</DialogDescription>
            )}
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
              {previewVersion?.system_prompt}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
