import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getUserRole } from './auth-helpers';

/**
 * Check whether a feature flag is enabled for the current user.
 *
 * If `ativo_geral` is true, the feature is on for everyone. Otherwise it's
 * only on for the admin (when `visivel_admin` is true) — this lets the
 * admin test a feature in production before flipping `ativo_geral` to
 * release it generally.
 *
 * Usage: gate a not-yet-released feature with
 * `if (await isFeatureEnabled('jogos_catalogo')) { ... }` in a server
 * component or route handler.
 */
export async function isFeatureEnabled(chave: string): Promise<boolean> {
  const supabase = createServerComponentClient({ cookies });
  const { data: flag } = await supabase
    .from('feature_flags')
    .select('ativo_geral, visivel_admin')
    .eq('chave', chave)
    .single();

  if (!flag) return false;
  if (flag.ativo_geral) return true;

  if (flag.visivel_admin) {
    const role = await getUserRole();
    return role === 'admin';
  }

  return false;
}
