import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="surface foot pt-16 pb-8">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-3.5">
              <Image src="/assets/gamellito-logo.svg" alt="" width={46} height={46} className="w-[46px] h-[46px]" />
              <Image src="/assets/wordmark-clean.svg" alt="Gamellito" width={140} height={30} className="h-[30px] w-auto" />
            </div>
            <p className="font-body text-sm leading-relaxed text-cream/85 max-w-[280px]">
              Tecnologia que acolhe, educa e gera resultados. A gente transforma o difícil em aventura.
            </p>
          </div>
          <div>
            <div className="col-h">Navegação</div>
            <div className="links">
              <Link href="/">Início</Link>
              <Link href="/sobre">Sobre</Link>
              <Link href="/ecossistema">Ecossistema</Link>
              <Link href="/biblioteca">Biblioteca de artigos</Link>
              <Link href="/sobre">Prêmios</Link>
              <Link href="/contato">Parceiros</Link>
              <Link href="/contato">Contato</Link>
              <Link href="/loja">Loja</Link>
              <Link href="/auth/login">Diário</Link>
            </div>
          </div>
          <div>
            <div className="col-h">Contato</div>
            <div className="flex flex-col gap-[11px]">
              <a href="https://instagram.com/gamellitoltda" target="_blank" rel="noreferrer">
                <span className="w-[9px] h-[9px] rounded-full bg-game-pink inline-block" />
                @gamellitoltda
              </a>
              <a href="https://gamellito.org.br" target="_blank" rel="noreferrer">
                <span className="w-[9px] h-[9px] rounded-full bg-game-blue inline-block" />
                gamellito.org.br
              </a>
              <a href="mailto:gamellitoltda@gmail.com">
                <span className="w-[9px] h-[9px] rounded-full bg-game-green inline-block" />
                gamellitoltda@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[.14] mt-9 pt-5 text-center font-body text-xs text-cream/70">
          © {new Date().getFullYear()} Gamellito Ltda. Todos os direitos reservados. ·{' '}
          <Link href="/privacidade" className="!inline underline">Privacidade</Link> ·{' '}
          <Link href="/termos" className="!inline underline">Termos</Link>
        </div>
      </div>
    </footer>
  );
}
