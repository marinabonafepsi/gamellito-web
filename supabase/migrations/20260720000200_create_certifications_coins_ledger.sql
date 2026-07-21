-- Migration: Fundação de dados do sistema "Amigos do Gamellito" — certificações
-- por nível + ledger de G-coins (ver docs de nomenclatura de badges e árvore de
-- gamificação compartilhados pela Marina em 2026-07-20).
--
-- DECISÃO DE DESIGN: os 4 "níveis" (N1-N4) do documento de gamificação já
-- existem como linhas da tabela `trilhas` para persona='familia' e
-- persona='crianca' (ordem 0-3: "Primeiros passos", "Rotina do dia a dia",
-- "Situações especiais", "Autonomia e apoio" — ver
-- scripts/seed-trilhas-modulos.mjs). Por isso `certifications.trilha_id`
-- referencia `trilhas(id)` em vez de criar uma tabela `trails`/`levels`
-- paralela — evita duplicar o modelo de conteúdo já editável pelo ERP.
--
-- GAP CONHECIDO: persona='educador' e persona='profissional' ainda têm só
-- 1 trilha cada (ordem 0, sem divisão em 4 níveis) — por isso este seed NÃO
-- cria certificações de trilha para elas ainda. Precisa primeiro quebrar o
-- conteúdo dessas personas em 4 trilhas (mesmo padrão de familia/crianca)
-- antes de anexar certificações N1-N4. As meta-certificações (cross-trilha)
-- não dependem disso e já são seedadas abaixo.

-- ============================================================================
-- certifications — metadata de cada badge/certificado (por trilha OU meta)
-- ============================================================================
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id UUID REFERENCES trilhas(id) ON DELETE CASCADE, -- null para meta-certificações
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'trail' CHECK (type IN ('trail', 'meta')),
  formal_name TEXT NOT NULL,        -- nome sério, vai no PDF/currículo
  badge_name TEXT NOT NULL,         -- apelido do universo, vai na interface (forma neutra/masc.)
  badge_name_f TEXT,                -- variante de gênero (opcional)
  unlock_message TEXT,              -- microcopy do momento de desbloqueio
  badge_color TEXT,                 -- cor do nível (hex)
  badge_asset TEXT,                 -- URL da ilustração (Roger) — preenchido depois
  requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
  coin_reward INTEGER NOT NULL DEFAULT 0 CHECK (coin_reward >= 0),
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (type = 'trail' AND trilha_id IS NOT NULL OR type = 'meta' AND trilha_id IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_certifications_trilha ON certifications(trilha_id);
CREATE INDEX IF NOT EXISTS idx_certifications_type ON certifications(type);

COMMENT ON TABLE certifications IS 'Badges/certificados "Amigos do Gamellito" — um por nível de trilha, ou meta (cross-trilha)';
COMMENT ON COLUMN certifications.requirements IS 'Ex: {"modules_completed":"all","min_quiz_score":70,"practical_activity":true}';

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certifications_select_ativas" ON certifications
  FOR SELECT USING (ativo = true);

CREATE POLICY "certifications_admin_all" ON certifications
  FOR ALL USING (public.current_user_role() = 'admin');

-- ============================================================================
-- user_certifications — certificados conquistados por usuário
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_code TEXT NOT NULL UNIQUE,
  UNIQUE (user_id, certification_id)
);

CREATE INDEX IF NOT EXISTS idx_user_certifications_user ON user_certifications(user_id);

COMMENT ON COLUMN user_certifications.certificate_code IS 'Código verificável publicamente no site, formato GML-<ano>-XXXX';

ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_certifications_select_own" ON user_certifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_certifications_admin_all" ON user_certifications
  FOR ALL USING (public.current_user_role() = 'admin');

-- Sem policy de INSERT/UPDATE para usuários: certificados são concedidos por
-- funções SECURITY DEFINER (a implementar na Fase 2, junto da UI "Meus
-- certificados"), nunca por insert direto do cliente.

-- Helper pra Fase 2: gera código verificável no formato GML-<ano>-XXXX
-- (usado como default de user_certifications.certificate_code ao emitir um
-- certificado; unicidade garantida pela constraint UNIQUE da coluna).
CREATE OR REPLACE FUNCTION gerar_certificate_code()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'GML-' || to_char(now(), 'YYYY') || '-' ||
    upper(substr(md5(gen_random_uuid()::text), 1, 4));
$$;

ALTER TABLE user_certifications ALTER COLUMN certificate_code SET DEFAULT gerar_certificate_code();

-- ============================================================================
-- coin_transactions — ledger imutável de G-coins (saldo = SUM(amount))
-- ============================================================================
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- negativo = gasto
  reason TEXT NOT NULL CHECK (reason IN (
    'module', 'certification', 'streak', 'referral', 'redemption',
    'cashback', 'feedback', 'expiry', 'migration_backfill', 'legacy', 'admin_adjustment'
  )),
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_expires ON coin_transactions(expires_at) WHERE expires_at IS NOT NULL;

COMMENT ON TABLE coin_transactions IS 'Ledger imutável de G-coins. NUNCA fazer UPDATE/DELETE em produção — só INSERT (via RPC). user_profiles.coins continua sendo o saldo rápido de leitura, mantido em sincronia pelas RPCs incrementar_coins/gastar_coins.';

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coin_transactions_select_own" ON coin_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "coin_transactions_admin_all" ON coin_transactions
  FOR ALL USING (public.current_user_role() = 'admin');

-- Sem policy de INSERT para usuários: toda transação é escrita por uma RPC
-- SECURITY DEFINER (incrementar_coins / gastar_coins abaixo), nunca por
-- insert direto do cliente — evita que o usuário forje moedas.

-- ============================================================================
-- coin_config — valores da economia de G-coins, editáveis sem deploy
-- ============================================================================
CREATE TABLE IF NOT EXISTS coin_config (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  descricao TEXT,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE coin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coin_config_select_all" ON coin_config
  FOR SELECT USING (true);

CREATE POLICY "coin_config_admin_all" ON coin_config
  FOR ALL USING (public.current_user_role() = 'admin');

INSERT INTO coin_config (key, value, descricao) VALUES
  ('reward.module_complete', 20, 'Coins ao completar um módulo'),
  ('reward.quiz_bonus', 10, 'Bônus por quiz com nota >= 90%'),
  ('reward.level1_complete', 50, 'Coins ao concluir Nível 1 de uma trilha'),
  ('reward.level2_complete', 100, 'Coins ao concluir Nível 2 de uma trilha'),
  ('reward.level3_complete', 200, 'Coins ao concluir Nível 3 de uma trilha'),
  ('reward.level4_complete', 400, 'Coins ao concluir Nível 4 de uma trilha'),
  ('reward.weekly_streak', 10, 'Coins por semana de atividade (streak), máx 1x/semana'),
  ('reward.referral', 100, 'Coins por indicação que conclui 1 módulo, máx 5/mês'),
  ('reward.module_feedback', 5, 'Coins por avaliar um módulo, 1x por módulo'),
  ('reward.purchase_cashback_pct', 5, 'Percentual de cashback em coins nas compras da loja'),
  ('rule.coin_expiry_months', 12, 'Validade das coins em meses'),
  ('rule.balance_cap', 3000, 'Teto de saldo de coins'),
  ('rule.max_order_discount_pct', 30, 'Desconto máximo por pedido, em % do carrinho (exceto frete grátis)')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- redemption_options — catálogo de resgate (ralo da economia de coins)
-- ============================================================================
CREATE TABLE IF NOT EXISTS redemption_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  cost INTEGER NOT NULL CHECK (cost > 0),
  type TEXT NOT NULL CHECK (type IN ('shipping', 'product_discount', 'content', 'physical')),
  descricao TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE redemption_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "redemption_options_select_active" ON redemption_options
  FOR SELECT USING (active = true);

CREATE POLICY "redemption_options_admin_all" ON redemption_options
  FOR ALL USING (public.current_user_role() = 'admin');

INSERT INTO redemption_options (slug, name, cost, type, descricao) VALUES
  ('frete-25', 'Frete: 25% de desconto', 150, 'shipping', NULL),
  ('frete-50', 'Frete: 50% de desconto', 300, 'shipping', NULL),
  ('frete-gratis', 'Frete grátis (1 pedido)', 500, 'shipping', NULL),
  ('kit-familia-10', '10% off em Kit Família', 400, 'product_discount', 'Não cumulativo com promoções'),
  ('wallpapers-exclusivos', 'Wallpapers/atividades exclusivas', 75, 'content', 'Custo marginal zero'),
  ('certificado-impresso', 'Certificado impresso + enviado', 600, 'physical', 'Inclui frete do certificado'),
  ('acesso-antecipado', 'Acesso antecipado a módulo novo', 200, 'content', NULL)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Meta-certificações (cross-trilha) — nomes narrativos (seção 4 do doc)
-- ============================================================================
INSERT INTO certifications (slug, type, formal_name, badge_name, requirements, coin_reward, ordem) VALUES
  ('ponte-gamellito', 'meta', 'Ponte Gamellito', 'Amigo(a) em Todo Lugar',
    '{"levels_reached":{"level":2,"min_trails":2}}'::jsonb, 300, 1),
  ('constancia', 'meta', 'Constância', 'Amigo(a) de Toda Semana',
    '{"streak_weeks":8}'::jsonb, 200, 2),
  ('comunidade', 'meta', 'Comunidade', 'Quem Traz Mais Amigos',
    '{"validated_contributions":5}'::jsonb, 250, 3),
  ('embaixador-gamellito', 'meta', 'Embaixador(a) Gamellito', 'Voz do Gamellito',
    '{"requires_certifications":["ponte-gamellito","comunidade"],"any_trail_level":4}'::jsonb, 1000, 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Certificações de trilha — persona 'crianca' e 'familia' (as únicas já
-- divididas em 4 níveis hoje — ver nota de GAP no topo do arquivo)
-- ============================================================================
INSERT INTO certifications (
  trilha_id, slug, type, formal_name, badge_name, badge_name_f, unlock_message, badge_color, requirements, coin_reward, ordem
)
SELECT
  t.id,
  'crianca-' || t.ordem::text,
  'trail',
  vals.formal_name,
  vals.badge_name,
  vals.badge_name_f,
  vals.unlock_message,
  vals.badge_color,
  '{"modules_completed":"all"}'::jsonb,
  vals.coin_reward,
  t.ordem
FROM trilhas t
JOIN (VALUES
  (0, 'Pequeno(a) Descobridor(a)', 'Novo Amigo do Gamellito', 'Nova Amiga do Gamellito',
    'Oba! O Gamellito acabou de fazer um novo amigo: VOCÊ!', '#FFC400', 50),
  (1, 'Aventureiro(a) Gamellito', 'Dupla de Aventura', 'Dupla de Aventura',
    'Você e o Gamellito agora são uma Dupla de Aventura! Pra onde vamos hoje?', '#F26A00', 100),
  (2, 'Super Guardião(ã)', 'Guardião do Gamellito', 'Guardiã do Gamellito',
    'O Gamellito confia em você de olhos fechados. Você agora é Guardião(ã)!', '#9B8CF0', 200),
  (3, 'Herói/Heroína Gamellito', 'Amigo do Coração', 'Amiga do Coração',
    'Tem amizade que é pra sempre. Você é Amigo(a) do Coração do Gamellito! 💛', '#D4AF37', 400)
) AS vals(ordem, formal_name, badge_name, badge_name_f, unlock_message, badge_color, coin_reward)
  ON vals.ordem = t.ordem
WHERE t.persona = 'crianca'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO certifications (
  trilha_id, slug, type, formal_name, badge_name, unlock_message, badge_color, requirements, coin_reward, ordem
)
SELECT
  t.id,
  'familia-' || t.ordem::text,
  'trail',
  vals.formal_name,
  vals.badge_name,
  vals.unlock_message,
  vals.badge_color,
  '{"modules_completed":"all"}'::jsonb,
  vals.coin_reward,
  t.ordem
FROM trilhas t
JOIN (VALUES
  (0, 'Certificado Semente do Cuidado', 'Porta Aberta',
    'A família recebeu o Gamellito em casa.', '#FFC400', 50),
  (1, 'Explorador(a) do Brincar em Família', 'Casa de Brincar',
    'A casa virou território de brincadeira!', '#F26A00', 100),
  (2, 'Guardião(ã) do Brincar em Casa', 'Ninho Gamellito',
    'Vocês cuidam e fazem o brincar acontecer.', '#9B8CF0', 200),
  (3, 'Família Mestre Gamellito', 'Família do Coração',
    'Vocês chegaram juntos até aqui. Família do Coração do Gamellito! 💛', '#D4AF37', 400)
) AS vals(ordem, formal_name, badge_name, unlock_message, badge_color, coin_reward)
  ON vals.ordem = t.ordem
WHERE t.persona = 'familia'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- RPC: incrementar_coins — agora também grava no ledger (backward compatible:
-- p_reason/p_reference_id são opcionais, chamadas existentes continuam
-- funcionando sem alteração de código)
-- ============================================================================
CREATE OR REPLACE FUNCTION incrementar_coins(
  p_user_id UUID,
  p_quantidade INTEGER,
  p_reason TEXT DEFAULT 'legacy',
  p_reference_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_profiles
  SET coins = coins + p_quantidade,
      atualizado_em = now()
  WHERE user_id = p_user_id;

  INSERT INTO coin_transactions (user_id, amount, reason, reference_id, expires_at)
  VALUES (
    p_user_id,
    p_quantidade,
    p_reason,
    p_reference_id,
    now() + (SELECT value FROM coin_config WHERE key = 'rule.coin_expiry_months') * INTERVAL '1 month'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION incrementar_coins(UUID, INTEGER, TEXT, UUID) TO authenticated;

-- ============================================================================
-- RPC: gastar_coins — decremento atômico com checagem de saldo + ledger
-- (primitiva nova, ainda não usada por nenhuma rota — /api/loja/comprar hoje
-- faz UPDATE direto porque a RPC comprar_item_atomico referenciada no código
-- nunca foi criada; migrar essa rota para usar gastar_coins fica pra próxima
-- fase, é mudança de API/código, não de dado)
-- ============================================================================
CREATE OR REPLACE FUNCTION gastar_coins(
  p_user_id UUID,
  p_quantidade INTEGER,
  p_reason TEXT DEFAULT 'redemption',
  p_reference_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  saldo_atual INTEGER;
BEGIN
  SELECT coins INTO saldo_atual FROM user_profiles WHERE user_id = p_user_id FOR UPDATE;

  IF saldo_atual IS NULL OR saldo_atual < p_quantidade THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  UPDATE user_profiles
  SET coins = coins - p_quantidade,
      atualizado_em = now()
  WHERE user_id = p_user_id;

  INSERT INTO coin_transactions (user_id, amount, reason, reference_id)
  VALUES (p_user_id, -p_quantidade, p_reason, p_reference_id);
END;
$$;

GRANT EXECUTE ON FUNCTION gastar_coins(UUID, INTEGER, TEXT, UUID) TO authenticated;

-- ============================================================================
-- Backfill: registra o saldo atual de cada usuário como transação de abertura
-- do ledger (reason='migration_backfill'), pra SUM(coin_transactions) bater
-- com user_profiles.coins a partir de agora
-- ============================================================================
INSERT INTO coin_transactions (user_id, amount, reason, expires_at)
SELECT
  user_id,
  coins,
  'migration_backfill',
  now() + (SELECT value FROM coin_config WHERE key = 'rule.coin_expiry_months') * INTERVAL '1 month'
FROM user_profiles
WHERE coins > 0;
