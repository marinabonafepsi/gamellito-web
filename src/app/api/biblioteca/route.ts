import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CATEGORIAS = ['Enfermagem', 'Endocrinologia', 'Educação', 'Psicologia'];

// GET /api/biblioteca - List published articles (public)
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase
      .from('biblioteca_artigos')
      .select('id, titulo, autores, resumo, categoria, ano, pdf_url, publicado_em')
      .eq('status', 'publicado')
      .order('publicado_em', { ascending: false });

    if (error) {
      console.error('Error fetching biblioteca_artigos:', error);
      return NextResponse.json({ error: 'Failed to fetch artigos' }, { status: 500 });
    }

    return NextResponse.json({ artigos: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/biblioteca - Submit a new article for review (profissional only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'profissional') {
      return NextResponse.json(
        { error: 'Apenas profissionais de saúde podem submeter artigos' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { titulo, autores, resumo, categoria, ano, pdf_url } = body;

    if (!titulo || !autores || !resumo || !categoria || !ano) {
      return NextResponse.json(
        { error: 'titulo, autores, resumo, categoria e ano são obrigatórios' },
        { status: 400 }
      );
    }

    if (!CATEGORIAS.includes(categoria)) {
      return NextResponse.json(
        { error: `categoria deve ser uma de: ${CATEGORIAS.join(', ')}` },
        { status: 400 }
      );
    }

    const { data: artigo, error } = await supabase
      .from('biblioteca_artigos')
      .insert({
        titulo,
        autores,
        resumo,
        categoria,
        ano,
        pdf_url: pdf_url || null,
        status: 'pendente',
        submetido_por: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating artigo:', error);
      return NextResponse.json({ error: 'Failed to submit artigo' }, { status: 500 });
    }

    await supabase.from('product_events').insert({
      user_id: user.id,
      event: 'artigo_submetido',
      properties: { artigo_id: artigo.id, categoria },
    });

    return NextResponse.json({ sucesso: true, artigo });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
