-- Migration 004: Create permissoes table
-- Manages fine-grained sharing permissions between users

CREATE TABLE IF NOT EXISTS permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_dono UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usuario_acesso UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_acesso TEXT NOT NULL CHECK (tipo_acesso IN ('readonly', 'comment', 'full')),
  criado_em TIMESTAMPTZ DEFAULT now(),
  expira_em TIMESTAMPTZ,
  revogado_em TIMESTAMPTZ,
  UNIQUE(usuario_dono, usuario_acesso),
  CHECK (usuario_dono != usuario_acesso)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_dono ON permissoes(usuario_dono);
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_acesso ON permissoes(usuario_acesso);
CREATE INDEX IF NOT EXISTS idx_permissoes_ativo ON permissoes(expira_em, revogado_em)
  WHERE revogado_em IS NULL;

-- Comments
COMMENT ON TABLE permissoes IS 'Controla quem acessa dados de quem (compartilhamento granular)';
COMMENT ON COLUMN permissoes.tipo_acesso IS 'readonly (ler), comment (ler+comentar), full (ler+editar+deletar)';
COMMENT ON COLUMN permissoes.expira_em IS 'Data de expiração da permissão (NULL = permanente)';
COMMENT ON COLUMN permissoes.revogado_em IS 'Quando foi revogado (NULL = ainda ativo)';
