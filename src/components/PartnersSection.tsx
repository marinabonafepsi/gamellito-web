"use client";

import { motion } from "framer-motion";
import { University, Hospital, FlaskConical, Handshake } from "@/components/icons";
import { AssetImage } from "@/components/SiteAssets";

const partners = [
  {
    icon: University,
    name: "UEL",
    fullName: "Universidade Estadual de Londrina",
    description:
      "Parceira acadêmica desde o início. O Gamellito é usado como parte dos projetos de extensão, pesquisa e ensino da universidade.",
  },
  {
    icon: FlaskConical,
    name: "USP",
    fullName: "Universidade de São Paulo",
    description:
      "Berço do projeto — o Gamellito nasceu como tese de doutorado no Instituto de Psicologia da USP.",
  },
  {
    icon: Hospital,
    name: "AEHU/UEL",
    fullName: "Ambulatório de Especialidades do HU",
    description:
      "Ações semanais de educação em saúde com pacientes pediátricos com DM1 há mais de 23 anos.",
  },
  {
    icon: Handshake,
    name: "Instituto Benfazer",
    fullName: "ONG parceira",
    description:
      "Parceria pela Lei Rouanet para captação de recursos e expansão cultural do projeto.",
  },
];

const PartnersSection = () => {
  return (
    <section id="parceiros" className="py-32 bg-gamellito-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Parceiros & <span className="text-primary">Universidades</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body mb-6">
            O Gamellito é fruto de parcerias acadêmicas e sociais que
            transformam pesquisa em impacto real.
          </p>
          <AssetImage
            asset="gamellitoEAmigos"
            alt="Gamellito e amigos — parcerias"
            className="w-36 h-auto mx-auto opacity-90"
            width={144}
            height={90}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border text-center hover:border-primary/30 transition-colors"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <partner.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                {partner.name}
              </h3>
              <p className="text-xs text-primary font-body font-bold mb-3">
                {partner.fullName}
              </p>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-card rounded-2xl p-8 border border-border text-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="text-muted-foreground font-body text-lg max-w-3xl mx-auto">
            A UEL pode utilizar o Gamellito como parte de seus projetos
            acadêmicos de extensão, ensino e pesquisa. O site atual do projeto
            está em{" "}
            <a
              href="https://gamellito.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline"
            >
              gamellito.org.br
            </a>{" "}
            (domínio da UEL), e esta plataforma nasce como o novo lar
            independente da marca <strong>Gamellito Ltda.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
