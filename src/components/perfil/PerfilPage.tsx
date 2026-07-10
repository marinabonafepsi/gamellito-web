'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';

const AVATARES = [
  { id: 'feliz', emoji: '😊', label: 'Feliz' },
  { id: 'animado', emoji: '🤩', label: 'Animado' },
  { id: 'raiva', emoji: '😠', label: 'Raiva' },
  { id: 'medo', emoji: '😨', label: 'Medo' },
] as const;

const ROLE_LABEL: Record<string, string> = {
  familia: 'Pai/Responsável',
  dm1: 'Pessoa com DM1',
  profissional: 'Profissional de Saúde',
  educador: 'Professor',
  instituicao: 'Instituição',
  admin: 'Administrador',
};

// Mesma arte/cor usada em cada papel na tela de seleção (/auth/select-role),
// pra manter a identidade visual do papel reconhecível do cadastro até o perfil.
const ROLE_ART: Record<string, { art: string; bg: string }> = {
  familia: { art: '/assets/gamellito-e-amigos.svg', bg: '#FFE1EE' },
  dm1: { art: '/assets/gamellito-e-amigos.svg', bg: '#FFE1EE' },
  profissional: { art: '/assets/medico-mae-gamellito.svg', bg: '#DDEBFF' },
  educador: { art: '/assets/gamellito-adventures.svg', bg: '#E4F5D0' },
  instituicao: { art: '/assets/gamellito-contente.svg', bg: '#FFF3C9' },
  admin: { art: '/assets/gamellito-logo.svg', bg: '#FFF3C9' },
};

interface PerfilPageProps {
  voltarHref: string;
}

export function PerfilPage({ voltarHref }: PerfilPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState<string>('feliz');
  const [coins, setCoins] = useState(0);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name, role, avatar, coins')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setName(profile.name || '');
        setRole(profile.role || '');
        setAvatar(profile.avatar || 'feliz');
        setCoins(profile.coins || 0);
      }
      setLoading(false);
    };
    load();
  }, [supabase, router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ name, avatar })
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return null;

  return (
    <div className="max-w-md mx-auto">
      <Link
        href={voltarHref}
        className="mb-6 inline-flex items-center gap-1 text-sm font-display font-bold text-ink/70 hover:text-ink"
      >
        ← Voltar
      </Link>

      <div className="text-center mb-6">
        {ROLE_ART[role] && (
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border-[3px] border-ink mb-3"
            style={{ background: ROLE_ART[role].bg }}
          >
            <Image src={ROLE_ART[role].art} alt="" width={40} height={40} className="w-10 h-10 object-contain" />
          </span>
        )}
        <h1 className="h-md text-purple mb-1">Meu perfil</h1>
        <p className="text-ink/60 text-sm">{ROLE_LABEL[role] || role}</p>
      </div>

      <GamCard surface="white" className="mb-4">
        <div className="flex items-center gap-[11px] mb-6">
          <span className="coin-ico big" />
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-display font-extrabold text-xl text-ink">
              {coins.toLocaleString('pt-BR')}
            </span>
            <span className="font-body font-bold text-[11px] text-ink/60">moedas Gamellito</span>
          </div>
        </div>

        <label className="block text-sm font-bold text-ink mb-2">Avatar</label>
        <div className="flex gap-3 mb-5">
          {AVATARES.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAvatar(a.id)}
              aria-label={a.label}
              aria-pressed={avatar === a.id}
              className={`w-14 h-14 rounded-full border-[3px] border-ink flex items-center justify-center text-2xl transition-all duration-100 ${
                avatar === a.id ? 'bg-sun shadow-pop-sm -translate-x-px -translate-y-px' : 'bg-white'
              }`}
            >
              {a.emoji}
            </button>
          ))}
        </div>

        <label className="block text-sm font-bold text-ink mb-2">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border-[3px] border-ink rounded-[16px] focus:outline-none focus:shadow-pop-sm bg-cream mb-5"
        />

        <label className="block text-sm font-bold text-ink mb-2">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 border-[3px] border-ink/20 rounded-[16px] bg-ink/5 text-ink/50"
        />

        {error && (
          <div className="bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold mt-4">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-game-green/10 border-2 border-game-green rounded-[16px] p-3 text-game-green text-sm font-bold mt-4">
            Perfil salvo!
          </div>
        )}

        <GamButton
          type="button"
          onClick={handleSave}
          disabled={saving}
          variant="primary"
          className="w-full mt-5"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </GamButton>
      </GamCard>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full text-center py-3 font-display font-bold text-sm text-game-red hover:underline"
      >
        Sair da conta
      </button>
    </div>
  );
}
