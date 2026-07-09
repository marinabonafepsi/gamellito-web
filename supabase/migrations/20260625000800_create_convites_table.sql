-- Migration 008: Create convites table
-- Manages invitations and sharing requests

CREATE TABLE IF NOT EXISTS convites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('paciente_para_profissional', 'profissional_para_paciente')),
  remetente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destinatario_email TEXT,
  destinatario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_unico TEXT UNIQUE NOT NULL,
  aceito BOOLEAN DEFAULT false,
  aceito_em TIMESTAMPTZ,
  rejeitado BOOLEAN DEFAULT false,
  expira_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_convites_remetente_id ON convites(remetente_id);
CREATE INDEX IF NOT EXISTS idx_convites_destinatario_id ON convites(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token_unico);
CREATE INDEX IF NOT EXISTS idx_convites_pendentes ON convites(aceito, rejeitado, expira_em)
  WHERE aceito = false AND rejeitado = false;
CREATE INDEX IF NOT EXISTS idx_convites_destinatario_email ON convites(destinatario_email);

-- Comments
COMMENT ON TABLE convites IS 'Convites para compartilhamento de dados entre usuários';
COMMENT ON COLUMN convites.token_unico IS 'Token seguro para link de convite';
COMMENT ON COLUMN convites.expira_em IS 'Convite válido até esta data (7 dias por padrão)';
