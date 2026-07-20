import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermissionFor } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// GET /api/modulos/progresso - lista os módulos já concluídos pelo usuário
// atual (id + estrelas), para o front-end sobrepor o status real nas trilhas.
// Aceita ?dm1_id= pra a família vinculada ver o progresso do DM1 (somente
// leitura), mesmo padrão de /api/registros.
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dm1Id = request.nextUrl.searchParams.get('dm1_id');
    let targetId = user.id;
    if (dm1Id && dm1Id !== user.id) {
      if (!(await hasPermissionFor(dm1Id))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      targetId = dm1Id;
    }

    const { data, error } = await supabase
      .from('modulo_progresso')
      .select('modulo_id, estrelas, concluido_em')
      .eq('user_id', targetId);

    if (error) {
      console.error('Error fetching modulo_progresso:', error);
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    return NextResponse.json({ progresso: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
