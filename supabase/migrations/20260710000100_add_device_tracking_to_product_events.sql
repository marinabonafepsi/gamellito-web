-- ============================================================================
-- product_events — platform/device_type, para saber de onde o usuário vem
-- (mobile/tablet/desktop) e priorizar trabalho de mobile vs. web.
-- ============================================================================

ALTER TABLE product_events
  ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('mobile', 'tablet', 'desktop')),
  ADD COLUMN IF NOT EXISTS device_type TEXT;

CREATE INDEX IF NOT EXISTS idx_product_events_platform ON product_events(platform);

-- ============================================================================
-- Corrige bug real: RLS foi habilitado em product_events em
-- 20260625000900_enable_rls_and_create_policies.sql sem nenhuma policy.
-- Todo insert nessa tabela roda com createRouteHandlerClient (sessão do
-- usuário, não service_role), então os eventos já existentes
-- (registro_salvo, item_comprado, artigo_submetido) vêm falhando
-- silenciosamente desde então — o insert não lança erro visível pro usuário,
-- só nunca grava a linha.
--
-- Tabela continua write-only para usuários: qualquer pessoa (logada ou
-- anônima, porque o evento "visita" dispara mesmo sem login) pode registrar
-- um evento, mas não existe policy de SELECT — leitura/analytics fica só
-- para service_role.
-- ============================================================================
CREATE POLICY "product_events_insert_any" ON product_events
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
