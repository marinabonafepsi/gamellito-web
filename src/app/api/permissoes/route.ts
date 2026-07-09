import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/permissoes - List permissoes for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get permissões that current user granted (as usuario_dono)
    const { data, error } = await supabase
      .from('permissoes')
      .select(
        `
        id,
        usuario_acesso,
        tipo_acesso,
        criado_em,
        expira_em,
        profissionais (
          id,
          name:user_profiles(name),
          especialidade
        )
      `
      )
      .eq('usuario_dono', user.id)
      .is('revogado_em', null)
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching permissoes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch permissoes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      permissoes: data || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/permissoes - Create new permission
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
    const { email_destino, tipo_acesso = 'readonly' } = body;

    if (!email_destino) {
      return NextResponse.json(
        { error: 'email_destino is required' },
        { status: 400 }
      );
    }

    // Generate unique token for invite
    const token = Math.random().toString(36).substr(2, 16);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valid for 7 days

    // Create convite
    const { data: convite, error: conviteError } = await supabase
      .from('convites')
      .insert({
        tipo: 'paciente_para_profissional',
        remetente_id: user.id,
        destinatario_email: email_destino,
        token_unico: token,
        expira_em: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (conviteError) {
      console.error('Error creating convite:', conviteError);
      return NextResponse.json(
        { error: 'Failed to create invite' },
        { status: 500 }
      );
    }

    // TODO: Send email with invite link
    // For now, just return the link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/convites/${token}`;

    return NextResponse.json({
      sucesso: true,
      convite,
      inviteLink,
      message: 'Convite criado. Email seria enviado aqui.',
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/permissoes/[id] - Revoke permission
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

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
