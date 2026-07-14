import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// PATCH /api/admin/jogos/:id - Atualiza um jogo do catálogo, admin only
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
    const { titulo, descricao, imagem_url, url_jogo, categoria, ativo, ordem } = body;

    const updates: Record<string, unknown> = {};
    if (titulo !== undefined) updates.titulo = titulo;
    if (descricao !== undefined) updates.descricao = descricao;
    if (imagem_url !== undefined) updates.imagem_url = imagem_url;
    if (url_jogo !== undefined) updates.url_jogo = url_jogo;
    if (categoria !== undefined) updates.categoria = categoria;
    if (ativo !== undefined) updates.ativo = ativo;
    if (ordem !== undefined) updates.ordem = ordem;

    const { data: jogo, error } = await supabase
      .from('jogos')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating jogo:', error);
      return NextResponse.json({ error: 'Failed to update jogo' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, jogo });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/jogos/:id - Remove um jogo do catálogo, admin only
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

    const { error } = await supabase.from('jogos').delete().eq('id', params.id);

    if (error) {
      console.error('Error deleting jogo:', error);
      return NextResponse.json({ error: 'Failed to delete jogo' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
