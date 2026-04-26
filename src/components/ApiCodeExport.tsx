import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ApiCodeExportProps {
  prompt: string;
}

type CodeLang = "python" | "javascript" | "curl";

function generateApiCode(prompt: string, lang: CodeLang): string {
  const escapedPrompt = prompt.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

  switch (lang) {
    case "python":
      return `import openai

client = openai.OpenAI(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "${escapedPrompt}"
        }
    ],
    temperature=0.7,
    max_tokens=2048
)

print(response.choices[0].message.content)`;

    case "javascript":
      return `import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "YOUR_API_KEY" });

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant."
    },
    {
      role: "user",
      content: "${escapedPrompt}"
    }
  ],
  temperature: 0.7,
  max_tokens: 2048,
});

console.log(response.choices[0].message.content);`;

    case "curl":
      return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "${escapedPrompt}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2048
}'`;

    default:
      return "";
  }
}

export function ApiCodeExport({ prompt }: ApiCodeExportProps) {
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<CodeLang>("python");
  const { language } = useLanguage();

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(language === "en" ? "Code copied!" : language === "ua" ? "Код скопійовано!" : "Код скопирован!");
    setTimeout(() => setCopied(false), 2000);
  };

  const labels = {
    en: { title: "Export as API Code", btn: "API Code" },
    ru: { title: "Экспорт в API-код", btn: "API-код" },
    ua: { title: "Експорт в API-код", btn: "API-код" },
  };
  const t = labels[language as keyof typeof labels] || labels.en;

  const code = generateApiCode(prompt, selectedLang);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs">
          <Code2 className="w-3 h-3" />
          <span>{t.btn}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={selectedLang} onValueChange={(v) => setSelectedLang(v as CodeLang)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
              <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
              <TabsTrigger value="curl" className="text-xs">cURL</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={() => handleCopy(code)} className="gap-1.5 h-7 text-xs">
              {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          {(["python", "javascript", "curl"] as const).map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-3">
              <pre className="bg-muted/50 border border-border/50 rounded-lg p-4 overflow-auto max-h-[50vh] text-xs font-mono leading-relaxed text-foreground/90">
                <code>{generateApiCode(prompt, lang)}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
