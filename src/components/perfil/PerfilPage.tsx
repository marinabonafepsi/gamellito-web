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

interface VinculoFamilia {
  id: string;
  nome: string;
  criadoEm: string;
  dm1UserId?: string;
}

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
  const [vinculosComoDm1, setVinculosComoDm1] = useState<VinculoFamilia[]>([]);
  const [vinculosComoFamilia, setVinculosComoFamilia] = useState<VinculoFamilia[]>([]);
  const [codigoGerado, setCodigoGerado] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [familiaLoading, setFamiliaLoading] = useState(false);
  const [familiaError, setFamiliaError] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  const loadVinculos = async () => {
    const res = await fetch('/api/familia/vinculos');
    if (!res.ok) return;
    const data = await res.json();
    setVinculosComoDm1(data.vinculosComoDm1 || []);
    setVinculosComoFamilia(data.vinculosComoFamilia || []);
  };

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

        if (profile.role === 'dm1' || profile.role === 'familia') {
          loadVinculos();
        }
      }
      setLoading(false);
    };
    load();
  }, [supabase, router]);

  const handleGerarCodigo = async () => {
    setFamiliaLoading(true);
    setFamiliaError('');
    try {
      const res = await fetch('/api/familia/codigo', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar código');
      setCodigoGerado(data.codigo);
    } catch (err) {
      setFamiliaError(err instanceof Error ? err.message : 'Erro ao gerar código');
    } finally {
      setFamiliaLoading(false);
    }
  };

  const handleResgatarCodigo = async () => {
    if (!codigoDigitado.trim()) return;
    setFamiliaLoading(true);
    setFamiliaError('');
    try {
      const res = await fetch('/api/familia/vinculos/resgatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoDigitado.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao vincular');
      setCodigoDigitado('');
      await loadVinculos();
    } catch (err) {
      setFamiliaError(err instanceof Error ? err.message : 'Erro ao vincular');
    } finally {
      setFamiliaLoading(false);
    }
  };

  const handleDesvincular = async (id: string) => {
    if (!confirm('Desfazer esse vínculo de família?')) return;
    await fetch(`/api/familia/vinculos/${id}`, { method: 'DELETE' });
    await loadVinculos();
  };

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
          <span className="role-badge mb-3" style={{ background: ROLE_ART[role].bg }}>
            <Image src={ROLE_ART[role].art} alt="" width={40} height={40} />
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

      {role === 'dm1' && (
        <GamCard surface="cream" className="mb-4">
          <h2 className="font-display font-bold text-ink mb-1">Vincular com a família</h2>
          <p className="text-ink/60 text-sm mb-4">
            Gere um código pra que seus pais/responsáveis acompanhem seu diário de glicemia,
            sem mexer na sua trilha de aprendizado.
          </p>

          {codigoGerado && (
            <div className="text-center bg-white border-[3px] border-ink rounded-[16px] py-4 mb-4">
              <p className="font-display font-extrabold text-2xl tracking-[0.2em] text-purple">
                {codigoGerado}
              </p>
              <p className="text-ink/50 text-xs mt-1">Válido por 7 dias</p>
            </div>
          )}

          <GamButton
            type="button"
            onClick={handleGerarCodigo}
            disabled={familiaLoading}
            variant="secondary"
            className="w-full mb-2"
          >
            {familiaLoading ? 'Gerando...' : 'Gerar código de família'}
          </GamButton>

          {familiaError && <p className="text-game-red text-sm font-bold mt-2">{familiaError}</p>}

          {vinculosComoDm1.length > 0 && (
            <div className="mt-4 space-y-2">
              {vinculosComoDm1.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between bg-white border-2 border-ink rounded-[14px] px-4 py-2"
                >
                  <span className="text-sm font-bold text-ink">{v.nome}</span>
                  <button
                    type="button"
                    onClick={() => handleDesvincular(v.id)}
                    className="text-xs text-game-red font-bold hover:underline"
                  >
                    Desvincular
                  </button>
                </div>
              ))}
            </div>
          )}
        </GamCard>
      )}

      {role === 'familia' && (
        <GamCard surface="cream" className="mb-4">
          <h2 className="font-display font-bold text-ink mb-1">Vínculo de família</h2>

          {vinculosComoFamilia.length > 0 ? (
            <div className="space-y-2">
              {vinculosComoFamilia.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between bg-white border-2 border-ink rounded-[14px] px-4 py-2"
                >
                  <Link
                    href={`/familia/vinculo/${v.dm1UserId}`}
                    className="text-sm font-bold text-ink hover:underline"
                  >
                    Diário de {v.nome}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDesvincular(v.id)}
                    className="text-xs text-game-red font-bold hover:underline"
                  >
                    Desvincular
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-ink/60 text-sm mb-4">
                Se quem tem DM1 já tem a própria conta, peça o código de família a ela em
                Minha conta para acompanhar o diário de glicemia por aqui.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigoDigitado}
                  onChange={(e) => setCodigoDigitado(e.target.value.toUpperCase())}
                  maxLength={8}
                  placeholder="CÓDIGO"
                  className="flex-1 px-4 py-2 bg-white border-[3px] border-ink rounded-[16px] text-ink uppercase placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                />
                <GamButton
                  type="button"
                  onClick={handleResgatarCodigo}
                  disabled={familiaLoading || !codigoDigitado.trim()}
                  variant="secondary"
                >
                  Vincular
                </GamButton>
              </div>
              {familiaError && <p className="text-game-red text-sm font-bold mt-2">{familiaError}</p>}
            </>
          )}
        </GamCard>
      )}

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
