# Diretriz mobile do Gamellito

Este documento é a referência permanente para qualquer trabalho de navegação/IA no site. **Toda página ou componente novo deve ser pensado mobile-first**, porque a maior parte do uso real é em celular e porque as decisões de navegação de hoje são a base do app nativo que o Gamellito deve ganhar quando o ecossistema tiver monetização — um bottom tab bar bem pensado agora vira o tab bar nativo depois sem redesenho; um `display:none` de navegação sem substituto não migra pra lugar nenhum.

A skill `.claude/skills/mobile-ux-review/SKILL.md` aplica essas regras automaticamente em revisões de código. Este documento é o "porquê" e o inventário por trás dela — ambos devem ser mantidos junto quando a IA do site mudar.

## Princípio central

Responsivo não é o mesmo que mobile-first. Encolher texto e empilhar botões evita que a tela quebre, mas não decide o que é primário, o que vira gaveta/sheet, e o que precisa de um padrão de navegação diferente (tab bar vs. hamburger vs. nada). Todo componente novo deve responder, antes de codar:
1. O que esse usuário precisa primeiro nessa tela, no celular?
2. O que é secundário e pode virar sheet/expansão, em vez de só encolher?
3. A navegação primária sobrevive em todos os breakpoints, ou desaparece em algum?
4. Se a ação é feita com uma mão só / sob estresse (ex.: registrar glicemia), ela está na metade inferior da tela?

## Status por área (auditoria de 2026-07-10)

### 🔴 Corrigido nesta rodada — Dashboard (família / educador / profissional)
`DashboardShell.tsx` + `DashboardShell.module.css` — usado pelos 3 papéis via `familia/dashboard`, `educador/dashboard`, `profissional/dashboard`.
- **Sidebar sumia abaixo de 680px sem substituto** (`module.css:150`) — sem navegação nenhuma no mobile. **Fix:** bottom tab bar fixo, reaproveitando os itens reais de cada variante (não os itens que já eram duplicados do "início" — ver abaixo).
- **"Conquistas" e "Loja" apontavam pro mesmo link** (`/loja`) — removido o item "Conquistas" da sidebar/tab bar; o painel de medalhas já existe inline no dashboard da família, não precisa de uma página própria ainda.
- **"+ Registrar glicemia" enterrado** depois de topbar + 3 cards + card de continuar + trilhas. **Fix:** botão flutuante (FAB) fixo no canto inferior, visível só no mobile, só na variante `dm1` — alcance de polegar, sem precisar rolar.
- **Alvos de toque pequenos** no botão de fechar modal (`.mx`) e no botão "+ Submeter artigo" (`.sh button`) — aumentados para a área mínima de toque confortável.
- **Sem suporte a safe-area** (notch/home indicator do iPhone) em lugar nenhum do site — adicionado `viewport-fit=cover` + `env(safe-area-inset-bottom)` no tab bar novo, porque qualquer barra fixa no rodapé precisa disso.

### 🟡 Corrigido nesta rodada — Entrada (login/cadastro)
Hoje existem **dois fluxos de autenticação paralelos**: o modal `AuthModal.tsx` (aberto pelo botão "Entrar" do `Navbar.tsx`) e páginas cheias equivalentes (`/auth/login`, `/auth/select-role`, `/auth/signup/[role]`), já usadas como destino de redirecionamento quando uma rota protegida exige login.
- Modal centralizado sobre o conteúdo é um padrão de desktop — em mobile o padrão nativo é tela cheia, sem nada "por trás" competindo pela atenção.
- **Fix:** no mobile (`md:hidden`), o botão "Entrar" do Navbar agora leva direto para `/auth/login` (página cheia, já existente), em vez de abrir o `AuthModal`. No desktop (`md:`) continua abrindo o modal, sem mudança. Não foi necessário criar nada novo — o fluxo de página cheia já existia e só não era o destino padrão no mobile.
- Isso também é a resposta direta ao "o entrar pode ser diferente" — no dashboard (onde o usuário já está logado a maior parte do tempo), a tela de entrada deixa de competir por espaço com a UI real; ela agora só aparece como uma tela própria e completa.

### 🟢 Auditado, sem ação necessária
- `Navbar.tsx` (nav do site/portais fora do dashboard) — já tem o padrão correto: linha de links some (`hidden md:flex`) pareada com hamburger (`md:hidden`) que abre um dropdown mobile. Usar como referência para qualquer nav nova.
- Grids responsivos padrão (`.agrid` na Biblioteca, `.role-stage .cards` na seleção de papel, grid da Loja, grid do Footer, `.wrap`/`.sec-pad` em `globals.css`) — todos colapsam pra 1 coluna em telas pequenas sem perder conteúdo ou navegação. Nenhum é um caso de "nav sumindo".

### ⚪ Fora de escopo por enquanto (documentado, não implementado)
- **Admin e Instituição são stubs** ("Portal em desenvolvimento") — quando ganharem conteúdo real, aplicar esta mesma diretriz (e a skill) desde o primeiro commit, não depois.
- **Página da Loja (`/loja`) não renderiza `Navbar` nem `Footer`** — quem chega lá (de qualquer tela, mobile ou desktop) fica sem navegação de volta a não ser o botão "voltar" do navegador. Isso não é um problema *mobile* especificamente (afeta desktop igual), por isso não foi resolvido nesta rodada focada em mobile — mas é um débito real a resolver separadamente.
- **Nav padrão do Navbar para o papel `educador`** (`Recursos` → `/educador/recursos`, `Forum` → `/educador/forum`) aponta pra rotas que não existem no app hoje (só `/educador/dashboard` e `/educador/perfil` existem). Não é um problema de mobile, é um link morto — vale uma limpeza à parte.
- Duas rotas de "Aprendizado" nas variantes `prof`/`saude` do `NAV_BY_VARIANT` já apontavam pro próprio dashboard (redundância pré-existente na sidebar desktop). O tab bar novo não repete essa redundância (ver seção técnica abaixo), mas a sidebar desktop em si não foi alterada — considerar limpar isso numa passada geral de nav depois.

## Diretriz técnica para o bottom tab bar (padrão a reaproveitar)

Sempre que uma nova área do dashboard precisar de navegação mobile, usar o mesmo padrão já implementado em `DashboardShell.tsx`:
- Máximo de 5 abas. Se sobrar destino, ele vira "Mais" ou entra no menu de conta — não vira uma 6ª aba espremida.
- Cada aba usa o mesmo tom/cor (`--game-*`) já associado àquele link na sidebar (bolinha colorida `s.nd`), pra manter consistência visual entre desktop e mobile.
- Fixo no rodapé, com `padding-bottom: env(safe-area-inset-bottom)` e o conteúdo da página com padding inferior equivalente à altura da barra, pra nada ficar escondido atrás dela.
- Ações urgentes/uma-mão-só (registrar algo, confirmar algo) não entram como aba — viram um FAB (botão flutuante) acima da tab bar, do jeito que foi feito para "+ Registrar glicemia".

## Quando revisitar este documento
- Sempre que uma nova página/portal for ao ar (Admin, Instituição).
- Sempre que o app nativo entrar em planejamento de verdade — nesse ponto, os padrões aqui (tab bar, FAB, tela cheia de auth) são o ponto de partida, não o resultado final.
