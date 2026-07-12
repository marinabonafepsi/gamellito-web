import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

const TIPOS = ['avatar_skin', 'badge', 'poder_jogo', 'recurso', 'cosmético'];

// GET /api/admin/loja-items - Lista todos os itens (incl. inativos), admin only
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
      .from('loja_items')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching loja_items:', error);
      return NextResponse.json({ error: 'Failed to fetch loja_items' }, { status: 500 });
    }

    return NextResponse.json({ itens: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/loja-items - Cria um novo item da loja, admin only
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
    const { nome, descricao, custo_moedas, imagem_url, tipo, ativo } = body;

    if (!nome || !custo_moedas) {
      return NextResponse.json(
        { error: 'nome e custo_moedas são obrigatórios' },
        { status: 400 }
      );
    }

    if (tipo && !TIPOS.includes(tipo)) {
      return NextResponse.json(
        { error: `tipo deve ser um de: ${TIPOS.join(', ')}` },
        { status: 400 }
      );
    }

    const { data: item, error } = await supabase
      .from('loja_items')
      .insert({
        nome,
        descricao: descricao || null,
        custo_moedas,
        imagem_url: imagem_url || null,
        tipo: tipo || null,
        ativo: ativo ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating loja_item:', error);
      return NextResponse.json({ error: 'Failed to create loja_item' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, item });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
