import { Instagram, Globe, Mail } from "@/components/icons";
import { siteAssets } from "@/components/SiteAssets";

const FooterSection = () => {
  return (
    <footer id="contato" className="bg-gradient-to-r from-gamellito-space via-gamellito-purple/60 to-gamellito-space border-t border-gamellito-purple/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={siteAssets.gamellitoFelizMaoNaBarriga} alt="Gamellito" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="font-display text-2xl font-bold text-primary">
                  Gamellito <span className="text-sm font-normal text-primary-foreground/85">Ltda.</span>
                </h3>
              </div>
            </div>
            <p className="text-primary-foreground/90 font-body text-sm leading-relaxed">
              Tecnologia que acolhe, educa e gera resultados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">
              Navegação
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Sobre", href: "#sobre" },
                { label: "Para Famílias", href: "#familias" },
                { label: "Programas", href: "#solucoes" },
                { label: "Prêmios", href: "#premios" },
                { label: "Parceiros", href: "#parceiros" },
                { label: "Contato", href: "#contato" },
                { label: "Loja", href: "/loja" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">
              Contato
            </h4>
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

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/80 font-body">
            © {new Date().getFullYear()} Gamellito Ltda. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
