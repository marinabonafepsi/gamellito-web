'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { PasswordInput } from '@/components/ds/PasswordInput';
import { translateAuthError } from '@/lib/auth-errors';
import { DASHBOARD_BY_ROLE, SIGNUP_ROLES, type Role } from '@/lib/auth-roles';
import { SignupForm } from '@/components/auth/SignupForm';
import { Field, ErrorBox, GoogleIcon, inputClass } from '@/components/auth/AuthFormBits';

type Step = 'login' | 'select-role' | 'signup';

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('login');
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleBack = () => {
    setError('');
    if (step === 'signup') setStep('select-role');
    else if (step === 'select-role') setStep('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      const userRole = (user?.user_metadata?.role as Role) || 'familia';
      onClose();
      router.push(DASHBOARD_BY_ROLE[userRole] || '/familia/dashboard');
      router.refresh();
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
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(translateAuthError(oauthError.message));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-cream border-[3px] border-ink rounded-[24px] shadow-pop-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white border-2 border-ink rounded-full shadow-pop-sm font-display font-bold text-ink hover:bg-cream transition-colors"
        >
          ✕
        </button>

        {/* Back */}
        {step !== 'login' && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-1 text-sm font-display font-bold text-ink/70 hover:text-ink"
          >
            ← Voltar
          </button>
        )}

        {step === 'login' && (
          <>
            <div className="text-center mb-6">
              <h2 className="h-md text-purple mb-1">Gamellito</h2>
              <p className="text-ink text-sm">Faça login na sua conta</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Email">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className={inputClass} placeholder="seu@email.com" autoFocus />
              </Field>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-ink">Senha</label>
                  <Link href="/auth/esqueci-senha" onClick={onClose} className="text-xs text-purple font-bold hover:underline">
                    Esqueci minha senha
                  </Link>
                </div>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required
                  className={inputClass} placeholder="Sua senha" />
              </div>

              {error && <ErrorBox message={error} />}

              <GamButton type="submit" disabled={loading} variant="primary" className="w-full">
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
              <GoogleIcon />
              Entrar com Google
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-ink opacity-70">
                Não tem conta?{' '}
                <button type="button" onClick={() => { setError(''); setStep('select-role'); }} className="text-purple font-bold hover:underline">
                  Cadastre-se
                </button>
              </p>
            </div>
          </>
        )}

        {step === 'select-role' && (
          <>
            <div className="text-center mb-6">
              <p className="eyebrow on-creme">Bora, Gamellito!</p>
              <h2 className="h-md mb-2">Escolha seu perfil</h2>
              <p className="text-sm text-ink/70">Para continuar o cadastro</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SIGNUP_ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); setStep('signup'); }}
                  className={`
                    card ${r.color} text-left transition-all duration-150 ease-out flex items-center gap-4 py-3 px-4
                    hover:-translate-x-px hover:-translate-y-px hover:shadow-pop-lg
                    active:translate-x-[3px] active:translate-y-[3px] active:shadow-pop-press
                    ${r.color === 'bg-cream' ? 'text-ink' : 'text-white'}
                  `}
                  data-test={`btn-role-${r.id}`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full border-2 border-ink flex-none ${r.dot}`} />
                  <span className="text-3xl flex-none">{r.icon}</span>
                  <span>
                    <span className="block font-display font-bold text-base">{r.label}</span>
                    <span className="block text-xs opacity-80">{r.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'signup' && role && (
          <>
            <div className="text-center mb-6">
              <h2 className="h-md text-purple mb-1">Criar Conta</h2>
              <p className="text-ink/60 text-sm">{SIGNUP_ROLES.find((r) => r.id === role)?.label}</p>
            </div>

            <SignupForm role={role} onSuccess={onClose} />
          </>
        )}
      </div>
    </div>
  );
}
