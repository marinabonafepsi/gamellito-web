-- A família vinculada a um DM1 (ver 20260711000100_create_familia_vinculos)
-- passa a poder ver o progresso dos módulos dele, mesma leitura que já tem
-- do diário de glicemia — sem isso, GET /api/modulos/progresso?dm1_id= volta
-- vazio pra quem tem permissão via `permissoes`, porque a policy original
-- só cobria o próprio dono (user_id = auth.uid()).

CREATE POLICY "modulo_progresso_select_vinculado" ON modulo_progresso
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = modulo_progresso.user_id
        AND permissoes.usuario_acesso = auth.uid()
        AND permissoes.revogado_em IS NULL
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
    )
  );
