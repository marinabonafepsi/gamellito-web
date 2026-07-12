import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

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
    const { item_id, quantidade = 1 } = body;

    if (!item_id) {
      return NextResponse.json(
        { error: 'item_id is required' },
        { status: 400 }
      );
    }

    // Get item and check cost
    const { data: item, error: itemError } = await supabase
      .from('loja_items')
      .select('custo_moedas')
      .eq('id', item_id)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Calculate total cost
    const totalCost = item.custo_moedas * quantidade;

    // Get current coins
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('coins')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if user has enough coins
    if (profile.coins < totalCost) {
      return NextResponse.json(
        { error: 'Saldo insuficiente' },
        { status: 400 }
      );
    }

    // Atomic operation: decrement coins and add to inventory
    // Using RPC for atomicity
    const { data: result, error: rpcError } = await supabase.rpc(
      'comprar_item_atomico',
      {
        p_user_id: user.id,
        p_item_id: item_id,
        p_quantidade: quantidade,
        p_custo: totalCost,
      }
    );

    if (rpcError) {
      // Fallback: manual transaction
      // Decrement coins
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ coins: profile.coins - totalCost })
        .eq('user_id', user.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update coins' },
          { status: 500 }
        );
      }

      // Add to inventory
      const { error: invError } = await supabase
        .from('inventario_usuario')
        .upsert({
          usuario_id: user.id,
          item_id,
          quantidade,
        });

      if (invError) {
        return NextResponse.json(
          { error: 'Failed to update inventory' },
          { status: 500 }
        );
      }
    }

    // Track event
    await trackEvent('item_comprado', { item_id, quantidade, custo: totalCost });

    return NextResponse.json({
      sucesso: true,
      moedas_gastas: totalCost,
      saldo_novo: profile.coins - totalCost,
      item_id,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
