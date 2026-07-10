import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TIPOS = ['basal', 'bolus', 'outro'];
const CAMPOS_PERMITIDOS = ['nome', 'tipo', 'dose', 'horarios', 'desde', 'observacao', 'ativo'];

// PATCH /api/medicamentos/[id] - Atualiza um medicamento do usuário atual
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.tipo && !TIPOS.includes(body.tipo)) {
      return NextResponse.json(
        { error: `tipo deve ser uma de: ${TIPOS.join(', ')}` },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
    for (const campo of CAMPOS_PERMITIDOS) {
      if (campo in body) updates[campo] = body[campo];
    }

    const { data: medicamento, error } = await supabase
      .from('medicamentos')
      .update(updates)
      .eq('id', params.id)
      .eq('familia_id', user.id) // Ensure ownership
      .select()
      .single();

    if (error) {
      console.error('Error updating medicamento:', error);
      return NextResponse.json({ error: 'Failed to update medicamento' }, { status: 500 });
    }

    if (!medicamento) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, medicamento });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/medicamentos/[id] - Remove um medicamento do usuário atual
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('medicamentos')
      .delete()
      .eq('id', params.id)
      .eq('familia_id', user.id); // Ensure ownership

    if (error) {
      console.error('Error deleting medicamento:', error);
      return NextResponse.json({ error: 'Failed to delete medicamento' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
