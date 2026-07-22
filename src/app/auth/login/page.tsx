'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';
import { PasswordInput } from '@/components/ds/PasswordInput';
import { translateAuthError } from '@/lib/auth-errors';
import { DASHBOARD_BY_ROLE } from '@/lib/auth-roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Redirect to appropriate dashboard
      const { data: { user } } = await supabase.auth.getUser();
      const role = (user?.user_metadata?.role as keyof typeof DASHBOARD_BY_ROLE) || 'familia';

      router.push(DASHBOARD_BY_ROLE[role] || '/familia/dashboard');
    } catch (err) {
      setError(err instanceof Error ? translateAuthError(err.message) : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) setError(translateAuthError(oauthError.message));
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="h-lg text-purple mb-2">
            Gamellito
          </h1>
          <p className="text-ink">Faça login na sua conta</p>
        </div>

        <GamCard surface="white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-ink">
                  Senha
                </label>
                <Link href="/auth/esqueci-senha" className="text-xs text-purple font-bold hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream"
                placeholder="Sua senha"
              />
            </div>

            {error && (
              <div className="bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold">
                {error}
              </div>
            )}

            <GamButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </GamButton>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink/12" />
            <span className="text-ink/60 text-xs font-body">ou</span>
            <div className="flex-1 h-px bg-ink/12" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-ink rounded-full shadow-pop py-2.5 px-5 font-display font-bold text-ink transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-pop-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-pop-press"
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32z"/>
              <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.44l-3.23-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H1.06v2.58A10 10 0 0 0 10 20z"/>
              <path fill="#FBBC05" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.52H1.06a10 10 0 0 0 0 8.96l3.35-2.58z"/>
              <path fill="#EA4335" d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.06 5.52L4.4 8.1C5.2 5.74 7.4 3.98 10 3.98z"/>
            </svg>
            Entrar com Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-ink opacity-70">
              Não tem conta?{' '}
              <Link href="/auth/select-role" className="text-purple font-bold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </GamCard>
      </div>
    </div>
  );
}
