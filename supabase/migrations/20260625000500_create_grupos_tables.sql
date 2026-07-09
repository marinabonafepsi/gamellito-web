-- Migration 005: Create grupos and grupos_membros tables
-- Manages groups of children (e.g., school classes, clinic groups)

CREATE TABLE IF NOT EXISTS grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instituicao_id UUID NOT NULL REFERENCES instituicoes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grupos_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  papel TEXT NOT NULL CHECK (papel IN ('gestor', 'educador', 'membro')),
  adicionado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(grupo_id, usuario_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grupos_instituicao_id ON grupos(instituicao_id);
CREATE INDEX IF NOT EXISTS idx_grupos_membros_grupo_id ON grupos_membros(grupo_id);
CREATE INDEX IF NOT EXISTS idx_grupos_membros_usuario_id ON grupos_membros(usuario_id);
CREATE INDEX IF NOT EXISTS idx_grupos_membros_papel ON grupos_membros(grupo_id, papel);

-- Comments
COMMENT ON TABLE grupos IS 'Grupos/Turmas de crianças dentro de instituições';
COMMENT ON TABLE grupos_membros IS 'Associação entre grupos e usuários';
COMMENT ON COLUMN grupos_membros.papel IS 'Função do usuário no grupo: gestor, educador, ou membro';
