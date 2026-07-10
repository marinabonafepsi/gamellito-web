-- Fix: RLS policies on biblioteca_artigos that check the caller's role via
-- `(SELECT role FROM user_profiles WHERE user_id = auth.uid())` recurse into
-- user_profiles' own "profiles_admin_select" policy, which does the exact
-- same self-referencing subquery on user_profiles. Postgres detects this as
-- a cycle and raises 42P17 "infinite recursion detected in policy for
-- relation user_profiles" — this broke GET /api/biblioteca in production.
--
-- Fix: a SECURITY DEFINER function bypasses RLS for this one lookup,
-- breaking the cycle. (This same recursive pattern exists in every other
-- "*_admin_all"/"*_admin_select" policy from migration 000900 — this
-- migration only touches biblioteca_artigos to keep the fix scoped.)

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM user_profiles WHERE user_id = auth.uid();
$$;

DROP POLICY IF EXISTS "biblioteca_artigos_admin_all" ON biblioteca_artigos;
DROP POLICY IF EXISTS "biblioteca_artigos_insert_profissional" ON biblioteca_artigos;

CREATE POLICY "biblioteca_artigos_admin_all" ON biblioteca_artigos
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "biblioteca_artigos_insert_profissional" ON biblioteca_artigos
  FOR INSERT WITH CHECK (
    submetido_por = auth.uid()
    AND status = 'pendente'
    AND public.current_user_role() = 'profissional'
  );
