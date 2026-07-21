
CREATE TABLE public.planner_state (
  id text PRIMARY KEY,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  revision bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.planner_state TO service_role;
ALTER TABLE public.planner_state ENABLE ROW LEVEL SECURITY;
INSERT INTO public.planner_state (id, state, revision) VALUES ('global', '{}'::jsonb, 0) ON CONFLICT DO NOTHING;
