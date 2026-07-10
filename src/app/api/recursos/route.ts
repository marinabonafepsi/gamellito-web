import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/recursos?papel=educador|profissional - Lista o catálogo de
// atividades/materiais curados para o papel do usuário, agrupado por categoria
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const papel = url.searchParams.get('papel');

    if (!papel || !['educador', 'profissional'].includes(papel)) {
      return NextResponse.json(
        { error: 'papel deve ser "educador" ou "profissional"' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('recursos')
      .select('id, categoria, titulo, descricao, icone, acao_label, url')
      .eq('papel_alvo', papel)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Error fetching recursos:', error);
      return NextResponse.json({ error: 'Failed to fetch recursos' }, { status: 500 });
    }

    const atividades = (data || []).filter((r) => r.categoria === 'atividade');
    const materiais = (data || []).filter((r) => r.categoria === 'material');

    return NextResponse.json({ atividades, materiais });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
