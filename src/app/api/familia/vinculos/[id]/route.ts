import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// DELETE /api/familia/vinculos/[id] - Desfaz um vínculo família<->DM1.
// Qualquer um dos dois lados pode desvincular (RPC porque a policy de delete
// em `permissoes` só cobre quem concedeu o acesso, usuario_dono).
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase.rpc('revogar_vinculo_familia', {
      p_permissao_id: params.id,
    });

    if (error) {
      console.error('Error revoking vinculo:', error);
      return NextResponse.json({ error: 'Failed to revoke vinculo' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
