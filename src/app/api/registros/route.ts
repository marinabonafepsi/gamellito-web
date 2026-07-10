import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/registros - List registros for current familia
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query params
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const dataInicio = url.searchParams.get('data_inicio');
    const dataFim = url.searchParams.get('data_fim');

    // Build query
    let query = supabase
      .from('registros')
      .select('*', { count: 'exact' })
      .eq('familia_id', user.id)
      .order('data_hora', { ascending: false });

    if (dataInicio) {
      query = query.gte('data_hora', dataInicio);
    }
    if (dataFim) {
      query = query.lte('data_hora', dataFim);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching registros:', error);
      return NextResponse.json(
        { error: 'Failed to fetch registros' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      registros: data || [],
      paginacao: {
        total: count || 0,
        limit,
        offset,
        has_more: (offset + limit) < (count || 0),
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

// POST /api/registros - Create new registro
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { valor, rotulo, observacao, lancado_por } = body;

    // Validate input
    if (!valor || !rotulo) {
      return NextResponse.json(
        { error: 'valor and rotulo are required' },
        { status: 400 }
      );
    }

    if (valor < 50 || valor > 600) {
      return NextResponse.json(
        { error: 'Valor deve estar entre 50 e 600 mg/dL' },
        { status: 400 }
      );
    }

    // Create registro
    const { data: registro, error } = await supabase
      .from('registros')
      .insert({
        familia_id: user.id,
        valor,
        rotulo,
        observacao,
        lancado_por: lancado_por || 'Mãe',
        data_hora: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating registro:', error);
      return NextResponse.json(
        { error: 'Failed to create registro' },
        { status: 500 }
      );
    }

    // Award coins (+10 moedas por registro)
    const { error: coinError } = await supabase.rpc('incrementar_coins', {
      p_user_id: user.id,
      p_quantidade: 10,
    });

    if (coinError) {
      console.error('Error awarding coins:', coinError);
      // Don't fail the request, coins are bonus
    }

    // Track event
    await supabase.from('product_events').insert({
      user_id: user.id,
      event: 'registro_salvo',
      properties: { valor, rotulo },
    });

    // Get updated coins
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      sucesso: true,
      registro,
      moedas_ganhas: 10,
      saldo_novo: profile?.coins || 10,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
