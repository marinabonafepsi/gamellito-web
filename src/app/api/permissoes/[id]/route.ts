import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// DELETE /api/permissoes/[id] - Revoke permission
export async function DELETE(
  request: NextRequest,
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

    const { id } = params;

    // Revoke permission
    const { error } = await supabase
      .from('permissoes')
      .update({ revogado_em: new Date().toISOString() })
      .eq('id', id)
      .eq('usuario_dono', user.id); // Ensure ownership

    if (error) {
      console.error('Error revoking permission:', error);
      return NextResponse.json(
        { error: 'Failed to revoke permission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sucesso: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
