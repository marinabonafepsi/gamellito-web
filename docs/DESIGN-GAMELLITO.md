# Design do Gamellito — como mexer e criar novas formas

Este doc explica como alterar o design do personagem Gamellito e criar novas variantes (expressões, poses, corpo inteiro) no site.

---

## 1. Onde está o design

- **SVGs do personagem:** `public/assets/`
  - `gamellito-contente.svg` — rostinho feliz (hero, CTAs)
  - `gamellito-furioso.svg` — frustrado (FAQ)
  - `gamellito-corpinho.svg` — corpo inteiro
- **Referência no código:** `src/components/SiteAssets.tsx` (paths) e `src/components/GamellitoCharacter.tsx` (variantes do personagem).
- **Cores oficiais:** `src/lib/gamellito-design.ts` (`GAMELLITO_COLORS`, `GAMELLITO_HSL`).

---

## 2. Como mexer no design (editar um SVG existente)

1. Abra o SVG em um editor (Figma, Illustrator, Inkscape, ou até VS Code).
2. Ajuste paths, formas ou textos. As cores oficiais estão em `gamellito-design.ts`:
   - Corpo: `#FF8300`
   - Sombra/detalhe: `#F06105`
   - Destaque (pés etc.): `#FFBC00`
   - Contorno: `#000000`
3. Salve e substitua o arquivo em `public/assets/` (mantenha o mesmo nome para não quebrar referências).
4. Se quiser que uma cor mude pelo site (tema claro/escuro, campanhas), troque no SVG `fill="#FF8300"` por `fill="currentColor"` e defina a cor no CSS do componente que usa o SVG (ou use variáveis CSS como `var(--gamellito-body)` se o SVG for inline).

---

## 3. Como criar novas formas do Gamellito

### Passo 1: Criar o SVG

- Desenhe ou exporte a nova variante (ex.: “Gamellito surpreso”, “Gamellito dormindo”).
- Use a mesma paleta (`gamellito-design.ts`) para manter a identidade.
- Salve como `public/assets/gamellito-<nome>.svg` (ex.: `gamellito-surpreso.svg`).

### Passo 2: Registrar no site

1. Abra `src/components/SiteAssets.tsx`.
2. No objeto `siteAssets`, adicione uma linha:
   ```ts
   gamellitoSurpreso: "/assets/gamellito-surpreso.svg",
   ```
3. Use em qualquer componente com `<AssetImage asset="gamellitoSurpreso" alt="..." />` ou `siteAssets.gamellitoSurpreso`.

### Passo 3 (opcional): Usar como variante do personagem principal

Se a nova forma for uma “expressão/pose” do personagem (como contente e furioso):

1. Abra `src/components/GamellitoCharacter.tsx`.
2. Adicione a variante no tipo e no objeto de assets, por exemplo:
   - `GamellitoVariant`: incluir `"corpinho" | "surpreso"`.
   - `ASSETS`: incluir `surpreso: "/assets/gamellito-surpreso.svg"`.
   - `defaultAlt`: incluir texto para acessibilidade.
3. Use no site: `<GamellitoCharacter variant="surpreso" />`.

Assim você consegue mexer no design atual e criar quantas novas formas do Gamellito quiser, sempre referenciando `SiteAssets` e, se fizer sentido, `GamellitoCharacter`.
