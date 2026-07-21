import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/certificados - lista todas as certificações ativas ("Amigos do
// Gamellito") com o status de conquista do usuário atual, pra alimentar a
// seção "Meus certificados" (dentro de /conquistas).
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: certificacoes, error: certError } = await supabase
      .from('certifications')
      .select('id, slug, type, formal_name, badge_name, badge_name_f, unlock_message, badge_color, badge_asset, coin_reward, ordem')
      .eq('ativo', true)
      .order('type', { ascending: true })
      .order('ordem', { ascending: true });

    if (certError) {
      console.error('Error fetching certifications:', certError);
      return NextResponse.json({ error: 'Failed to load certifications' }, { status: 500 });
    }

    const { data: conquistadas, error: conquistadasError } = await supabase
      .from('user_certifications')
      .select('certification_id, earned_at, certificate_code')
      .eq('user_id', user.id);

    if (conquistadasError) {
      console.error('Error fetching user_certifications:', conquistadasError);
      return NextResponse.json({ error: 'Failed to load user certifications' }, { status: 500 });
    }

    const conquistadasPorId = new Map(
      (conquistadas || []).map((c) => [c.certification_id, c])
    );

    const resultado = (certificacoes || []).map((c) => {
      const conquistada = conquistadasPorId.get(c.id);
      return {
        ...c,
        conquistada: !!conquistada,
        conquistada_em: conquistada?.earned_at ?? null,
        certificate_code: conquistada?.certificate_code ?? null,
      };
    });

    return NextResponse.json({ certificados: resultado });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
