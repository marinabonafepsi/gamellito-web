'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/redefinir-senha`,
    });

    setLoading(false);

    // Não revela se o e-mail existe ou não — sempre mostra a mesma mensagem
    // de sucesso, exceto em erros claramente do lado do cliente (ex: rate limit).
    if (resetError && resetError.status && resetError.status >= 500) {
      setError('Erro ao enviar o e-mail. Tenta de novo em alguns minutos.');
      return;
    }

    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="h-lg text-purple mb-2">Esqueci minha senha</h1>
          <p className="text-ink">Vamos te mandar um link pra redefinir</p>
        </div>

        <GamCard surface="white">
          {enviado ? (
            <div className="text-center py-2">
              <p className="text-ink font-bold mb-2">E-mail enviado! 📬</p>
              <p className="text-ink/70 text-sm">
                Se <strong>{email}</strong> tiver uma conta, chega um link em alguns minutos pra você
                escolher uma senha nova. Não esquece de olhar o spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                  placeholder="seu@email.com"
                />
              </div>

              {error && (
                <div className="bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold">
                  {error}
                </div>
              )}

              <GamButton type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
              </GamButton>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-purple font-bold hover:underline">
              ← Voltar pro login
            </Link>
          </div>
        </GamCard>
      </div>
    </div>
  );
}
