# Roadmap Sprint-by-Sprint: Gamellito Multi-Portal

## Contexto

- **6 fases** em ~16 semanas
- **Sprints de 1 semana** cada (40 horas de trabalho)
- **1 sprint = 1 dev** (ou pode paralelizar com múltiplos devs)
- Cada fase é um incremento funcional completo

## Timeline de Alto Nível

```
FASE 1 (Fundação):     Semanas 1-3   → Pronto para auth multi-role
FASE 2 (Família):      Semanas 4-6   → Pais conseguem compartilhar
FASE 3 (Profissional): Semanas 7-9   → Profissional vê pacientes
FASE 4 (Educador):     Semanas 10-11 → Educador acessa recursos
FASE 5 (Instituição):  Semanas 12-14 → Instituição gerencia grupos
FASE 6 (Admin):        Semanas 15-16 → Painel admin + Go-live
```

---

# FASE 1: FUNDAÇÃO (Semanas 1-3)

## Sprint 1.1: Schema Supabase (Semana 1)

**Objetivo:** Criar todas as tabelas novas e migrations

**Tarefas:**

- [ ] Criar migration: `001_add_role_tenant_to_users.sql` (ALTER auth.users)
- [ ] Criar migration: `002_create_profissionais_table.sql`
- [ ] Criar migration: `003_create_instituicoes_table.sql`
- [ ] Criar migration: `004_create_permissoes_table.sql`
- [ ] Criar migration: `005_create_grupos_tables.sql`
- [ ] Criar migration: `006_create_consentimento_granular.sql`
- [ ] Criar migration: `007_create_loja_tables.sql`
- [ ] Criar migration: `008_create_convites_table.sql`
- [ ] Testar migrations em staging
- [ ] Criar script de rollback para cada migration

**Dependências:** Nenhuma  
**Responsável:** Backend Lead  
**Estimativa:** 40h  
**Entregáveis:** 8 migrations + script rollback

---

## Sprint 1.2: RLS Policies (Semana 1-2)

**Objetivo:** Implementar 40+ políticas de segurança Row-Level Security

**Tarefas:**

- [ ] RLS para `auth.users` (admin vs família vs outros)
- [ ] RLS para `registros` (família vê próprios + profissional se tem permissão)
- [ ] RLS para `user_profiles` (cada um vê seu próprio)
- [ ] RLS para `permissoes` (dono + receptor)
- [ ] RLS para `profissionais` (público lê; paciente lê completo)
- [ ] RLS para `instituicoes` (multi-tenant)
- [ ] RLS para `grupos` + `grupos_membros`
- [ ] RLS para `consentimento_granular`
- [ ] RLS para `loja_items` (público) + `inventario_usuario` (próprio)
- [ ] RLS para `convites` (remetente + destinatário)
- [ ] Testes de RLS (tentar acessar dados de outro usuário = erro)

**Dependências:** Sprint 1.1  
**Responsável:** Backend Lead + Security Review  
**Estimativa:** 40h  
**Entregáveis:** 40+ policies testadas + test cases

---

## Sprint 1.3: Auth Gateway + Middleware (Semana 2)

**Objetivo:** `/auth/select-role` e middleware de role validation

**Tarefas:**

- [ ] Atualizar schema de `auth.users` (role + tenant_id)
- [ ] Criar `/auth/select-role` page (UI: 3-4 opções de role)
- [ ] Criar `/auth/signup/[role]` routes (formulário diferenciado por role)
- [ ] Implementar callback handler que detecta role + insere em `user_profiles`
- [ ] Criar middleware que valida role + redireciona para portal correto
- [ ] Atualizar session helpers (`getRole()`, `getTenantId()`, `requireAuth()`)
- [ ] Testes E2E: SignUp como pai → vai para `/familia/dashboard`
- [ ] Testes E2E: SignUp como prof → vai para `/profissional/dashboard`

**Dependências:** Sprint 1.1  
**Responsável:** Full-stack  
**Estimativa:** 40h  
**Entregáveis:** Auth flow pronto; usuário vê portal correto após login

---

## Sprint 1.4: Layout Base por Portal (Semana 3)

**Objetivo:** Navbar + layouts templates para cada portal

**Tarefas:**

- [ ] Criar component `<NavbarFamilia />` (logo, links, avatar, moedas)
- [ ] Criar component `<NavbarProfissional />` (logo, links, especialidade, badge)
- [ ] Criar component `<NavbarEducador />`
- [ ] Criar component `<NavbarInstituicao />`
- [ ] Criar component `<NavbarAdmin />`
- [ ] Criar layout wrapper para `/familia/*` routes
- [ ] Criar layout wrapper para `/profissional/*` routes
- [ ] Criar layout wrapper para `/educador/*` routes
- [ ] Criar layout wrapper para `/instituicao/*` routes
- [ ] Criar layout wrapper para `/admin/*` routes
- [ ] Testes: Navbar muda conforme role
- [ ] Testes: Links mostram apenas rotas do portal

**Dependências:** Sprint 1.3  
**Responsável:** Frontend Lead  
**Estimativa:** 40h  
**Entregáveis:** 5 portais com layouts base

---

## Sprint 1.5: Testes de Segurança (Semana 3)

**Objetivo:** QA/Penetration testing da Fase 1

**Tarefas:**

- [ ] Testar RLS: Pai não consegue ver dados de outro pai
- [ ] Testar RLS: Profissional sem permissão não vê pacientes
- [ ] Testar RLS: Instituição só vê seu tenant
- [ ] Testar role validation: usuário família não acessa `/profissional/*`
- [ ] Testar session persistence (login → logout → login)
- [ ] Testar consentimento (checkbox granular funciona)
- [ ] Testar direito ao esquecimento (deletar conta → tudo apagado)
- [ ] Load test: 1000 usuários simultâneos em `/login`
- [ ] Documentar vulnerabilidades encontradas

**Dependências:** Sprints 1.1-1.4  
**Responsável:** QA Lead  
**Estimativa:** 40h  
**Entregáveis:** Security audit report + issues priorizadas

---

### FIM FASE 1 ✅
**Status:** Pronto para auth multi-role; todos os portais têm layouts base

---

# FASE 2: PORTAL FAMÍLIA (Semanas 4-6)

## Sprint 2.1: Dashboard + Timeline (Semana 4)

**Objetivo:** `/familia/dashboard` e `/familia/crianca/[id]/registros`

**Tarefas:**

- [ ] Criar page `/familia/dashboard` (lista de crianças, últimos registros)
- [ ] Criar component `<CriancaCard />` (nome, avatar, idade, últimas 3 entradas)
- [ ] Criar page `/familia/crianca/[id]/registros` (timeline scrollável)
- [ ] Integrar Recharts para mostrar últimos 7 dias (sem interpretar valores)
- [ ] Criar button "Registrar nova glicemia"
- [ ] Criar modal `<RegistroModal />` para lançar entrada (valor + rótulo + observação)
- [ ] API: `GET /api/familia/dashboard`
- [ ] API: `GET /api/familia/crianca/[id]/registros`
- [ ] API: `POST /api/registros` (com RLS validation)
- [ ] Testes: Pai consegue registrar glicemia da criança
- [ ] Testes: Timeline carrega sem lag (500 registros)

**Dependências:** Sprint 1.3  
**Responsável:** Full-stack  
**Estimativa:** 40h  
**Entregáveis:** Dashboard + Timeline pronto; consegue registrar glicemia

---

## Sprint 2.2: Gráfico Interativo (Semana 4)

**Objetivo:** `/familia/crianca/[id]/grafico`

**Tarefas:**

- [ ] Criar page `/familia/crianca/[id]/grafico`
- [ ] Implementar gráfico com Recharts (LineChart ou AreaChart)
- [ ] Mostrar últimos 30 dias (ou período customizável)
- [ ] **REGRA #1:** Nunca mostrar faixas "Normal/Alto/Baixo"
- [ ] **REGRA #1:** Celebração é "Eba, registrou!" NOT "Eba, valor ótimo!"
- [ ] Filtros: 7 dias, 30 dias, 90 dias
- [ ] Tooltip com data + valor (sem interpretação)
- [ ] Exportar como imagem (PNG)
- [ ] Testes: Gráfico renderiza em < 1s
- [ ] Testes: Não há linguagem de interpretação (buscar "alto/baixo/normal")

**Dependências:** Sprint 2.1  
**Responsável:** Frontend  
**Estimativa:** 25h  
**Entregáveis:** Gráfico pronto; sem violação de Regra #1

---

## Sprint 2.3: Compartilhamento (Semana 5)

**Objetivo:** `/familia/crianca/[id]/compartilhar` com QR code + invite

**Tarefas:**

- [ ] Criar page `/familia/crianca/[id]/compartilhar`
- [ ] Gerar QR code (use `qrcode` npm package)
- [ ] Campo de email para convidar profissional
- [ ] API: `POST /api/convites` (gera token único + email)
- [ ] Tabela de permissões já concedidas (com botão revogar)
- [ ] RLS: Profissional só vê dados após aceitar convite
- [ ] Email de invite: "Marina compartilhou seus dados com você"
- [ ] Link de aceitação: `/convites/[token]`
- [ ] Testes: Profissional sem convite não vê dados
- [ ] Testes: Profissional com convite vê dados
- [ ] Testes: Revogar permissão funciona imediatamente

**Dependências:** Sprint 2.1, Sprint 1.1 (permissoes table)  
**Responsável:** Full-stack  
**Estimativa:** 40h  
**Entregáveis:** Compartilhamento pronto; profissional consegue receber acesso

---

## Sprint 2.4: Loja + Gamificação (Semana 5-6)

**Objetivo:** Integrar loja com moedas (resgate funcional)

**Tarefas:**

- [ ] Popular `loja_items` (5-10 items: avatar skins, badges, poderes)
- [ ] Criar page `/loja/itens` (grid de items + preço em moedas)
- [ ] Mostrar saldo de moedas no topo
- [ ] Implementar compra: `POST /api/loja/comprar`
- [ ] Validar saldo (< moedas = erro)
- [ ] Adicionar a `inventario_usuario`
- [ ] Decrementar coins em `user_profiles` (RPC atômico)
- [ ] Animação de "Parabéns! Você comprou..."
- [ ] Testes: Criança não consegue comprar com moedas insuficientes
- [ ] Testes: Compra decrementa saldo corretamente
- [ ] Testes: Avatares adquiridos aparecem no perfil

**Dependências:** Sprint 1.1, Sprint 2.1 (moedas existem)  
**Responsável:** Full-stack  
**Estimativa:** 40h  
**Entregáveis:** Loja funcional; gamificação completa (ganhar + gastar)

---

## Sprint 2.5: E2E Tests (Semana 6)

**Objetivo:** Testes end-to-end com Playwright

**Tarefas:**

- [ ] Criar teste: Signup como pai → Registrar glicemia → Ver moeda ganha
- [ ] Criar teste: Registrar → Ver no gráfico
- [ ] Criar teste: Compartilhar com profissional → Profissional vê dados
- [ ] Criar teste: Revogar acesso → Profissional não vê mais dados
- [ ] Criar teste: Ganhar moedas → Comprar item → Item aparece no perfil
- [ ] Criar teste: Tentar acessar criança de outro pai = 403
- [ ] Coverage: > 80% de cobertura de features principais

**Dependências:** Sprints 2.1-2.4  
**Responsável:** QA Lead  
**Estimativa:** 40h  
**Entregáveis:** E2E suite pronta; CI/CD com testes verdes

---

### FIM FASE 2 ✅
**Status:** Pais conseguem registrar dados e compartilhar com profissional

---

# FASE 3: PORTAL PROFISSIONAL (Semanas 7-9)

## Sprint 3.1: Dashboard + Ficha de Paciente (Semana 7)

**Objetivo:** `/profissional/dashboard` e `/profissional/paciente/[id]`

**Tarefas:**

- [ ] Criar page `/profissional/dashboard` ("Meus pacientes")
- [ ] Listar pacientes que compartilharam dados (query `permissoes`)
- [ ] Card por paciente: nome + foto + último registro + status
- [ ] Criar page `/profissional/paciente/[id]` (ficha clínica)
- [ ] Mostrar últimos 20 registros em timeline
- [ ] Integrar gráfico de período customizável
- [ ] Campo "Notas clínicas" (textarea)
- [ ] API: `GET /api/profissional/dashboard`
- [ ] API: `GET /api/profissional/paciente/[id]`
- [ ] API: `POST /api/profissional/paciente/[id]/notas`
- [ ] RLS: Profissional só vê pacientes com permissão
- [ ] Testes: Médico vê apenas seus pacientes

**Dependências:** Sprint 2.3 (compartilhamento), Sprint 1.3 (auth)  
**Responsável:** Full-stack  
**Estimativa:** 40h  
**Entregáveis:** Dashboard pronto; profissional vê seus pacientes

---

## Sprint 3.2: Relatórios Exportáveis (Semana 8)

**Objetivo:** Gerar relatório PDF clinicamente útil

**Tarefas:**

- [ ] Criar page `/profissional/relatorios`
- [ ] Filtros: Paciente + período (últimos 7/30/90 dias)
- [ ] Implementar PDF export (use `pdfkit` ou `jsPDF`)
- [ ] Conteúdo do PDF:
  - [ ] Cabeçalho: Nome criança, data de geração, médico responsável
  - [ ] Resumo: Total registros, adesão, últimas entradas
  - [ ] Gráfico: 30 dias (sem interpretação)
  - [ ] Timeline: Todos os registros do período
  - [ ] Rodapé: Data, assinatura digital (opcional)
- [ ] Botão "Baixar PDF"
- [ ] Email option: "Enviar relatório por email"
- [ ] Testes: PDF gerado corretamente
- [ ] Testes: Sem violação de Regra #1 no PDF

**Dependências:** Sprint 3.1  
**Responsável:** Full-stack  
**Estimativa:** 30h  
**Entregáveis:** Relatórios exportáveis pronto

---

## Sprint 3.3: Convites + Alertas (Semana 8-9)

**Objetivo:** "Pedir acesso" + notificações de adesão

**Tarefas:**

- [ ] Página `/profissional/convites` (pendentes)
- [ ] Profissional pode procurar paciente por email
- [ ] Enviar "Pedir acesso" → Email para pai
- [ ] Pai aceita/rejeita via link
- [ ] Sistema de alertas (opcional): "Paciente não registrou há 3 dias"
- [ ] Notificações por email (configurável)
- [ ] Testes: Convite pendente aparece para profissional
- [ ] Testes: Pai recebe email + consegue rejeitar

**Dependências:** Sprint 3.1, Sprint 2.3  
**Responsável:** Backend  
**Estimativa:** 30h  
**Entregáveis:** Sistema de convites pronto

---

## Sprint 3.4: Recursos + Compartilhamento (Semana 9)

**Objetivo:** Profissional compartilha materiais educativos com paciente

**Tarefas:**

- [ ] Criar biblioteca de recursos (PDF, vídeos, artigos)
- [ ] Profissional pode marcar recurso para compartilhar com paciente
- [ ] Notificação ao paciente (email + in-app)
- [ ] Paciente acessa via `/familia/recursos-compartilhados`
- [ ] API: `GET /api/recursos-compartilhados`
- [ ] Testes: Recurso aparece para paciente após compartilhamento

**Dependências:** Sprint 3.1  
**Responsável:** Full-stack  
**Estimativa:** 25h  
**Entregáveis:** Recursos compartilháveis pronto

---

## Sprint 3.5: E2E Tests (Semana 9)

**Objetivo:** Testes de integração Família ↔ Profissional

**Tarefas:**

- [ ] Teste: Pai compartilha → Médico vê paciente
- [ ] Teste: Médico acessa ficha completa
- [ ] Teste: Médico registra nota → Nota persiste
- [ ] Teste: Médico gera relatório PDF → Arquivo válido
- [ ] Teste: Médico compartilha recurso → Pai vê recurso
- [ ] Coverage: > 80%

**Dependências:** Sprints 3.1-3.4  
**Responsável:** QA Lead  
**Estimativa:** 35h  
**Entregáveis:** E2E suite pronto

---

### FIM FASE 3 ✅
**Status:** Profissional consegue ver dados de pacientes + gerar relatórios

---

# FASE 4: PORTAL EDUCADOR (Semanas 10-11)

## Sprint 4.1: Dashboard + Grupos (Semana 10)

**Objetivo:** `/educador/dashboard` e gerenciar turmas

**Tarefas:**

- [ ] Criar page `/educador/dashboard` ("Meus grupos")
- [ ] Card por grupo: nome + quantidade de membros + progresso
- [ ] Criar page `/educador/grupos` (gestão de turmas)
- [ ] Botão "Nova turma" → Modal para criar
- [ ] Adicionar membros (crianças) à turma
- [ ] Relatório agregado: Registros do grupo (sem dados pessoais)
- [ ] API: `GET /api/educador/grupos`
- [ ] API: `POST /api/educador/grupos`

**Dependências:** Sprint 1.1 (grupos table), Sprint 1.3 (auth)  
**Responsável:** Full-stack  
**Estimativa:** 30h  
**Entregáveis:** Dashboard + grupos pronto

---

## Sprint 4.2: Biblioteca de Recursos (Semana 10-11)

**Objetivo:** `/educador/recursos` — Materiais educativos

**Tarefas:**

- [ ] Criar page `/educador/recursos` (grid de materiais)
- [ ] Tipos: PDFs, vídeos, artigos, templates
- [ ] Filtros: Por tema (DM1, nutrição, exercício, psicologia)
- [ ] Educador pode compartilhar com seu grupo
- [ ] Crianças/pais acessam via `/familia/recursos-educacao`
- [ ] API: `GET /api/educador/recursos`
- [ ] Testes: Recurso aparece para membros do grupo

**Dependências:** Sprint 4.1  
**Responsável:** Frontend + Backend  
**Estimativa:** 30h  
**Entregáveis:** Biblioteca funcional

---

## Sprint 4.3: Forum + Comunidade (Semana 11)

**Objetivo:** Dúvidas da comunidade

**Tarefas:**

- [ ] Criar page `/educador/forum` (dúvidas postadas)
- [ ] Educador pode responder dúvidas
- [ ] Threads de discussão (banco de dados: `forum_threads`, `forum_replies`)
- [ ] Moderação básica (delete/flag)
- [ ] Notificações quando responder

**Dependências:** Sprint 4.1  
**Responsável:** Backend  
**Estimativa:** 25h  
**Entregáveis:** Forum funcional

---

### FIM FASE 4 ✅
**Status:** Educadores acessam recursos e gerenciam comunidade

---

# FASE 5: PORTAL INSTITUIÇÃO (Semanas 12-14)

## Sprint 5.1: Dashboard Gestor (Semana 12)

**Objetivo:** `/instituicao/dashboard` — Gestão de escola/clínica

**Tarefas:**

- [ ] Criar page `/instituicao/dashboard`
- [ ] Métricas: Total crianças, adesão %, últimas ações
- [ ] Gráfico de adesão ao longo do tempo
- [ ] Tabela de grupos + membros
- [ ] API: `GET /api/instituicao/dashboard`
- [ ] API: `GET /api/instituicao/grupos`
- [ ] RLS: Gestor só vê seu tenant

**Dependências:** Sprint 1.1, Sprint 1.3  
**Responsável:** Full-stack  
**Estimativa:** 30h  
**Entregáveis:** Dashboard institucional pronto

---

## Sprint 5.2: Gestão de Equipe (Semana 13)

**Objetivo:** Convitar profissionais + educadores

**Tarefas:**

- [ ] Criar page `/instituicao/equipe`
- [ ] Adicionar profissionais (médicos, enfermeiros)
- [ ] Adicionar educadores (professores, agentes)
- [ ] Definir papéis (gestor, educador, profissional)
- [ ] Gerenciar permissões (quem vê o quê)
- [ ] Remover membro
- [ ] API: `POST /api/instituicao/equipe`
- [ ] Email de invite para profissional

**Dependências:** Sprint 5.1  
**Responsável:** Backend  
**Estimativa:** 30h  
**Entregáveis:** Gestão de equipe pronto

---

## Sprint 5.3: Relatórios Agregados (Semana 13-14)

**Objetivo:** Analisar adesão + performance

**Tarefas:**

- [ ] Criar page `/instituicao/relatorios`
- [ ] Filtros: Período, grupo, métrica
- [ ] Gráficos: Adesão ao longo tempo, registros por grupo, comparação
- [ ] Exportar como PDF
- [ ] Sem exposição de dados pessoais

**Dependências:** Sprint 5.1  
**Responsável:** Full-stack  
**Estimativa:** 30h  
**Entregáveis:** Relatórios institucionais pronto

---

## Sprint 5.4: Permissões Granulares (Semana 14)

**Objetivo:** Controle fino de quem acessa o quê

**Tarefas:**

- [ ] Criar página `/instituicao/permissoes`
- [ ] Definir: Profissional A vê grupo 1,2 mas não 3
- [ ] Educador B vê apenas grupo 1
- [ ] RLS atualizada para respeitar permissões por grupo
- [ ] Testes: Profissional não consegue acessar grupos não-permitidos

**Dependências:** Sprint 5.2  
**Responsável:** Backend  
**Estimativa:** 25h  
**Entregáveis:** Permissões granulares pronto

---

### FIM FASE 5 ✅
**Status:** Instituições gerenciam grupos + equipe com permissões

---

# FASE 6: ADMIN + LANÇAMENTO (Semanas 15-16)

## Sprint 6.1: Painel Admin (Semana 15)

**Objetivo:** `/admin/*` — Marina controla plataforma

**Tarefas:**

- [ ] Dashboard: Métricas globais (total users, novos por dia, adesão)
- [ ] Gestão de instituições (CRUD, verificação CNPJ)
- [ ] Gestão de profissionais (verificar CRM/COREN)
- [ ] Support: Buscar usuário + ver dados (com auditoria)
- [ ] Relatórios: BI básico (CSV export)
- [ ] Analytics: Charts de crescimento
- [ ] RLS: Apenas admin consegue acessar

**Dependências:** Sprint 1.1  
**Responsável:** Backend + Frontend  
**Estimativa:** 40h  
**Entregáveis:** Painel admin funcional

---

## Sprint 6.2: Testes de Segurança Final (Semana 15)

**Objetivo:** Penetration testing antes do go-live

**Tarefas:**

- [ ] SQL injection tests
- [ ] XSS tests
- [ ] CSRF tests
- [ ] RLS coverage (tentar burlar isolamento)
- [ ] Multi-tenant isolation (instituição A não vê B)
- [ ] Performance load test (10k concurrent users)
- [ ] LGPD compliance check (consentimento, direito ao esquecimento)
- [ ] Relatório final de vulnerabilidades

**Dependências:** Todas sprints anteriores  
**Responsável:** Security team  
**Estimativa:** 40h  
**Entregáveis:** Security audit report + remediation plan

---

## Sprint 6.3: Deploy + Go-Live (Semana 16)

**Objetivo:** Colocar em produção

**Tarefas:**

- [ ] Revisar migrations (backward compatibility)
- [ ] Deploy para staging (testes finais)
- [ ] Configurar DNS + SSL
- [ ] Configurar monitoring + alertas (Sentry, Datadog)
- [ ] Deploy para produção
- [ ] Comunicado ao mercado (press release)
- [ ] Email aos usuários antigos (invite para novo portal)
- [ ] Documentação de boas-vindas
- [ ] Suporte ativo (chat 24h)

**Dependências:** Sprint 6.2  
**Responsável:** DevOps + Marina  
**Estimativa:** 30h  
**Entregáveis:** Platform live ✅

---

### FIM FASE 6 ✅
**Status:** GO-LIVE; Gamellito operacional para todos os portais

---

# DEPENDÊNCIAS CRÍTICAS

```
Sprint 1.1 (Schema)
  ↓
Sprint 1.2 (RLS)
  ↓
Sprint 1.3 (Auth Gateway) + Sprint 1.4 (Layouts) [parallelizáveis]
  ↓
FASE 1 DONE ✅
  ↓
Sprint 2.1-2.2 (Dashboard) → Sprint 2.3 (Compartilhamento)
  ↓
Sprint 3.1 (Profissional dashboard) [depende de Sprint 2.3]
  ↓
Sprint 3.2-3.5 (Relatórios e features) [podem rodar em paralelo]
  ↓
FASE 2-3 DONE ✅
  ↓
Sprint 4.1-4.3 [podem rodar em paralelo com Fase 5]
Sprint 5.1-5.4 [podem rodar em paralelo com Fase 4]
  ↓
FASE 4-5 DONE ✅
  ↓
Sprint 6.1-6.2 [parallelizáveis]
  ↓
Sprint 6.3 (Deploy)
  ↓
GO-LIVE ✅
```

---

# PARALLELIZAÇÃO POSSÍVEL

## Com 1 dev (caminho crítico)
Seguir sequencialmente: Fase 1 → Fase 2 → Fase 3 → Fases 4-5 paralelo → Fase 6

## Com 2 devs
- **Dev 1:** Fase 1 → Fase 2 (Família)
- **Dev 2:** Fase 1 (em paralelo) → Fase 3 (Profissional) → Fase 4-5 em paralelo

## Com 3 devs
- **Dev 1:** Fase 1 → Fase 2 (Família)
- **Dev 2:** Fase 1 (em paralelo) → Fase 3 (Profissional)
- **Dev 3:** Fases 4-5 (em paralelo com Dev 2)

## Com 5+ devs
- Paralelizar Sprint 2.1-2.4 (todos diferentes sprints da Fase 2)
- Paralelizar Fases 3-5 (simultâneo)
- Sprint 1 não pode paralelizar muito (dependências em cascata)

---

# ESTIMATIVAS CONSOLIDADAS

| Fase | Horas | Semanas | Devs Recomendados |
|------|-------|---------|-------------------|
| 1    | 200h  | 3       | 1                 |
| 2    | 175h  | 3       | 1-2               |
| 3    | 160h  | 3       | 1-2               |
| 4    | 85h   | 2       | 1                 |
| 5    | 115h  | 3       | 1-2               |
| 6    | 110h  | 2       | 1-2               |
| **TOTAL** | **845h** | **16** | **1-2 dedicados** |

### Conversão em Dias Úteis
- 845h ÷ 8h/dia = 105 dias úteis
- Com 2 devs: 52-53 dias (10-11 semanas)
- Com 1 dev: 105 dias (21 semanas)

---

# RISCOS & MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Complexidade RLS cresce demais | Alta | Alto | Documentar cada policy; testes unitários antes de merge |
| LGPD compliance não passa auditoria | Média | **Crítico** | Legal review após Sprint 1.2; compliance checklist |
| Performance degrada com 1k usuários | Média | Alto | Load test em Sprint 2.5; índices no DB; cache strategy |
| Migração dados atual → novo schema | Baixa | Médio | Script de migração + rollback testado em staging |
| Scope creep (features além roadmap) | Alta | Médio | Define MVP por fase; "não-fazer" list |
| Descoberta tardia de conflitos multi-tenant | Média | Alto | Spike de 1 dia em Sprint 1.2 testando isolamento |

---

# CRITÉRIOS DE SUCESSO POR FASE

## FASE 1: Fundação
- ✅ Todos os usuários conseguem fazer login com role atribuído
- ✅ Redirecionamento automático para portal correto
- ✅ RLS testa 100%; usuário não consegue acessar dados alheios
- ✅ Security audit passa (0 vulnerabilidades críticas)

## FASE 2: Família
- ✅ Pai registra 10+ entradas de glicemia sem erro
- ✅ Profissional recebe convite + consegue acessar dados
- ✅ Gráfico renderiza < 500ms; Regra #1 não violada
- ✅ Moedas são ganhadas e gastas corretamente

## FASE 3: Profissional
- ✅ Médico vê apenas seus pacientes (RLS)
- ✅ PDF exportado contém 30 dias de dados + gráfico
- ✅ Médico consegue convidar paciente novo
- ✅ Notas clínicas persistem e são visíveis em próximos acessos

## FASE 4: Educador
- ✅ Educador cria turma + adiciona 5 alunos
- ✅ Recursos compartilhados aparecem para alunos em 5min
- ✅ Forum aceita e exibe posts

## FASE 5: Instituição
- ✅ Gestor vê dashboard com 3+ métricas
- ✅ Convite para profissional enviado; profissional consegue aceitar
- ✅ Relatório agregado não expõe dados pessoais

## FASE 6: Admin + Go-Live
- ✅ Marina consegue listar 100+ usuários; filtrar por role
- ✅ Security audit final: 0 vulnerabilidades críticas/altas
- ✅ Platform aguenta 10k concurrent users
- ✅ Usuários migrados do sistema antigo; dados íntegros
- ✅ Email automático enviado para usuários existentes

---

# CHECKLIST PRÉ-SPRINT

**Antes de iniciar cada sprint:**

- [ ] User stories detalhadas (Figma mockups se aplicável)
- [ ] Estimativas refinadas com time
- [ ] Dependências externas mapeadas (ex: aprovação LGPD)
- [ ] Testes definidos (unit + integration + E2E)
- [ ] Ambiente staging disponível
- [ ] Code review process definido
- [ ] Release notes preparadas

---

# CONTATOS E RESPONSÁVEIS

- **Produto/Sprint Planning:** Marina
- **Backend Lead:** [TBD]
- **Frontend Lead:** [TBD]
- **QA Lead:** [TBD]
- **Security Review:** [TBD]
- **DevOps/Deploy:** [TBD]

---

**Roadmap criado em:** 2026-06-24  
**Última atualização:** 2026-06-24  
**Status:** Pronto para planning de Sprint 1.1
