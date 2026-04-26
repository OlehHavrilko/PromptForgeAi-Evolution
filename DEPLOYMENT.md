# Deployment Guide

## Prerequisites

- Vercel account
- Supabase project (create at [supabase.com](https://supabase.com))
- Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run all migration files from `supabase/migrations/` in chronological order
3. Go to Authentication → URL Configuration:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`
4. Enable Email provider: Authentication → Providers → Email

## 2. Deploy Edge Functions

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

supabase functions deploy --all
```

## 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Import from GitHub: `OlehHavrilko/PromptForgeAi`
3. Framework will be auto-detected as **Vite**
4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same as anon key |

5. Click **Deploy**

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Vercel | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Vercel | Supabase anon key |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel | Same as anon key |
| `GEMINI_API_KEY` | Supabase secrets | Default AI provider key |
| `SUPABASE_URL` | Supabase secrets | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase secrets | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Supabase service role key |
