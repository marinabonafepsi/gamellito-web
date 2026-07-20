import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, hasPermissionFor } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// GET /api/registros - List registros for current familia, or (via
// ?dm1_id=) for a DM1 account linked to the current família account
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
    const dm1Id = url.searchParams.get('dm1_id');

    let targetId = user.id;
    if (dm1Id && dm1Id !== user.id) {
      if (!(await hasPermissionFor(dm1Id))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      targetId = dm1Id;
    }

    // Build query
    let query = supabase
      .from('registros')
      .select('*', { count: 'exact' })
      .eq('familia_id', targetId)
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
    const { valor, rotulo, observacao, lancado_por, medicamentos_tomados, contexto } = body;

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

    const medsTomados: string[] = Array.isArray(medicamentos_tomados)
      ? medicamentos_tomados.filter((m: unknown): m is string => typeof m === 'string')
      : [];

    // Create registro
    const { data: registro, error } = await supabase
      .from('registros')
      .insert({
        familia_id: user.id,
        valor,
        rotulo,
        observacao,
        lancado_por: lancado_por || 'Mãe',
        medicamentos_tomados: medsTomados,
        contexto: typeof contexto === 'string' ? contexto : null,
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

    // Award coins: 15 base por registro + 5 por medicamento marcado como
    // tomado (mesma fórmula da "Missão do dia" no protótipo original).
    const moedasGanhas = 15 + medsTomados.length * 5;
    const { error: coinError } = await supabase.rpc('incrementar_coins', {
      p_user_id: user.id,
      p_quantidade: moedasGanhas,
    });

    if (coinError) {
      console.error('Error awarding coins:', coinError);
      // Don't fail the request, coins are bonus
    }

    // Track event
    await trackEvent('registro_salvo', { valor, rotulo });

    // Get updated coins
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      sucesso: true,
      registro,
      moedas_ganhas: moedasGanhas,
      saldo_novo: profile?.coins || moedasGanhas,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
