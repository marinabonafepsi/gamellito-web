-- Migration 003: Create instituicoes table
-- Stores schools, clinics, hospitals, and other organizations

CREATE TABLE IF NOT EXISTS instituicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  tipo TEXT CHECK (tipo IN ('hospital', 'clinica', 'ubs', 'escola', 'ong', 'outro')),
  cnpj TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  gestor_id UUID REFERENCES auth.users(id),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instituicoes_cnpj ON instituicoes(cnpj);
CREATE INDEX IF NOT EXISTS idx_instituicoes_tipo ON instituicoes(tipo);
CREATE INDEX IF NOT EXISTS idx_instituicoes_gestor_id ON instituicoes(gestor_id);
CREATE INDEX IF NOT EXISTS idx_instituicoes_ativo ON instituicoes(ativo);

-- Comments
COMMENT ON TABLE instituicoes IS 'Organizações (escolas, clínicas, hospitais, UBS, ONGs)';
COMMENT ON COLUMN instituicoes.gestor_id IS 'Quem gerencia a instituição';
COMMENT ON COLUMN instituicoes.ativo IS 'Está em funcionamento?';
