interface PromptConfig {
  input: string;
  length: string;
}

const lengthGuidelines: Record<string, string> = {
  "Краткий": "Дай краткий и лаконичный ответ, сфокусированный только на главном.",
  "Сбалансированный": "Предоставь сбалансированный ответ с достаточной детализацией.",
  "Детальный": "Дай подробный, всесторонний ответ, охватывающий все аспекты темы.",
  "Concise": "Keep the response brief and to the point, focusing on essential information only.",
  "Balanced": "Provide a well-balanced response with adequate detail without being excessive.",
  "Detailed": "Deliver a comprehensive, in-depth response covering all relevant aspects thoroughly.",
};

export function generatePrompt(config: PromptConfig): string {
  if (!config.input.trim()) {
    return "";
  }

  const lengthGuideline = lengthGuidelines[config.length] || lengthGuidelines["Сбалансированный"];

  const prompt = `You are a helpful AI assistant. ${lengthGuideline}

## Задача
${config.input}

## Рекомендации
- Сфокусируйся на качественном и релевантном ответе
- Структурируй ответ четко и понятно
- Будь точным и внимательным к деталям
- Учитывай контекст и аудиторию

## Формат ответа
Предоставь хорошо организованный ответ, который напрямую решает поставленную задачу.`;

  return prompt;
}

export const templates = [
  {
    id: "blog-post",
    title: "Blog Post",
    description: "Generate engaging blog content with SEO optimization",
    icon: "FileText",
    example: "Write about sustainable living tips",
    defaultInput: "Write an engaging blog post about",
    taskType: "content",
  },
  {
    id: "code-review",
    title: "Code Review",
    description: "Get detailed code analysis and improvement suggestions",
    icon: "Code",
    example: "Review my React component for performance",
    defaultInput: "Review and improve this code:",
    taskType: "code",
  },
  {
    id: "ad-copy",
    title: "Ad Copy",
    description: "Create compelling advertising copy that converts",
    icon: "Megaphone",
    example: "Create a Facebook ad for my SaaS product",
    defaultInput: "Create compelling ad copy for",
    taskType: "marketing",
  },
  {
    id: "summary",
    title: "Research Summary",
    description: "Synthesize complex topics into clear summaries",
    icon: "Search",
    example: "Summarize recent AI developments",
    defaultInput: "Provide a comprehensive summary of",
    taskType: "research",
  },
];
