import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// PATCH /api/registros/[id] - Update registro
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Parse request body
    const body = await request.json();

    // Update registro
    const { data: registro, error } = await supabase
      .from('registros')
      .update(body)
      .eq('id', id)
      .eq('familia_id', user.id) // Ensure ownership
      .select()
      .single();

    if (error) {
      console.error('Error updating registro:', error);
      return NextResponse.json(
        { error: 'Failed to update registro' },
        { status: 500 }
      );
    }

    if (!registro) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, registro });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/registros/[id] - Delete registro
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Delete registro
    const { error } = await supabase
      .from('registros')
      .delete()
      .eq('id', id)
      .eq('familia_id', user.id); // Ensure ownership

    if (error) {
      console.error('Error deleting registro:', error);
      return NextResponse.json(
        { error: 'Failed to delete registro' },
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
