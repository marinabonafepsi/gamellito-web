import { Instagram, Globe, Mail } from "@/components/icons";

const FooterSection = () => {
  return (
    <footer id="contato" className="bg-gamellito-space py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand — mesmo mascote do header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/characters/gamellito-logo.svg" alt="Gamellito" className="w-12 h-12 object-contain" />
              <img src="/characters/gamellito-wordmark.svg" alt="Gamellito Ltda." className="h-8 object-contain" />
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
            <div className="space-y-2">
              {["Sobre", "Jogos", "Soluções", "Prêmios", "Parceiros"].map(
                (label) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                    className="block text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body"
                  >
                    {label}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">
              Contato
            </h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/gamellito"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-foreground/90 hover:text-primary transition-colors font-body"
              >
                <Instagram className="w-4 h-4" />
                @gamellito
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
