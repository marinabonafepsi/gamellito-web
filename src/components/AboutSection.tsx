"use client";

import { motion } from "framer-motion";
import { Heart, Gamepad2, GraduationCap, Award } from "@/components/icons";
import { AssetImage } from "@/components/SiteAssets";

const stats = [
  { icon: Heart, label: "Crianças impactadas", value: "2.000+" },
  { icon: Gamepad2, label: "Anos de pesquisa", value: "12+" },
  { icon: GraduationCap, label: "Desde", value: "2014" },
  { icon: Award, label: "Prêmios internacionais", value: "5" },
];

const AboutSection = () => {
  return (
    <>
      {/* ── O problema ── */}
      <section id="sobre" data-track-section="sobre" className="py-32 bg-gamellito-cream">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-14 items-center"
          >
            <div>
              <p className="text-primary font-body font-semibold text-sm uppercase tracking-wider mb-3">
                O problema
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 leading-tight">
                Informação não muda comportamento.{" "}
                <span className="text-primary">Experiência sim.</span>
              </h2>
              <div className="space-y-4 font-body text-muted-foreground text-lg leading-relaxed">
                <p>
                  Viver com diabetes na infância é lidar, todos os dias, com
                  escolhas que assustam adultos. A informação existe — o que
                  falta é <strong className="text-foreground">vontade de cuidar</strong>.
                  E vontade não nasce do medo.
                </p>
                <p>
                  Crianças e adolescentes com diabetes precisam de adesão
                  sustentada ao cuidado. Os profissionais de saúde raramente
                  têm ferramentas para ensinar isso de forma envolvente.
                  O resultado é baixa adesão, complicações evitáveis e alto
                  custo para o sistema.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <AssetImage
                asset="gamellitoEAmigos"
                alt="Gamellito e amigos — comunidade e aprendizado"
                className="rounded-3xl w-full max-w-sm mx-auto block"
                width={400}
                height={280}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── A virada ── */}
      <section data-track-section="metodo" className="py-32 bg-gamellito-space relative overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle opacity-40"
            style={{
              top: `${((i * 23 + 11) % 95) + 2}%`,
              left: `${((i * 37 + 19) % 95) + 2}%`,
              animationDelay: `${((i * 71) % 300) / 100}s`,
            }}
          />
        ))}
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Nossa proposta de valor
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              A gente não ensina sobre diabetes.{" "}
              <span className="text-primary">A gente faz a criança querer cuidar de si.</span>
            </h2>
            <p className="font-body text-primary-foreground/85 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              Unimos jogo, narrativa e ilustração a uma base psicológica real
              para transformar o cuidado em algo afetivo, leve e —
              principalmente — <strong className="text-primary">duradouro</strong>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-primary-foreground/5 rounded-2xl p-5 border border-primary-foreground/10"
                >
                  <stat.icon className="w-7 h-7 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-display font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70 font-body mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
