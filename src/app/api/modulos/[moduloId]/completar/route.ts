import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/auth-helpers';
import { MODULOS_TODOS } from '@/lib/modulos-content-registry';
import { checkAndAwardTrilhaCertificacao } from '@/lib/certifications';

export const runtime = 'nodejs';

// Recompensa base por módulo concluído + bônus por estrela (0-3), seguindo a
// faixa "padrão" de GCoins do GDD (25-35 por fase única).
const BASE_COINS = 20;
const COINS_POR_ESTRELA = 10;

// POST /api/modulos/[moduloId]/completar - marca o módulo como concluído para
// o usuário atual e credita GCoins na primeira conclusão. Conclusões
// seguintes atualizam a pontuação (estrelas) sem gerar moedas de novo.
export async function POST(
  request: NextRequest,
  { params }: { params: { moduloId: string } }
) {
  try {
    const { moduloId } = params;

    if (!MODULOS_TODOS[moduloId]) {
      return NextResponse.json({ error: 'Módulo desconhecido' }, { status: 404 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const estrelasRaw = Number(body?.estrelas);
    const estrelas = Number.isFinite(estrelasRaw) ? Math.min(3, Math.max(0, Math.round(estrelasRaw))) : 3;

    const { data: existente } = await supabase
      .from('modulo_progresso')
      .select('estrelas')
      .eq('user_id', user.id)
      .eq('modulo_id', moduloId)
      .maybeSingle();

    if (existente) {
      if (estrelas > existente.estrelas) {
        await supabase
          .from('modulo_progresso')
          .update({ estrelas })
          .eq('user_id', user.id)
          .eq('modulo_id', moduloId);
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('coins')
        .eq('user_id', user.id)
        .single();

      return NextResponse.json({
        sucesso: true,
        ja_concluido: true,
        moedas_ganhas: 0,
        saldo_novo: profile?.coins || 0,
        estrelas: Math.max(estrelas, existente.estrelas),
      });
    }

    const { error: insertError } = await supabase.from('modulo_progresso').insert({
      user_id: user.id,
      modulo_id: moduloId,
      estrelas,
    });

    if (insertError) {
      console.error('Error saving modulo_progresso:', insertError);
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
    }

    const moedasGanhas = BASE_COINS + estrelas * COINS_POR_ESTRELA;

    const { error: coinError } = await supabase.rpc('incrementar_coins', {
      p_user_id: user.id,
      p_quantidade: moedasGanhas,
      p_reason: 'module',
    });

    if (coinError) {
      console.error('Error awarding coins:', coinError);
      // Não falha a request — as moedas são bônus, o progresso já foi salvo.
    }

    await trackEvent('modulo_concluido', { modulo_id: moduloId, estrelas });

    // Se esse módulo era o último pendente do nível (trilha), concede o
    // certificado "Amigos do Gamellito" do nível + coins do nível.
    const certificacaoDesbloqueada = await checkAndAwardTrilhaCertificacao(
      supabase,
      user.id,
      moduloId
    );
    if (certificacaoDesbloqueada) {
      await trackEvent('certificacao_desbloqueada', {
        certification_id: certificacaoDesbloqueada.id,
        slug: certificacaoDesbloqueada.slug,
      });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      sucesso: true,
      ja_concluido: false,
      moedas_ganhas: moedasGanhas,
      saldo_novo: profile?.coins || moedasGanhas,
      estrelas,
      certificacao_desbloqueada: certificacaoDesbloqueada,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
