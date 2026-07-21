import type { SupabaseClient } from '@supabase/supabase-js';

export interface CertificacaoDesbloqueada {
  id: string;
  slug: string;
  formal_name: string;
  badge_name: string;
  badge_name_f: string | null;
  unlock_message: string | null;
  badge_color: string | null;
  badge_asset: string | null;
  coin_reward: number;
}

// Chama a RPC verificar_e_conceder_certificacao (ver migration
// 20260720000300_certificacao_award_rpc.sql) depois de marcar um módulo como
// concluído. Se esse módulo era o último pendente do nível (trilha), a RPC
// concede o certificado + credita as coins do nível e retorna os dados do
// badge; caso contrário retorna null. Nunca lança — indisponibilidade não
// deve travar a conclusão do módulo, que já foi salva antes desta chamada.
export async function checkAndAwardTrilhaCertificacao(
  supabase: SupabaseClient,
  userId: string,
  moduloId: string
): Promise<CertificacaoDesbloqueada | null> {
  const { data, error } = await supabase.rpc('verificar_e_conceder_certificacao', {
    p_user_id: userId,
    p_modulo_id: moduloId,
  });

  if (error) {
    console.error('Error checking certification award:', error);
    return null;
  }

  return (data as CertificacaoDesbloqueada | null) || null;
}
