"use client";

import { motion } from "framer-motion";
import { ChefHat, Gamepad2, GraduationCap, BookOpen } from "@/components/icons";
import { AssetImage, type SiteAssetKey } from "@/components/SiteAssets";

const solutions: Array<{
  icon: typeof ChefHat;
  title: string;
  description: string;
  asset: SiteAssetKey;
}> = [
  {
    icon: ChefHat,
    title: "Oficinas culinárias e alimentação",
    description:
      "Oficinas que promovem aprendizado prático sobre alimentação saudável e contagem de carboidratos, com participação ativa das crianças na elaboração de receitas e reprodução em casa. Contribuem para a melhoria de parâmetros clínicos e maior conscientização sobre os cuidados com a alimentação.",
    asset: "geladeira",
  },
  {
    icon: Gamepad2,
    title: "Jogos educativos e método Gamellito",
    description:
      "Atividades com o método Gamellito: recursos lúdicos e interativos para facilitar a compreensão do manejo do DM1. Jogos educativos, dinâmicas em grupo e práticas recreativas que estimulam a autonomia e a adesão ao tratamento por parte de crianças, adolescentes e familiares.",
    asset: "pancreasPreguicoso",
  },
  {
    icon: GraduationCap,
    title: "Rodas de conversa e equipe multidisciplinar",
    description:
      "Rodas de conversa e intervenções que abordam adesão ao tratamento, reconhecimento de sinais de descompensação glicêmica e importância do monitoramento glicêmico. Equipe de nutrição, psicologia, artes cênicas, design gráfico, educação física, serviço social, odontologia, enfermagem e oftalmologia.",
    asset: "medicoMaeGamellito",
  },
  {
    icon: BookOpen,
    title: "Materiais educativos e alcance digital",
    description:
      "Materiais educativos digitais e impressos: jogos, histórias em quadrinhos, vídeos e telenovela educativa, em linguagem acessível. Disponibilizados em plataformas digitais, redes sociais e canais institucionais da UEL para ampliar o acesso e reforçar os conteúdos das oficinas presenciais.",
    asset: "maeGamellitoGlicemia",
  },
];

const resultados = [
  "Maior autonomia no manejo do DM1 e adesão às práticas de autocuidado",
  "Melhora no controle glicêmico e redução da variabilidade das glicemias",
  "Fortalecimento do vínculo entre equipe, usuários e famílias",
  "Base para políticas públicas e alinhamento ao ODS 3.4.1 (Agenda 2030 ONU)",
];

const SolutionsSection = () => {
  return (
    <section id="solucoes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            🏥 Soluções para{" "}
            <span className="text-primary">Saúde Pública</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body mb-4">
            Promoção do autocuidado e educação em saúde para crianças e adolescentes com Diabetes Mellitus Tipo 1. O projeto promove atenção integral e cuidado multidisciplinar por meio de ações interdisciplinares no Ambulatório de Especialidades do Hospital Universitário (AEHU/UEL).
          </p>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Desde 2023, atividades semanais com foco em prevenção de complicações, reabilitação e fortalecimento do autocuidado, valorizando o trabalho colaborativo e a construção coletiva do conhecimento.
          </p>
          <AssetImage
            asset="bicicleta"
            alt="Vida ativa e saúde — Gamellito"
            className="w-32 h-auto mx-auto mt-6 opacity-90"
            width={128}
            height={80}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all group"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <sol.icon className="w-7 h-7 text-primary" />
                </div>
                <AssetImage
                  asset={sol.asset}
                  alt=""
                  className="w-20 h-auto flex-shrink-0 opacity-80"
                  width={80}
                  height={50}
                />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {sol.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {sol.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Resultados e parceria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-card rounded-2xl p-8 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <h4 className="font-display font-bold text-xl text-foreground mb-4">
              Resultados e impacto
            </h4>
            <ul className="space-y-3">
              {resultados.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-muted-foreground font-body leading-relaxed"
                >
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted rounded-2xl p-8 border border-border">
            <h4 className="font-display font-bold text-xl text-foreground mb-4">
              Parceria UEL e AEHU
            </h4>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              O projeto é desenvolvido em parceria com a Universidade Estadual de Londrina (UEL) e o Ambulatório de Especialidades do Hospital Universitário (AEHU/UEL). São oferecidas 40 vagas mensais para crianças e adolescentes com DM1 e seus pais ou responsáveis, com acompanhamento regular e atividades educativas interdisciplinares desde 2023.
            </p>
            <p className="text-sm text-muted-foreground font-body">
              A iniciativa se alinha ao Objetivo de Desenvolvimento Sustentável 3.4.1 da Agenda 2030 da ONU, que busca reduzir a mortalidade por doenças crônicas não transmissíveis por meio da prevenção e do tratamento adequado.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionsSection;
