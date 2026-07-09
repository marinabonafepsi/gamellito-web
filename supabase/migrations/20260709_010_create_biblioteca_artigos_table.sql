-- Migration: Create biblioteca_artigos table
-- Repositório aberto de artigos científicos sobre DM1, submetidos por
-- profissionais de saúde e publicados após revisão.

CREATE TABLE IF NOT EXISTS biblioteca_artigos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  autores TEXT NOT NULL,
  resumo TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('Enfermagem', 'Endocrinologia', 'Educação', 'Psicologia')),
  ano INT NOT NULL CHECK (ano >= 1900),
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'publicado', 'rejeitado')),
  submetido_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT now(),
  publicado_em TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_biblioteca_artigos_status ON biblioteca_artigos(status);
CREATE INDEX IF NOT EXISTS idx_biblioteca_artigos_categoria ON biblioteca_artigos(categoria);
CREATE INDEX IF NOT EXISTS idx_biblioteca_artigos_submetido_por ON biblioteca_artigos(submetido_por);

COMMENT ON TABLE biblioteca_artigos IS 'Artigos científicos sobre DM1 submetidos por profissionais e publicados em acesso aberto';
COMMENT ON COLUMN biblioteca_artigos.status IS 'pendente = aguardando revisão; publicado = visível publicamente; rejeitado = não aprovado';

ALTER TABLE biblioteca_artigos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "biblioteca_artigos_select_publicado" ON biblioteca_artigos;
DROP POLICY IF EXISTS "biblioteca_artigos_select_own" ON biblioteca_artigos;
DROP POLICY IF EXISTS "biblioteca_artigos_insert_profissional" ON biblioteca_artigos;
DROP POLICY IF EXISTS "biblioteca_artigos_admin_all" ON biblioteca_artigos;

-- Public consegue ver apenas artigos publicados
CREATE POLICY "biblioteca_artigos_select_publicado" ON biblioteca_artigos
  FOR SELECT USING (status = 'publicado');

-- Profissional vê as próprias submissões (inclusive pendentes/rejeitadas)
CREATE POLICY "biblioteca_artigos_select_own" ON biblioteca_artigos
  FOR SELECT USING (submetido_por = auth.uid());

-- Profissional consegue submeter artigos (entram como 'pendente')
CREATE POLICY "biblioteca_artigos_insert_profissional" ON biblioteca_artigos
  FOR INSERT WITH CHECK (
    submetido_por = auth.uid()
    AND status = 'pendente'
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'profissional'
    )
  );

-- Admin gerencia tudo (revisão, publicação, edição)
CREATE POLICY "biblioteca_artigos_admin_all" ON biblioteca_artigos
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );
