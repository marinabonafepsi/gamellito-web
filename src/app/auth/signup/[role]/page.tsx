'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { PasswordInput } from '@/components/ds/PasswordInput';

type Role = 'familia' | 'dm1' | 'profissional' | 'educador' | 'instituicao';

interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nome: string;
  // Familia specific
  nomeCrianca?: string;
  dataNascimentoCrianca?: string;
  codigoFamilia?: string;
  // Profissional specific
  crmCoren?: string;
  estado?: string;
  especialidade?: string;
  // Instituição specific
  nomeInstituicao?: string;
  cnpj?: string;
  tipoInstituicao?: string;
  // Consentimentos
  aceitoTermos: boolean;
  permitirCompartilhamento: boolean;
  permitirEmails: boolean;
  permitirAnalytics: boolean;
}

export default function SignupPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const role = params.role as Role;

  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    passwordConfirm: '',
    nome: '',
    nomeCrianca: '',
    dataNascimentoCrianca: '',
    codigoFamilia: '',
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?role=${role}` },
    });
    if (oauthError) setError(oauthError.message);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.aceitoTermos) {
        throw new Error('Você deve aceitar os termos de serviço');
      }

      if (formData.password !== formData.passwordConfirm) {
        throw new Error('As senhas não correspondem');
      }

      if (formData.password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }

      // 1. Criar usuário com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role,
            nome: formData.nome,
            ...(role === 'familia' && {
              nomeCrianca: formData.nomeCrianca,
              dataNascimentoCrianca: formData.dataNascimentoCrianca,
              codigoFamilia: formData.codigoFamilia,
            }),
            ...(role === 'dm1' && {
              dataNascimento: formData.dataNascimentoCrianca,
            }),
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

      // Redirect baseado no role
      const redirects: Record<Role, string> = {
        familia: '/familia/dashboard',
        dm1: '/familia/dashboard',
        profissional: '/profissional/dashboard',
        educador: '/educador/dashboard',
        instituicao: '/instituicao/dashboard',
      };

      router.push(redirects[role]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao criar conta'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'familia':
        return (
          <>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                Nome da Criança
              </label>
              <input
                type="text"
                name="nomeCrianca"
                value={formData.nomeCrianca}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                placeholder="Marina"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="dataNascimentoCrianca"
                value={formData.dataNascimentoCrianca}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink focus:outline-none focus:shadow-pop-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                Código da família (opcional)
              </label>
              <input
                type="text"
                name="codigoFamilia"
                value={formData.codigoFamilia}
                onChange={handleChange}
                maxLength={8}
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 uppercase focus:outline-none focus:shadow-pop-sm"
                placeholder="Se a criança/adolescente já tem conta"
              />
              <p className="text-xs text-ink/50 mt-1">
                Se quem tem DM1 já criou a própria conta, peça o código de família a ela em Minha conta.
              </p>
            </div>
          </>
        );
      case 'dm1':
        return (
          <div>
            <label className="block text-sm font-bold text-ink mb-2">
              Sua Data de Nascimento
            </label>
            <input
              type="date"
              name="dataNascimentoCrianca"
              value={formData.dataNascimentoCrianca}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink focus:outline-none focus:shadow-pop-sm"
            />
          </div>
        );
      case 'profissional':
        return (
          <>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                CRM / COREN
              </label>
              <input
                type="text"
                name="crmCoren"
                value={formData.crmCoren}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                placeholder="12345/SP"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink focus:outline-none focus:shadow-pop-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  <option value="BA">BA</option>
                  {/* Add more states */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Especialidade
                </label>
                <select
                  name="especialidade"
                  value={formData.especialidade}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink focus:outline-none focus:shadow-pop-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="medico">Médico</option>
                  <option value="nutricionista">Nutricionista</option>
                  <option value="psicólogo">Psicólogo</option>
                  <option value="enfermeiro">Enfermeiro</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'instituicao':
        return (
          <>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                Nome da Instituição
              </label>
              <input
                type="text"
                name="nomeInstituicao"
                value={formData.nomeInstituicao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                placeholder="Escola X"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                CNPJ
              </label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-2">
                Tipo
              </label>
              <select
                name="tipoInstituicao"
                value={formData.tipoInstituicao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink focus:outline-none focus:shadow-pop-sm"
              >
                <option value="escola">Escola</option>
                <option value="clinica">Clínica</option>
                <option value="hospital">Hospital</option>
                <option value="ubs">UBS</option>
                <option value="ong">ONG</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="h-md text-purple mb-2">
            Criar Conta
          </h1>
          <p className="text-ink/60">Role: {role}</p>
        </div>

        {error && (
          <div className="bg-game-red/10 border-2 border-game-red rounded-[16px] p-4 mb-6 text-game-red text-sm font-bold">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-ink rounded-full shadow-pop py-2.5 px-5 mb-5 font-display font-bold text-ink transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-pop-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-pop-press"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32z" />
            <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.44l-3.23-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H1.06v2.58A10 10 0 0 0 10 20z" />
            <path fill="#FBBC05" d="M4.4 11.9a6 6 0 0 1 0-3.8V5.52H1.06a10 10 0 0 0 0 8.96l3.35-2.58z" />
            <path fill="#EA4335" d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 10 0 10 10 0 0 0 1.06 5.52L4.4 8.1C5.2 5.74 7.4 3.98 10 3.98z" />
          </svg>
          Cadastrar com Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-ink/12" />
          <span className="text-ink/60 text-xs font-body">ou com email</span>
          <div className="flex-1 h-px bg-ink/12" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
              placeholder="seu@email.com"
            />
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">
              {role === 'familia' || role === 'dm1' ? 'Seu Nome' : 'Nome Completo'}
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
              placeholder="Seu Nome"
            />
          </div>

          {/* Role Specific Fields */}
          {renderRoleSpecificFields()}

          {/* Senha */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">
              Senha
            </label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">
              Confirmar Senha
            </label>
            <PasswordInput
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
              placeholder="Confirme sua senha"
            />
          </div>

          {/* Consentimentos */}
          <div className="bg-cream p-4 rounded-[16px] space-y-3 border-[3px] border-ink">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="aceitoTermos"
                checked={formData.aceitoTermos}
                onChange={handleChange}
                required
                className="mt-1"
              />
              <label className="text-xs text-dark-gray">
                Aceito os{' '}
                <Link href="/termos" className="underline hover:text-purple-main">
                  Termos de Serviço
                </Link>
                {' '}e{' '}
                <Link href="/privacidade" className="underline hover:text-purple-main">
                  Política de Privacidade
                </Link>
                {' '}(obrigatório)
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="permitirCompartilhamento"
                checked={formData.permitirCompartilhamento}
                onChange={handleChange}
              />
              <label className="text-xs text-dark-gray">
                Permitir compartilhamento de dados com profissionais de saúde
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="permitirEmails"
                checked={formData.permitirEmails}
                onChange={handleChange}
              />
              <label className="text-xs text-dark-gray">
                Receber emails sobre atualizações
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="permitirAnalytics"
                checked={formData.permitirAnalytics}
                onChange={handleChange}
              />
              <label className="text-xs text-dark-gray">
                Participar de análise anônima para melhorar o serviço
              </label>
            </div>
          </div>

          {/* Submit */}
          <GamButton
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </GamButton>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-ink/60 text-sm">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-purple-main hover:underline font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
