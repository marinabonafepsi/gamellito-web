import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { DASHBOARD_BY_ROLE, type Role } from '@/lib/auth-roles';

const VALID_ROLES = Object.keys(DASHBOARD_BY_ROLE);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const pendingRole = searchParams.get('role');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        // Perfil escolhido antes de ir pro Google (cadastro via OAuth): cria direto
        if (pendingRole && VALID_ROLES.includes(pendingRole)) {
          const user = data.user;
          await supabase.from('user_profiles').insert({
            user_id: userId,
            role: pendingRole,
            name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
            coins: 0,
            avatar: 'feliz',
          });
          await supabase.from('product_events').insert({
            user_id: userId,
            event: 'novo_usuario',
            properties: { role: pendingRole, via: 'google' },
          });
          return NextResponse.redirect(`${origin}${DASHBOARD_BY_ROLE[pendingRole as Role]}`);
        }

        // Primeiro login via Google sem perfil escolhido: manda escolher o perfil
        return NextResponse.redirect(`${origin}/auth/select-role`);
      }

      return NextResponse.redirect(`${origin}${DASHBOARD_BY_ROLE[profile.role as Role] || '/familia/dashboard'}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
