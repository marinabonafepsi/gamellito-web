-- Signup quebrava com 401 ao inserir em user_profiles/consentimentos_granular
-- logo após supabase.auth.signUp(), porque o projeto exige confirmação de
-- email (mailer_autoconfirm=false) e por isso não existe sessão ativa nesse
-- momento — a policy "profiles_update_own"/RLS em geral exige auth.uid().
--
-- Fix: um trigger em auth.users cria o perfil (e os consentimentos) no
-- momento em que o usuário é criado, via SECURITY DEFINER, que ignora RLS.
-- Só roda para cadastro por email/senha (que sempre manda "role" em
-- options.data no signUp()). Cadastro via Google não manda "role" aqui —
-- continua a cargo de /auth/callback, que já roda com sessão ativa.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (NEW.raw_user_meta_data ? 'role') THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.user_profiles (user_id, role, name, coins, avatar)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'nome',
    0,
    'feliz'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.consentimentos_granular (usuario_id, tipo, aceito, versao, aceito_em)
  VALUES
    (NEW.id, 'compartilhar_com_profissional', COALESCE((NEW.raw_user_meta_data->>'permitirCompartilhamento')::boolean, false), '1.0', now()),
    (NEW.id, 'email_atualizacoes', COALESCE((NEW.raw_user_meta_data->>'permitirEmails')::boolean, false), '1.0', now()),
    (NEW.id, 'analytics_anonimo', COALESCE((NEW.raw_user_meta_data->>'permitirAnalytics')::boolean, false), '1.0', now())
  ON CONFLICT (usuario_id, tipo, versao) DO NOTHING;

  INSERT INTO public.product_events (user_id, event, properties)
  VALUES (NEW.id, 'novo_usuario', jsonb_build_object('role', NEW.raw_user_meta_data->>'role'));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: usuários reais já existentes que nunca conseguiram gravar seu
-- perfil por causa do bug acima. Role default 'familia' (mesmo fallback que
-- o app já usa em auth-helpers.ts quando user_metadata.role está ausente).
INSERT INTO public.user_profiles (user_id, role, name, coins, avatar)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'role', 'familia'),
  COALESCE(u.raw_user_meta_data->>'nome', u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  0,
  'feliz'
FROM auth.users u
LEFT JOIN public.user_profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;
