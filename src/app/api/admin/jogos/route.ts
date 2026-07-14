import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// GET /api/admin/jogos - Lista todos os jogos (incl. inativos), admin only
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((await getUserRole()) !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Error fetching jogos:', error);
      return NextResponse.json({ error: 'Failed to fetch jogos' }, { status: 500 });
    }

    return NextResponse.json({ jogos: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/jogos - Cria um novo jogo no catálogo, admin only
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if ((await getUserRole()) !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { titulo, descricao, imagem_url, url_jogo, categoria, ativo, ordem } = body;

    if (!titulo) {
      return NextResponse.json({ error: 'titulo é obrigatório' }, { status: 400 });
    }

    const { data: jogo, error } = await supabase
      .from('jogos')
      .insert({
        titulo,
        descricao: descricao || null,
        imagem_url: imagem_url || null,
        url_jogo: url_jogo || null,
        categoria: categoria || null,
        ativo: ativo ?? true,
        ordem: ordem ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating jogo:', error);
      return NextResponse.json({ error: 'Failed to create jogo' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, jogo });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
