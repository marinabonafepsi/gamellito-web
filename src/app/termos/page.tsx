'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-fluid-3xl font-display font-bold text-purple-main mb-8">
            Termos de Serviço
          </h1>

          <div className="space-y-8 text-dark-gray">
            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e usar a plataforma Gamellito, você concorda em estar vinculado por estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, por favor, não use a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                2. Uso Apropriado
              </h2>
              <p>
                Você concorda em usar Gamellito apenas para fins legais e de forma que não infrinja os direitos de terceiros ou restrinja seu uso e gozo.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                3. Contas de Usuário
              </h2>
              <p>
                Ao criar uma conta, você é responsável por manter a confidencialidade da sua senha e por todas as atividades que ocorrem na sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                4. Isenção de Responsabilidade
              </h2>
              <p>
                Gamellito é fornecida "no estado em que se encontra". Não garantimos que o serviço será ininterrupto ou livre de erros.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                5. Limitação de Responsabilidade
              </h2>
              <p>
                Em nenhum caso Gamellito será responsável por danos indiretos, acidentais, especiais ou consequentes.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                6. Alterações dos Termos
              </h2>
              <p>
                Gamellito reserva o direito de modificar estes Termos a qualquer momento. As mudanças serão efetivas imediatamente após a publicação.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                7. Rescisão
              </h2>
              <p>
                Podemos encerrar sua conta a qualquer momento, por qualquer razão, sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                8. Lei Aplicável
              </h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-fluid-2xl font-display font-bold text-purple-main mb-4">
                Contato
              </h2>
              <p>
                Se tiver dúvidas sobre estes Termos, entre em contato conosco em contato@gamellito.com
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
