# 📐 REORGANIZAÇÃO DE ESTRUTURA

**Objetivo:** Aplicar a arquitetura multi-persona no projeto dela, reutilizando o design pronto.

---

## 🔄 COMPARAÇÃO: ATUAL vs PROPOSTA

### ESTRUTURA ATUAL (gamellito-web-novo)
```
app/
├─ diario/              ← Portal único (público + privado)
│  ├─ login/
│  ├─ lancar/
│  ├─ grafico/
│  ├─ historico/
│  ├─ moedas/
│  ├─ conta/
│  └─ consentimento/
├─ auth/
├─ api/
│  ├─ registros/
│  ├─ humor/
│  ├─ perfil/
│  └─ ...
└─ (home, contato, loja, etc)

src/components/
├─ diario/              ← Tudo misturado
├─ ui/                  ← shadcn/ui
├─ ds/                  ← Design System (GamButton, GamCard)
└─ (layout, sections, etc)
```

**Problema:** Tudo em um único fluxo. Sem diferenciação de roles (pai, profissional, instituição).

---

### ESTRUTURA PROPOSTA (Arquitetura Multi-Persona)
```
app/
├─ (marketing)/         ← Landing + Público
│  ├─ page.tsx          (Home)
│  ├─ sobre/
│  ├─ contato/
│  ├─ para-familias/
│  ├─ para-profissionais/
│  ├─ para-instituicoes/
│  └─ layout.tsx        (Header + Footer público)
│
├─ auth/                ← Autenticação + Role Selection
│  ├─ select-role/      (NEW: Escolher perfil)
│  ├─ signup/[role]/    (NEW: Signup por role)
│  ├─ login/            (Reutiliza componente dela)
│  ├─ callback/
│  └─ layout.tsx
│
├─ (portals)/           ← Portais autenticados
│  ├─ familia/          ← Portal Pai/Responsável
│  │  ├─ dashboard/     (NEW: Dashboard familiar)
│  │  ├─ crianca/[id]/
│  │  │  ├─ registros/  (Reutiliza: diario/lancar)
│  │  │  ├─ grafico/    (Reutiliza: diario/grafico)
│  │  │  ├─ compartilhar/ (NEW: Compartilhamento)
│  │  │  └─ moedas/     (Reutiliza: diario/moedas)
│  │  ├─ consentimento/ (Reutiliza: diario/consentimento)
│  │  ├─ conta/         (Reutiliza: diario/conta)
│  │  └─ layout.tsx     (Navbar + protecção familia)
│  │
│  ├─ profissional/     ← Portal Médico/Profissional (NEW)
│  │  ├─ dashboard/     (NEW: Meus pacientes)
│  │  ├─ paciente/[id]/
│  │  │  ├─ ficha/      (NEW: Histórico paciente)
│  │  │  ├─ notas/      (NEW: Notas clínicas)
│  │  │  └─ relatorio/  (NEW: Exportar PDF)
│  │  ├─ relatorios/    (NEW: Gerenciar relatórios)
│  │  ├─ convites/      (NEW: Convites pendentes)
│  │  └─ layout.tsx
│  │
│  ├─ educador/         ← Portal Educador (NEW)
│  │  ├─ dashboard/     (NEW: Grupos + Recursos)
│  │  ├─ recursos/      (NEW: Biblioteca educação)
│  │  ├─ grupos/        (NEW: Gerenciar grupos)
│  │  └─ layout.tsx
│  │
│  ├─ instituicao/      ← Portal Instituição (NEW)
│  │  ├─ dashboard/     (NEW: Gestão geral)
│  │  ├─ grupos/        (NEW: Crianças + Grupos)
│  │  ├─ equipe/        (NEW: Profissionais + Educadores)
│  │  ├─ relatorios/    (NEW: Agregados)
│  │  └─ layout.tsx
│  │
│  ├─ admin/            ← Portal Admin (NEW)
│  │  ├─ dashboard/     (NEW: Métricas)
│  │  ├─ usuarios/      (NEW: Support)
│  │  └─ layout.tsx
│  │
│  └─ layout.tsx        (Wrapper geral)
│
├─ loja/                ← Loja (Pública + Autenticada)
│  ├─ page.tsx          (Catálogo)
│  ├─ carrinho/         (NEW: Carrinho com moedas)
│  └─ layout.tsx
│
├─ jogos/               ← Jogos
│  └─ (reutiliza games/)
│
└─ api/
   ├─ auth/
   ├─ registros/        (Reutiliza: app/api/registros)
   ├─ humor/            (Reutiliza: app/api/humor)
   ├─ perfil/           (Reutiliza: app/api/perfil)
   ├─ permissoes/       (NEW: Gerenciar compartilhamento)
   ├─ loja/             (NEW: Compras com moedas)
   ├─ notas-clinicas/   (NEW: Notas profissional)
   ├─ relatorios/       (NEW: Gerar PDFs)
   └─ convites/         (NEW: Gerenciar convites)

src/components/
├─ ds/                  (REUTILIZA: GamButton, GamCard, GamBadge)
├─ ui/                  (REUTILIZA: shadcn/ui)
├─ layout/              (REUTILIZA: Header, Footer, Navbar)
├─ diario/              (REUTILIZA: GraficoGlicemia, EditarRegistroModal)
├─ portals/             (NEW: Componentes por portal)
│  ├─ familia/          (NEW: DashboardFamilia, RegistroCard)
│  ├─ profissional/     (NEW: PacienteCard, NotasClinicas)
│  ├─ educador/         (NEW: GrupoCard, RecursoCard)
│  └─ instituicao/      (NEW: GestaoCard, RelatorioCard)
├─ shared/              (NEW: Componentes compartilhados entre portais)
│  ├─ PermissaoPanel/
│  ├─ CompartilhamentoQR/
│  └─ AlertasCard/
├─ home/                (REUTILIZA: Sections, Hero, etc)
├─ games/               (REUTILIZA: GameCard, GameContainer)
└─ icons.tsx            (REUTILIZA)

lib/
├─ supabase/            (REUTILIZA: client, server)
├─ analytics/           (REUTILIZA)
├─ auth-helpers.ts      (NEW: getRole(), getTenantId(), requireAuth())
└─ (existentes)

supabase/
├─ migrations/
│  ├─ 001_add_role_tenant.sql        (NEW)
│  ├─ 002_create_profissionais.sql   (NEW)
│  ├─ 003_create_permissoes.sql      (NEW)
│  ├─ 004_create_instituicoes.sql    (NEW)
│  ├─ 005_create_grupos.sql          (NEW)
│  ├─ 006_create_consentimento.sql   (NEW)
│  ├─ 007_create_loja.sql            (NEW)
│  ├─ 008_create_convites.sql        (NEW)
│  └─ 009_enable_rls.sql             (NEW)
├─ functions/           (NEW: RPC functions)
└─ seed.sql             (NEW: Data inicial)

middleware.ts           (NEW: Role-based routing)
```

---

## 🔄 MAPEAMENTO: REUTILIZAR vs NOVO

### ✅ REUTILIZAR (Já existe no design dela)
```
Componentes:
✓ GamButton, GamCard, GamBadge (ds/)
✓ shadcn/ui components (ui/)
✓ Header, Footer, Navbar (layout/)
✓ GraficoGlicemia, EditarRegistroModal (diario/)
✓ GameCard, GameContainer (games/)
✓ All SVG assets (/characters, /assets)

Pages:
✓ Home (/)
✓ Loja (/loja)
✓ Jogos (/jogos)
✓ Sobre, Contato
✓ Diário/Login, Lancar, Grafico, Historico
✓ Consentimento, Conta/Perfil

APIs:
✓ /api/registros
✓ /api/humor
✓ /api/perfil
✓ /api/auth/callback
✓ /api/auth/magic-link
```

### 🆕 NOVO (Criar seguindo arquitetura)
```
Pages:
🆕 /auth/select-role (Escolher perfil)
🆕 /auth/signup/[role] (Signup por role)
🆕 /familia/dashboard (Home familia)
🆕 /familia/crianca/[id]/compartilhar (QR code)
🆕 /profissional/dashboard (Meus pacientes)
🆕 /profissional/paciente/[id] (Ficha paciente)
🆕 /educador/dashboard
🆕 /instituicao/dashboard
🆕 /admin/dashboard

Components:
🆕 /src/components/portals/* (Por portal)
🆕 /src/components/shared/* (Compartilhados)

APIs:
🆕 /api/permissoes
🆕 /api/loja/comprar
🆕 /api/notas-clinicas
🆕 /api/relatorios/gerar
🆕 /api/convites

Migrations:
🆕 9 arquivos SQL (schema + RLS)

Auth/Middleware:
🆕 middleware.ts (validar role + redirect)
🆕 lib/auth-helpers.ts (session functions)
```

---

## 📋 STEPS DE REORGANIZAÇÃO

### Fase 1: Backup + Setup
```
1. ✅ Já tem: clone do repo (gamellito-web-novo)
2. ✅ Criar nova branch: feature/multi-persona-architecture
3. ✅ Manter estrutura atual INTACTA (não deletar nada)
```

### Fase 2: Criar Nova Estrutura (Sem mexer em código frontend)
```
4. Criar pastas:
   - app/(marketing)/
   - app/auth/select-role/
   - app/(portals)/familia/
   - app/(portals)/profissional/
   - app/(portals)/educador/
   - app/(portals)/instituicao/
   - app/(portals)/admin/
   - src/components/portals/
   - src/components/shared/

5. Mover rotas existentes:
   - app/diario/ → app/(portals)/familia/
   - Renomear se necessário para context

6. Criar stubs para novas rotas:
   - /auth/select-role/ (layout + form)
   - /auth/signup/[role]/ (layout + form)
   - /profissional/dashboard/ (stub)
   - etc...
```

### Fase 3: Database + APIs
```
7. Executar 9 migrations SQL no Supabase
8. Criar 5 novas APIs (/api/permissoes, /api/loja/comprar, etc)
9. Implementar RLS policies
```

### Fase 4: Auth + Middleware
```
10. Criar middleware.ts (role-based routing)
11. Criar lib/auth-helpers.ts (getRole, getTenantId, requireAuth)
12. Update auth flow para incluir select-role
```

### Fase 5: Componentes (SEM DESIGN NOVO)
```
13. Usar componentes DE DESIGN DELA (GamButton, GamCard)
14. Criar wrappers/containers em src/components/portals/
15. Reutilizar diario/* para familia/*
```

### Fase 6: Testes + Deploy
```
16. Testes E2E (Playwright)
17. Deploy em staging
18. Você aprova design/UX com Claude Design se necessário
```

---

## 🎯 RESULTADO FINAL

```
✅ Landing page + Home (marketing)
✅ Auth com role selection (novo)
✅ Portal Família (reutiliza diario)
✅ Portal Profissional (novo + funcional)
✅ Portal Educador (novo + funcional)
✅ Portal Instituição (novo + funcional)
✅ Portal Admin (novo + funcional)
✅ Loja (novo + integrado)
✅ Jogos (reutiliza)
✅ Multi-tenant (Supabase RLS)
✅ Compartilhamento de dados (novo)
✅ Design DELA (reutiliza tudo)
✅ Segurança LGPD (novo)
```

---

## 📞 PRÓXIMO PASSO

Você quer que eu:

**A)** Comece a reorganizar a ESTRUTURA (sem mexer em frontend)?

**B)** Mostra mais detalhes de como cada componente fica?

**C)** Já cria a nova branch com tudo estruturado?

👇
