'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { GamButton } from '@/components/ds/GamButton';

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="eyebrow on-creme">Sobre a gente</p>
          <h1 className="h-lg mb-8">
            Sobre <span className="hl-orange">Gamellito</span>
          </h1>

          <div className="space-y-8 text-ink">
            <section>
              <h2 className="h-md text-purple mb-4">
                Nossa Missão
              </h2>
              <p className="lead leading-relaxed">
                Gamellito é uma plataforma gamificada de saúde digital que torna o acompanhamento de crianças com Diabetes Mellitus Tipo 1 (DM1) uma experiência divertida e envolvente. Conectamos famílias, profissionais de saúde e educadores em um ecossistema colaborativo.
              </p>
            </section>

            <section>
              <h2 className="h-md text-purple mb-4">
                Como Funciona
              </h2>
              <div className="space-y-4">
                <div className="card">
                  <div className="flex items-center gap-2 mb-2"><span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-blue" /><h3 className="font-display font-bold text-purple">Para Famílias</h3></div>
                  <p>
                    Registre alimentação, glicemia e atividades em um diário interativo. Ganhe moedas e desbloqueie prêmios conforme avança no controle da saúde.
                  </p>
                </div>

                <div className="card card-cream">
                  <div className="flex items-center gap-2 mb-2"><span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-orange" /><h3 className="font-display font-bold text-purple">Para Profissionais</h3></div>
                  <p>
                    Acompanhe seus pacientes em tempo real, receba alertas importantes e gere relatórios detalhados. Integre-se ao diário para orientações personalizadas.
                  </p>
                </div>

                <div className="card">
                  <div className="flex items-center gap-2 mb-2"><span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-green" /><h3 className="font-display font-bold text-purple">Para Educadores</h3></div>
                  <p>
                    Eduque grupos de crianças sobre DM1 através de recursos interativos e gamificados. Acompanhe progresso coletivo e individual.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="h-md text-purple mb-4">
                Nossos Valores
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bullet !mt-0">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-orange mt-1.5" />
                  <div>
                    <strong className="text-purple">Saúde em Primeiro Lugar</strong>
                    <p>Todas as funcionalidades são baseadas em evidências e diretrizes médicas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bullet">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-blue mt-1.5" />
                  <div>
                    <strong className="text-purple">Colaboração</strong>
                    <p>Famílias, profissionais e educadores trabalham juntos.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bullet">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-green mt-1.5" />
                  <div>
                    <strong className="text-purple">Segurança e Privacidade</strong>
                    <p>Conformidade total com LGPD e padrões de proteção de dados.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bullet">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-pink mt-1.5" />
                  <div>
                    <strong className="text-purple">Diversão</strong>
                    <p>A saúde não precisa ser chata. Gamificação torna o cuidado engajante.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/auth/select-role">
              <GamButton variant="primary" size="lg">
                Começar Agora
              </GamButton>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
