-- Migration 0085: Create core tables that were used throughout the app code
-- but never actually created by any prior migration (user_profiles, registros,
-- humor_logs, clinical_notes, product_events). Must run AFTER 008 (dependency-free
-- but keeps numeric order) and BEFORE 009, which enables RLS + policies on them.

-- ============================================================================
-- user_profiles — perfil gamificado (coins, avatar, role) por usuário
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'familia'
    CHECK (role IN ('admin', 'familia', 'profissional', 'educador', 'instituicao')),
  name TEXT,
  display_name TEXT,
  avatar TEXT NOT NULL DEFAULT 'feliz'
    CHECK (avatar IN ('feliz', 'animado', 'raiva', 'medo')),
  coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
  verificado BOOLEAN NOT NULL DEFAULT false,
  tenant_id UUID,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant_id ON user_profiles(tenant_id);

-- ============================================================================
-- registros — diário de glicemia (o core do app para famílias)
-- ============================================================================
CREATE TABLE IF NOT EXISTS registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  familia_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor INTEGER NOT NULL CHECK (valor BETWEEN 50 AND 600),
  rotulo TEXT NOT NULL CHECK (rotulo IN ('jejum', 'antes', 'depois', 'dormir', 'outro')),
  observacao TEXT,
  lancado_por TEXT DEFAULT 'Mãe',
  data_hora TIMESTAMPTZ NOT NULL DEFAULT now(),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registros_familia_data ON registros(familia_id, data_hora DESC);

-- ============================================================================
-- humor_logs — humor diário (máx. 1x/dia, dá +5 moedas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS humor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  humor TEXT NOT NULL CHECK (humor IN ('feliz', 'animado', 'raiva', 'medo', 'normal')),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, data)
);

-- ============================================================================
-- clinical_notes — notas de profissionais sobre um paciente
-- ============================================================================
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_dono UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_por UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_usuario_dono ON clinical_notes(usuario_dono);

-- ============================================================================
-- product_events — analytics interno (service_role only, sem policies de user)
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_events_event ON product_events(event);

-- ============================================================================
-- RPC: incrementar_coins — incremento atômico de moedas (usado em /api/registros)
-- ============================================================================
CREATE OR REPLACE FUNCTION incrementar_coins(p_user_id UUID, p_quantidade INTEGER)
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
END;
$$;

GRANT EXECUTE ON FUNCTION incrementar_coins(UUID, INTEGER) TO authenticated;
