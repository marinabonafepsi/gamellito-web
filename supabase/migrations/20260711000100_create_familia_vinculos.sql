-- Vínculo entre a conta de uma pessoa com DM1 e a conta dos pais/responsáveis.
--
-- 'dm1' e 'familia' já existem como papéis separados (20260703_010), mas
-- nunca foram ligados: cada um é uma conta isolada, mesmo quando representam
-- a mesma família (o DM1 segue sua própria trilha de aprendizado). Este
-- vínculo usa a mesma infra de "permissoes" já usada para acesso de
-- profissionais (ver registros_profissional_select em
-- 20260625000900_enable_rls_and_create_policies.sql) — só muda como o
-- acesso é concedido: aqui é por um código de 8 caracteres gerado pelo DM1,
-- em vez de convite por e-mail.

CREATE TABLE IF NOT EXISTS codigos_familia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dm1_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  codigo TEXT UNIQUE NOT NULL,
  usado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  usado_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ DEFAULT now(),
  expira_em TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE INDEX IF NOT EXISTS idx_codigos_familia_dm1 ON codigos_familia(dm1_user_id);
CREATE INDEX IF NOT EXISTS idx_codigos_familia_codigo ON codigos_familia(codigo);

COMMENT ON TABLE codigos_familia IS 'Códigos de 8 caracteres que o DM1 gera para que os pais vinculem a conta deles à dele';
COMMENT ON COLUMN codigos_familia.usado_por IS 'user_id de quem resgatou o código (NULL = ainda não usado)';

ALTER TABLE codigos_familia ENABLE ROW LEVEL SECURITY;

-- DM1: gera, vê e revoga (deleta) seus próprios códigos
CREATE POLICY "codigos_familia_dm1_select" ON codigos_familia
  FOR SELECT USING (dm1_user_id = auth.uid());

CREATE POLICY "codigos_familia_dm1_insert" ON codigos_familia
  FOR INSERT WITH CHECK (dm1_user_id = auth.uid());

CREATE POLICY "codigos_familia_dm1_delete" ON codigos_familia
  FOR DELETE USING (dm1_user_id = auth.uid());

-- ADMIN: vê tudo
CREATE POLICY "codigos_familia_admin_select" ON codigos_familia
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- user_profiles: permitir que os dois lados de um vínculo vejam o nome um do
-- outro (sem isso, a família não consegue nem mostrar "Diário de <nome>").
-- Mesmo shape de EXISTS que registros_profissional_select já usa.
-- ============================================================================
CREATE POLICY "profiles_select_vinculado" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.revogado_em IS NULL
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND (
          (permissoes.usuario_dono = user_profiles.user_id AND permissoes.usuario_acesso = auth.uid())
          OR (permissoes.usuario_acesso = user_profiles.user_id AND permissoes.usuario_dono = auth.uid())
        )
    )
  );

-- ============================================================================
-- RPC: resgatar_codigo_familia — a família troca um código pelo vínculo.
-- SECURITY DEFINER porque quem resgata (usuario_acesso) não é o dono do
-- código (dm1_user_id != auth.uid()), então a policy normal de insert em
-- permissoes (usuario_dono = auth.uid()) bloquearia o insert.
-- ============================================================================
CREATE OR REPLACE FUNCTION resgatar_codigo_familia(p_codigo TEXT)
RETURNS TABLE(dm1_user_id UUID, dm1_nome TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row codigos_familia%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM codigos_familia
  WHERE codigo = upper(trim(p_codigo))
    AND usado_por IS NULL
    AND expira_em > now()
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'codigo_invalido';
  END IF;

  IF v_row.dm1_user_id = auth.uid() THEN
    RAISE EXCEPTION 'nao_pode_vincular_a_si_mesmo';
  END IF;

  UPDATE codigos_familia
  SET usado_por = auth.uid(), usado_em = now()
  WHERE id = v_row.id;

  INSERT INTO permissoes (usuario_dono, usuario_acesso, tipo_acesso)
  VALUES (v_row.dm1_user_id, auth.uid(), 'readonly')
  ON CONFLICT (usuario_dono, usuario_acesso)
  DO UPDATE SET revogado_em = NULL, expira_em = NULL;

  RETURN QUERY
    SELECT v_row.dm1_user_id, up.name
    FROM user_profiles up
    WHERE up.user_id = v_row.dm1_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION resgatar_codigo_familia(TEXT) TO authenticated;

-- ============================================================================
-- RPC: revogar_vinculo_familia — qualquer um dos dois lados pode desfazer o
-- vínculo (a policy "permissoes_dono_delete" só cobre o lado que concedeu).
-- ============================================================================
CREATE OR REPLACE FUNCTION revogar_vinculo_familia(p_permissao_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE permissoes
  SET revogado_em = now()
  WHERE id = p_permissao_id
    AND (usuario_dono = auth.uid() OR usuario_acesso = auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION revogar_vinculo_familia(UUID) TO authenticated;

-- ============================================================================
-- Trigger de signup (20260709000100): resgate automático quando a pessoa já
-- entra com um código de família (campo opcional no cadastro). Silencioso se
-- o código não existir/expirou — nunca deve derrubar o signup.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dm1_id UUID;
  v_codigo TEXT;
BEGIN
  IF NOT (NEW.raw_user_meta_data ? 'role') THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.user_profiles (user_id, role, name, coins, avatar)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'nome',
    0,
    'feliz'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.consentimentos_granular (usuario_id, tipo, aceito, versao, aceito_em)
  VALUES
    (NEW.id, 'compartilhar_com_profissional', COALESCE((NEW.raw_user_meta_data->>'permitirCompartilhamento')::boolean, false), '1.0', now()),
    (NEW.id, 'email_atualizacoes', COALESCE((NEW.raw_user_meta_data->>'permitirEmails')::boolean, false), '1.0', now()),
    (NEW.id, 'analytics_anonimo', COALESCE((NEW.raw_user_meta_data->>'permitirAnalytics')::boolean, false), '1.0', now())
  ON CONFLICT (usuario_id, tipo, versao) DO NOTHING;

  INSERT INTO public.product_events (user_id, event, properties)
  VALUES (NEW.id, 'novo_usuario', jsonb_build_object('role', NEW.raw_user_meta_data->>'role'));

  IF NEW.raw_user_meta_data->>'role' = 'familia' THEN
    v_codigo := trim(NEW.raw_user_meta_data->>'codigoFamilia');
    IF v_codigo IS NOT NULL AND length(v_codigo) > 0 THEN
      SELECT dm1_user_id INTO v_dm1_id
      FROM public.codigos_familia
      WHERE codigo = upper(v_codigo)
        AND usado_por IS NULL
        AND expira_em > now()
      LIMIT 1;

      IF v_dm1_id IS NOT NULL THEN
        UPDATE public.codigos_familia
        SET usado_por = NEW.id, usado_em = now()
        WHERE dm1_user_id = v_dm1_id AND codigo = upper(v_codigo) AND usado_por IS NULL;

        INSERT INTO public.permissoes (usuario_dono, usuario_acesso, tipo_acesso)
        VALUES (v_dm1_id, NEW.id, 'readonly')
        ON CONFLICT (usuario_dono, usuario_acesso) DO NOTHING;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
