# PromptForge

AI prompt management web application — create, organize, enhance and test AI prompts with a modern UI.

## Features

- **Prompt Generator** — generate production-ready prompts with tone, style and length controls
- **Prompt Enhancer** — improve existing prompts using AI
- **Prompt Scoring** — evaluate prompt quality with detailed criteria breakdown
- **Chat Assistant** — iteratively refine prompts through conversation
- **Image Analyzer** — analyze images and generate descriptive prompts
- **Text Tools** — humanize AI-generated text or detect AI content
- **History** — all generations saved and searchable
- **Templates** — curated prompt templates across categories
- **Multi-language** — English, Russian, Ukrainian UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Routing | React Router v6 |
| Backend | Supabase (Auth + DB + Edge Functions) |
| AI | Gemini 2.5 Flash (default) + OpenAI / Anthropic / OpenRouter (user keys) |

## Getting Started

### Requirements
- Node.js ≥ 18
- Supabase project
- Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Local development

```bash
git clone https://github.com/OlehHavrilko/PromptForgeAi.git
cd PromptForgeAi
npm install
cp .env.example .env
# Fill in .env with your Supabase and Gemini credentials
npm run dev
```

### Environment variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full Vercel deployment instructions.

## License

MIT
