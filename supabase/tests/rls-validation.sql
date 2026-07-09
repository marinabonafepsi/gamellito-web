-- ============================================================================
-- RLS VALIDATION TESTS
-- Run these in Supabase SQL Editor to validate security policies
-- ============================================================================

-- =============================================================================
-- TEST 1: PAI A NÃO VÊ DADOS DE PAI B
-- =============================================================================

-- Setup: Create two families
INSERT INTO auth.users (id, email, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'pai_a@test.com', 'familia'),
  ('22222222-2222-2222-2222-222222222222', 'pai_b@test.com', 'familia');

INSERT INTO user_profiles (user_id, role, name, coins) VALUES
  ('11111111-1111-1111-1111-111111111111', 'familia', 'Pai A', 0),
  ('22222222-2222-2222-2222-222222222222', 'familia', 'Pai B', 0);

-- Create registros for Pai A
INSERT INTO registros (familia_id, valor, data_hora, rotulo) VALUES
  ('11111111-1111-1111-1111-111111111111', 120, now(), 'depois'),
  ('11111111-1111-1111-1111-111111111111', 130, now() - interval '1 day', 'jejum'),
  ('11111111-1111-1111-1111-111111111111', 125, now() - interval '2 days', 'antes');

-- Create registros for Pai B
INSERT INTO registros (familia_id, valor, data_hora, rotulo) VALUES
  ('22222222-2222-2222-2222-222222222222', 140, now(), 'depois'),
  ('22222222-2222-2222-2222-222222222222', 135, now() - interval '1 day', 'jejum');

-- TEST: Pai A sees ONLY his own records
SET SESSION "user.id" = '11111111-1111-1111-1111-111111111111';
SELECT COUNT(*) as count_pai_a FROM registros;
-- Expected: 3 (Pai A's records)

SELECT COUNT(*) as count_pai_b FROM registros WHERE familia_id = '22222222-2222-2222-2222-222222222222';
-- Expected: 0 (RLS blocks Pai B's records)

-- TEST: Pai B sees ONLY his own records
SET SESSION "user.id" = '22222222-2222-2222-2222-222222222222';
SELECT COUNT(*) as count_pai_b FROM registros;
-- Expected: 2 (Pai B's records)

SELECT COUNT(*) as count_pai_a FROM registros WHERE familia_id = '11111111-1111-1111-1111-111111111111';
-- Expected: 0 (RLS blocks Pai A's records)

-- =============================================================================
-- TEST 2: PROFISSIONAL SEM PERMISSÃO NÃO VÊ PACIENTE
-- =============================================================================

INSERT INTO auth.users (id, email, role) VALUES
  ('33333333-3333-3333-3333-333333333333', 'prof@clinic.com', 'profissional');

INSERT INTO user_profiles (user_id, role, name, coins) VALUES
  ('33333333-3333-3333-3333-333333333333', 'profissional', 'Dr. Silva', 0);

-- TEST: Prof without permission sees NO records
SET SESSION "user.id" = '33333333-3333-3333-3333-333333333333';
SELECT COUNT(*) as count_registros_sem_permissao FROM registros;
-- Expected: 0 (RLS blocks - no permission)

-- =============================================================================
-- TEST 3: PROFISSIONAL COM PERMISSÃO VÊ PACIENTE
-- =============================================================================

-- Create permission for Prof to see Pai A's data
INSERT INTO permissoes (usuario_dono, usuario_acesso, tipo_acesso) VALUES
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'readonly');

-- TEST: Prof WITH permission sees records
SET SESSION "user.id" = '33333333-3333-3333-3333-333333333333';
SELECT COUNT(*) as count_registros_com_permissao FROM registros;
-- Expected: 3 (Pai A's records - permission granted)

SELECT COUNT(*) as count_pai_b_ainda_bloqueado FROM registros WHERE familia_id = '22222222-2222-2222-2222-222222222222';
-- Expected: 0 (RLS blocks Pai B - no permission)

-- =============================================================================
-- TEST 4: REVOGAR PERMISSÃO BLOQUEIA IMEDIATAMENTE
-- =============================================================================

-- Revoke permission
UPDATE permissoes SET revogado_em = now()
WHERE usuario_dono = '11111111-1111-1111-1111-111111111111'
  AND usuario_acesso = '33333333-3333-3333-3333-333333333333';

-- TEST: Prof NO LONGER sees records
SET SESSION "user.id" = '33333333-3333-3333-3333-333333333333';
SELECT COUNT(*) as count_after_revoke FROM registros;
-- Expected: 0 (Permission revoked - RLS blocks again)

-- =============================================================================
-- TEST 5: ADMIN CONSEGUE VER TUDO COM AUDITORIA
-- =============================================================================

INSERT INTO auth.users (id, email, role) VALUES
  ('99999999-9999-9999-9999-999999999999', 'admin@gamellito.com', 'admin');

-- TEST: Admin sees ALL records
SET SESSION "user.id" = '99999999-9999-9999-9999-999999999999';
SELECT COUNT(*) as admin_count_all FROM registros;
-- Expected: 5 (Pai A: 3 + Pai B: 2)

-- =============================================================================
-- TEST 6: MULTI-TENANT ISOLATION (INSTITUIÇÕES)
-- =============================================================================

-- Create two institutions
INSERT INTO instituicoes (id, nome, tipo, cnpj) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Escola A', 'escola', '00.000.000/0001-00'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Clínica B', 'clinica', '00.000.000/0002-00');

-- Create gestor for each institution
INSERT INTO auth.users (id, email, role, tenant_id) VALUES
  ('44444444-4444-4444-4444-444444444444', 'gestor_a@school.com', 'instituicao', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('55555555-5555-5555-5555-555555555555', 'gestor_b@clinic.com', 'instituicao', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

UPDATE instituicoes SET gestor_id = '44444444-4444-4444-4444-444444444444' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
UPDATE instituicoes SET gestor_id = '55555555-5555-5555-5555-555555555555' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- TEST: Gestor A sees ONLY Escola A
SET SESSION "user.id" = '44444444-4444-4444-4444-444444444444';
SELECT COUNT(*) as count_escola_a FROM instituicoes WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
-- Expected: 1

SELECT COUNT(*) as count_clinica_b FROM instituicoes WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0 (RLS blocks Clínica B)

-- TEST: Gestor B sees ONLY Clínica B
SET SESSION "user.id" = '55555555-5555-5555-5555-555555555555';
SELECT COUNT(*) as count_clinica_b FROM instituicoes WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 1

SELECT COUNT(*) as count_escola_a FROM instituicoes WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
-- Expected: 0 (RLS blocks Escola A)

-- =============================================================================
-- CLEANUP (Uncomment to clean up test data)
-- =============================================================================

/*
DELETE FROM registros WHERE familia_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM permissoes WHERE usuario_dono = '11111111-1111-1111-1111-111111111111';
DELETE FROM user_profiles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999');
DELETE FROM auth.users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999');
DELETE FROM instituicoes WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
*/
