import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// POST /api/relatorios/gerar - Generate PDF report
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
    const { paciente_id, data_inicio, data_fim } = body;

    if (!paciente_id) {
      return NextResponse.json({ error: 'paciente_id required' }, { status: 400 });
    }

    // Verify permission
    const { data: perm, error: permError } = await supabase
      .from('permissoes')
      .select('id')
      .eq('usuario_dono', paciente_id)
      .eq('usuario_acesso', user.id)
      .is('revogado_em', null)
      .single();

    if (permError || !perm) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get paciente profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name, avatar, coins')
      .eq('user_id', paciente_id)
      .single();

    // Get registros for date range
    let query = supabase
      .from('registros')
      .select('*')
      .eq('familia_id', paciente_id)
      .order('data_hora', { ascending: false });

    if (data_inicio) {
      query = query.gte('data_hora', data_inicio);
    }
    if (data_fim) {
      query = query.lte('data_hora', data_fim);
    }

    const { data: registros, error: regError } = await query.limit(100);

    if (regError) {
      return NextResponse.json(
        { error: 'Failed to fetch registros' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const valores = (registros || []).map((r: any) => r.valor);
    const stats = {
      total: valores.length,
      minimo: valores.length > 0 ? Math.min(...valores) : 0,
      maximo: valores.length > 0 ? Math.max(...valores) : 0,
      media: valores.length > 0
        ? Math.round(valores.reduce((a: number, b: number) => a + b, 0) / valores.length)
        : 0,
    };

    // Generate report data (PDF generation would happen here)
    // For now, just return the data
    const reportData = {
      paciente_nome: profile?.name || 'Paciente',
      paciente_avatar: profile?.avatar || 'feliz',
      data_relatorio: new Date().toLocaleDateString('pt-BR'),
      periodo_inicio: data_inicio || 'Sem limite',
      periodo_fim: data_fim || 'Sem limite',
      estatisticas: stats,
      registros_count: registros?.length || 0,
      observacoes: [
        '✅ Relatório gerado automaticamente por Gamellito',
        '⚠️ Este relatório não contém interpretação médica',
        '📋 Para análise clínica, consulte o profissional de saúde',
      ],
    };

    // TODO: Convert to PDF and send as file
    // For MVP, just return JSON
    return NextResponse.json({
      sucesso: true,
      relatorio: reportData,
      message: 'PDF generation coming soon',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
