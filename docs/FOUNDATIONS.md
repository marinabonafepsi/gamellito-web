# Fundações visuais (Foundations) — Guia do livro Gamellito

Referência rápida das variáveis CSS e Tailwind aplicadas a partir do guia visual (Roger Cartoons).

## 1. Paleta de cores

| Elemento           | Hex       | Uso                                      | CSS / Tailwind                    |
|-------------------|-----------|------------------------------------------|-----------------------------------|
| Gamellito Orange  | `#FF8C00` | Protagonista e CTAs principais           | `--primary`, `gamellito-orange`   |
| Mãe Red           | `#E31E24` | Personagem de apoio e alertas            | `--secondary`, `gamellito-mae-red`|
| Hospital Purple   | `#A881C0` | Cuidado, Doutor Lagartão                 | `gamellito-hospital-purple`       |
| BG Yellow         | `#FFD700` | Fundos e destaque                        | `gamellito-bg-yellow`             |
| Health Green      | `#8CC63F` | Nutrição e sucesso nas tarefas           | `--accent`, `gamellito-health-green` |

Cores no código: `app/globals.css` (variáveis `--gamellito-*`) e `tailwind.config.js` (objeto `gamellito`).

## 2. Tipografia

- **Títulos (headings):** `--font-display` → Pangolin (fallback enquanto Pulang não estiver em Google Fonts). No guia: Pulang (manuscrito/orgânico).
- **Corpo:** `--font-body` → Roboto (acessibilidade e clareza).
- **Escala:** Major Third (1.250). Variáveis `--text-base`, `--text-sm`, `--text-lg` … `--text-5xl` em `globals.css`. Tailwind: classes `text-fluid-sm` a `text-fluid-3xl` para tipografia fluida.

## 3. Bordas e containers (estética “Livro Vivo”)

- Bordas suaves: **≥ 24px**. `--radius: 24px`, `--radius-sm: 20px`, `--radius-lg: 28px`.
- Uso: `rounded` (Tailwind) usa `var(--radius)` por padrão.

## 4. Próximos passos sugeridos no guia

- **Texturas:** ruído/paper no fundo (ex.: classe `.bg-paper` com textura sutil).
- **Diálogos:** balões de fala (speech bubbles) com rabichos orgânicos, sem linhas retas.
- **Iconografia:** medidor de glicemia, seringa/caneta, alimentação no estilo “desenho manual” de Roger Cartoons.
