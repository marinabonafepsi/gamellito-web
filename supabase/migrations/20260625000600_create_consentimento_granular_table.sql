-- Migration 006: Create consentimentos_granular table
-- LGPD compliance: granular consent management

CREATE TABLE IF NOT EXISTS consentimentos_granular (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'compartilhar_com_profissional',
    'compartilhar_com_instituicao',
    'analytics_anonimo',
    'email_atualizacoes',
    'marketing'
  )),
  aceito BOOLEAN NOT NULL,
  versao TEXT DEFAULT '1.0',
  aceito_em TIMESTAMPTZ,
  user_agent TEXT,
  UNIQUE(usuario_id, tipo, versao)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consentimentos_usuario_id ON consentimentos_granular(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consentimentos_usuario_tipo ON consentimentos_granular(usuario_id, tipo);
CREATE INDEX IF NOT EXISTS idx_consentimentos_aceito ON consentimentos_granular(tipo, aceito);

-- Comments
COMMENT ON TABLE consentimentos_granular IS 'Consentimento LGPD granular (checkbox por tipo)';
COMMENT ON COLUMN consentimentos_granular.tipo IS 'Tipo de consentimento (compartilhamento, analytics, emails)';
COMMENT ON COLUMN consentimentos_granular.versao IS 'Versão do consentimento para tracking de atualizações';
