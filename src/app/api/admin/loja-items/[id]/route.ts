import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

const TIPOS = ['avatar_skin', 'badge', 'poder_jogo', 'recurso', 'cosmético'];

// PATCH /api/admin/loja-items/:id - Atualiza um item da loja, admin only
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    if (tipo && !TIPOS.includes(tipo)) {
      return NextResponse.json(
        { error: `tipo deve ser um de: ${TIPOS.join(', ')}` },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (nome !== undefined) updates.nome = nome;
    if (descricao !== undefined) updates.descricao = descricao;
    if (custo_moedas !== undefined) updates.custo_moedas = custo_moedas;
    if (imagem_url !== undefined) updates.imagem_url = imagem_url;
    if (tipo !== undefined) updates.tipo = tipo;
    if (ativo !== undefined) updates.ativo = ativo;

    const { data: item, error } = await supabase
      .from('loja_items')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating loja_item:', error);
      return NextResponse.json({ error: 'Failed to update loja_item' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, item });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/loja-items/:id - Remove um item da loja, admin only
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { error } = await supabase.from('loja_items').delete().eq('id', params.id);

    if (error) {
      console.error('Error deleting loja_item:', error);
      return NextResponse.json({ error: 'Failed to delete loja_item' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
