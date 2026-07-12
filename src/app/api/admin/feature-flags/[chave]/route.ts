import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// PATCH /api/admin/feature-flags/:chave - Atualiza uma flag, admin only
export async function PATCH(request: NextRequest, { params }: { params: { chave: string } }) {
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
    const { nome, descricao, ativo_geral, visivel_admin } = body;

    const updates: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
    if (nome !== undefined) updates.nome = nome;
    if (descricao !== undefined) updates.descricao = descricao;
    if (ativo_geral !== undefined) updates.ativo_geral = ativo_geral;
    if (visivel_admin !== undefined) updates.visivel_admin = visivel_admin;

    const { data: flag, error } = await supabase
      .from('feature_flags')
      .update(updates)
      .eq('chave', params.chave)
      .select()
      .single();

    if (error) {
      console.error('Error updating feature_flag:', error);
      return NextResponse.json({ error: 'Failed to update feature_flag' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, flag });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/feature-flags/:chave - Remove uma flag, admin only
export async function DELETE(request: NextRequest, { params }: { params: { chave: string } }) {
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

    const { error } = await supabase.from('feature_flags').delete().eq('chave', params.chave);

    if (error) {
      console.error('Error deleting feature_flag:', error);
      return NextResponse.json({ error: 'Failed to delete feature_flag' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
