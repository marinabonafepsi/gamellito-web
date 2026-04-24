# Gamellito Web

Site institucional da **Gamellito Ltda** — plataforma de jogos digitais e materiais lúdicos para educação em saúde no Diabetes Tipo 1.

> **Stack:** Next.js 16 · React · TypeScript · Tailwind CSS · Framer Motion

---

## Para o dev: integrar um novo jogo

Se você foi alocado para construir e integrar um jogo na seção **Jogos** do site, leia primeiro:

📄 **[`docs/SPEC-NOVO-JOGO.md`](./docs/SPEC-NOVO-JOGO.md)** — especificação completa com setup, estrutura de dados, opções de integração e checklist de entrega.

📄 **[`docs/JOGO-EMBED.md`](./docs/JOGO-EMBED.md)** — detalhes técnicos sobre embed via iframe (modos light, embed local e embed externo).

---

## Rodar o projeto localmente

```bash
# 1. Clone o repositório
git clone https://github.com/marinabonafepsi/gamellito-web.git
cd gamellito-web

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
# → http://localhost:8080
```

### Variáveis de ambiente (opcional)

Crie um arquivo `.env.local` na raiz se quiser configurar o modo do jogo:

```bash
# Modo do jogo: "light" (React nativo) ou "embed" (iframe)
NEXT_PUBLIC_GAME_MODE=light

# URL do jogo se modo embed
NEXT_PUBLIC_GAME_EMBED_URL=/demo-game/
```

---

## Estrutura de pastas

```
gamellito-web/
├── app/                        # Páginas (Next.js App Router)
│   ├── page.tsx                # Home
│   ├── para-familias/          # Sessão de pais/diagnóstico
│   ├── jogos/                  # Listagem e detalhes dos jogos
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   │   └── experimente/page.tsx
│   └── ...
├── src/
│   ├── components/             # Componentes React
│   │   ├── Navbar.tsx
│   │   ├── GamesSection.tsx    # Seção de jogos na home
│   │   ├── game-light/         # Minijogo da geladeira (React)
│   │   └── games/GameCard.tsx  # Card de jogo na listagem
│   ├── hooks/
│   │   └── useFridgeGame.ts    # Estado do minijogo
│   └── lib/
│       └── games.ts            # ← AQUI ficam os dados dos jogos
├── public/
│   ├── assets/                 # Ilustrações e mascote Gamellito
│   └── demo-game/              # Minijogo estático (HTML puro)
└── docs/
    ├── SPEC-NOVO-JOGO.md       # Guia para o dev do novo jogo
    └── JOGO-EMBED.md           # Detalhes técnicos de embed
```

---

## Páginas do site

| Rota | Descrição |
|------|-----------|
| `/` | Home com todas as seções |
| `/para-familias` | Curadoria de informações para pais no diagnóstico |
| `/jogos` | Listagem de jogos disponíveis |
| `/jogos/[slug]` | Página de detalhes de cada jogo |
| `/jogos/experimente` | Jogo interativo embutido |
| `/para-profissionais` | Área para profissionais de saúde |
| `/projeto-gamellito` | Sobre o projeto |
| `/parcerias-uel` | Parceria com a UEL |

---

## Contato

- **Instagram:** [@gamellito](https://instagram.com/gamellito)
- **Email:** gamellitoltda@gmail.com
- **Site:** [gamellito.org.br](https://gamellito.org.br)
