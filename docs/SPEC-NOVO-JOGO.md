# Especificação — Integrar um Novo Jogo ao Site Gamellito

> **Para o dev alocado:** este documento contém tudo que você precisa para construir e integrar um jogo dentro da aba **Jogos** do site Gamellito.  
> Repositório: `https://github.com/marinabonafepsi/gamellito-web`  
> Branch de trabalho: crie uma branch a partir de `main`, ex: `feat/nome-do-jogo`

---

## 1. Visão geral da arquitetura de jogos

O site tem **três modos** para exibir um jogo na página `/jogos/experimente`:

| Modo | Variável `.env.local` | Quando usar |
|------|----------------------|-------------|
| **light** (padrão) | `NEXT_PUBLIC_GAME_MODE=light` | Jogo feito em React, rodando dentro do site |
| **embed local** | `NEXT_PUBLIC_GAME_MODE=embed` | Jogo em HTML/JS puro dentro de `/public/` |
| **embed externo** | `NEXT_PUBLIC_GAME_MODE=embed` + `NEXT_PUBLIC_GAME_EMBED_URL=https://...` | Jogo hospedado em outro servidor (itch.io, Vercel, etc.) |

**Recomendação para este projeto:** use o modo **embed externo** se o jogo for feito em Unity/Godot/outro engine exportado para web, ou o modo **light** se for feito em React puro.

---

## 2. Setup do repositório

```bash
# 1. Clone o repositório
git clone https://github.com/marinabonafepsi/gamellito-web.git
cd gamellito-web

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente local
cp .env.example .env.local   # se não existir, crie o .env.local manualmente

# 4. Rode o servidor de desenvolvimento
npm run dev
# → site disponível em http://localhost:8080
```

### Conteúdo do `.env.local` para desenvolvimento

```bash
# Modo de exibição do jogo
NEXT_PUBLIC_GAME_MODE=embed

# URL do jogo (troque pelo endereço do seu jogo)
NEXT_PUBLIC_GAME_EMBED_URL=http://localhost:3000

# API base do jogo (se precisar de backend)
GAMELLITO_APP_API_URL=http://localhost:3000/api
```

---

## 3. Registrar o novo jogo no catálogo

Edite o arquivo **`src/lib/games.ts`** e adicione um novo objeto ao array `games`:

```ts
// src/lib/games.ts
export const games: Game[] = [
  {
    // Jogo existente
    slug: "gamellito-adventures",
    nome: "Gamellito Adventures",
    resumo: "...",
    publicoAlvo: "crianças, adolescentes e famílias",
    objetivosEmSaude: "...",
    linkJogo: "https://gamellito.org.br",
    status: "disponivel",
  },

  // ─── ADICIONE AQUI O NOVO JOGO ───
  {
    slug: "nome-do-jogo",                           // URL-friendly, sem espaços
    nome: "Nome Completo do Jogo",                  // Exibido na listagem e na página
    resumo: "Descrição breve — 1 ou 2 frases.",     // Card na listagem /jogos
    publicoAlvo: "crianças de 6 a 14 anos",         // Público-alvo principal
    objetivosEmSaude: "Objetivo educacional/saúde do jogo.",
    linkJogo: "https://url-do-jogo.com",            // URL para jogar (ou /demo-game/)
    status: "disponivel",                           // "disponivel" | "em_pesquisa" | "em_teste"
  },
];
```

Com isso, o jogo aparece automaticamente em:
- **`/jogos`** — listagem com card
- **`/jogos/nome-do-jogo`** — página de detalhes com botão "Jogar agora"

---

## 4. Integrar o jogo na aba "Experimente" (`/jogos/experimente`)

### Opção A — Jogo externo (iframe, recomendado para Unity/Godot/HTML exportado)

1. Hospede o jogo em algum serviço (Vercel, Netlify, itch.io, GitHub Pages, etc.) com **HTTPS**.
2. No `.env.local` (ou no painel de deploy):
   ```bash
   NEXT_PUBLIC_GAME_MODE=embed
   NEXT_PUBLIC_GAME_EMBED_URL=https://url-do-jogo.com
   ```
3. Reinicie o servidor — o jogo aparecerá em `/jogos/experimente` dentro do iframe.

**Requisitos para o jogo funcionar no iframe:**

```
✅ Responsivo: o canvas/container deve ocupar 100% de largura e 100vh de altura
✅ Touch/mobile: suporte a touchstart/click para celulares
✅ HTTPS: obrigatório para não bloquear conteúdo misto
✅ Leve: prefira assets comprimidos (WebP, áudio comprimido)
✅ Sem bloqueio de iframe: não use X-Frame-Options: DENY ou SAMEORIGIN
```

O iframe já vem configurado com:
```html
allow="fullscreen; gamepad"
sandbox="allow-scripts allow-same-origin"
```
Se o jogo precisar de outras permissões (ex: `pointer-lock`), edite `app/jogos/experimente/page.tsx`.

---

### Opção B — Jogo local em HTML/JS puro (dentro do `/public`)

1. Crie a pasta `public/nome-do-jogo/` com o `index.html` e os assets do jogo.
2. No `.env.local`:
   ```bash
   NEXT_PUBLIC_GAME_MODE=embed
   NEXT_PUBLIC_GAME_EMBED_URL=/nome-do-jogo/
   ```
3. Acesse em `http://localhost:8080/jogos/experimente`.

Referência: `public/demo-game/index.html` — minijogo da geladeira em HTML puro.

---

### Opção C — Jogo em React (componente dentro do site)

1. Crie seus componentes em `src/components/game-light/` (ao lado dos existentes).
2. Edite `app/jogos/experimente/page.tsx` para importar e renderizar seu componente no lugar de `<GameContainer />`.
3. Mantenha `NEXT_PUBLIC_GAME_MODE=light`.

Referência: `src/components/game-light/GameContainer.tsx` e `src/hooks/useFridgeGame.ts`.

---

## 5. Design system — o que o jogo deve respeitar

### Paleta de cores

| Token | Uso |
|-------|-----|
| `#7C3AED` (gamellito-purple) | Cor primária |
| `#FF8C00` (gamellito-orange) | Destaques, CTAs |
| `#E8003D` (gamellito-mae-red) | Alertas, emoção |
| `#22C55E` (gamellito-health-green) | Saúde, progresso |
| `#0EA5E9` (gamellito-blue) | Info, tipos |
| `#EAB308` (gamellito-yellow) | Conquistas, estrelas |
| `#0F1A2E` (gamellito-space) | Fundo escuro |

### Tipografia

- **Display/títulos:** fonte `Pangolin` (cursive, lúdica)
- **Corpo/texto:** fonte `Roboto` (clean, legível)

### Personagem Gamellito

O mascote é um personagem ilustrado disponível em SVG em `/public/assets/`:

| Asset | Uso recomendado no jogo |
|-------|------------------------|
| `gamellito-contente.svg` | Tela inicial, vitória, feedback positivo |
| `gamellito-furioso.svg` | Erro, frustração, glicemia alta/baixa |
| `gamellito-feliz-mao-na-barriga.svg` | Logo, ícone, tela de carregamento |
| `gamellito-corpinho.svg` | Personagem jogável, destaque |
| `pancreas-preguicoso.svg` | Explicações sobre DM1 |
| `mae-gamellito-glicemia.svg` | Monitoramento, família |

Use esses assets para manter consistência visual com o site.

---

## 6. Estrutura de arquivos que você vai tocar

```
gamellito-web/
├── src/lib/
│   └── games.ts              ← OBRIGATÓRIO: adicionar o novo jogo aqui
│
├── app/jogos/
│   ├── page.tsx              ← listagem (automática via games.ts)
│   ├── [slug]/page.tsx       ← página de detalhes (automática via games.ts)
│   └── experimente/
│       └── page.tsx          ← se precisar customizar a tela do jogo
│
├── src/components/game-light/ ← Opção C: componentes do jogo em React
│
├── public/
│   └── nome-do-jogo/         ← Opção B: jogo em HTML estático
│
└── .env.local                ← variáveis de ambiente (não commitar)
```

---

## 7. Checklist de entrega

Antes de abrir o Pull Request, confirme:

- [ ] Objeto do jogo adicionado em `src/lib/games.ts` com `status: "disponivel"`
- [ ] Jogo aparece na listagem `/jogos` com card correto
- [ ] Página `/jogos/nome-do-jogo` carrega sem erro (título, resumo, botão "Jogar agora")
- [ ] Jogo funciona em `/jogos/experimente` (iframe ou componente React)
- [ ] Responsivo: testado em mobile (375px) e desktop (1280px)
- [ ] Touch: interações funcionam no celular
- [ ] Sem erro de console crítico (404 de assets, CORS, etc.)
- [ ] PR aberto na branch `feat/nome-do-jogo` apontando para `main`

---

## 8. Páginas de referência no site

| Página | URL | Arquivo |
|--------|-----|---------|
| Seção Jogos (home) | `/#jogos` | `src/components/GamesSection.tsx` |
| Listagem de jogos | `/jogos` | `app/jogos/page.tsx` |
| Detalhes do jogo | `/jogos/[slug]` | `app/jogos/[slug]/page.tsx` |
| Experimente | `/jogos/experimente` | `app/jogos/experimente/page.tsx` |
| Jogo atual (referência) | `https://gamellito.org.br` | — |

---

## 9. Dúvidas e contato

- **Repositório GitHub:** `https://github.com/marinabonafepsi/gamellito-web`
- **Instagram:** [@gamellito](https://instagram.com/gamellito)
- **Email:** gamellitoltda@gmail.com

> Leia também: `docs/JOGO-EMBED.md` — documentação técnica completa sobre os modos de embed.
