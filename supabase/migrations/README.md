# Supabase Migrations - Gamellito Multi-Portal

## 📋 Overview

Todas as migrations SQL para a arquitetura multi-portal do Gamellito.

**Total de migrations:** 8 (+ RLS policies depois)

## 🚀 Como Aplicar as Migrations

### Opção 1: Supabase Dashboard (Manual)
1. Abra [app.supabase.com](https://app.supabase.com)
2. Vá para `SQL Editor`
3. Copie o conteúdo de cada migration na ordem
4. Execute

### Opção 2: Supabase CLI (Automático)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref YOUR_PROJECT_ID

# Aplicar migrations
supabase migration up

# Ou empurrar para remoto
supabase push
```

### Opção 3: SQL em sequência (Recomendado)
```bash
# Executar na ordem:
psql postgresql://... < 001_add_role_tenant_to_users.sql
psql postgresql://... < 002_create_profissionais_table.sql
psql postgresql://... < 003_create_instituicoes_table.sql
psql postgresql://... < 004_create_permissoes_table.sql
psql postgresql://... < 005_create_grupos_tables.sql
psql postgresql://... < 006_create_consentimento_granular_table.sql
psql postgresql://... < 007_create_loja_tables.sql
psql postgresql://... < 008_create_convites_table.sql
```

## ✅ Checklist de Validação

- [ ] Todas as 8 migrations executadas sem erros
- [ ] Coluna `role` adicionada a `auth.users`
- [ ] Coluna `tenant_id` adicionada a `auth.users`
- [ ] Tabela `profissionais` criada com índices
- [ ] Tabela `instituicoes` criada com índices
- [ ] Tabela `permissoes` criada com UNIQUE constraint
- [ ] Tabelas `grupos` e `grupos_membros` criadas
- [ ] Tabela `consentimentos_granular` criada
- [ ] Tabelas `loja_items` e `inventario_usuario` criadas
- [ ] Tabela `convites` criada com token único

### Verificar no Supabase SQL:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Verificar colunas adicionadas a auth.users
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'auth';

-- Verificar índices
SELECT * FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;
```

## 📝 Notas Importantes

1. **RLS deve ser habilitado** DEPOIS das tabelas criarem (Sprint 1.2)
2. **Backups:** Sempre fazer backup antes de aplicar migrations em produção
3. **Rollback:** Se algo der errado, as migrations são **reversíveis** (DROP TABLE IF EXISTS)
4. **Ordem é crítica:** As migrations têm dependências (ex: permissoes referencia auth.users)

## 🔗 Relacionamentos Principais

```
auth.users (1) ──→ (N) profissionais (1:1 se role='profissional')
auth.users (1) ──→ (N) instituicoes (via tenant_id)
auth.users (1) ──→ (N) permissoes (como usuario_dono ou usuario_acesso)
auth.users (1) ──→ (N) grupos_membros
instituicoes (1) ──→ (N) grupos
grupos (1) ──→ (N) grupos_membros
loja_items (1) ──→ (N) inventario_usuario
```

## 🚨 Troubleshooting

### Erro: "Column already exists"
```sql
-- Verificar se coluna já existe:
SELECT EXISTS(SELECT 1 FROM information_schema.columns 
  WHERE table_name='users' AND column_name='role');
```
Se existir, a migration foi executada antes.

### Erro: "Foreign key constraint failed"
Certifique-se que todas as migrations anteriores foram executadas (especialmente a 001).

### Erro: "Unique constraint violation"
Cuidado ao re-executar migrations que criam índices UNIQUE. Use `IF NOT EXISTS`.

