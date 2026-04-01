import Image from "next/image";
import Link from "next/link";
import { siteAssets } from "@/components/SiteAssets";

export function HomeHero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2b1654] via-[#1a0f3a] to-[#1a0f3a] pt-16"
    >
      {/* Background: imagem + overlay — fundo roxo sempre visível */}
      <div className="absolute inset-0 min-h-screen">
        <Image
          src="/hero-space-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="100vw"
          unoptimized
          priority
        />
        <div
          className="absolute inset-0 bg-[#2b1654]/50"
          aria-hidden
        />
      </div>

      {/* Estrelinhas flutuantes */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#ffd66b] animate-twinkle"
          style={{
            top: `${(i * 7) % 100}%`,
            left: `${(i * 11) % 100}%`,
            animationDelay: `${(i % 3) * 0.8}s`,
            width: 3,
            height: 3,
          }}
        />
      ))}

      {/* Conteúdo: texto + personagem — diagramação igual ao Lovable */}
      <div className="container relative z-10 mx-auto flex flex-col items-center gap-8 px-4 lg:flex-row lg:gap-16">
        {/* Texto: centralizado no mobile, à esquerda no desktop */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-display text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-7xl">
            Gamellito
            <span className="mt-2 block text-3xl text-[#ff8a3c] md:text-4xl">
              Ltda.
            </span>
          </h1>
          <p className="font-body text-lg text-white max-w-xl mb-8 md:text-xl mx-auto lg:mx-0" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            Jogos educativos e soluções criativas para a saúde pública.
            Transformamos o cuidado com o Diabetes Tipo 1 em uma aventura
            lúdica e acolhedora.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
            <Link
              href="/jogos"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff8a3c] px-8 py-4 font-display text-lg font-bold text-white shadow-[0_4px_20px_rgba(255,138,60,0.5)] hover:opacity-90 transition-opacity"
            >
              <span aria-hidden>🎮</span>
              <span>Conheça os Jogos</span>
            </Link>
            <Link
              href="/solucoes"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white/10 px-8 py-4 font-display text-lg font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <span aria-hidden>🏥</span>
              <span>Soluções em Saúde</span>
            </Link>
          </div>
        </div>

        {/* Personagem: só a imagem flutuando, como no Lovable */}
        <div className="flex-shrink-0">
          <div className="animate-float relative w-64 md:w-80 lg:w-96" style={{ height: 384 }}>
            <Image
              src={siteAssets.gamellitoContente}
              alt="Gamellito - mascote"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
              loading="eager"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Indicador de scroll: mouse com bolinha animada */}
      <a
        href="#conteudo"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
        aria-label="Rolar para baixo"
      >
        <div className="flex h-10 w-6 flex-col items-center rounded-full border-2 border-current pt-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff8a3c] animate-scroll-bounce" />
        </div>
      </a>
    </section>
  );
}
