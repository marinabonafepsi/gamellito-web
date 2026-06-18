import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// AUTH DESABILITADO TEMPORARIAMENTE PARA TESTE — reabilitar antes do merge
async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// ── POST /api/registros ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { supabase, user } = await getUser();
  const body = await request.json();
  const { valor, data_hora, rotulo, observacao, lancado_por } = body;

  if (!valor || !data_hora || !rotulo || !lancado_por) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  // Sem auth: simula sucesso para teste visual
  if (!user) {
    return NextResponse.json({
      id: crypto.randomUUID(),
      familia_id: "teste",
      valor: Number(valor),
      data_hora,
      rotulo,
      observacao: observacao ?? null,
      lancado_por,
      created_at: new Date().toISOString(),
    }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("registros")
    .insert({
      familia_id: user.id,
      valor: Number(valor),
      data_hora,
      rotulo,
      observacao: observacao ?? null,
      lancado_por,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// ── GET /api/registros ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { supabase, user } = await getUser();

  // Sem auth: retorna lista vazia para teste visual
  if (!user) {
    return NextResponse.json([]);
  }

  const { searchParams } = new URL(request.url);
  const periodo = searchParams.get("periodo") ?? "7";

  const diasAtras = new Date();
  diasAtras.setDate(diasAtras.getDate() - Number(periodo));

  const { data, error } = await supabase
    .from("registros")
    .select("*")
    .eq("familia_id", user.id)
    .gte("data_hora", diasAtras.toISOString())
    .order("data_hora", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ── PATCH /api/registros ────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const { supabase, user } = await getUser();
  const body = await request.json();
  const { id, ...campos } = body;

  if (!id) {
    return NextResponse.json({ error: "id obrigatório." }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ id, ...campos });
  }

  const { data, error } = await supabase
    .from("registros")
    .update(campos)
    .eq("id", id)
    .eq("familia_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ── DELETE /api/registros ───────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getUser();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id obrigatório." }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from("registros")
    .delete()
    .eq("id", id)
    .eq("familia_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
