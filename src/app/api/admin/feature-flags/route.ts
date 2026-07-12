import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// GET /api/admin/feature-flags - Lista todas as flags, admin only
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
      .from('feature_flags')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching feature_flags:', error);
      return NextResponse.json({ error: 'Failed to fetch feature_flags' }, { status: 500 });
    }

    return NextResponse.json({ flags: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/feature-flags - Cria uma nova flag, admin only
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
    const { chave, nome, descricao, ativo_geral, visivel_admin } = body;

    if (!chave || !nome) {
      return NextResponse.json({ error: 'chave e nome são obrigatórios' }, { status: 400 });
    }

    const { data: flag, error } = await supabase
      .from('feature_flags')
      .insert({
        chave,
        nome,
        descricao: descricao || null,
        ativo_geral: ativo_geral ?? false,
        visivel_admin: visivel_admin ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating feature_flag:', error);
      return NextResponse.json({ error: 'Failed to create feature_flag' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, flag });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
