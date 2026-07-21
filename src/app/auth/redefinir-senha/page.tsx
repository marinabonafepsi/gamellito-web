'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';
import { PasswordInput } from '@/components/ds/PasswordInput';

type Estado = 'verificando' | 'pronto' | 'invalido' | 'sucesso';

export default function RedefinirSenhaPage() {
  const [estado, setEstado] = useState<Estado>('verificando');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setEstado('pronto');
    });

    // O clique no link do e-mail já pode ter processado o token antes deste
    // efeito rodar — nesse caso não vem o evento PASSWORD_RECOVERY, só a
    // sessão já ativa.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setEstado((s) => (s === 'verificando' ? 'pronto' : s));
    });

    const timeout = setTimeout(() => {
      setEstado((s) => (s === 'verificando' ? 'invalido' : s));
    }, 3000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (senha !== confirmar) {
      setError('As senhas não correspondem');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setEstado('sucesso');
    setTimeout(() => router.push('/auth/login'), 2500);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="h-lg text-purple mb-2">Redefinir senha</h1>
          <p className="text-ink">Escolha sua nova senha</p>
        </div>

        <GamCard surface="white">
          {estado === 'verificando' && (
            <p className="text-center text-ink/70 py-4">Verificando o link...</p>
          )}

          {estado === 'invalido' && (
            <div className="text-center py-2">
              <p className="text-ink font-bold mb-2">Esse link não é mais válido</p>
              <p className="text-ink/70 text-sm mb-5">
                Links de redefinição expiram depois de um tempo ou só podem ser usados uma vez.
              </p>
              <GamButton variant="primary" className="w-full" onClick={() => router.push('/auth/esqueci-senha')}>
                Pedir um novo link
              </GamButton>
            </div>
          )}

          {estado === 'sucesso' && (
            <div className="text-center py-2">
              <p className="text-ink font-bold mb-2">Senha redefinida! ✅</p>
              <p className="text-ink/70 text-sm">Te levando pro login...</p>
            </div>
          )}

          {estado === 'pronto' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Nova senha</label>
                <PasswordInput
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Confirmar senha</label>
                <PasswordInput
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  placeholder="Confirme sua senha"
                />
              </div>

              {error && (
                <div className="bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold">
                  {error}
                </div>
              )}

              <GamButton type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </GamButton>
            </form>
          )}
        </GamCard>
      </div>
    </div>
  );
}
