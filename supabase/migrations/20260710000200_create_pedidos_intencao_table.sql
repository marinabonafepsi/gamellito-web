-- Fake door da loja física: mede intenção de compra dos produtos (pelúcia,
-- camiseta, livro, etc.) sem processar pagamento real. O usuário chega até
-- o checkout, preenche endereço e "confirma o pedido" — a gente só grava a
-- intenção aqui pra saber quantos pedidos de fato apareceriam antes de
-- montar produção/logística de verdade.

CREATE TABLE IF NOT EXISTS pedidos_intencao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  familia_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  numero_pedido TEXT NOT NULL UNIQUE,
  itens JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  nome_contato TEXT NOT NULL,
  telefone_contato TEXT,
  endereco JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'intencao' CHECK (status IN ('intencao', 'contatado', 'cancelado')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_intencao_familia ON pedidos_intencao(familia_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_intencao_criado_em ON pedidos_intencao(criado_em);

COMMENT ON TABLE pedidos_intencao IS 'Fake door: intenção de compra de produtos físicos, sem pagamento real';
COMMENT ON COLUMN pedidos_intencao.itens IS 'Array [{id, nome, preco_unit, quantidade}] com o carrinho no momento do pedido';

ALTER TABLE pedidos_intencao ENABLE ROW LEVEL SECURITY;

-- FAMILIA: cria e vê os próprios pedidos de intenção
CREATE POLICY "pedidos_intencao_familia_insert" ON pedidos_intencao
  FOR INSERT WITH CHECK (familia_id = auth.uid());

CREATE POLICY "pedidos_intencao_familia_select" ON pedidos_intencao
  FOR SELECT USING (familia_id = auth.uid());

-- ADMIN: vê tudo (é quem acompanha a demanda do fake door)
CREATE POLICY "pedidos_intencao_admin_select" ON pedidos_intencao
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );
