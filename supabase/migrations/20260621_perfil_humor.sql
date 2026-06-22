-- ═══════════════════════════════════════════════════════════════
-- Perfil do usuário, humor diário e analytics de produto
-- ═══════════════════════════════════════════════════════════════

-- ── user_profiles ───────────────────────────────────────────────
-- Saldo de moedas e metadados de engajamento.
-- Criado automaticamente no primeiro login (via auth.callback).

create table if not exists public.user_profiles (
  user_id     uuid        primary key references auth.users(id) on delete cascade,
  coins       integer     not null default 0 check (coins >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "own_profile_select" on public.user_profiles
  for select using (user_id = auth.uid());

create policy "own_profile_insert" on public.user_profiles
  for insert with check (user_id = auth.uid());

create policy "own_profile_update" on public.user_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Incrementa coins atomicamente (sem race condition)
create or replace function public.incrementar_coins(p_user_id uuid, p_quantidade integer)
returns void language plpgsql security definer as $$
begin
  insert into public.user_profiles (user_id, coins)
    values (p_user_id, greatest(0, p_quantidade))
  on conflict (user_id) do update
    set coins      = public.user_profiles.coins + greatest(0, excluded.coins),
        updated_at = now();
end;
$$;

-- ── humor_logs ──────────────────────────────────────────────────
-- Registro diário de humor da família (único por dia).
-- Gera moedas para incentivar o check-in.

create table if not exists public.humor_logs (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  humor        text        not null
                           check (humor in ('feliz', 'animado', 'raiva', 'medo', 'normal')),
  coins_ganhos integer     not null default 0,
  data_local   date        not null,
  created_at   timestamptz not null default now(),
  unique (user_id, data_local)
);

alter table public.humor_logs enable row level security;

create policy "own_humor_select" on public.humor_logs
  for select using (user_id = auth.uid());

create policy "own_humor_insert" on public.humor_logs
  for insert with check (user_id = auth.uid());

create policy "own_humor_update" on public.humor_logs
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists humor_user_data on public.humor_logs (user_id, data_local desc);

-- ── product_events ──────────────────────────────────────────────
-- Tabela de analytics de produto para saúde de uso e engajamento.
-- Alimentada pelo servidor (service_role) — nunca exposta ao client.
-- Consulte via Supabase Studio para dashboards de uso.

create table if not exists public.product_events (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete set null,
  anon_id     text,                            -- ID anônimo do localStorage (pré-login)
  event       text        not null,            -- ex.: 'novo_usuario', 'registro_salvo', 'humor_marcado'
  page        text,
  properties  jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists product_events_user     on public.product_events (user_id, created_at desc);
create index if not exists product_events_event    on public.product_events (event, created_at desc);
create index if not exists product_events_created  on public.product_events (created_at desc);

-- Apenas service_role pode inserir e ler (dashboard interno)
alter table public.product_events enable row level security;

create policy "service_role_only" on public.product_events
  using (false)
  with check (false);

-- ── identified_users ────────────────────────────────────────────
-- Já criada pelo analytics existente; garantir existência.

create table if not exists public.identified_users (
  id          text        primary key,
  email       text        not null,
  name        text,
  created_at  timestamptz default now()
);

create unique index if not exists identified_users_email on public.identified_users (email);
alter table public.identified_users enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'identified_users' and policyname = 'allow_insert'
  ) then
    execute 'create policy "allow_insert" on public.identified_users for insert with check (true)';
    execute 'create policy "allow_update" on public.identified_users for update with check (true)';
  end if;
end $$;
