-- Tabela de log de emails enviados
-- Registra cada envio de email transacional (boas-vindas, magic link, etc.)

create table if not exists email_logs (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete set null,
  email      text        not null,
  tipo       text        not null, -- 'boas_vindas' | 'magic_link' | etc.
  status     text        not null, -- 'enviado' | 'erro'
  erro       text,                 -- mensagem de erro se status = 'erro'
  created_at timestamptz default now()
);

-- Apenas admins podem ler; a inserção vem do service role (servidor)
alter table email_logs enable row level security;

create policy "service_role_only" on email_logs
  using (false)
  with check (false);
