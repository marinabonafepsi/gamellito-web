-- Migration 007: Create loja_items and inventario_usuario tables
-- Gamification: shop items and user inventory

CREATE TABLE IF NOT EXISTS loja_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  custo_moedas INT NOT NULL CHECK (custo_moedas > 0),
  imagem_url TEXT,
  tipo TEXT CHECK (tipo IN ('avatar_skin', 'badge', 'poder_jogo', 'recurso', 'cosmético')),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventario_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES loja_items(id),
  quantidade INT DEFAULT 1,
  adquirido_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(usuario_id, item_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loja_items_ativo ON loja_items(ativo);
CREATE INDEX IF NOT EXISTS idx_loja_items_tipo ON loja_items(tipo);
CREATE INDEX IF NOT EXISTS idx_inventario_usuario ON inventario_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inventario_item ON inventario_usuario(item_id);

-- Comments
COMMENT ON TABLE loja_items IS 'Catálogo de itens compráveis com moedas';
COMMENT ON TABLE inventario_usuario IS 'Itens que cada usuário adquiriu';
COMMENT ON COLUMN loja_items.custo_moedas IS 'Preço em moedas do jogo';
