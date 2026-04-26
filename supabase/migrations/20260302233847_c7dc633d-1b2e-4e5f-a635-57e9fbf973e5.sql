
-- Template ratings table
CREATE TABLE public.template_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.user_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (template_id, user_id)
);

ALTER TABLE public.template_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all ratings"
  ON public.template_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own rating"
  ON public.template_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rating"
  ON public.template_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rating"
  ON public.template_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Add average rating cache to user_templates
ALTER TABLE public.user_templates 
  ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
