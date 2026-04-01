# Como embedar o jogo no site (share web game)

Este doc explica como exibir um jogo leve dentro do site na aba **Experimente**, para crianças experimentarem sem sair da página.

---

## Fluxo local pronto (8080 + 3000)

Para visualizar o jogo que foi feito no seu ambiente local:

1. **Suba o jogo/app na porta 3000** (projeto `gamellito-app/web-light`):
   ```bash
   npm install
   npm run dev
   ```
2. **Suba o site na porta 8080** (projeto `gamellito-web`):
   ```bash
   npm install
   npm run dev
   ```
3. **Acesse no navegador**:
   - `http://localhost:8080/jogo` (redireciona para `/jogos/experimente`)
   - `http://localhost:8080/jogos/experimente`

O arquivo `.env.local` já pode usar:

```bash
NEXT_PUBLIC_GAME_EMBED_URL=http://localhost:3000
GAMELLITO_APP_API_URL=http://localhost:3000/api
```

---

## Modo `light` (padrão): geladeira no React

- **Página:** `/jogos/experimente` com `NEXT_PUBLIC_GAME_MODE=light` (ou sem definir).
- **Implementação:** componentes em `src/components/game-light/`, estado em `src/hooks/useFridgeGame.ts` (abrir/fechar, lanches, **sequência**, **satisfação**, variedade; persistência `localStorage` chave `gamellito-web-fridge-v2`, com migração automática a partir de `gamellito-web-fridge-v1`).
- **Jogabilidade:** pontos por abertura + bônus por lanche (e por lanche novo), barra de satisfação, combo ao fechar depois de escolher lanche, meta de provar todos os itens. Animações com Framer Motion na cena. Protótipos mais completos costumam estar em pastas como `gamellito-app` ou `Gamellito_rebirth` no mesmo ambiente — o modo web é independente e focado no site.
- **Loop antigo (3 tarefas / glicemia):** mantido só em `src/hooks/useGameState.ts` para eventual reutilização; **não** é usado nesta página após o refactor.

## Onde está (embed / demo estático)

- **Página:** `/jogos/experimente` — com `NEXT_PUBLIC_GAME_MODE=embed`, usa **iframe**.
- **Minijogo estático:** `public/demo-game/index.html` — mesma ideia (geladeira + lanches), HTML puro alinhado ao modo light.
- **Navegação:** link **Experimente** no menu e botão **Experimente um jogo** na seção Jogos da home.

Variáveis úteis:

```bash
# embed = iframe; light = React no site
NEXT_PUBLIC_GAME_MODE=light
```

---

## Usar seu próprio jogo (URL externa)

Se você tiver um jogo web em outro domínio (ex.: projeto “share web game”, itch.io, ou servidor próprio):

1. **Variável de ambiente**  
   No `.env.local` (ou no painel da Vercel/hosting), defina:
   ```bash
   NEXT_PUBLIC_GAME_EMBED_URL=https://seu-jogo.exemplo.com/
   ```
   A URL deve ser a página **jogável** do jogo (ex.: `index.html` ou a rota que abre o canvas).

2. **Reinicie o servidor**  
   Após alterar variáveis que começam com `NEXT_PUBLIC_`, rode de novo `npm run dev` (ou faça um novo deploy).

3. **Comportamento**  
   A página `/jogos/experimente` usa um **iframe** com `src` igual a `NEXT_PUBLIC_GAME_EMBED_URL`. Se a variável não existir, usa o minijogo local `/demo-game/`.

---

## API do jogo via localhost:8080

Quando o jogo (no `gamellito-app`) precisa acessar API, use o proxy do site:

- Endpoint no site: `/api/jogo/:path*`
- Destino padrão: `http://localhost:3000/api/:path*`
- Variável para trocar destino: `GAMELLITO_APP_API_URL`

Exemplo de `.env.local` no site:

```bash
# URL do jogo para o iframe
NEXT_PUBLIC_GAME_EMBED_URL=http://localhost:3000

# Base da API do gamellito-app (sem barra no final)
GAMELLITO_APP_API_URL=http://localhost:3000/api
```

No frontend do jogo, prefira chamar a API por caminho relativo (ex.: `/api/jogo/scores`) quando estiver embutido no site.

---

## Boas práticas para o jogo embedado

Para funcionar bem dentro do iframe e em mobile:

- **Responsivo:** o jogo deve se adaptar à largura/altura do iframe (ex.: canvas ou container com `width: 100%`; `height: 100%` ou `100vh`).
- **Touch:** suporte a toque (eventos `touchstart` / `click`) para celulares e tablets.
- **Leve:** evite assets pesados; assim a aba “Experimente” continua rápida.
- **HTTPS:** a URL do jogo deve ser HTTPS para não dar problema de conteúdo misto no site.
- **Cross-origin:** se o jogo estiver em outro domínio, o iframe já faz o isolamento; não é necessário CORS para apenas exibir o jogo.

---

## Atributos do iframe (segurança e acessibilidade)

Na página `app/jogos/experimente/page.tsx` o iframe usa:

- `title="Jogo Gamellito — experimente tocar no personagem"` — acessibilidade.
- `allow="fullscreen; gamepad"` — permite tela cheia e gamepad quando o jogo precisar.
- `sandbox="allow-scripts allow-same-origin"` — restringe o que o conteúdo do iframe pode fazer, mantendo scripts e mesma origem para o jogo carregar assets do seu domínio.

Se no futuro o jogo precisar de mais permissões (ex.: `allow="fullscreen; gamepad; pointer-lock"`), basta ajustar o `allow` nesse iframe.

---

## Resumo

| Objetivo                         | Ação |
|----------------------------------|------|
| Jogo leve no site (geladeira, React) | `NEXT_PUBLIC_GAME_MODE=light` (padrão) — ver `useFridgeGame` e `GameContainer`. |
| Usar o minijogo estático no iframe | `NEXT_PUBLIC_GAME_MODE=embed`; opcionalmente ajuste `NEXT_PUBLIC_GAME_EMBED_URL` (padrão `/demo-game/`). |
| Usar seu jogo em outro link      | Defina `NEXT_PUBLIC_GAME_EMBED_URL` com a URL do jogo. |
| Mudar texto da aba / botão      | Edite `app/jogos/experimente/page.tsx` e `GamesSection.tsx`. |
