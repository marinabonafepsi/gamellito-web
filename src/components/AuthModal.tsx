'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { translateAuthError } from '@/lib/auth-errors';

type Role = 'familia' | 'dm1' | 'educador' | 'profissional' | 'instituicao';
type Step = 'login' | 'select-role' | 'signup';

const ROLES: { id: Role; label: string; icon: string; description: string; color: string; dot: string }[] = [
  {
    id: 'familia',
    label: 'Sou Pai/Responsável',
    icon: '👨‍👩‍👧',
    description: 'Acompanhe a saúde do seu filho',
    color: 'bg-orange',
    dot: 'bg-game-pink',
  },
  {
    id: 'dm1',
    label: 'Sou Pessoa com DM1',
    icon: '🧑',
    description: 'Acompanhe sua própria saúde',
    color: 'bg-game-blue',
    dot: 'bg-game-pink',
  },
  {
    id: 'educador',
    label: 'Sou Professor',
    icon: '👨‍🏫',
    description: 'Compartilhe recursos com alunos',
    color: 'bg-lilac',
    dot: 'bg-game-green',
  },
  {
    id: 'profissional',
    label: 'Sou Profissional de Saúde',
    icon: '👨‍⚕️',
    description: 'Acesse dados de seus pacientes',
    color: 'bg-purple-soft',
    dot: 'bg-game-blue',
  },
  {
    id: 'instituicao',
    label: 'Sou de uma Instituição',
    icon: '🏫',
    description: 'Gerencie sua escola/clínica',
    color: 'bg-cream',
    dot: 'bg-sun',
  },
];

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  familia: '/familia/dashboard',
  dm1: '/familia/dashboard',
  profissional: '/profissional/dashboard',
  educador: '/educador/dashboard',
  instituicao: '/instituicao/dashboard',
};

interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nome: string;
  nomeCrianca?: string;
  dataNascimento?: string;
  crmCoren?: string;
  estado?: string;
  especialidade?: string;
  nomeInstituicao?: string;
  cnpj?: string;
  tipoInstituicao?: string;
  aceitoTermos: boolean;
  permitirCompartilhamento: boolean;
  permitirEmails: boolean;
  permitirAnalytics: boolean;
}

const initialForm: SignupFormData = {
  email: '',
  password: '',
  passwordConfirm: '',
  nome: '',
  nomeCrianca: '',
  dataNascimento: '',
  crmCoren: '',
  estado: '',
  especialidade: '',
  nomeInstituicao: '',
  cnpj: '',
  tipoInstituicao: 'escola',
  aceitoTermos: false,
  permitirCompartilhamento: false,
  permitirEmails: false,
  permitirAnalytics: false,
};

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('login');
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<SignupFormData>(initialForm);
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
    if (oauthError) setError(oauthError.message);
  };

  const handleGoogleSignup = async (signupRole: Role) => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?role=${signupRole}` },
    });
    if (oauthError) setError(oauthError.message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError('');
    setLoading(true);

    try {
      if (!formData.aceitoTermos) throw new Error('Você deve aceitar os termos de serviço');
      if (formData.password !== formData.passwordConfirm) throw new Error('As senhas não correspondem');
      if (formData.password.length < 8) throw new Error('A senha deve ter pelo menos 8 caracteres');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role,
            nome: formData.nome,
            ...(role === 'familia' && {
              nomeCrianca: formData.nomeCrianca,
              dataNascimentoCrianca: formData.dataNascimento,
            }),
            ...(role === 'dm1' && { dataNascimento: formData.dataNascimento }),
            ...(role === 'profissional' && {
              crmCoren: formData.crmCoren,
              estado: formData.estado,
              especialidade: formData.especialidade,
            }),
            ...(role === 'instituicao' && {
              nomeInstituicao: formData.nomeInstituicao,
              cnpj: formData.cnpj,
              tipoInstituicao: formData.tipoInstituicao,
            }),
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar usuário');

      // Perfil, consentimentos e evento de novo usuário são criados por um
      // trigger no banco (on_auth_user_created), não aqui — o client não tem
      // sessão ativa neste momento quando a confirmação de email é exigida.

      onClose();
      router.push(DASHBOARD_BY_ROLE[role]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'familia':
        return (
          <>
            <Field label="Nome da Criança">
              <input type="text" name="nomeCrianca" value={formData.nomeCrianca} onChange={handleChange} required
                className={inputClass} placeholder="Marina" />
            </Field>
            <Field label="Data de Nascimento">
              <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required
                className={inputClass} />
            </Field>
          </>
        );
      case 'dm1':
        return (
          <Field label="Sua Data de Nascimento">
            <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required
              className={inputClass} />
          </Field>
        );
      case 'profissional':
        return (
          <>
            <Field label="CRM / COREN">
              <input type="text" name="crmCoren" value={formData.crmCoren} onChange={handleChange} required
                className={inputClass} placeholder="12345/SP" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Estado">
                <select name="estado" value={formData.estado} onChange={handleChange} required className={inputClass}>
                  <option value="">Selecione...</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  <option value="BA">BA</option>
                </select>
              </Field>
              <Field label="Especialidade">
                <select name="especialidade" value={formData.especialidade} onChange={handleChange} required className={inputClass}>
                  <option value="">Selecione...</option>
                  <option value="medico">Médico</option>
                  <option value="nutricionista">Nutricionista</option>
                  <option value="psicólogo">Psicólogo</option>
                  <option value="enfermeiro">Enfermeiro</option>
                </select>
              </Field>
            </div>
          </>
        );
      case 'instituicao':
        return (
          <>
            <Field label="Nome da Instituição">
              <input type="text" name="nomeInstituicao" value={formData.nomeInstituicao} onChange={handleChange} required
                className={inputClass} placeholder="Escola X" />
            </Field>
            <Field label="CNPJ">
              <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required
                className={inputClass} placeholder="00.000.000/0000-00" />
            </Field>
            <Field label="Tipo">
              <select name="tipoInstituicao" value={formData.tipoInstituicao} onChange={handleChange} required className={inputClass}>
                <option value="escola">Escola</option>
                <option value="clinica">Clínica</option>
                <option value="hospital">Hospital</option>
                <option value="ubs">UBS</option>
                <option value="ong">ONG</option>
              </select>
            </Field>
          </>
        );
      default:
        return null;
    }
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
              <Field label="Senha">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className={inputClass} placeholder="Sua senha" />
              </Field>

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
              {ROLES.map((r) => (
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
              <p className="text-ink/60 text-sm">{ROLES.find((r) => r.id === role)?.label}</p>
            </div>

            {error && <ErrorBox message={error} className="mb-4" />}

            <button
              type="button"
              onClick={() => handleGoogleSignup(role)}
              className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-ink rounded-full shadow-pop py-2.5 px-5 mb-5 font-display font-bold text-ink transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-pop-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-pop-press"
            >
              <GoogleIcon />
              Cadastrar com Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-ink/12" />
              <span className="text-ink/60 text-xs font-body">ou com email</span>
              <div className="flex-1 h-px bg-ink/12" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <Field label="Email">
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="seu@email.com" />
              </Field>
              <Field label={role === 'familia' ? 'Seu Nome' : 'Nome Completo'}>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className={inputClass} placeholder="Seu Nome" />
              </Field>

              {renderRoleSpecificFields()}

              <Field label="Senha">
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className={inputClass} placeholder="Mínimo 8 caracteres" />
              </Field>
              <Field label="Confirmar Senha">
                <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required className={inputClass} placeholder="Confirme sua senha" />
              </Field>

              <div className="bg-white p-4 rounded-[16px] space-y-3 border-[3px] border-ink">
                <label className="flex items-start gap-3 text-xs text-ink/80">
                  <input type="checkbox" name="aceitoTermos" checked={formData.aceitoTermos} onChange={handleChange} required className="mt-1" />
                  <span>
                    Aceito os{' '}
                    <Link href="/termos" className="underline hover:text-purple" target="_blank">Termos de Serviço</Link>{' '}e{' '}
                    <Link href="/privacidade" className="underline hover:text-purple" target="_blank">Política de Privacidade</Link>
                    {' '}(obrigatório)
                  </span>
                </label>
                <label className="flex items-start gap-3 text-xs text-ink/80">
                  <input type="checkbox" name="permitirCompartilhamento" checked={formData.permitirCompartilhamento} onChange={handleChange} />
                  Permitir compartilhamento de dados com profissionais de saúde
                </label>
                <label className="flex items-start gap-3 text-xs text-ink/80">
                  <input type="checkbox" name="permitirEmails" checked={formData.permitirEmails} onChange={handleChange} />
                  Receber emails sobre atualizações
                </label>
                <label className="flex items-start gap-3 text-xs text-ink/80">
                  <input type="checkbox" name="permitirAnalytics" checked={formData.permitirAnalytics} onChange={handleChange} />
                  Participar de análise anônima para melhorar o serviço
                </label>
              </div>

              <GamButton type="submit" disabled={loading} variant="primary" className="w-full">
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </GamButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const inputClass = 'w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink mb-2">{label}</label>
      {children}
    </div>
  );
}

function ErrorBox({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div className={`bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold ${className}`}>
      {message}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32z" />
      <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.44l-3.23-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H1.06v2.58A10 10 0 0 0 10 20z" />
      <path fill="#FBBC05" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.52H1.06a10 10 0 0 0 0 8.96l3.35-2.58z" />
      <path fill="#EA4335" d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.06 5.52L4.4 8.1C5.2 5.74 7.4 3.98 10 3.98z" />
    </svg>
  );
}
