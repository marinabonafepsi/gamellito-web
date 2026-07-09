'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacidadePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-fluid-3xl font-display font-bold text-purple-main mb-8">
            Política de Privacidade
          </h1>

          <div className="space-y-8 text-dark-gray">
            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                1. Introdução
              </h2>
              <p>
                Gamellito ("nós", "nosso" ou "a Empresa") opera a plataforma Gamellito. Esta página informa você sobre as nossas políticas de coleta, uso e divulgação de dados pessoais quando você usa nosso serviço.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                2. Coleta de Dados
              </h2>
              <p>
                Coletamos vários tipos de informações para diversos propósitos:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Dados de conta: nome, email, telefone</li>
                <li>Dados de saúde: registros de glicemia, alimentação, atividades</li>
                <li>Dados de uso: páginas visitadas, tempo gasto, interações</li>
                <li>Dados técnicos: endereço IP, navegador, dispositivo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                3. Uso dos Dados
              </h2>
              <p>
                Utilizamos os dados coletados para:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência</li>
                <li>Comunicação com você</li>
                <li>Conformidade com lei aplicável</li>
                <li>Análise e pesquisa</li>
              </ul>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                4. Proteção de Dados
              </h2>
              <p>
                Implementamos medidas de segurança apropriadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                5. Compartilhamento de Dados
              </h2>
              <p>
                Não vendemos seus dados pessoais a terceiros. Podemos compartilhar dados com:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Profissionais de saúde autorizados por você</li>
                <li>Prestadores de serviço que nos auxiliam</li>
                <li>Autoridades legais quando requerido por lei</li>
              </ul>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                6. Seus Direitos
              </h2>
              <p>
                De acordo com a LGPD, você tem o direito de:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de dados</li>
                <li>Revogar seu consentimento</li>
                <li>Portar seus dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                7. Retenção de Dados
              </h2>
              <p>
                Mantemos seus dados pessoais pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                8. Alterações à Esta Política
              </h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre mudanças publicando a nova política nesta página.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                9. Contato
              </h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:
              </p>
              <p className="mt-3 font-medium">
                📧 Email: privacidade@gamellito.com<br />
                🏢 Endereço: São Paulo, SP - Brasil
              </p>
            </section>
          </div>

          <p className="text-center text-medium-gray text-sm mt-12 pt-8 border-t border-light-gray">
            Última atualização: 01 de Julho de 2026
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
