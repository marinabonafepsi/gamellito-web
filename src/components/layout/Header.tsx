import Image from "next/image";
import Link from "next/link";
import { siteAssets } from "@/components/SiteAssets";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/projeto-gamellito", label: "Sobre" },
  { href: "/jogos", label: "Jogos" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/parcerias-uel", label: "Parceiros" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gamellitoPurple bg-gradient-to-r from-gamellitoPurpleDark/95 via-gamellitoPurple/95 to-gamellitoPurpleDark/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
            <Image
              src={siteAssets.gamellitoFelizMaoNaBarriga}
              alt="Gamellito"
              fill
              className="object-contain drop-shadow-lg"
              sizes="40px"
              unoptimized
            />
          </div>
          <span className="font-display text-2xl font-bold text-[#ffd66b]">
            Gamellito
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-white hover:text-[#ffd66b] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

