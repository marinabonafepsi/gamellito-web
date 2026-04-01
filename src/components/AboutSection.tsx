"use client";

import { motion } from "framer-motion";
import { Heart, Gamepad2, GraduationCap, Award } from "@/components/icons";
import { AssetImage } from "@/components/SiteAssets";

const stats = [
  { icon: Heart, label: "Crianças impactadas", value: "2.000+" },
  { icon: Gamepad2, label: "Jogos desenvolvidos", value: "5+" },
  { icon: GraduationCap, label: "Desde", value: "2014" },
  { icon: Award, label: "Prêmios internacionais", value: "5" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Quem é o <span className="text-primary">Gamellito</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-6xl mx-auto font-body">
            Um pet virtual alienígena que ensina crianças com Diabetes Tipo 1 a cuidarem de si mesmas, brincando.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <AssetImage
              asset="gamellitoEAmigos"
              alt="Gamellito e amigos — comunidade e aprendizado"
              className="rounded-2xl w-full max-w-sm mx-auto block"
              width={320}
              height={200}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-foreground font-body text-lg leading-relaxed">
              O <strong className="text-primary">Projeto Gamellito</strong>{" "}
              nasceu em 2014 como parte de um doutorado na USP e se tornou
              referência em educação em saúde gamificada. Através de jogos
              digitais, livros, oficinas culinárias e ações lúdicas, ajudamos
              crianças e adolescentes com DM1 a entenderem e gerenciarem sua
              condição.
            </p>
            <p className="text-foreground font-body text-lg leading-relaxed">
              Gamellito é um "serious game" onde a criança cuida de um
              alienígena que tem diabetes — medindo glicemia, aplicando insulina
              e escolhendo alimentos. Brincando, aprendem a cuidar de si
              próprias.
            </p>
            <p className="text-muted-foreground font-body">
              Validado pela ADJ Diabetes Brasil e desenvolvido em parceria com a
              UEL (Universidade Estadual de Londrina), o projeto integra
              profissionais de nutrição, psicologia, design, educação física e
              mais.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 text-center border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-body mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
