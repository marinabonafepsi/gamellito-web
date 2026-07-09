import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/notas-clinicas - List notas for paciente
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
    const pacienteId = url.searchParams.get('paciente_id');

    if (!pacienteId) {
      return NextResponse.json({ error: 'paciente_id required' }, { status: 400 });
    }

    // Verify user has permission to see this paciente
    const { data: perm, error: permError } = await supabase
      .from('permissoes')
      .select('id')
      .eq('usuario_dono', pacienteId)
      .eq('usuario_acesso', user.id)
      .is('revogado_em', null)
      .single();

    if (permError || !perm) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get notas (would be from clinical_notes table)
    // For now, return empty
    return NextResponse.json({ notas: [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notas-clinicas - Create nota
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paciente_id, texto } = body;

    if (!paciente_id || !texto) {
      return NextResponse.json(
        { error: 'paciente_id and texto are required' },
        { status: 400 }
      );
    }

    // Verify permission
    const { data: perm, error: permError } = await supabase
      .from('permissoes')
      .select('id, tipo_acesso')
      .eq('usuario_dono', paciente_id)
      .eq('usuario_acesso', user.id)
      .is('revogado_em', null)
      .single();

    if (permError || !perm) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only 'comment' or 'full' access can add notas
    if (perm.tipo_acesso === 'readonly') {
      return NextResponse.json(
        { error: 'Insufficient permission to add notas' },
        { status: 403 }
      );
    }

    // Create nota (would insert into clinical_notes table)
    // For now, just return success
    return NextResponse.json({
      sucesso: true,
      nota: {
        id: 'temp-id',
        texto,
        criado_em: new Date().toISOString(),
        criado_por: user.id,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
