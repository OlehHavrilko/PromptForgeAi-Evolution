-- Create generation history table
CREATE TABLE public.generation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  generated_prompt TEXT NOT NULL,
  tool_type TEXT NOT NULL DEFAULT 'generator', -- generator, humanizer, detector, image_analyzer
  length_setting TEXT,
  tone TEXT,
  style TEXT,
  target_model TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES public.generation_history(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own history"
ON public.generation_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
ON public.generation_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
ON public.generation_history
FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_generation_history_user_id ON public.generation_history(user_id);
CREATE INDEX idx_generation_history_created_at ON public.generation_history(created_at DESC);
CREATE INDEX idx_generation_history_tool_type ON public.generation_history(tool_type);

-- Create usage_limits table for tracking user limits
CREATE TABLE public.usage_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free', -- free, pro, business
  daily_generations_used INTEGER NOT NULL DEFAULT 0,
  daily_limit INTEGER NOT NULL DEFAULT 10,
  monthly_generations_used INTEGER NOT NULL DEFAULT 0,
  monthly_limit INTEGER NOT NULL DEFAULT 100,
  last_daily_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_monthly_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for usage_limits
CREATE POLICY "Users can view their own limits"
ON public.usage_limits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own limits"
ON public.usage_limits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own limits"
ON public.usage_limits
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to reset daily limits
CREATE OR REPLACE FUNCTION public.reset_daily_limits()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_daily_reset < CURRENT_DATE THEN
    NEW.daily_generations_used := 0;
    NEW.last_daily_reset := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-reset daily limits on access
CREATE TRIGGER check_daily_reset
BEFORE UPDATE ON public.usage_limits
FOR EACH ROW
EXECUTE FUNCTION public.reset_daily_limits();