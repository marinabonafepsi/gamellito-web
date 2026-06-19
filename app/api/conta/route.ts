import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // Apaga todos os registros da família (RLS garante que só apaga os próprios)
  const { error: errRegistros } = await supabase
    .from("registros")
    .delete()
    .eq("familia_id", user.id);

  if (errRegistros) {
    return NextResponse.json({ error: "Erro ao apagar registros." }, { status: 500 });
  }

  // Apaga a conta do usuário (requer service_role)
  const admin = await createAdminClient();
  const { error: errUser } = await admin.auth.admin.deleteUser(user.id);

  if (errUser) {
    return NextResponse.json({ error: "Registros apagados, mas houve um erro ao remover a conta. Contate o suporte." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
