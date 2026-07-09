'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';

interface Permissao {
  id: string;
  usuario_acesso: string;
  tipo_acesso: string;
  criado_em: string;
  profissional?: { name: string; especialidade: string };
}

export default function CompartilharPage() {
  const params = useParams();
  const [qrCode, setQrCode] = useState('');
  const [email, setEmail] = useState('');
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadPermissoes();
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const token = Math.random().toString(36).substr(2, 9);
      const inviteLink = `${window.location.origin}/convites/${token}`;
      const qr = await QRCode.toDataURL(inviteLink);
      setQrCode(qr);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const loadPermissoes = async () => {
    try {
      const response = await fetch('/api/permissoes');
      const data = await response.json();
      setPermissoes(data.permissoes || []);
    } catch (error) {
      console.error('Error loading permissoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Digite um email válido');
        return;
      }

      const response = await fetch('/api/permissoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'convite_email',
          email_destino: email,
        }),
      });

      if (response.ok) {
        alert('✅ Convite enviado! O profissional receberá um email com o link.');
        setEmail('');
        loadPermissoes();
      } else {
        const error = await response.json();
        setError(error.error || 'Erro ao enviar convite');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      setError('Erro ao enviar convite');
    } finally {
      setSending(false);
    }
  };

  const handleRevogar = async (permissaoId: string) => {
    if (!confirm('Tem certeza que deseja revogar este acesso?')) return;

    try {
      const response = await fetch(`/api/permissoes/${permissaoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Acesso revogado com sucesso');
        loadPermissoes();
      } else {
        alert('Erro ao revogar acesso');
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      alert('Erro ao revogar acesso');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-purple-main mb-2">
          🔗 Compartilhar Dados
        </h1>
        <p className="text-dark-gray">
          Compartilhe dados com profissionais de saúde para melhor acompanhamento
        </p>
      </div>

      {/* QR Code Section */}
      <GamCard surface="white">
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-dark-gray mb-4">
            📱 Compartilhar via QR Code
          </h3>
          <p className="text-sm text-dark-gray opacity-70 mb-6">
            Peça ao profissional para escanear este código
          </p>
          {qrCode && (
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border-[3px] border-ink">
                <img src={qrCode} alt="QR Code" width={200} height={200} />
              </div>
            </div>
          )}
          <GamButton
            onClick={generateQRCode}
            variant="secondary"
            size="sm"
          >
            🔄 Regenerar QR Code
          </GamButton>
        </div>
      </GamCard>

      {/* Email Section */}
      <GamCard surface="cream">
        <h3 className="text-xl font-bold text-dark-gray mb-4">
          📧 Compartilhar via Email
        </h3>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">
              Email do Profissional
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="medico@clinic.com"
                required
                className="flex-1 px-4 py-2 bg-white border-[3px] border-ink rounded-lg text-dark-gray placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
              />
              <GamButton
                type="submit"
                disabled={sending}
                variant="primary"
              >
                {sending ? 'Enviando...' : '✉️ Enviar'}
              </GamButton>
            </div>
          </div>
          {error && (
            <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
        </form>
      </GamCard>

      {/* Permissões Ativas */}
      <div>
        <h2 className="text-2xl font-display font-bold text-purple-main mb-4">
          ✅ Acesso Concedido ({permissoes.length})
        </h2>

        {loading ? (
          <GamCard surface="white">
            <div className="text-center py-6">
              <p className="text-gray-400">Carregando...</p>
            </div>
          </GamCard>
        ) : permissoes.length > 0 ? (
          <div className="space-y-3">
            {permissoes.map((perm) => (
              <GamCard key={perm.id} surface="white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-dark-gray text-lg">
                      👨‍⚕️ {perm.profissional?.name || 'Profissional'}
                    </p>
                    <p className="text-sm text-dark-gray opacity-70">
                      {perm.profissional?.especialidade || 'Sem especialidade'}
                    </p>
                    <p className="text-xs text-dark-gray opacity-50 mt-2">
                      Acesso: {perm.tipo_acesso}
                    </p>
                    <p className="text-xs text-dark-gray opacity-50">
                      Desde:{' '}
                      {new Date(perm.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevogar(perm.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-all"
                  >
                    🚫 Revogar
                  </button>
                </div>
              </GamCard>
            ))}
          </div>
        ) : (
          <GamCard surface="purple">
            <div className="text-center py-8">
              <p className="text-dark-gray opacity-70">
                Você ainda não compartilhou dados com ninguém
              </p>
              <p className="text-sm text-dark-gray opacity-50 mt-2">
                Use o QR Code ou envie um email para compartilhar com um profissional
              </p>
            </div>
          </GamCard>
        )}
      </div>

      {/* Info Box - LGPD */}
      <GamCard surface="purple">
        <div className="p-4">
          <p className="text-sm font-medium text-dark-gray mb-2">🔒 Privacidade e Segurança</p>
          <p className="text-xs text-dark-gray opacity-80">
            Você controla quem tem acesso aos seus dados. Todos os compartilhamentos
            estão criptografados e protegidos por LGPD. Você pode revogar o acesso
            a qualquer momento.
          </p>
        </div>
      </GamCard>
    </div>
  );
}
