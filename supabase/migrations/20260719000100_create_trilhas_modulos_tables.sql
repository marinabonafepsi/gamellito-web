-- Migration: Create trilhas and modulos tables
-- Torna as trilhas de aprendizado e seus módulos editáveis pelo ERP em vez
-- de hardcoded em src/lib/trilhas-data.ts e src/lib/modulos-content*.ts.

CREATE TABLE IF NOT EXISTS trilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona TEXT NOT NULL CHECK (persona IN ('familia', 'crianca', 'educador', 'profissional')),
  nome TEXT NOT NULL,
  cor TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (persona, nome)
);

-- id é TEXT (não UUID) de propósito: preserva os mesmos ids usados hoje
-- (a1, a2, ..., prof-1, saude-1, ...) para não quebrar modulo_progresso.modulo_id
-- (supabase/migrations/20260718000100_create_modulo_progresso.sql), que já
-- guarda progresso real de usuários referenciando esses ids por texto.
CREATE TABLE IF NOT EXISTS modulos (
  id TEXT PRIMARY KEY,
  trilha_id UUID NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  cor TEXT NOT NULL,
  formato TEXT NOT NULL,
  licoes_label TEXT NOT NULL DEFAULT '1 módulo',
  pct_demo TEXT NOT NULL DEFAULT '0%',
  bar_class TEXT,
  status_demo TEXT NOT NULL DEFAULT 'começar',
  status_class TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN
    ('glossario', 'sequencia', 'video', 'prato', 'decisao', 'checklist', 'stepper', 'mochila', 'artigo', 'pdf')),
  conteudo JSONB NOT NULL DEFAULT '{}'::jsonb,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modulos_trilha ON modulos(trilha_id);
CREATE INDEX IF NOT EXISTS idx_modulos_ordem ON modulos(ordem);
CREATE INDEX IF NOT EXISTS idx_trilhas_persona ON trilhas(persona);

COMMENT ON TABLE trilhas IS 'Trilhas de aprendizado (níveis/grupos de módulos), editáveis via ERP';
COMMENT ON TABLE modulos IS 'Módulos individuais dentro de uma trilha, editáveis via ERP';
COMMENT ON COLUMN modulos.id IS 'Slug estável (a1, prof-1, ...) — igual ao modulo_progresso.modulo_id existente';
COMMENT ON COLUMN modulos.conteudo IS 'Payload específico do tipo (ver docs/seed-trilhas-modulos.mjs para o shape de cada tipo)';
COMMENT ON COLUMN modulos.ativo IS 'Publicado/despublicado — só módulos ativos aparecem no site público';

ALTER TABLE trilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (inclusive anônima) vê trilhas/módulos ativos
CREATE POLICY "trilhas_select_ativas" ON trilhas
  FOR SELECT USING (ativo = true);

CREATE POLICY "modulos_select_ativos" ON modulos
  FOR SELECT USING (ativo = true);

-- Admin gerencia tudo (usa a função SECURITY DEFINER para evitar recursão de
-- RLS em user_profiles — ver migration
-- 20260709000030_fix_remaining_admin_policy_recursion.sql)
CREATE POLICY "trilhas_admin_all" ON trilhas
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "modulos_admin_all" ON modulos
  FOR ALL USING (public.current_user_role() = 'admin');
