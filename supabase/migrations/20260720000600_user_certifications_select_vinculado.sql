-- Migration: permite que família/profissional vinculado leia as
-- certificações conquistadas por um DM1, via `permissoes` (mesmo padrão de
-- metas_glicemia_profissional_select em 20260720000400). Sem essa policy,
-- o app da família (gamellito-app-mobile) e qualquer UI web de "conquistas
-- do vinculado" sempre retornam 0 resultados por causa do RLS — sem erro,
-- só lista vazia, o que mascara o bug.

DROP POLICY IF EXISTS "user_certifications_select_vinculado" ON user_certifications;
CREATE POLICY "user_certifications_select_vinculado" ON user_certifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = user_certifications.user_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('readonly', 'comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );
