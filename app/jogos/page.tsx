import { redirect } from "next/navigation";

/** Redireciona /jogos para a seção de jogos na home */
export default function JogosPage() {
  redirect("/#jogos");
}
