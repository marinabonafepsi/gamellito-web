# QA: Plano de Testes Completo - Gamellito Multi-Portal

**Versão:** 1.0  
**Data:** 2026-06-24  
**Responsável:** QA Team  
**Status:** Ativo para Fases 1-6  

---

## 1. OBJETIVO

Garantir que a arquitetura multi-portal do Gamellito seja:
- **Segura**: RLS, isolamento de dados, LGPD compliant
- **Funcional**: Todas as features funcionam conforme especificação
- **Performática**: Dashboards < 2s, APIs < 200ms
- **Acessível**: WCAG 2.1 AA, multi-device, multi-browser
- **Confiável**: Erro handling, edge cases cobertos

---

## 2. ESTRUTURA DE TESTES POR FASE

### Fase 1: Infraestrutura Base (Autenticação + RLS)

#### 2.1.1 SEGURANÇA: RLS - Isolamento de Dados por Role

**Objetivo:** Garantir que cada role só acessa dados permitidos.

**Cenário 1: Pai não consegue acessar dados de outro Pai**

- **Pré-condição:** 2 pais criados (pai_A, pai_B)
- **Ação:** pai_A tenta GET `/api/familia/registros?familia_id=pai_B_uuid`
- **Esperado:** HTTP 403 ou lista vazia
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'pai_a_uuid';
  SELECT COUNT(*) FROM registros 
    WHERE familia_id = 'pai_b_uuid'; -- Esperado: 0 linhas
  ROLLBACK;
  ```
- **RLS Policy Check:**
  ```sql
  -- Verificar que a policy está aplicada
  SELECT * FROM pg_policies 
    WHERE tablename = 'registros' 
    AND policyname LIKE '%familia%';
  ```

---

**Cenário 2: Profissional sem permissão não vê paciente**

- **Pré-condição:** Prof sem convite aceito, Pai com registros
- **Ação:** Prof tenta GET `/api/profissional/pacientes`
- **Esperado:** HTTP 200 + lista vazia OU HTTP 403
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'prof_uuid';
  SELECT COUNT(*) FROM registros; -- Esperado: 0 linhas
  ROLLBACK;
  ```

---

**Cenário 3: Admin consegue acessar todos os dados (com auditoria)**

- **Pré-condição:** Admin user logged in, 100+ registros no DB
- **Ação:** Admin GET `/admin/usuarios/[user_id]/registros`
- **Esperado:** HTTP 200 + registros visíveis + entry em audit_log
- **Test SQL:**
  ```sql
  -- Verificar que admin vê dados
  BEGIN;
  SET SESSION user_id = 'admin_uuid';
  SELECT COUNT(*) FROM registros; -- Esperado: 100+
  
  -- Verificar auditoria
  SELECT * FROM audit_log 
    WHERE admin_id = 'admin_uuid' 
    ORDER BY created_at DESC LIMIT 1;
  ROLLBACK;
  ```

---

**Cenário 4: Instituição A não vê dados de Instituição B**

- **Pré-condição:** 2 instituições (Escola_A, Clinica_B), dados de cada
- **Ação:** Gestor_A GET `/instituicao/dashboard` → vê apenas dados_A
- **Esperado:** Filtro automático por tenant_id
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'gestor_a_uuid';
  -- Verificar que apenas dados da Instituição A retornam
  SELECT DISTINCT tenant_id FROM (
    SELECT tenant_id FROM auth.users 
    WHERE id = auth.uid()
  ) user_info;
  ROLLBACK;
  ```

---

#### 2.1.2 FUNCIONALIDADE: Autenticação por Role

**Cenário 1: Signup como Pai → Dashboard correto**

- **Ação:**
  1. POST `/auth/signup` com `{ email, password, role: 'familia' }`
  2. Verificar email (mock/test-email)
  3. Login com email + password
- **Esperado:**
  - `auth.users.role = 'familia'`
  - Redirect to `/familia/dashboard`
  - Navbar contém "Meu Perfil", Avatar, Moedas
- **Playwright Test:**
  ```javascript
  test('Signup como Pai redireciona para /familia/dashboard', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.fill('[name="email"]', 'novo_pai@example.com');
    await page.fill('[name="password"]', 'Test@1234');
    await page.select('[name="role"]', 'familia');
    await page.click('[data-testid="btn-signup"]');
    
    // Verify email via mock
    const emailLink = await getTestEmailLink('novo_pai@example.com');
    await page.goto(emailLink);
    
    // Expect redirect to familia dashboard
    expect(page.url()).toContain('/familia/dashboard');
    
    // Verify navbar elements
    await expect(page.locator('[data-testid="navbar-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="coins-display"]')).toBeVisible();
  });
  ```

---

**Cenário 2: Signup como Profissional → Valida CRM**

- **Ação:**
  1. POST `/auth/signup` com role='profissional' + CRM inválido (ex: "ABC123")
  2. Submeter form
- **Esperado:** Erro "CRM inválido (formato: XXXXX/UF)"
- **Ação:**
  3. Preencher CRM válido (ex: "123456/SP")
  4. Submeter
- **Esperado:** Success, redirect to `/profissional/onboarding`

---

**Cenário 3: Signup como Instituição → Valida CNPJ**

- **Ação:**
  1. POST com CNPJ inválido (ex: "00000000000000")
  2. Submeter
- **Esperado:** Erro "CNPJ inválido"
- **Ação:**
  3. Preencher CNPJ válido (ex: "11.222.333/0001-81")
  4. Submeter
- **Esperado:** Success

---

**Cenário 4: Login redirect correto por role**

- **Setup:**
  1. User familia logged in
  2. Tenta acessar `/profissional/dashboard`
- **Esperado:** Middleware redireciona para `/familia/dashboard`
- **Test:**
  ```javascript
  test('Familia logada nao consegue acessar /profissional/dashboard', async ({ page, context }) => {
    const familiaAuth = { role: 'familia', user_id: 'familia_uuid' };
    await context.addCookies([{
      name: 'next-auth.session',
      value: createSession(familiaAuth),
      // ... cookie config
    }]);
    
    const response = await page.goto('/profissional/dashboard');
    expect(response.status()).toBe(307); // Redirect
    expect(page.url()).toContain('/familia/dashboard');
  });
  ```

---

### Fase 2: Profissionais + Permissões

#### 2.2.1 SEGURANÇA: Compartilhamento Granular

**Cenário 1: Pai compartilha com readonly → Prof não consegue deletar**

- **Pré-condição:**
  1. Pai cria permissão: `INSERT INTO permissoes (usuario_dono_id, usuario_acesso_id, tipo_acesso) VALUES (pai_uuid, prof_uuid, 'readonly')`
  2. Prof tem acesso à criança
- **Ação:** Prof tenta DELETE `/api/registros/[id]`
- **Esperado:** HTTP 403 "Acesso negado: readonly"
- **RLS Policy:**
  ```sql
  CREATE POLICY "Profissional-readonly" ON registros
    FOR DELETE USING (
      (auth.uid() = usuario_id) OR
      (EXISTS (
        SELECT 1 FROM permissoes
        WHERE usuario_dono_id = registros.familia_id
        AND usuario_acesso_id = auth.uid()
        AND tipo_acesso IN ('comment', 'full')
        AND revogada_em IS NULL
        AND (expira_em IS NULL OR expira_em > now())
      ))
    );
  ```

---

**Cenário 2: Pai compartilha com comment → Prof consegue comentar**

- **Pré-condição:** Permissão com `tipo_acesso = 'comment'`
- **Ação:** Prof POST `/api/registros/[id]/notas` com comentário
- **Esperado:** HTTP 201, nota criada
- **Ação:** Prof tenta DELETE registro original
- **Esperado:** HTTP 403

---

**Cenário 3: Compartilhamento expira após data**

- **Pré-condição:** `INSERT INTO permissoes ... expira_em = '2026-06-20'`
- **Data atual:** 2026-06-25 (simular com clock mock)
- **Ação:** Prof GET `/api/profissional/pacientes`
- **Esperado:** Paciente não aparece na lista
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'prof_uuid';
  -- Simular data futura
  SET LOCAL timezone = 'UTC';
  SELECT COUNT(*) FROM permissoes
    WHERE usuario_acesso_id = auth.uid()
    AND expira_em > now()
    AND revogada_em IS NULL; -- Esperado: 0
  ROLLBACK;
  ```

---

**Cenário 4: Revogar acesso funciona imediatamente**

- **Pré-condição:** Prof tem acesso aceito
- **Ação:**
  1. Pai POST `/api/permissoes/[id]/revogar`
  2. Prof imediatamente tenta GET `/api/profissional/pacientes`
- **Esperado:** HTTP 403 ou lista vazia (sem delay)
- **Implementation Check:**
  ```javascript
  // Verificar que permissoes são consultadas a cada request, não cacheadas
  test('Revogar acesso e consultar imediatamente bloqueia', async ({ page, browser }) => {
    const pai = await loginAs(page, 'pai@example.com');
    const prof = await loginAs(await browser.newContext(), 'prof@clinic.com');
    
    // Prof tem acesso
    let response = await prof.request.get('/api/profissional/pacientes');
    expect(response.status()).toBe(200);
    
    // Pai revoga
    await pai.goto('/familia/crianca/123/compartilhar');
    await pai.click('[data-testid="btn-revogar"]');
    
    // Prof perde acesso IMEDIATAMENTE
    response = await prof.request.get('/api/profissional/pacientes');
    expect(response.status()).toBe(403);
  });
  ```

---

#### 2.2.2 FUNCIONALIDADE: Portal Profissional

**Cenário 1: Dashboard mostra apenas pacientes com compartilhamento ativo**

- **Setup:**
  1. Prof tem 10 convites aceitos (permissoes ativas)
  2. 2 permissoes expiradas
  3. 5 compartilhamentos revogados
- **Ação:** Prof GET `/api/profissional/dashboard`
- **Esperado:** Response contém exatamente 10 pacientes
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'prof_uuid';
  SELECT COUNT(DISTINCT usuario_dono_id) FROM permissoes
    WHERE usuario_acesso_id = auth.uid()
    AND revogada_em IS NULL
    AND (expira_em IS NULL OR expira_em > now());
  -- Esperado: 10
  ROLLBACK;
  ```

---

**Cenário 2: Ficha de paciente mostra últimos 20 registros**

- **Setup:** 50 registros total para uma criança
- **Ação:** Prof GET `/api/profissional/paciente/[id]/registros?limit=20`
- **Esperado:**
  - 20 registros retornados
  - Ordenado por data DESC (mais recente primeiro)
  - Campos: `id, data_hora, valor, unidade, criado_em`
- **Test:**
  ```javascript
  test('Ficha de paciente pagina corretamente', async ({ page }) => {
    await page.goto('/profissional/paciente/123');
    
    const records = await page.locator('[data-testid="record-row"]');
    expect(await records.count()).toBe(20);
    
    // Verify sorted DESC
    const firstDate = await records.first().locator('[data-testid="record-date"]').textContent();
    const lastDate = await records.last().locator('[data-testid="record-date"]').textContent();
    expect(new Date(firstDate) > new Date(lastDate)).toBeTruthy();
  });
  ```

---

**Cenário 3: Notas clínicas salvam e persistem**

- **Ação:**
  1. Prof POST `/api/profissional/paciente/[id]/notas`
  2. Body: `{ "texto": "Paciente com boa adesão", "data_atendimento": "2026-06-24" }`
- **Esperado:**
  - HTTP 201
  - Nota aparece em DB: `SELECT * FROM clinical_notes WHERE profissional_id = ... AND paciente_id = ...`
- **Ação:**
  3. Prof GET `/api/profissional/paciente/[id]`
- **Esperado:** Nota aparece no objeto `paciente.notas[]`

---

**Cenário 4: Relatório PDF exporta sem interpretação de glicemia**

- **CRÍTICO - Regra Nº 1 do Gamellito**
- **Ação:** Prof POST `/api/profissional/relatorios/gerar`
  - Body: `{ "crianca_id": "...", "data_inicio": "2026-05-01", "data_fim": "2026-06-24" }`
- **Esperado:**
  - HTTP 200 + PDF blob
  - PDF contém tabela com registros
  - **Nenhuma menção a "alto/baixo/normal"**
  - **Nenhuma zona colorida no gráfico (sem "faixa segura")**
  - Gráfico apenas mostra valores históricos (linha)
- **Audit Check:**
  ```javascript
  test('Relatório PDF nao interpreta glicemia', async ({ page }) => {
    const pdf = await page.request.post('/api/profissional/relatorios/gerar', {
      data: { crianca_id: '123', data_inicio: '2026-05-01', data_fim: '2026-06-24' }
    });
    
    const pdfBuffer = await pdf.arrayBuffer();
    const pdfText = await extractTextFromPDF(pdfBuffer);
    
    // Verificar que NÃO contém interpretações
    expect(pdfText).not.toMatch(/alto|baixo|normal|faixa|seguro|risco/i);
    
    // Verificar que contém dados brutos
    expect(pdfText).toMatch(/\d{2,3}\s*mg\/dL?/);
  });
  ```

---

### Fase 3: Multi-Tenant + Grupos (Instituições)

#### 2.3.1 FUNCIONALIDADE: Grupos + Educadores

**Cenário 1: Criar grupo dentro de instituição**

- **Pré-condição:** Gestor de instituição logado
- **Ação:**
  1. POST `/api/instituicao/grupos`
  2. Body: `{ "nome": "Turma 5A", "descricao": "Classe de 5ª série", "educador_id": "..." }`
- **Esperado:**
  - HTTP 201
  - `instituicao_id` atribuído automaticamente (via RLS)
  - Grupo criado: `INSERT INTO grupos (instituicao_id, nome, educador_id) VALUES (...)`

---

**Cenário 2: Adicionar alunos ao grupo**

- **Ação:** POST `/api/grupos/[grupo_id]/adicionar-alunos`
  - Body: `{ "usuario_ids": ["aluno1_uuid", "aluno2_uuid", ...] }`
- **Esperado:**
  - HTTP 201
  - Entradas em `grupos_membros` criadas
  - Educador consegue ver esses alunos em GET `/api/grupos/[grupo_id]/alunos`

---

**Cenário 3: Multi-tenant isolation em queries**

- **Setup:** 2 instituições, cada uma com 100 grupos
- **Ação:**
  1. Gestor_A GET `/api/instituicao/grupos`
  2. Gestor_B GET `/api/instituicao/grupos`
- **Esperado:**
  - Gestor_A vê 100 grupos (os dela)
  - Gestor_B vê 100 grupos (os dela)
  - Sem sobreposição
- **RLS Policy:**
  ```sql
  CREATE POLICY "Instituicao-grupos-isolamento" ON grupos
    FOR ALL USING (
      instituicao_id = (
        SELECT tenant_id FROM auth.users WHERE id = auth.uid()
      )
    );
  ```

---

### Fase 4: Consentimento Granular (LGPD)

#### 2.4.1 SEGURANÇA: Consentimento Granular

**Cenário 1: Checkbox "Compartilhar dados com profissionais"**

- **Pré-condição:** Pai na tela de configurações
- **Ação:**
  1. Desmarcar checkbox `consentimento.compartilhar_profissionais`
  2. Salvar
- **Esperado:**
  - Row em `consentimento_granular` criada com `consentimento_dado = false`
  - Pai tenta compartilhar com profissional → GET `/api/familia/crianca/[id]/compartilhar-options` retorna vazio
  - RLS policy bloqueia INSERT em `permissoes` se consentimento = false
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'pai_uuid';
  
  INSERT INTO consentimento_granular 
    (usuario_crianca_id, usuario_profissional_id, tipo_consentimento, consentimento_dado)
  VALUES ('crianca_uuid', 'prof_uuid', 'registros_glicemia', false);
  
  -- Tentar criar permissão deve falhar (RLS)
  INSERT INTO permissoes (usuario_dono_id, usuario_acesso_id, tipo_acesso)
  VALUES ('pai_uuid', 'prof_uuid', 'readonly');
  -- Esperado: violates row-level security policy
  ROLLBACK;
  ```

---

**Cenário 2: Checkbox "Receber emails sobre atualizações"**

- **Ação:**
  1. Desmarcar `consentimento.receber_emails_atualizacoes`
  2. Sistema envia email de atualização de feature
- **Esperado:** Pai NÃO recebe email
- **Implementation:** Verificar em email service: `WHERE consentimento.receber_emails = true`

---

**Cenário 3: Checkbox "Participar de analytics anônimo"**

- **Ação:**
  1. Desmarcar `consentimento.analytics_anonimo`
  2. Pai usa app (navegação, cliques, etc)
- **Esperado:** `product_events.user_id = NULL` (anonimizado)
- **Test:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'pai_uuid';
  
  UPDATE consentimento_granular 
  SET consentimento_dado = false 
  WHERE tipo_consentimento = 'analytics_anonimo'
  AND usuario_crianca_id = 'pai_uuid';
  
  -- Depois de evento do usuário
  SELECT COUNT(*) FROM product_events 
    WHERE user_id IS NULL 
    AND evento_tipo = 'page_view'; 
  -- Esperado: > 0
  ROLLBACK;
  ```

---

**Cenário 4: Versão de consentimento atualiza**

- **Setup:**
  1. Nova versão de termos lançada (v2)
  2. Email enviado para todos os pais
  3. Pai faz login
- **Esperado:**
  - Prompt obrigatório: "Aceitar nova versão dos termos?"
  - Se aceitar: `consentimento_granular.versao = 'v2'`
  - Se rejeitar: Ainda consegue usar app, mas vê prompt em próximo login

---

#### 2.4.2 FUNCIONALIDADE: Permissões de Criança

**Cenário 1: Pai faz onboarding de criança com consentimentos**

- **Ação:**
  1. POST `/api/familia/criar-crianca`
  2. Body: `{ "nome": "Marina", "data_nasc": "2015-01-01", ... }`
  3. Popup com checkboxes de consentimento
  4. Pai marca/desmarca
  5. Clica "Confirmar"
- **Esperado:**
  - Criança criada em `auth.users` com `role = 'crianca'`
  - Entries em `consentimento_granular` para cada tipo
  - `ip_origem` e `user_agent` registrados

---

### Fase 5: Convites + Compartilhamento

#### 2.5.1 FUNCIONALIDADE: Convites por Email + QR Code

**Cenário 1: QR code gerado e funciona**

- **Pré-condição:** Pai em `/familia/crianca/[id]/compartilhar`
- **Ação:**
  1. Clica "Gerar QR Code"
  2. QR code aparece na tela
  3. Escanear com celular
- **Esperado:**
  - QR code leva para URL `/convites/[token]`
  - Token válido por 7 dias
  - Criança específica identificada na URL
- **Test:**
  ```javascript
  test('QR code é gerado e codifica URL correta', async ({ page }) => {
    await page.goto('/familia/crianca/123/compartilhar');
    await page.click('[data-testid="btn-gerar-qr"]');
    
    const qrImage = await page.locator('[data-testid="qr-code"]');
    expect(qrImage).toBeVisible();
    
    // Decodificar QR code (usando biblioteca)
    const qrData = await decodeQRCode(qrImage);
    expect(qrData).toMatch(/\/convites\/[a-zA-Z0-9-_]+/);
  });
  ```

---

**Cenário 2: Email invite recebido**

- **Ação:**
  1. Pai clica "Compartilhar via email"
  2. Insere `prof@clinic.com`
  3. Clica "Enviar"
- **Esperado:**
  - Email enviado para `prof@clinic.com`
  - Email contém link: `/convites/[token]`
  - Link válido por 7 dias
  - DB: `INSERT INTO convites (usuario_remetente_id, email_destinatario, tipo_convite, token_convite, expira_em) VALUES (...)`

---

**Cenário 3: Profissional aceita convite**

- **Pré-condição:** Prof clica link do email
- **Ação:**
  1. GET `/convites/[token]`
  2. Prof logado (ou signup)
  3. Clica "Aceitar Compartilhamento"
- **Esperado:**
  - HTTP 200
  - `UPDATE convites SET aceito = true, aceito_em = now() WHERE token_convite = '...'`
  - `INSERT INTO permissoes (usuario_dono_id, usuario_acesso_id, tipo_acesso) VALUES (pai_uuid, prof_uuid, 'readonly')`
  - Redirect to `/profissional/dashboard`
  - Paciente aparece na lista de pacientes do prof

---

**Cenário 4: Convite expira após 7 dias**

- **Pré-condição:** Convite criado há 8 dias
- **Ação:** Prof clica link
- **Esperado:** HTTP 410 "Link expirado"

---

### Fase 6: Gamificação (Loja + Moedas)

#### 2.6.1 FUNCIONALIDADE: Sistema de Moedas

**Cenário 1: Registrar glicemia → +10 moedas**

- **Setup:** Pai com 0 moedas
- **Ação:**
  1. POST `/api/registros`
  2. Body: `{ "valor": 120, "unidade": "mg/dL", "data_hora": "2026-06-24T10:30:00Z" }`
- **Esperado:**
  - HTTP 201, registro criado
  - `user_profiles.coins` incrementado de 0 → 10
  - Entry em `coin_transactions` (para auditoria)
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'pai_uuid';
  
  SELECT coins FROM user_profiles WHERE user_id = auth.uid(); -- 0
  
  INSERT INTO registros (familia_id, valor, unidade) 
  VALUES (auth.uid(), 120, 'mg/dL');
  
  SELECT coins FROM user_profiles WHERE user_id = auth.uid(); -- 10
  ROLLBACK;
  ```

---

**Cenário 2: Humor diário → +5 moedas (1x por dia)**

- **Setup:** Pai com 100 moedas
- **Ação:**
  1. POST `/api/humor`
  2. Body: `{ "humor": "feliz" }`
- **Esperado:**
  - HTTP 201
  - Coins: 100 → 105
  - Entry em `humor_logs` com timestamp
- **Ação:**
  3. Tenta POST `/api/humor` novamente (mesmo dia)
- **Esperado:** HTTP 429 "Você já registrou seu humor hoje"

---

**Cenário 3: Comprar item com moedas → Decrementa saldo**

- **Pré-condição:** Pai com 100 moedas, item avatar custa 50
- **Ação:** POST `/api/loja/comprar`
  - Body: `{ "item_id": "avatar_dino_uuid", "quantidade": 1 }`
- **Esperado:**
  - HTTP 201
  - Coins: 100 → 50
  - `inventario_usuario` entry criada
- **Transação atômica:**
  ```sql
  BEGIN;
    UPDATE user_profiles SET coins = coins - 50 WHERE user_id = auth.uid();
    INSERT INTO inventario_usuario (usuario_id, item_loja_id, quantidade) VALUES (...);
    INSERT INTO coin_transactions (user_id, tipo, quantidade) VALUES (auth.uid(), 'compra', -50);
  COMMIT;
  -- Se erro, ROLLBACK automático
  ```

---

**Cenário 4: Não consegue comprar com moedas insuficientes**

- **Pré-condição:** Pai com 10 moedas, item custa 50
- **Ação:** POST `/api/loja/comprar`
- **Esperado:** HTTP 400 "Saldo insuficiente (tem: 10, precisa: 50)"
- **Implementação:**
  ```javascript
  // Backend check
  if (user.coins < item.custo_moedas) {
    return res.status(400).json({
      error: 'Saldo insuficiente',
      tem: user.coins,
      precisa: item.custo_moedas
    });
  }
  ```

---

**Cenário 5: Avatar muda conforme humor**

- **Setup:** Avatar padrão (neutro)
- **Ação:**
  1. POST `/api/humor` com `humor = 'raiva'`
- **Esperado:**
  - `user_profiles.humor_atual = 'raiva'`
  - Navbar: Avatar renderiza sprite "raiva"
- **Ação:**
  2. POST `/api/humor` com `humor = 'feliz'`
- **Esperado:**
  - Avatar muda para "feliz" imediatamente (sem reload)
- **Frontend Test:**
  ```javascript
  test('Avatar muda quando humor é registrado', async ({ page }) => {
    await page.goto('/familia/dashboard');
    
    const initialAvatarSrc = await page.locator('[data-testid="avatar"]').getAttribute('src');
    expect(initialAvatarSrc).toContain('neutro');
    
    // Register mood
    await page.click('[data-testid="btn-registrar-humor"]');
    await page.click('[data-testid="mood-raiva"]');
    await page.click('[data-testid="btn-confirmar"]');
    
    // Avatar changes
    const newAvatarSrc = await page.locator('[data-testid="avatar"]').getAttribute('src');
    expect(newAvatarSrc).toContain('raiva');
  });
  ```

---

#### 2.6.2 FUNCIONALIDADE: Loja

**Cenário 1: Items listam corretamente**

- **Ação:** GET `/api/loja/items`
- **Esperado:**
  - HTTP 200
  - Array com 5+ items
  - Campos: `id, nome, tipo, custo_moedas, imagem_url, ativo`
  - Apenas items `ativo = true`
- **Test:**
  ```javascript
  test('Loja lista items ativos', async ({ request }) => {
    const response = await request.get('/api/loja/items');
    expect(response.status()).toBe(200);
    
    const items = await response.json();
    expect(items.length).toBeGreaterThanOrEqual(5);
    
    items.forEach(item => {
      expect(item.ativo).toBe(true);
      expect(item.custo_moedas).toBeGreaterThan(0);
    });
  });
  ```

---

**Cenário 2: Compra é atômica (no rollback em crash)**

- **Pré-condição:** Pai com 100 moedas
- **Ação:**
  1. POST `/api/loja/comprar` (item custa 30)
  2. Simular crash durante transação (DB query 2 de 3 executa)
- **Esperado:**
  - Coins ainda = 100 (rollback automático)
  - Item NÃO em inventário
- **Implementation:**
  ```javascript
  // Simulated crash (for testing)
  // Backend should use transactions (supabase RPC)
  export async function comprareItem(userId, itemId) {
    const { data, error } = await supabase.rpc('comprar_item_atomico', {
      user_id: userId,
      item_id: itemId
    });
    
    if (error) throw error;
    return data;
  }
  
  // RPC function (PostgreSQL)
  CREATE OR REPLACE FUNCTION comprar_item_atomico(user_id uuid, item_id uuid)
  RETURNS json AS $$
  DECLARE
    v_custo INTEGER;
    v_coins INTEGER;
  BEGIN
    -- Verificar item
    SELECT custo_moedas INTO v_custo FROM loja_items WHERE id = item_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Item nao existe'; END IF;
    
    -- Verificar coins
    SELECT coins INTO v_coins FROM user_profiles WHERE user_id = user_id;
    IF v_coins < v_custo THEN RAISE EXCEPTION 'Saldo insuficiente'; END IF;
    
    -- Atualizar coins
    UPDATE user_profiles SET coins = coins - v_custo WHERE user_id = user_id;
    
    -- Criar inventário
    INSERT INTO inventario_usuario (usuario_id, item_loja_id, quantidade)
    VALUES (user_id, item_id, 1)
    ON CONFLICT (usuario_id, item_loja_id) 
    DO UPDATE SET quantidade = quantidade + 1;
    
    -- Log
    INSERT INTO coin_transactions (user_id, tipo, quantidade, item_id)
    VALUES (user_id, 'compra', -v_custo, item_id);
    
    RETURN json_build_object('sucesso', true, 'coins_novo', v_coins - v_custo);
  END;
  $$ LANGUAGE plpgsql;
  ```

---

**Cenário 3: Inventário persiste após logout**

- **Pré-condição:** Pai compra item
- **Ação:**
  1. GET `/api/inventario`
  2. Vê item no inventário
  3. Logout
  4. Login novamente
  5. GET `/api/inventario`
- **Esperado:** Item ainda lá

---

## 3. TESTES DE LGPD & CONFORMIDADE

### 3.1 Direito ao Esquecimento (Art. 18, IV LGPD)

**Cenário 1: Deletar conta apaga tudo**

- **Pré-condição:** Pai com:
  - 50 registros
  - 100 moedas
  - 3 compartilhamentos ativos
  - 2 grupos (educador)
- **Ação:**
  1. POST `/api/conta/deletar` com password confirmation
  2. Email de confirmação enviado
  3. Clica link no email
- **Esperado:**
  - `auth.users.deleted_at` setado (soft delete)
  - Registros do pai deletados
  - Moedas zeradas (ou deletadas)
  - Permissões revogadas (`revogada_em` setado)
  - Grupos deletados
  - Nenhuma referência ao usuário em:
    - `user_profiles`
    - `registros`
    - `permissoes`
    - `grupos`
    - `inventario_usuario`
- **Test SQL:**
  ```sql
  BEGIN;
  SET SESSION user_id = 'pai_uuid';
  
  -- Antes de deletar
  SELECT COUNT(*) FROM registros WHERE familia_id = auth.uid(); -- 50
  SELECT COUNT(*) FROM permissoes WHERE usuario_dono_id = auth.uid(); -- 3
  
  -- Simular DELETE account
  UPDATE auth.users SET deleted_at = now() WHERE id = auth.uid();
  DELETE FROM registros WHERE familia_id = auth.uid();
  UPDATE permissoes SET revogada_em = now() WHERE usuario_dono_id = auth.uid();
  
  -- Verificar deletion
  SELECT COUNT(*) FROM registros WHERE familia_id = auth.uid(); -- 0
  SELECT COUNT(*) FROM permissoes WHERE usuario_dono_id = auth.uid() AND revogada_em IS NULL; -- 0
  ROLLBACK;
  ```

---

**Cenário 2: Audit logs apagam ou anonimizam**

- **Pré-condição:** 100 linhas em `audit_log` para user_id
- **Ação:** Deletar conta
- **Esperado:**
  - Opção 1: Linhas deletadas
  - Opção 2: `user_id = NULL` (anonimizado), mas `acao` preservada

---

### 3.2 Privacidade de Crianças (Art. 14 LGPD)

**Cenário 1: Máximo de dados armazenado para criança**

- **Esperado - dados permitidos:**
  - Nome
  - Data de nascimento
  - Avatar (escolhido pela criança)
  - Registros de saúde (glicemia, alimentação)
  - Humor diário
  - Inventário (itens da loja)
- **NÃO permitido:**
  - Geolocalização
  - Foto/rosto (sem consentimento explícito)
  - Email pessoal
  - CPF/RG
- **Code Review Checklist:**
  - [ ] `user_profiles` tabela NÃO contém `location`, `photo_url`
  - [ ] Signup de criança NÃO pede email
  - [ ] RLS bloqueia acesso a dados pessoais sem permissão

---

**Cenário 2: Consentimento parental é obrigatório**

- **Pré-condição:** Criança < 12 anos
- **Ação:** Pai cria perfil da criança
- **Esperado:**
  - Popup obrigatório: "Sou responsável por [criança] e autorizo o uso de dados"
  - Checkbox NÃO é pré-marcado
  - Botão "Confirmar" desabilitado até marcar
  - Log: `consentimento_granular.tipo = 'consentimento_parental'`

---

## 4. TESTES DE PERFORMANCE

### 4.1 Dashboard Load Time

**Cenário 1: Dashboard com 500 registros carrega em < 2s**

- **Setup:**
  1. Gerar 500 registros para uma criança (via seed script)
  2. Limpar cache
- **Ação:**
  1. Abrir DevTools → Lighthouse
  2. GET `/familia/dashboard`
  3. Medir Time to Interactive (TTI)
- **Esperado:** TTI < 2000ms
- **Tool:** Playwright + WebPageTest
  ```javascript
  test('Dashboard com 500 registros carrega em < 2s', async ({ page }) => {
    // Seed 500 registros
    await seedRegistros(500);
    
    const startTime = Date.now();
    await page.goto('/familia/dashboard');
    
    // Esperar que layout paint esteja pronto
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(2000);
  });
  ```

---

**Cenário 2: Gráfico renderiza sem lag**

- **Setup:** 500 registros
- **Ação:** GET `/familia/crianca/[id]/grafico`
- **Esperado:**
  - Time to First Paint < 1s
  - Recharts renderiza sem jank (60 FPS)
- **Tool:** Chrome DevTools → Performance tab
  ```javascript
  test('Gráfico renderiza sem lag com 500 pontos', async ({ page }) => {
    await page.goto('/familia/crianca/123/grafico');
    
    // Medir FPS durante renderização
    const fps = await page.evaluate(() => {
      return new Promise(resolve => {
        let frameCount = 0;
        const start = performance.now();
        
        const countFrames = () => {
          frameCount++;
          if (performance.now() - start < 3000) {
            requestAnimationFrame(countFrames);
          } else {
            const avgFps = (frameCount / 3);
            resolve(avgFps);
          }
        };
        
        countFrames();
      });
    });
    
    // Esperado: > 50 FPS (smooth)
    expect(fps).toBeGreaterThan(50);
  });
  ```

---

**Cenário 3: Timeline com paginação infinita**

- **Setup:** 200 registros
- **Ação:**
  1. GET `/api/familia/crianca/[id]/registros?limit=50&offset=0` → 50 registros
  2. Scroll down
  3. GET `/api/familia/crianca/[id]/registros?limit=50&offset=50` → próximos 50
  4. Repeat até fim
- **Esperado:**
  - Cada fetch < 300ms
  - Paginação infinita funciona sem carregar tudo no início

---

### 4.2 Database Query Performance

**Cenário 1: Índices estão otimizados**

- **Query mais comum:**
  ```sql
  EXPLAIN ANALYZE
  SELECT * FROM registros 
  WHERE familia_id = '...' 
  ORDER BY data_hora DESC 
  LIMIT 20;
  ```
- **Esperado:** Index Scan (não Seq Scan)
  ```
  Index Scan using idx_registros_familia_data on registros ...
  ```

---

**Cenário 2: Multi-tenant query rápida**

- **Query:**
  ```sql
  EXPLAIN ANALYZE
  SELECT COUNT(*) FROM registros 
  WHERE familia_id IN (
    SELECT id FROM auth.users 
    WHERE tenant_id = '...'
  );
  ```
- **Esperado:** < 100ms em DB com 1M registros

---

## 5. TESTES DE COMPATIBILIDADE

### 5.1 Browsers

**Target:** Chrome 120+, Firefox 121+, Safari 17+, Edge 120+

**Test Matrix:**

| Browser | Version | OS | Status |
|---------|---------|----|----|
| Chrome | 120+ | Windows, macOS, Linux | [ ] Pass |
| Firefox | 121+ | Windows, macOS, Linux | [ ] Pass |
| Safari | 17+ | macOS, iOS | [ ] Pass |
| Edge | 120+ | Windows | [ ] Pass |

**Testes por Browser:**

```javascript
import { chromium, firefox, webkit } from '@playwright/browser-chromium';

test.describe('Cross-browser compatibility', () => {
  for (const browserName of ['chromium', 'firefox', 'webkit']) {
    test(`Login flow in ${browserName}`, async () => {
      const browser = browserName === 'chromium' ? chromium
        : browserName === 'firefox' ? firefox
        : webkit;
      
      const ctx = await browser.launchPersistentContext('./user_data_dir');
      const page = await ctx.newPage();
      
      // Run tests
      await page.goto('/auth/login');
      await page.fill('[name="email"]', 'test@example.com');
      await page.fill('[name="password"]', 'Test@1234');
      await page.click('[data-testid="btn-login"]');
      
      await expect(page).toHaveURL(/\/.*\/dashboard/);
      await ctx.close();
    });
  }
});
```

---

### 5.2 Mobile

**Device Matrix:**

| Device | Browser | Viewport | Status |
|--------|---------|----------|--------|
| iPhone 14+ | Safari | 390x844 | [ ] Pass |
| Android 13+ | Chrome | 375x667 | [ ] Pass |
| iPad | Safari | 1024x1366 | [ ] Pass |

**Mobile-specific Tests:**

```javascript
test('Mobile responsiveness - 375px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/familia/dashboard');
  
  // Elementos visíveis sem scroll horizontal
  const viewport = await page.viewportSize();
  const htmlWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  
  expect(htmlWidth).toBeLessThanOrEqual(viewport.width + 10); // 10px tolerance
});

test('Touch interactions work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Tap to open drawer
  await page.tap('[data-testid="btn-menu"]');
  
  const drawer = page.locator('[data-testid="drawer"]');
  await expect(drawer).toBeVisible();
});
```

---

### 5.3 Acessibilidade (WCAG 2.1 AA)

**Testes Automáticos:**

```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('Acessibilidade - home page', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  
  // Verificar violações WCAG 2.1 AA
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  });
});

test('Contrast ratio >= 4.5:1', async ({ page }) => {
  await page.goto('/familia/dashboard');
  
  const contrastResults = await page.evaluate(() => {
    // Usar biblioteca axe ou similar
    const elements = document.querySelectorAll('body *');
    const results = [];
    
    elements.forEach(el => {
      const computed = window.getComputedStyle(el);
      const fgColor = computed.color;
      const bgColor = computed.backgroundColor;
      
      // Calcular contrast ratio
      const ratio = calculateContrast(fgColor, bgColor);
      if (ratio < 4.5) {
        results.push({ el: el.tagName, ratio });
      }
    });
    
    return results;
  });
  
  expect(contrastResults).toHaveLength(0);
});
```

**Testes Manuais:**

- [ ] Screen reader (NVDA, JAWS) consegue navegar
- [ ] Tab navigation funciona logicamente
- [ ] Focus visível em todos os botões
- [ ] Alt text em imagens
- [ ] Labels associadas a inputs

---

## 6. TESTES E2E (Fluxos Completos)

### 6.1 Happy Path: Pai Registra Glicemia → Ganha Moedas → Compra Item

```javascript
test('Full flow: signup → register → earn coins → shop', async ({ page, context }) => {
  // === SIGNUP ===
  await page.goto('/auth/signup');
  
  await page.fill('[name="email"]', 'new_pai@example.com');
  await page.fill('[name="password"]', 'Test@1234');
  await page.select('[name="role"]', 'familia');
  await page.check('[data-testid="terms-checkbox"]');
  await page.click('[data-testid="btn-signup"]');
  
  // Verify email
  const emailLink = await getTestEmailLink('new_pai@example.com');
  await page.goto(emailLink);
  
  // === CREATE CHILD ===
  await expect(page).toHaveURL(/\/familia\/onboarding/);
  await page.fill('[name="crianca_nome"]', 'Marina');
  await page.fill('[name="crianca_data_nasc"]', '2015-01-15');
  
  // Consent
  await page.click('[data-testid="consent-btn"]');
  await page.check('[data-testid="parental-consent"]');
  await page.click('[data-testid="btn-confirmar"]');
  
  await expect(page).toHaveURL(/\/familia\/dashboard/);
  
  // === REGISTER GLICEMIA ===
  await page.click('[data-testid="btn-registrar-glicemia"]');
  await page.fill('[name="valor"]', '120');
  await page.select('[name="unidade"]', 'mg/dL');
  await page.click('[data-testid="btn-salvar"]');
  
  // Celebração (sem interpretação de valor!)
  const celebration = await page.locator('[data-testid="celebration-message"]').textContent();
  expect(celebration).toContain('Parabéns');
  expect(celebration).not.toMatch(/alto|baixo|normal/i);
  
  // === VERIFY COINS ===
  const coinsDisplay = await page.locator('[data-testid="coins"]').textContent();
  expect(coinsDisplay).toMatch(/10/); // +10 moedas
  
  // === GO TO SHOP ===
  await page.goto('/loja');
  
  const firstItem = await page.locator('[data-testid="item-card"]').first();
  const itemPrice = await firstItem.locator('[data-testid="item-price"]').textContent();
  const itemName = await firstItem.locator('[data-testid="item-name"]').textContent();
  
  // === BUY ITEM ===
  await firstItem.click('[data-testid="btn-comprar"]');
  
  const confirmDialog = page.locator('[data-testid="confirm-purchase"]');
  await expect(confirmDialog).toBeVisible();
  
  await confirmDialog.click('[data-testid="btn-confirmar"]');
  
  // === VERIFY PURCHASE ===
  const successMsg = await page.locator('[data-testid="purchase-success"]').textContent();
  expect(successMsg).toContain('Parabéns');
  
  // Coins decremented
  const coinsAfter = await page.locator('[data-testid="coins"]').textContent();
  expect(coinsAfter).toMatch(/([0-9]+)/);
  
  // === INVENTORY ===
  await page.goto('/inventario');
  const ownedItem = page.locator(`[data-testid="item-${itemName}"]`);
  await expect(ownedItem).toBeVisible();
});
```

---

### 6.2 Profissional Workflow

```javascript
test('Prof accepts invite → sees patient → exports report', async ({ page, browser }) => {
  // === SETUP: Pai e Prof independentes ===
  const paiContext = await browser.newContext();
  const paiPage = await paiContext.newPage();
  
  const profContext = await browser.newContext();
  const profPage = await profContext.newPage();
  
  // === PAI: SIGNUP E CRIAR CRIANÇA ===
  await paiPage.goto('/auth/signup');
  await paiPage.fill('[name="email"]', 'pai@example.com');
  await paiPage.fill('[name="password"]', 'Test@1234');
  await paiPage.select('[name="role"]', 'familia');
  await paiPage.click('[data-testid="btn-signup"]');
  
  const emailLink1 = await getTestEmailLink('pai@example.com');
  await paiPage.goto(emailLink1);
  
  // Criar criança
  await paiPage.fill('[name="crianca_nome"]', 'Marina');
  await paiPage.click('[data-testid="btn-criar"]');
  
  const criancaId = await paiPage.url().match(/crianca\/(.+)/)[1];
  
  // === PAI: COMPARTILHAR COM PROF ===
  await paiPage.goto(`/familia/crianca/${criancaId}/compartilhar`);
  
  await paiPage.fill('[data-testid="email-invite"]', 'prof@clinic.com');
  await paiPage.click('[data-testid="btn-compartilhar"]');
  
  // === PROF: SIGNUP E ACEITAR CONVITE ===
  const inviteEmail = await getTestEmailLink('prof@clinic.com');
  const inviteToken = inviteEmail.match(/\/convites\/(.+)/)[1];
  
  await profPage.goto('/auth/signup');
  await profPage.fill('[name="email"]', 'prof@clinic.com');
  await profPage.fill('[name="password"]', 'Test@1234');
  await profPage.select('[name="role"]', 'profissional');
  await profPage.fill('[name="crm"]', '123456/SP');
  await profPage.click('[data-testid="btn-signup"]');
  
  const emailLink2 = await getTestEmailLink('prof@clinic.com');
  await profPage.goto(emailLink2);
  
  // === PROF: ACEITAR COMPARTILHAMENTO ===
  await profPage.goto(`/convites/${inviteToken}`);
  await profPage.click('[data-testid="btn-aceitar"]');
  
  // === PROF: VERIFICAR PACIENTE ===
  await profPage.goto('/profissional/dashboard');
  
  const patients = await profPage.locator('[data-testid="patient-card"]');
  expect(await patients.count()).toBeGreaterThan(0);
  
  // === PROF: ABRIR FICHA ===
  await patients.first().click();
  
  // Adicionar nota
  await profPage.fill('[data-testid="nota-textarea"]', 'Paciente com boa adesão');
  await profPage.click('[data-testid="btn-salvar-nota"]');
  
  // === PROF: EXPORTAR RELATÓRIO ===
  await profPage.click('[data-testid="btn-exportar"]');
  await profPage.selectOption('[data-testid="formato-exportacao"]', 'pdf');
  
  const [download] = await Promise.all([
    profPage.waitForEvent('download'),
    profPage.click('[data-testid="btn-download"]')
  ]);
  
  const pdfPath = await download.path();
  
  // === VALIDATE PDF ===
  const pdfText = await extractPDFText(pdfPath);
  
  // Deve conter dados
  expect(pdfText).toMatch(/Marina|Registro|Glicemia/i);
  
  // CRÍTICO: Não deve conter interpretação
  expect(pdfText).not.toMatch(/alto|baixo|normal|faixa segura/i);
  
  await paiContext.close();
  await profContext.close();
});
```

---

## 7. TESTES DE SEGURANÇA APROFUNDADOS

### 7.1 Injection Attacks

**SQL Injection:**

```javascript
test('SQL injection attempt blocked', async ({ request }) => {
  const response = await request.post('/api/registros', {
    data: {
      valor: "120' OR '1'='1",
      familia_id: "' DROP TABLE registros; --"
    }
  });
  
  expect(response.status()).toBe(400);
  
  // Verificar que tabela ainda existe
  const tableExists = await db.raw(`
    SELECT EXISTS(
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'registros'
    );
  `);
  expect(tableExists.rows[0].exists).toBe(true);
});
```

**XSS Prevention:**

```javascript
test('XSS attempt blocked', async ({ page }) => {
  const xssPayload = '<script>alert("xss")</script>';
  
  await page.goto('/familia/criar-crianca');
  await page.fill('[name="crianca_nome"]', xssPayload);
  await page.click('[data-testid="btn-criar"]');
  
  // Verificar que script não executou
  const alerts = await page.evaluate(() => window.alertCount || 0);
  expect(alerts).toBe(0);
  
  // Verificar que foi salvo como texto
  const childName = await page.locator('[data-testid="child-name"]').textContent();
  expect(childName).toBe(xssPayload); // Escaped
  expect(childName).not.toContain('<script>');
});
```

---

### 7.2 CSRF Protection

```javascript
test('CSRF token required for state-changing requests', async ({ request }) => {
  const response = await request.post('/api/registros', {
    data: { valor: 120 },
    headers: { 'csrf-token': 'invalid' }
  });
  
  expect(response.status()).toBe(403);
});
```

---

## 8. CHECKLIST FINAL (PRÉ-LAUNCH)

### Segurança
- [ ] RLS policies testadas (100% coverage)
- [ ] Não há SQL injection (validação + prepared statements)
- [ ] Não há XSS (Content-Security-Policy headers configurados)
- [ ] CSRF tokens em formulários
- [ ] Senhas hasheadas (bcrypt, 10+ rounds)
- [ ] Sessions expiram (30 min inatividade)
- [ ] Audit logs completos e imutáveis
- [ ] Dados sensíveis não aparecem em logs

### Funcionalidade
- [ ] Todas as features da Fase 1-6 funcionam
- [ ] Sem bugs críticos (P0/P1)
- [ ] Tratamento de erros adequado (status codes corretos)
- [ ] Loading states para operações longas
- [ ] Validação de input (client + server)
- [ ] Confirmação de ações destrutivas (DELETE, revoke)

### LGPD & Conformidade
- [ ] Consentimento granular obrigatório
- [ ] Direito ao esquecimento testado
- [ ] Dados de crianças protegidos (Art. 14)
- [ ] Auditoria de acesso logging
- [ ] Privacidade em PDFs (sem interpretação de glicemia)
- [ ] Política de privacidade atualizada
- [ ] Termos de serviço versionados

### Performance
- [ ] Dashboard < 2s load
- [ ] API < 200ms response (p95)
- [ ] Sem memory leaks (DevTools)
- [ ] Database queries < 100ms (indexed)
- [ ] Bundle size < 500KB (gzip)
- [ ] CDN configurado para assets estáticos

### Compatibilidade
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+
- [ ] iOS Safari (iPhone 12+)
- [ ] Android Chrome
- [ ] Mobile viewport 375px
- [ ] Tablet viewport 1024px

### Acessibilidade
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader (NVDA) testado
- [ ] Keyboard navigation funciona
- [ ] Contrast ratio >= 4.5:1
- [ ] Focus visível em todos elementos
- [ ] Alt text em imagens

### Documentação
- [ ] README com setup e deployment
- [ ] API docs (Swagger/OpenAPI)
- [ ] RLS policies documentadas
- [ ] Runbook de deployment
- [ ] Incident response plan
- [ ] Data dictionary (tabelas + fields)

### Comunicação
- [ ] Press release pronto
- [ ] Email aos users antigos (se aplicável)
- [ ] Chat support treinado
- [ ] FAQ pronto
- [ ] Community forum pronto

---

## 9. MÉTRICAS DE SUCESSO

| Métrica | Target | Aceitável | Crítico |
|---------|--------|-----------|---------|
| Test Coverage | > 90% | > 80% | < 50% = STOP |
| Security Score | A+ (OWASP) | A | < B = STOP |
| Performance (Lighthouse) | > 90 | > 80 | < 70 = STOP |
| Acessibilidade (axe) | 100% | > 95% | < 90% = STOP |
| Uptime (SLA) | 99.9% | 99.5% | < 99% = ALERT |
| Incident Response | < 1h | < 2h | > 4h = ESCALATE |
| RLS Violations | 0 | 0 | > 0 = ROLLBACK |
| Data Leaks | 0 | 0 | > 0 = ROLLBACK |

---

## 10. EXECUÇÃO DO PLANO

### Sprint 1-2: Fase 1 (Infra + RLS)
- Implementar RLS policies
- Testes de segurança (isolamento)
- Testes de autenticação

### Sprint 3-4: Fase 2 (Profissionais)
- Portal profissional
- Compartilhamento granular
- Permissões

### Sprint 5-6: Fase 3 (Multi-Tenant)
- Grupos + educadores
- Instituições
- Multi-tenant isolation

### Sprint 7-8: Fase 4-5 (Consentimento + Convites)
- Consentimento LGPD
- Convites por email + QR
- Direito ao esquecimento

### Sprint 9-10: Fase 6 (Gamificação)
- Sistema de moedas
- Loja + inventário
- Avatar dinâmico

### Sprint 11: Testes Integrados + Performance
- Testes E2E (Playwright)
- Performance testing
- Testes cross-browser

### Sprint 12: Pré-Launch
- Todas as checklists completas
- Documentação finalizada
- Soft launch (beta)

---

## 11. RESPONSABILIDADES

| Função | Tarefas |
|--------|---------|
| QA Lead | Coordena plano, prioritiza testes, aprova release |
| QA Engineers | Implementam testes, reportam bugs |
| Developers | Implementam fixes, suportam QA |
| Product | Valida stories, define critério de aceitação |
| DevOps | Configura CI/CD, ambientes de teste |
| Security | Realiza security review, penetration testing |

---

## 12. FERRAMENTAS

| Ferramenta | Uso |
|-----------|-----|
| Playwright | E2E, automação de browser |
| Jest | Unit tests |
| Vitest | Unit tests (alternativa) |
| axe-core | Acessibilidade |
| Lighthouse | Performance |
| OWASP ZAP | Security scanning |
| PostgreSQL | Query analysis (EXPLAIN) |
| Supabase | RLS testing, database queries |
| GitHub Actions | CI/CD |
| Sentry | Error tracking |

---

**Próximas Etapas:**
1. Revisar plano com time
2. Ajustar timelines por sprint
3. Criar tickets de teste no backlog
4. Configurar CI/CD com testes automáticos
5. Treinar QA engineers no plano

---

**Documento Final:** Este plano é o "master document" de QA para implementação das Fases 1-6 do Gamellito.

Manutenção: Atualizar conforme features são implementadas. Última revisão: 2026-06-24.
