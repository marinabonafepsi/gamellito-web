-- Migration 002: Create profissionais table
-- Stores data specific to healthcare professionals

CREATE TABLE IF NOT EXISTS profissionais (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  especialidade TEXT CHECK (especialidade IN ('medico', 'nutricionista', 'psicólogo', 'enfermeiro', 'educador_fisico', 'terapeuta', 'outro')),
  crm_coren TEXT UNIQUE NOT NULL,
  estado TEXT, -- UF (SP, RJ, etc)
  verificado BOOLEAN DEFAULT false,
  instituicao_id UUID,
  biografia TEXT,
  foto_perfil TEXT,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profissionais_especialidade ON profissionais(especialidade);
CREATE INDEX IF NOT EXISTS idx_profissionais_verificado ON profissionais(verificado);
CREATE INDEX IF NOT EXISTS idx_profissionais_instituicao_id ON profissionais(instituicao_id);
CREATE INDEX IF NOT EXISTS idx_profissionais_crm_coren ON profissionais(crm_coren, estado);

-- Comments
COMMENT ON TABLE profissionais IS 'Dados de profissionais de saúde (médicos, nutricionistas, psicólogos, etc)';
COMMENT ON COLUMN profissionais.crm_coren IS 'CRM ou COREN verificado';
COMMENT ON COLUMN profissionais.verificado IS 'Marina confirmou credenciais?';
