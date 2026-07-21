// Traduz as mensagens de erro mais comuns que o Supabase Auth devolve (em
// inglês, sem tradução própria) pra um português que uma mãe sem contexto
// técnico consiga agir a partir dele.
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes('invalid login credentials')) {
    return 'Email ou senha incorretos. Confira e tente de novo — ou clique em "Esqueci minha senha".';
  }
  if (m.includes('email not confirmed')) {
    return 'Você ainda não confirmou seu email. Procure o link de confirmação que a gente mandou pra sua caixa de entrada (ou spam).';
  }
  if (m.includes('user already registered') || m.includes('already registered')) {
    return 'Já existe uma conta com esse email. Tenta fazer login em vez de criar uma nova.';
  }
  if (m.includes('rate limit')) {
    return 'Muitas tentativas seguidas. Espera alguns minutos e tenta de novo.';
  }
  if (m.includes('network') || m.includes('fetch failed') || m.includes('failed to fetch')) {
    return 'Não deu pra conectar agora. Confira sua internet e tenta de novo.';
  }

  return 'Não deu pra entrar agora. Confira seus dados e tenta de novo em alguns instantes.';
}
