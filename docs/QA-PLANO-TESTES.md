# QA: Plano de Testes Completo - Gamellito Multi-Portal

## 📋 Objetivo

Garantir que a arquitetura multi-portal seja:
- ✅ **Segura** (RLS, isolamento, sem vazamento de dados)
- ✅ **Funcional** (todas features funcionam)
- ✅ **Conformidade LGPD** (consentimento, direito ao esquecimento)
- ✅ **Performance** (< 2s dashboard, < 200ms API)
- ✅ **Acessível** (WCAG 2.1 AA)

---

## 🧪 TIPOS DE TESTES

### 1️⃣ TESTES DE SEGURANÇA (RLS + Isolamento)

#### 1.1 Isolamento de Dados por Role

**Cenário 1: Pai A não consegue acessar dados de Pai B**
```gherkin
DADO duas contas de pai criadas (pai_a, pai_b)
E pai_a tem 5 registros de glicemia
E pai_b tem 3 registros de glicemia

QUANDO pai_a faz GET /api/registros
ENTÃO recebe apenas 5 registros (seus próprios)
E NOT consegue ver registros de pai_b

QUANDO pai_a tenta fazer GET /api/registros?familia_id=pai_b
ENTÃO recebe HTTP 403 (Forbidden)
```

**Test SQL:**
```sql
SET SESSION user_id = 'pai_a_uuid';
SELECT COUNT(*) FROM registros; 
-- Esperado: 5

SELECT COUNT(*) FROM registros WHERE familia_id = 'pai_b_uuid'; 
-- Esperado: 0 (RLS bloqueia)
```

---

**Cenário 2: Profissional sem permissão não vê paciente**
```gherkin
DADO um profissional (prof_a)
E um pai (pai) com 10 registros
E prof_a NÃO tem permissão para acessar dados de pai

QUANDO prof_a faz GET /api/profissional/paciente/{pai_id}
ENTÃO recebe HTTP 403 ou lista vazia
E NOT consegue ver registros do pai
```

---

**Cenário 3: Profissional COM permissão vê paciente**
```gherkin
DADO permissão criada (pai → prof_a, tipo=readonly)
E permissão ativa (expira_em > now(), revogado_em IS NULL)

QUANDO prof_a faz GET /api/profissional/paciente/{pai_id}
ENTÃO recebe HTTP 200
E vê últimos 20 registros do pai

QUANDO prof_a tenta DELETE /api/registros/{id}
ENTÃO recebe HTTP 403 (sem permissão)
```

---

**Cenário 4: Instituição A não vê dados de Instituição B**
```gherkin
DADO duas instituições (Escola_A, Clinica_B)
E Escola_A tem 45 crianças
E Clinica_B tem 20 crianças

QUANDO gestor_A faz GET /api/instituicao/dashboard
ENTÃO vê apenas dados de Escola_A (45 crianças)
E NOT vê dados de Clinica_B

QUANDO gestor_A tenta GET /api/instituicao/grupos/{grupo_clinica_b}
ENTÃO recebe HTTP 403
```

---

**Cenário 5: Admin consegue acessar com auditoria**
```gherkin
DADO um usuário admin
E qualquer dado (registro, permissão, convite)

QUANDO admin faz GET /admin/usuarios/{user_id}/dados
ENTÃO recebe dados completos
E acesso é registrado em audit_log com:
  - admin_id
  - timestamp
  - endpoint acessado
  - resultado
```

---

#### 1.2 Validação de Permissões

**Cenário 6: Compartilhamento expirado bloqueia acesso**
```gherkin
DADO permissão com expira_em = 2026-06-20
E data atual = 2026-06-25

QUANDO prof faz GET /api/profissional/paciente/{id}
ENTÃO recebe HTTP 403 "Compartilhamento expirado"
```

---

**Cenário 7: Revogar acesso funciona imediatamente**
```gherkin
DADO prof_a com acesso a pai
QUANDO pai revoga em /familia/crianca/{id}/compartilhar
E clica "Revogar"
E transação DELETE FROM permissoes completa

ENTÃO prof_a faz novo GET /api/profissional/paciente/{id}
E recebe HTTP 403 (sem delay)
```

---

### 2️⃣ TESTES FUNCIONAIS (Feature Completeness)

#### 2.1 Autenticação por Role

**Cenário 8: Signup como Pai → Vai para /familia/dashboard**
```gherkin
QUANDO novo usuário faz signup com role=familia
E preenche: email, password, nome_crianca

ENTÃO auth.users.role = 'familia'
E user_profiles.role = 'familia'
E redirects para /familia/dashboard
E navbar mostra: Logo + Avatar + Moedas

QUANDO clica Avatar
ENTÃO modal mostra: Perfil, Meu Diário, Sair
```

---

**Cenário 9: Signup como Profissional → Valida CRM**
```gherkin
QUANDO novo prof preenche CRM inválido (ex: "ABC123")
ENTÃO recebe erro: "CRM inválido para estado X"

QUANDO preenche CRM válido (ex: "12345/SP")
E COREN válido
ENTÃO sucesso, redirect para /profissional/dashboard
```

---

**Cenário 10: Login redirect correto por role**
```gherkin
DADO user familia_a logado
QUANDO tenta acessar /profissional/dashboard
ENTÃO recebe HTTP 403 ou redirects para /familia/dashboard

DADO user prof_a logado
QUANDO tenta acessar /familia/dashboard
ENTÃO recebe HTTP 403 ou redirects para /profissional/dashboard
```

---

#### 2.2 Gamificação Completa

**Cenário 11: Registrar glicemia → +10 moedas**
```gherkin
DADO pai com coins = 100
QUANDO pai registra novo valor de glicemia
THEN coins = 110
AND moedas_ganhas aparece no UI com animação

WHEN query user_profiles
THEN coins = 110
```

---

**Cenário 12: Humor diário → +5 moedas (1x por dia)**
```gherkin
DADO pai com coins = 100
WHEN clica "Como você está?" e seleciona "Feliz"
THEN coins = 105
AND registro em humor_logs

WHEN tenta registrar novamente (MESMO DIA)
THEN erro: "Você já registrou seu humor hoje"
AND coins NOT aumenta

WHEN volta PRÓXIMO DIA
THEN consegue registrar novamente
```

---

**Cenário 13: Comprar item com moedas**
```gherkin
DADO pai com coins = 100
WHEN clica item de 50 moedas e clica "Comprar"
THEN coins = 50
AND item_id adicionado a inventario_usuario
AND mensagem "Parabéns! Você comprou..."

WHEN tenta comprar com moedas insuficientes
THEN erro: "Você precisa de 50 moedas, tem 30"
AND nenhuma transação
```

---

**Cenário 14: Avatar muda conforme humor**
```gherkin
DADO pai logado com avatar = "feliz"
WHEN registra humor = "raiva"
THEN avatar na navbar muda para "raiva"
WHEN logout + login
THEN avatar persiste como "raiva"
```

---

#### 2.3 Compartilhamento & Convites

**Cenário 15: QR code gerado e funciona**
```gherkin
GIVEN pai em /familia/crianca/{id}/compartilhar
WHEN QR code is visible
AND escanear com celular
THEN abre link: https://gamellito.com/convites/{token}

GIVEN prof clica link
THEN view: "Dr Silva quer compartilhar dados de Marina?"
WHEN clica "Aceitar"
THEN permissao criada em DB
AND redirect para /profissional/dashboard
```

---

**Cenário 16: Email de convite recebido**
```gherkin
WHEN pai clica "Compartilhar via email"
AND preenche: prof@clinic.com
AND clica "Enviar"

THEN email enviado para prof@clinic.com
AND email contém: nome criança, link com token
AND link expira em 7 dias
```

---

**Cenário 17: Profissional aceita convite**
```gherkin
GIVEN prof recebe email com link
WHEN clica link em /convites/{token}
THEN view: "Qual é seu tipo de acesso?"
AND opções: readonly, comment, full

WHEN seleciona "readonly" e clica "Aceitar"
THEN permissao criada com tipo=readonly
THEN query_check: prof consegue SELECT registros
THEN query_check: prof não consegue DELETE
```

---

**Cenário 18: Revogar acesso remove imediatamente**
```gherkin
GIVEN prof_a tem acesso a pai
WHEN pai clica "Revogar" em /familia/crianca/{id}/compartilhar
AND DELETE FROM permissoes executa

THEN prof_a faz novo GET /api/profissional/paciente/{id}
AND recebe HTTP 403
```

---

### 3️⃣ TESTES DE LGPD & CONFORMIDADE

#### 3.1 Consentimento Granular

**Cenário 19: Consentimento obrigatório no signup**
```gherkin
GIVEN novo pai em /auth/signup
WHEN preenche email/password/dados
AND clica "Próximo"

THEN view: checkboxes obrigatórios:
  ☑️ Aceito os Termos de Serviço (obrigatório)
  ☐ Compartilhar com profissionais (opcional)
  ☐ Compartilhar com instituições (opcional)
  ☐ Enviar emails de atualização (opcional)
  ☐ Análise anônima (opcional)

WHEN deixa "Termos" desmarcado
THEN botão "Criar Conta" desabilitado
```

---

**Cenário 20: Consentimento de compartilhamento respeitado**
```gherkin
GIVEN pai com "Compartilhar com profissionais" = FALSE
WHEN tenta POST /api/familia/crianca/{id}/compartilhar
THEN erro: "Você não consentiu compartilhamento"

GIVEN mesmo pai muda para TRUE
WHEN tenta novamente
THEN sucesso, permissao criada
```

---

**Cenário 21: Analytics respeitam consentimento**
```gherkin
GIVEN pai com "Análise anônima" = FALSE
WHEN registra glicemia
THEN product_events.user_id = NULL (anonimizado)

GIVEN mesmo pai marca TRUE
THEN product_events.user_id = pai_uuid
```

---

#### 3.2 Direito ao Esquecimento (LGPD Art. 18, IV)

**Cenário 22: Deletar conta apaga TUDO**
```gherkin
GIVEN pai com:
  - 50 registros
  - 100 moedas
  - 3 compartilhamentos
  - 5 convites
  - 20 notas clinicas de profissionais

WHEN acessa /familia/configuracoes
AND clica "Deletar minha conta"
AND digita senha para confirmar
AND clica "Deletar permanentemente"

THEN email de confirmação enviado
WHEN clica link no email

THEN:
  - auth.users.id deletado
  - user_profiles deletado
  - registros deletados (CASCADE)
  - permissoes deletadas
  - inventario_usuario deletado
  - convites deletados
  - NADA resto no DB ligado ao user
  
AND session finalizada
AND redirect para home
AND login não funciona mais
```

---

**Cenário 23: Logs de acesso apagados/anonimizados**
```gherkin
GIVEN audit_log com 100 registros do user_id
WHEN user deleta conta

THEN audit_log atualizado:
  - user_id = NULL (anonimizado)
  - mensagem original mantida
  - timestamp mantido
  
RESULT: User é ghost, dados históricos anonimizados
```

---

#### 3.3 Privacidade de Crianças (LGPD Art. 14)

**Cenário 24: Mínimo de dados armazenados**
```gherkin
GIVEN criança < 12 anos
WHEN pai cria perfil

THEN NENHUMA coleta de:
  - Localização GPS
  - Face/Biometria (fotos descritivas)
  - Comportamento detalhado
  - Histórico de navegação
  
ONLY armazenado:
  - Nome
  - Idade
  - Avatar customizado
  - Registros de glicemia
  - Humor diário
```

---

**Cenário 25: Consentimento de pais é obrigatório**
```gherkin
GIVEN criança tentando acessar /auth/signup
WHEN preenche email próprio
AND data_nascimento < 12 anos

THEN view: "Você é menor de idade"
AND "Um pai/responsável precisa criar sua conta"
AND redirects para /auth/signup com role=familia
```

---

### 4️⃣ TESTES DE PERFORMANCE

#### 4.1 Load Time

**Cenário 26: Dashboard carrega em < 2s (500 registros)**
```gherkin
GIVEN pai com 500 registros de glicemia
WHEN acessa /familia/dashboard
THEN Lighthouse:
  - First Contentful Paint < 1.5s
  - Largest Contentful Paint < 2s
  - Cumulative Layout Shift < 0.1
```

---

**Cenário 27: Gráfico renderiza sem lag (Recharts)**
```gherkin
GIVEN /familia/crianca/{id}/grafico com 500 pontos
WHEN página carrega
THEN Recharts renderiza em < 1s
AND zoom/pan/hover sem travamento
```

---

**Cenário 28: Timeline com paginação (não carrega tudo)**
```gherkin
GIVEN /familia/crianca/{id}/registros
AND GET /api/.../registros?limit=50&offset=0
THEN retorna exatamente 50 registros
AND paginacao.has_more = true

WHEN user scroll para final
AND lazy-load disparado
THEN GET /api/.../registros?limit=50&offset=50
AND próximos 50 registros carregam
```

---

#### 4.2 Database Performance

**Cenário 29: Queries com índices são < 100ms**
```sql
-- Check EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM registros 
WHERE familia_id = '...' 
ORDER BY data_hora DESC 
LIMIT 50;

-- Esperado: Index Scan, ~50ms
```

---

**Cenário 30: RLS não causa overhead**
```gherkin
GIVEN query simples: SELECT * FROM registros
AND com RLS ativa

THEN Latência < 50ms (mesmo que sem RLS)
AND RLS policies otimizadas (não N+1)
```

---

### 5️⃣ TESTES E2E (Playwright)

#### 5.1 Happy Path: Pai → Registra → Ganha Moedas → Compra

```javascript
test('Full flow: signup → register → coins → buy', async ({ page }) => {
  // 1. Signup
  await page.goto('/auth/signup');
  await page.fill('[name="email"]', 'novo@test.com');
  await page.fill('[name="password"]', 'Senha123!@#');
  await page.select('[name="role"]', 'familia');
  await page.check('[name="termos"]');
  await page.click('[data-test="btn-signup"]');
  
  // 2. Confirm email (mock)
  const emailLink = await getEmailLink('novo@test.com');
  await page.goto(emailLink);
  
  // 3. Create child profile
  await page.fill('[name="crianca_nome"]', 'Marina');
  await page.fill('[name="crianca_data_nascimento"]', '2020-01-15');
  await page.click('[data-test="btn-criar"]');
  
  // 4. Verify redirect to dashboard
  expect(page.url()).toContain('/familia/dashboard');
  
  // 5. Register glicemia
  await page.click('[data-test="btn-registrar"]');
  await page.fill('[name="valor"]', '120');
  await page.select('[name="rotulo"]', 'depois');
  await page.click('[data-test="btn-salvar"]');
  
  // 6. Verify coins gained
  const coins = await page.locator('[data-test="saldo"]').textContent();
  expect(coins).toMatch(/10|110/); // Ganhou 10
  
  // 7. Go to loja
  await page.click('[data-test="nav-loja"]');
  
  // 8. Buy item
  await page.click('[data-test="item-0"]');
  await page.click('[data-test="btn-comprar"]');
  
  // 9. Verify success animation
  const message = await page.locator('[data-test="success"]').textContent();
  expect(message).toContain('Parabéns');
  
  // 10. Verify coins decremented
  const novas_coins = await page.locator('[data-test="saldo"]').textContent();
  expect(parseInt(novas_coins)).toBeLessThan(parseInt(coins));
});
```

---

#### 5.2 Profissional Workflow

```javascript
test('Prof accepts invite → sees patient → exports report', async ({ page }) => {
  // 1. Pai compartilha via QR code
  const pai = await loginAs('pai@test.com', 'pass');
  await pai.goto('/familia/crianca/123/compartilhar');
  const qrCodeDataUrl = await pai.locator('[data-test="qr-code"]').getAttribute('src');
  
  // 2. Prof escaneia link
  const tokenMatch = qrCodeDataUrl.match(/convites\/([a-z0-9]+)/);
  const token = tokenMatch[1];
  
  const prof = await loginAs('prof@clinic.com', 'pass');
  await prof.goto(`/convites/${token}`);
  
  // 3. Prof aceita
  await prof.select('[name="tipo_acesso"]', 'readonly');
  await prof.click('[data-test="btn-aceitar"]');
  
  // 4. Prof vê paciente em dashboard
  expect(prof.url()).toContain('/profissional/dashboard');
  const pacientesCards = await prof.locator('[data-test="paciente-card"]').count();
  expect(pacientesCards).toBeGreaterThan(0);
  
  // 5. Prof acessa ficha
  await prof.click('[data-test="paciente-card-0"]');
  const registros = await prof.locator('[data-test="registro-row"]').count();
  expect(registros).toBeGreaterThan(0);
  
  // 6. Prof gera relatório
  await prof.click('[data-test="btn-relatorio"]');
  const pdfBuffer = await prof.page.context().waitForEvent('download');
  
  // 7. Verify PDF
  const path = await pdfBuffer.path();
  // Verify no "alto/baixo/normal" text
  // Verify gráfico included
  expect(await isPdfValid(path)).toBe(true);
});
```

---

### 6️⃣ TESTES DE COMPATIBILIDADE

#### 6.1 Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ |
| Firefox | 121+ | ✅ |
| Safari | 17+ | ✅ |
| Edge | 120+ | ✅ |

---

#### 6.2 Mobile

| Device | Status |
|--------|--------|
| iOS Safari (iPhone 12+) | ✅ |
| Android Chrome | ✅ |
| Viewport 375px | ✅ (responsive) |

---

#### 6.3 Acessibilidade (WCAG 2.1 AA)

**Cenário 31: Screen reader consegue navegar**
```gherkin
GIVEN usuário com leitor de tela (NVDA, JAWS)
WHEN navega /familia/dashboard
THEN consegue:
  - Ouvir menu e links
  - Preencher formulários
  - Submeter dados
  - Ouvir resultados
  
MUST ter:
  - Headings hierárquicos (h1, h2, h3)
  - Labels para inputs
  - Alt text para imagens
  - Role attributes para custom components
```

---

**Cenário 32: Keyboard-only navigation**
```gherkin
GIVEN usuário SEM mouse
WHEN navega apenas com Tab + Enter
THEN consegue:
  - Acessar todos os links
  - Preencher todos os forms
  - Não há "keyboard traps"
  - Focus é visível sempre
```

---

**Cenário 33: Contrast ratio**
```gherkin
GIVEN cor de texto vs background
THEN contrast ratio >= 4.5:1 (AA)
OR >= 7:1 (AAA)

TOOL: axe DevTools, Contrast Checker
```

---

## ✅ CHECKLIST FINAL (PRÉ-LAUNCH)

### Segurança
- [ ] RLS policies testadas (100% coverage)
- [ ] No SQL injection (OWASP tests)
- [ ] No XSS (Content-Security-Policy headers)
- [ ] CSRF tokens em formulários
- [ ] Senhas hasheadas (bcrypt, rate-limited)
- [ ] Sessions expiram (30 min inatividade)
- [ ] Audit logs completos
- [ ] Penetration test by security firm

### Funcionalidade
- [ ] Todas as features de Fase 6 funcionam
- [ ] Nenhum bug P0 (crítico) ou P1 (major)
- [ ] Nenhum bug P2 (minor) > 10
- [ ] Tratamento de erros consistente
- [ ] Loading states visíveis
- [ ] Input validation completa

### LGPD
- [ ] Consentimento granular obrigatório
- [ ] Direito ao esquecimento testado E2E
- [ ] Dados de crianças protegidos
- [ ] Auditoria de acesso logging
- [ ] Legal review aprovado

### Performance
- [ ] Dashboard < 2s (Lighthouse > 90)
- [ ] API < 200ms (p95)
- [ ] Nenhum memory leak
- [ ] Database queries < 100ms
- [ ] Bundle size < 500KB gzip

### Documentação
- [ ] README com setup
- [ ] API docs (Swagger)
- [ ] RLS policies documented
- [ ] Deployment runbook
- [ ] Incident response plan

### Testes Automatizados
- [ ] Unit tests (Jest) > 80% coverage
- [ ] Integration tests > 80% coverage
- [ ] E2E tests (Playwright) > 70% coverage
- [ ] CI/CD pipeline green

---

## 📊 Métricas de Sucesso

| Métrica | Target | Pass/Fail |
|---------|--------|-----------|
| Test Coverage | > 90% | - |
| Security Score | A+ (OWASP) | - |
| Performance (Lighthouse) | > 90 | - |
| Acessibilidade (axe) | 0 violations | - |
| Uptime | 99.9% | - |
| Bugs P0 | 0 | - |
| Bugs P1 | 0 | - |

---

## 🚀 Execução (Fases)

| Fase | Testes | Owner | Timeline |
|------|--------|-------|----------|
| 1 | RLS + Isolamento (Sprint 1.5) | QA Lead | Semana 3 |
| 2 | Funcional + E2E (Sprint 2.5) | QA Lead | Semana 6 |
| 3 | Funcional + Segurança (Sprint 3.5) | QA Lead | Semana 9 |
| 4-5 | Funcional (durante) | Dev + QA | Semanas 11, 14 |
| 6 | Penetration test | Security | Semana 15 |

---

