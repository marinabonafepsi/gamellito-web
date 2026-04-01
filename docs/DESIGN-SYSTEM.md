# Design System — Gamellito

Mapeamento de cores, tipografia e regras de UX para manter consistência e acessibilidade.

---

## 1. Paleta de cores (globals.css)

| Token | Uso | Cor |
|-------|-----|-----|
| **primary** | Marca Gamellito, CTAs principais, **destaque em texto** | Laranja #FF8C00 |
| **primary-foreground** | Texto sobre fundos primary (botões, barras) | Branco |
| **secondary** | Apenas **fundos de botão** (ex.: CTA secundário), nunca texto longo | Vermelho Mãe #E31E24 |
| **foreground** | Texto principal em fundo claro | Escuro (260 30% 12%) |
| **muted-foreground** | Texto secundário (legendas, descrições) | Cinza escuro (contraste ≥ 4.5:1) |
| **accent** | Sucesso, saúde, destaque positivo | Verde #8CC63F |
| **destructive** | Erros, ações destrutivas apenas | Vermelho |

---

## 2. Regras de UX para texto

- **Nunca use vermelho (secondary) para texto** — baixa legibilidade e associação a erro/alerta. Use **primary (laranja)** para destaques de marca e títulos.
- **Destaques em headlines** (ex.: “Gamellito”, “Jogos & Soluções”): `text-primary`.
- **Links e hovers** em fundo escuro: `text-primary-foreground/90` com `hover:text-primary` (laranja), não vermelho.
- **Tags e labels** (ex.: “Mobile Game”, “Livros”): `text-primary` ou `text-muted-foreground` conforme hierarquia.
- **Ícones de destaque** em cards: `text-primary` (laranja) para manter a marca; reserve vermelho só para alertas reais.

---

## 3. Onde cada cor aparece

| Área | Texto / UI | Cor |
|------|------------|-----|
| Hero “Ltda.” | Destaque | primary |
| Navbar logo “Gamellito” | Marca | primary |
| Navbar/Footer links hover | Interação | primary |
| Seção Jogos título “Jogos & Soluções” | Destaque | primary |
| About “Gamellito” | Destaque | primary |
| Cards (tags, ícones) | Tags / ícone | primary |
| Footer “Gamellito”, links | Marca / hover | primary |
| Botões preenchidos (CTA) | Fundo | primary ou secondary (só fundo, texto branco) |

---

## 4. Contraste e acessibilidade

- **Fundo claro:** texto principal `foreground`, secundário `muted-foreground` (já ajustado para WCAG AA).
- **Fundo escuro (space):** texto `primary-foreground` com opacidade ≥ 90% para corpo; destaques em `text-primary` (laranja) para boa leitura.

---

## 5. Resumo

- **Texto em vermelho (secondary)** → trocar por **primary (laranja)** em todo o site.
- **secondary** fica apenas para fundo de botão quando quiser um CTA alternativo vermelho (uso pontual).
- Dúvida: “é destaque de marca ou CTA?” → use **primary**.
