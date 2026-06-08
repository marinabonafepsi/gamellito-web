-- DIA-002: tabela registros com RLS
-- Minimização de dados (LGPD): apenas o mínimo necessário para o diário.
-- NÃO armazenar: CPF, nome completo, endereço, valor-alvo, classificação clínica.

create table if not exists public.registros (
  id          uuid primary key default gen_random_uuid(),
  familia_id  uuid not null,
  valor       integer not null,
  data_hora   timestamptz not null,
  rotulo      text not null check (rotulo in ('jejum', 'antes', 'depois', 'dormir', 'outro')),
  observacao  text,
  lancado_por text not null,
  criado_em   timestamptz not null default now()
);

-- Índice para consultas por família ordenadas por data
create index if not exists registros_familia_data_hora
  on public.registros (familia_id, data_hora desc);

-- Row Level Security: cada família só acessa seus próprios dados
alter table public.registros enable row level security;

create policy "familia_select_own"
  on public.registros for select
  using (familia_id = (select auth.uid()));

create policy "familia_insert_own"
  on public.registros for insert
  with check (familia_id = (select auth.uid()));

create policy "familia_update_own"
  on public.registros for update
  using (familia_id = (select auth.uid()))
  with check (familia_id = (select auth.uid()));

create policy "familia_delete_own"
  on public.registros for delete
  using (familia_id = (select auth.uid()));
