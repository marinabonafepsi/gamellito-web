# Especificação Técnica - Arquitetura Multi-Portal Gamellito

**Status:** Rascunho Técnico  
**Data:** 2026-06-24  
**Versão:** 1.0

---

## Documentos Inclusos

Esta pasta contém a especificação técnica completa para a implementação da arquitetura multi-portal do Gamellito.

### 1. [ESPECIFICACAO-TECNICA-ERD.md](./ESPECIFICACAO-TECNICA-ERD.md)
**Entity Relationship Diagram Detalhado**

Contém:
- ✅ Descrição de todas as 10 tabelas novas (profissionais, instituicoes, permissoes, grupos, consentimento_granular, convites, loja_items, inventario_usuario, grupos_membros)
- ✅ Alterações em tabelas existentes (auth.users)
- ✅ Relacionamentos entre tabelas com tipos de FK
- ✅ Índices recomendados por performance
- ✅ Constraints (UNIQUE, CHECK) com SQL
- ✅ Diagrama Mermaid para visualização
- ✅ Sequência recomendada de migração
- ✅ Notas de implementação e dados de teste

**Para:** Arquiteto, DBA, Desenvolvedor Backend

---

### 2. [ESPECIFICACAO-RLS-POLICIES.sql](./ESPECIFICACAO-RLS-POLICIES.sql)
**Row Level Security (RLS) - Políticas de Segurança**

Contém:
- ✅ Políticas RLS completas para cada tabela
- ✅ Controle por role (admin, familia, profissional, educador, instituicao)
- ✅ Operações: SELECT, INSERT, UPDATE, DELETE
- ✅ Implementação de compartilhamento granular
- ✅ Verificação de permissões e consentimentos
- ✅ Funções helper para auditoria
- ✅ Job de limpeza de permissões expiradas
- ✅ Notas sobre cache, performance e auditoria

**Para:** DBA, Desenvolvedor Backend, Security Engineer

---

### 3. [ESPECIFICACAO-APIS.md](./ESPECIFICACAO-APIS.md)
**REST API - Endpoints Detalhados**

Contém:
- ✅ Base URL e rate limiting
- ✅ Autenticação JWT (signup, login, refresh)
- ✅ APIs de Família (compartilhamento, criança)
- ✅ APIs de Profissional (dashboard, pacientes, notas)
- ✅ APIs de Educador (grupos, relatórios)
- ✅ APIs de Instituição (dashboard administrativo)
- ✅ APIs de Permissões (compartilhamentos)
- ✅ APIs de Convites (aceitação com e sem conta)
- ✅ APIs de Loja (itens, inventário, compras)
- ✅ Request/Response completos com exemplos
- ✅ Status codes e tratamento de erros
- ✅ cURL examples
- ✅ Fluxos de negócio

**Para:** Desenvolvedor Frontend, Desenvolvedor Backend, QA

---

## Quick Start por Perfil

### 👨‍💼 Tech Lead / Arquiteto
1. Leia "Visão Geral" de cada documento
2. Estude ESPECIFICACAO-TECNICA-ERD.md (Diagrama Mermaid)
3. Revise sequência de migração
4. Valide índices e constraints

### 👨‍💻 Desenvolvedor Backend
1. ESPECIFICACAO-TECNICA-ERD.md → estrutura e índices
2. ESPECIFICACAO-RLS-POLICIES.sql → implementar policies
3. ESPECIFICACAO-APIS.md → endpoints e handlers
4. Seguir sequência de migração

### 👨‍💻 Desenvolvedor Frontend
1. ESPECIFICACAO-APIS.md → endpoints e formatos
2. Seções de Request/Response para cada role
3. Status codes e tratamento de erros
4. Fluxos de negócio (compartilhamento, convites)

### 🔒 Security Engineer
1. ESPECIFICACAO-RLS-POLICIES.sql → revisão completa
2. Verificar matriz de permissões por role
3. Validar consentimento granular
4. Revisar auditoria (ip_origem, user_agent)

### 📊 Product Manager
1. ESPECIFICACAO-APIS.md → fluxos de negócio
2. Revisar endpoints de dashboard por role
3. Funcionalidades de gamificação (loja)
4. Relatórios para instituição

### 🧪 QA / Tester
1. ESPECIFICACAO-APIS.md → casos de teste
2. ESPECIFICACAO-TECNICA-ERD.md → validação de dados
3. Testar cada policy RLS com roles diferentes
4. Testar transições de estado (expiração, revogação)

---

## Estrutura de Roles

| Role | Descrição | Acesso Padrão |
|------|-----------|---------------|
| **admin** | Administrador global | Tudo |
| **familia** | Responsável/Pais | Próprios dados + compartilhamento |
| **profissional** | Médico/Nutricionista | Dados compartilhados por família |
| **educador** | Professor/Educador | Dados do grupo + relatórios |
| **instituicao** | Admin da escola/clínica | Dashboard administrativo |

---

## Tabelas Principais (10 novas)

```
auth.users                  (existente, alterada)
├── profissionais           (nova)
├── instituicoes            (nova)
├── permissoes              (nova)
├── grupos                  (nova)
├── grupos_membros          (nova)
├── consentimento_granular  (nova)
├── convites                (nova)
├── loja_items              (nova)
└── inventario_usuario      (nova)
```

---

## Fluxos Principais

### 1. Compartilhamento de Dados
```
Familia → POST /compartilhar
  ├─ Cria permissao
  ├─ Cria convite (email)
  └─ Cria consentimento_granular

Profissional → Aceita convite
  ├─ Ativa permissao
  ├─ Pode ver registros
  └─ Pode adicionar comentários/notas
```

### 2. Multi-Tenant
```
Usuario → tenant_id (instituicao_id)
  ├─ Segregação de dados
  ├─ Isolamento de grupos
  └─ Dashboard específico por tenant
```

### 3. Gamificação
```
Usuario → Faz registros
  ├─ Ganha moedas
  ├─ Compra items na loja
  └─ Adiciona ao inventário
```

---

## Checklist de Implementação

### Fase 1 - Infraestrutura (Semana 1-2)
- [ ] Criar migrations para tabelas novas
- [ ] Adicionar índices recomendados
- [ ] Implementar constraints
- [ ] Setup de audit_log

### Fase 2 - RLS Policies (Semana 2-3)
- [ ] Implementar todas as policies RLS
- [ ] Testar policies por role
- [ ] Setup de cache de permissões
- [ ] Implementar cleanup de expirados

### Fase 3 - APIs de Autenticação (Semana 1-2)
- [ ] POST /auth/signup
- [ ] POST /auth/login
- [ ] POST /auth/refresh
- [ ] POST /auth/logout

### Fase 4 - APIs de Família (Semana 3-4)
- [ ] GET /familia/dashboard
- [ ] POST /familia/crianca
- [ ] GET /familia/crianca/{id}/registros
- [ ] POST /familia/crianca/{id}/compartilhar
- [ ] GET /familia/compartilhamentos
- [ ] DELETE /familia/compartilhamentos/{id}

### Fase 5 - APIs de Profissional (Semana 4-5)
- [ ] GET /profissional/dashboard
- [ ] GET /profissional/paciente/{id}
- [ ] POST /profissional/paciente/{id}/notas
- [ ] POST /profissional/paciente/{id}/registros/{id}/comentario

### Fase 6 - APIs de Educador (Semana 5-6)
- [ ] GET /educador/dashboard
- [ ] GET /educador/grupo/{id}
- [ ] GET /educador/grupo/{id}/relatorios

### Fase 7 - APIs de Instituição (Semana 6-7)
- [ ] GET /instituicao/dashboard
- [ ] POST /instituicao/grupos
- [ ] GET /instituicao/relatorios/grupo/{id}
- [ ] POST /instituicao/relatorios/exportar

### Fase 8 - APIs de Permissões e Convites (Semana 7-8)
- [ ] GET /permissoes
- [ ] DELETE /permissoes/{id}
- [ ] GET /convites/pendentes
- [ ] POST /convites/{id}/aceitar
- [ ] POST /convites/{token}/aceitar-anonimo

### Fase 9 - APIs de Loja (Semana 8-9)
- [ ] GET /loja/items
- [ ] GET /loja/inventario
- [ ] POST /loja/comprar
- [ ] POST /loja/inventario/{id}/ativar

### Fase 10 - Testing & QA (Semana 9-10)
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes RLS/segurança
- [ ] Load testing
- [ ] UAT com stakeholders

---

## Padrões Técnicos

### Banco de Dados
- **Engine:** PostgreSQL 14+
- **Auth:** Supabase (PostgREST)
- **RLS:** Row Level Security habilitado
- **Soft Delete:** deleted_at, revogada_em

### Backend
- **Framework:** Node.js + Express ou similar
- **ORM:** Prisma ou TypeORM
- **Auth:** JWT (HS256 ou RS256)
- **Cache:** Redis (permissões)
- **Logs:** Structured JSON

### Frontend
- **Framework:** React 18+
- **State:** React Query ou SWR
- **UI:** Componentes próprios ou Shadcn/UI
- **Segurança:** Token na localStorage/sessionStorage

### DevOps
- **CI/CD:** GitHub Actions ou similar
- **Infra:** Docker + Kubernetes ou Cloud Run
- **Database:** PostgreSQL (RDS/Cloud SQL)
- **Storage:** Cloud Storage (imagens, documentos)

---

## Considerações Importantes

### ⚠️ Segurança
- **LGPD Compliance:** Registrar ip_origem e user_agent em consentimentos
- **RLS Obrigatória:** Nunca confiar em filtragem de aplicação
- **Audit Log:** Manter histórico por 2 anos
- **Permissões Granulares:** Sempre verificar consentimento_granular

### 🚀 Performance
- **Cache Permissões:** TTL 5 minutos em Redis
- **Índices:** Usar índices compostos conforme recomendado
- **Paginação:** Sempre usar limit/offset
- **Lazy Loading:** Não carregar todo inventário/histórico

### 🔄 Fluxos
- **Compartilhamento:** Sempre cria convite + permissao + consentimento
- **Expiração:** Job diário para marcar como expirado
- **Revogação:** Soft delete (revogada_em, não deletar)
- **Cascata:** DELETE em usuário → soft delete permissões

### 📱 UX
- **Onboarding:** Clear path para cada role
- **Dashboard:** Contextualizado por role
- **Compartilhamento:** UI clara com QR code + link
- **Permissões:** Fácil revogar/estender

---

## Próximos Passos

1. **Code Review:** Revisar com time de arquitetura
2. **Migração:** Criar migrations em order numérica
3. **Testes:** Escrever testes antes do código
4. **Documentação:** Atualizar com descobertas
5. **Prototipagem:** MVP com core features
6. **Feedback:** Iteração com stakeholders

---

## Contato & Suporte

Para dúvidas sobre a especificação:
- Consulte os documentos em ordem: ERD → RLS → APIs
- Revise exemplos e casos de teste
- Valide com arquitetura antes de implementar

---

**Última Atualização:** 2026-06-24  
**Documentação Técnica v1.0**
