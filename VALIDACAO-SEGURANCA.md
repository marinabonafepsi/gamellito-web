# 🔐 Validação de Segurança - Sprint 1.5

## ✅ CHECKLIST DE SEGURANÇA

### 1. RLS (Row Level Security)

#### Test 1.1: Isolamento Pai A vs Pai B ⏳
```sql
-- Executar em supabase/tests/rls-validation.sql
-- Expected: Pai A vê 3 registros, não vê 2 de Pai B
-- Expected: Pai B vê 2 registros, não vê 3 de Pai A
```
- [ ] Pai A não consegue ver dados de Pai B
- [ ] Pai B não consegue ver dados de Pai A
- [ ] Queries retornam 0 para dados de outro usuário

#### Test 1.2: Profissional sem Permissão ⏳
```sql
-- Prof sem permissão vê 0 registros
-- After permission granted, vê registros de Pai A
-- After revoke, vê 0 novamente
```
- [ ] Prof sem permissão não consegue ver registros
- [ ] Prof com permissão vê registros do paciente
- [ ] Revogar permissão bloqueia imediatamente

#### Test 1.3: Multi-Tenant (Instituições) ⏳
```sql
-- Gestor A vê apenas Escola A
-- Gestor B vê apenas Clínica B
```
- [ ] Gestor A não consegue ver Instituição B
- [ ] Gestor B não consegue ver Instituição A
- [ ] Isolamento via tenant_id funciona

#### Test 1.4: Admin Consegue Ver Tudo ⏳
```sql
-- Admin vê ALL registros (5 total)
```
- [ ] Admin consegue acessar dados de qualquer usuário
- [ ] Acesso é auditado em log

### 2. Auth Gateway

#### Test 2.1: Select Role Page ⏳
- [ ] /auth/select-role carrega com 4 opções
- [ ] Clique em cada role redireciona para /auth/signup/[role]
- [ ] Links para login funcionam

#### Test 2.2: Signup Forms Diferenciados ⏳

**Familia:**
- [ ] Campo "Nome da Criança" visível
- [ ] Campo "Data de Nascimento" visível
- [ ] Submit cria user com role='familia'
- [ ] Redirect para /familia/dashboard

**Profissional:**
- [ ] Campo "CRM/COREN" visível
- [ ] Campo "Especialidade" visível
- [ ] Submit cria user com role='profissional'
- [ ] Redirect para /profissional/dashboard

**Educador:**
- [ ] Formulário correto
- [ ] Redirect para /educador/dashboard

**Instituição:**
- [ ] Campo "CNPJ" visível
- [ ] Campo "Tipo" visível
- [ ] Redirect para /instituicao/dashboard

#### Test 2.3: Middleware Routing ⏳
- [ ] User familia não consegue acessar /profissional/* (redirect 403)
- [ ] User profissional não consegue acessar /familia/* (redirect 403)
- [ ] Unauthenticated user redirect para /auth/login
- [ ] Authenticated user em /auth/login redirect para portal

#### Test 2.4: Session Helpers ⏳
- [ ] getUser() retorna user autenticado
- [ ] getUserRole() retorna role correto
- [ ] hasRole() valida permissão
- [ ] requireAuth() redireciona se não autenticado

### 3. Layout Base

#### Test 3.1: Navbar ⏳
- [ ] Navbar carrega com logo
- [ ] Nav items corretos por role
- [ ] UserMenu abre/fecha

#### Test 3.2: UserMenu ⏳
- [ ] Avatar mostra emoção correta
- [ ] Moedas exibem saldo correto
- [ ] Logout funciona

### 4. Consentimento (LGPD)

#### Test 4.1: Granular Consent ⏳
- [ ] Checkboxes obrigatório (Termos) aparece
- [ ] Checkboxes opcionais aparecem (compartilhamento, emails, analytics)
- [ ] Consentimentos salvos em consentimentos_granular

#### Test 4.2: Conformidade LGPD ⏳
- [ ] Dados de criança < 12 anos são protegidos
- [ ] analytics_anonimo respeitado (user_id NULL se false)
- [ ] Direito ao esquecimento implementado

---

## 🧪 COMO EXECUTAR OS TESTES

### Pré-requisitos
```bash
# Ter Supabase CLI instalado
npm install -g supabase

# Ter Playwright instalado
npm install -D @playwright/test
```

### 1. RLS Validation (SQL)

```bash
# Abrir Supabase SQL Editor
# Copiar conteúdo de: supabase/tests/rls-validation.sql
# Executar cada TEST section
# Validar Expected results
```

**Passo a Passo:**
1. Ir para app.supabase.com → SQL Editor
2. Copiar TEST 1 inteiro (Setup + SELECT)
3. Executar
4. Validar: Pai A vê 3, Pai B vê 0
5. Repetir para Tests 2-6

### 2. E2E Tests (Playwright)

```bash
# Executar testes
npm run test:e2e

# Ou específico
npx playwright test tests/e2e/auth-flow.spec.ts

# Com debug
npx playwright test --debug
```

### 3. Security Audit

```bash
# Buscar strings perigosas (SQL injection, etc)
grep -r "SELECT.*\$" src/
grep -r "DELETE.*\$" src/
grep -r "UPDATE.*\$" src/

# OWASP Top 10 check
# - SQL Injection: Use parameterized queries ✅ (Supabase handles)
# - XSS: Sanitize output ✅ (React does by default)
# - CSRF: Tokens ✅ (Supabase handles)
```

---

## 📋 ISSUES ENCONTRADOS

### Críticos (P0) 🔴
- [ ] (none yet)

### Major (P1) 🟠
- [ ] (none yet)

### Minor (P2) 🟡
- [ ] (none yet)

---

## ✅ APROVAÇÃO FINAL

- [ ] Todos os 6 RLS Tests passaram
- [ ] Auth flow E2E tests passaram
- [ ] Middleware redirect correto
- [ ] Session helpers funcionam
- [ ] Consentimento LGPD validado
- [ ] Security audit OK (zero vulnerabilidades)

---

## 📈 MÉTRICAS

| Métrica | Target | Status |
|---------|--------|--------|
| RLS Tests | 6 | ⏳ |
| E2E Tests | 8 | ⏳ |
| Security Issues | 0 | ⏳ |
| Code Coverage | > 80% | ⏳ |

---

## 🔄 PRÓXIMOS PASSOS

Após Sprint 1.5 completo:
1. ✅ FASE 1 COMPLETO
2. 🚀 Começar SPRINT 2.1 (Portal Família)

**Deadline:** Jul 15, 2026

