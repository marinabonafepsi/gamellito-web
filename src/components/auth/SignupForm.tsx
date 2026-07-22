'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { PasswordInput } from '@/components/ds/PasswordInput';
import { translateAuthError } from '@/lib/auth-errors';
import { DASHBOARD_BY_ROLE, type Role } from '@/lib/auth-roles';
import { Field, ErrorBox, GoogleIcon, inputClass } from './AuthFormBits';

interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nome: string;
  // Família
  nomeCrianca?: string;
  dataNascimentoCrianca?: string;
  codigoFamilia?: string;
  // Profissional
  crmCoren?: string;
  estado?: string;
  especialidade?: string;
  // Instituição
  nomeInstituicao?: string;
  cnpj?: string;
  tipoInstituicao?: string;
  // Consentimentos
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
};

interface SignupFormProps {
  role: Role;
  // Chamado logo antes do redirecionamento pós-cadastro (ex.: fechar a
  // AuthModal). A página cheia de cadastro não precisa passar nada.
  onSuccess?: () => void;
}

export function SignupForm({ role, onSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleSignup = async () => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?role=${role}` },
    });
    if (oauthError) setError(translateAuthError(oauthError.message));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              dataNascimentoCrianca: formData.dataNascimentoCrianca,
              codigoFamilia: formData.codigoFamilia || undefined,
            }),
            ...(role === 'dm1' && { dataNascimento: formData.dataNascimentoCrianca }),
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

      onSuccess?.();
      router.push(DASHBOARD_BY_ROLE[role]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? translateAuthError(err.message) : 'Erro ao criar conta');
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
                className={inputClass} placeholder="Ex: Ana" />
            </Field>
            <Field label="Data de Nascimento">
              <input type="date" name="dataNascimentoCrianca" value={formData.dataNascimentoCrianca} onChange={handleChange} required
                className={inputClass} />
            </Field>
            <Field label="Código da família (opcional)">
              <input type="text" name="codigoFamilia" value={formData.codigoFamilia} onChange={handleChange} maxLength={8}
                className={`${inputClass} uppercase`} placeholder="Se a criança/adolescente já tem conta" />
              <p className="text-xs text-ink/50 mt-1">
                Se quem tem DM1 já criou a própria conta, peça o código de família a ela em Minha conta.
              </p>
            </Field>
          </>
        );
      case 'dm1':
        return (
          <Field label="Sua Data de Nascimento">
            <input type="date" name="dataNascimentoCrianca" value={formData.dataNascimentoCrianca} onChange={handleChange} required
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
    <>
      {error && <ErrorBox message={error} className="mb-4" />}

      <button
        type="button"
        onClick={handleGoogleSignup}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input type="email" name="email" value={formData.email} onChange={handleChange} required
            className={inputClass} placeholder="seu@email.com" />
        </Field>
        <Field label={role === 'familia' || role === 'dm1' ? 'Seu Nome' : 'Nome Completo'}>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
            className={inputClass} placeholder="Seu Nome" />
        </Field>

        {renderRoleSpecificFields()}

        <Field label="Senha">
          <PasswordInput name="password" value={formData.password} onChange={handleChange} required minLength={8}
            className={inputClass} placeholder="Mínimo 8 caracteres" />
        </Field>
        <Field label="Confirmar Senha">
          <PasswordInput name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required
            className={inputClass} placeholder="Confirme sua senha" />
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
  );
}
