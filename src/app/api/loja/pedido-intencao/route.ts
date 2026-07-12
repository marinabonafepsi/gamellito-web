import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/auth-helpers';
import { getProdutoFisico } from '@/lib/loja-produtos';

export const runtime = 'nodejs';

interface CarrinhoInput {
  id: string;
  quantidade: number;
}

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
    const { carrinho, nome_contato, telefone_contato, endereco } = body as {
      carrinho: CarrinhoInput[];
      nome_contato: string;
      telefone_contato?: string;
      endereco: {
        cep: string;
        rua: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
      };
    };

    if (!Array.isArray(carrinho) || carrinho.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    if (!nome_contato?.trim()) {
      return NextResponse.json({ error: 'nome_contato é obrigatório' }, { status: 400 });
    }

    if (!endereco?.cep || !endereco?.rua || !endereco?.numero || !endereco?.bairro || !endereco?.cidade || !endereco?.estado) {
      return NextResponse.json({ error: 'Endereço incompleto' }, { status: 400 });
    }

    // Preço vem do catálogo do servidor, nunca do cliente
    const itens = [];
    let subtotal = 0;

    for (const linha of carrinho) {
      const produto = getProdutoFisico(linha.id);
      const quantidade = Math.max(1, Math.floor(linha.quantidade || 1));

      if (!produto) {
        return NextResponse.json({ error: `Produto inválido: ${linha.id}` }, { status: 400 });
      }

      itens.push({
        id: produto.id,
        nome: produto.nome,
        preco_unit: produto.preco,
        quantidade,
      });
      subtotal += produto.preco * quantidade;
    }

    const numeroPedido = String(Math.floor(100000 + Math.random() * 900000));

    const { error: insertError } = await supabase.from('pedidos_intencao').insert({
      familia_id: user.id,
      numero_pedido: numeroPedido,
      itens,
      subtotal,
      nome_contato: nome_contato.trim(),
      telefone_contato: telefone_contato?.trim() || null,
      endereco,
    });

    if (insertError) {
      console.error('Error creating pedido de intenção:', insertError);
      return NextResponse.json({ error: 'Failed to register order' }, { status: 500 });
    }

    await trackEvent('pedido_intencao_criado', { numero_pedido: numeroPedido, subtotal, itens_count: itens.length });

    return NextResponse.json({
      sucesso: true,
      numero_pedido: numeroPedido,
      subtotal,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
