import { Instagram, Globe, Mail } from "@/components/icons";

const FooterSection = () => {
  return (
    <footer id="contato" className="relative overflow-hidden bg-gamellito-space">
      {/* Background pattern (similar to navbar) */}
      <img
        src="/characters/gamellito-navbar-bg.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-right opacity-30"
      />

      <div className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/characters/gamellito-logo.svg" alt="Gamellito" className="w-14 h-14 object-contain" />
              <img src="/characters/gamellito-wordmark.svg" alt="Gamellito Ltda." className="h-10 object-contain" />
            </div>
            <p className="text-primary-foreground/90 font-body text-sm leading-relaxed">
              Tecnologia que acolhe, educa e gera resultados.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-display font-bold text-primary mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                { label: "Início", href: "/#inicio" },
                { label: "Sobre", href: "/#sobre" },
                { label: "Ecossistema", href: "/para-familias" },
                { label: "Contato", href: "/#contato" },
                { label: "Loja", href: "/loja" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display font-bold text-primary mb-4">Contato</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/gamellitoltda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body"
              >
                <Instagram className="w-4 h-4" />
                @gamellitoltda
              </a>
              <a
                href="https://gamellito.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body"
              >
                <Globe className="w-4 h-4" />
                gamellito.org.br
              </a>
              <a
                href="mailto:gamellitoltda@gmail.com"
                className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body"
              >
                <Mail className="w-4 h-4" />
                gamellitoltda@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center">
          <p className="text-xs text-primary-foreground/70 font-body">
            © {new Date().getFullYear()} Gamellito Ltda. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
