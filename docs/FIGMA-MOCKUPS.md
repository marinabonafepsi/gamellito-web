# Figma Mockups: Gamellito Multi-Portal

## 5 Portais Visuais Propostos

### 1. Portal Família (/familia/*)

**Navbar:**
- Logo Gamellito (esquerda)
- Breadcrumb: `Família > Marina (criança)` (centro)
- Botão Avatar com dropdown: "Perfil", "Meus Pedidos", "Sair" (direita)
- Saldo de moedas: `150 🪙` (topo direita com fundo dourado)

**Dashboard:**
- Hero card: "Bem-vindo, Marina! 👋"
- 3 cards em grid (responsive):
  1. **"Últimos 7 dias"** — Timeline com ícones (seringa, comida, exercício)
  2. **"Evolução"** — Recharts LineChart, sem valores absolutos, apenas linha em gradiente
  3. **"Compartilhamento"** — `0 profissionais com acesso` + QR Code + Botão "Gerar Novo"

**Timeline (Scroll Infinito):**
```
┌─────────────────────────────────┐
│ Jun 25, 10:30 | 120 mg/dL       │
│ Depois do lanche                │
│ [Editar] [Deletar]              │
├─────────────────────────────────┤
│ Jun 25, 07:15 | 95 mg/dL        │
│ Em jejum                        │
│ [Editar] [Deletar]              │
├─────────────────────────────────┤
│ Jun 24, 18:45 | 145 mg/dL       │
│ Depois do jantar                │
│ [Editar] [Deletar]              │
```

**Loja (/familia/loja):**
- Grid de 6 items (avatar skins, badges, poderes)
- Cada item: Imagem + Nome + `50 🪙` + Botão "Comprar"
- Saldo topo: `150 🪙` com animação de contador
- Seções: "Avatar", "Badges", "Poderes Especiais"

---

### 2. Portal Profissional (/profissional/*)

**Navbar:**
- Logo + "Meus Pacientes" (ativo)
- Avatar + `Dr. Silva | Endocrinologista` + Badge "Verificado ✓"
- Botão "Adicionar Paciente"

**Dashboard: "Meus Pacientes"**
- 4 cards em grid 2x2 (responsive 1 col mobile):
  ```
  ┌──────────────────────┐ ┌──────────────────────┐
  │ Marina               │ │ João                 │
  │ 12 anos             │ │ 11 anos             │
  │ Último: ontem       │ │ Último: 2d atrás    │
  │ [Ver Ficha]         │ │ [Ver Ficha]         │
  └──────────────────────┘ └──────────────────────┘
  
  ┌──────────────────────┐ ┌──────────────────────┐
  │ Ana                  │ │ +                    │
  │ 10 anos             │ │ Aguardando aceitar   │
  │ Último: 4d atrás    │ │ convite              │
  │ [Ver Ficha]         │ │                      │
  └──────────────────────┘ └──────────────────────┘
  ```

**Ficha de Paciente (/profissional/paciente/[id]):**
- Topo: Nome + Idade + Tipo de acesso (readonly) + Badges
- 20 últimos registros em timeline com scroll
- Campo "Notas Clínicas" com textarea expandível
- Botões (sticky footer):
  - "Gerar Relatório PDF" (primary)
  - "Compartilhar Recurso" (secondary)
  - "Contatar Responsável" (tertiary)

**Relatório (/profissional/paciente/[id]/relatorio):**
- Filtros: Data início + Data fim + Botão "Gerar"
- Preview modal:
  ```
  ┌────────────────────────────────┐
  │ RELATÓRIO DE Marina            │
  │ 01 Jun - 30 Jun, 2026          │
  │                                │
  │ Registros: 45                  │
  │ Média: 125 mg/dL               │
  │ Variabilidade: ±35 mg/dL       │
  │                                │
  │ [Gráfico de linha]             │
  │                                │
  │ [Timeline dos 20 últimos]      │
  │                                │
  │ [Baixar PDF]                   │
  └────────────────────────────────┘
  ```
- Conteúdo PDF: Cabeçalho + Resumo + Gráfico + Timeline (sem interpretação clínica)
- Botão "Baixar PDF" com nome do arquivo `Marina_Relatorio_Jun2026.pdf`

---

### 3. Portal Educador (/educador/*)

**Navbar:**
- Logo + "Meus Grupos" (ativo)
- Avatar + `Prof. Ana | Educadora`
- Botão "Novo Grupo"

**Dashboard:**
- 2 cards em layout:
  ```
  ┌────────────────────────────────┐
  │ Turma 5A                       │
  │ 15 alunos | 120 registros      │
  │ Adesão: 85%                    │
  │ [Acessar]                      │
  └────────────────────────────────┘
  
  ┌────────────────────────────────┐
  │ Grupo DM1 Clínica X            │
  │ 8 alunos | 60 registros        │
  │ Adesão: 75%                    │
  │ [Acessar]                      │
  └────────────────────────────────┘
  ```

**Biblioteca de Recursos (/educador/recursos):**
- Grid de 8 cards (PDFs, vídeos, artigos)
- Cada card layout:
  ```
  ┌──────────────────┐
  │  [Imagem Thumb]  │
  ├──────────────────┤
  │ Título do Artigo │
  │ [Nutrição]       │ <- tag
  │ [Compartilhar]   │
  └──────────────────┘
  ```
- Temas como filtros: DM1, Nutrição, Exercício, Psicologia
- Botão "Upload Novo Recurso"

**Forum Comunidade (/educador/forum):**
- Lista de threads:
  ```
  ┌─────────────────────────────────────────┐
  │ Como lidar com hipoglicemia em aula?    │
  │ Por Prof. Silva | 12 respostas | 2d     │
  └─────────────────────────────────────────┘
  
  ┌─────────────────────────────────────────┐
  │ Receitas saudáveis pro intervalo        │
  │ Por Nutricionista | 5 respostas | 1w    │
  └─────────────────────────────────────────┘
  ```
- Botão "+ Nova Pergunta" (sticky)
- Busca por tema no topo

---

### 4. Portal Instituição (/instituicao/*)

**Navbar:**
- Logo + `Escola X` (nome da instituição)
- Avatar + "Gestor da Saúde" + Badge "Admin"
- Notificações + Settings

**Dashboard:**
- Cards de métrica em grid 2x2:
  ```
  ┌──────────────────────┐ ┌──────────────────────┐
  │ 45 crianças          │ │ 78.5% adesão         │
  │ Registros: 1.200     │ │ Trend ↑ +5% vs mês   │
  │ Último: hoje         │ │ Último: hoje         │
  └──────────────────────┘ └──────────────────────┘
  
  ┌──────────────────────┐ ┌──────────────────────┐
  │ 3 grupos             │ │ 12 profissionais     │
  │ 8 educadores         │ │ 2 administradores    │
  └──────────────────────┘ └──────────────────────┘
  ```

**Tabela de Grupos (/instituicao/grupos):**
- Colunas: Nome Grupo | Membros | Registros | Adesão | Ações
- Rows com dados:
  ```
  | Turma 5A      | 25  | 340  | 92%  | [Edit] [Delete] |
  | Turma 6B      | 23  | 290  | 78%  | [Edit] [Delete] |
  | Enfermaria    | 8   | 145  | 88%  | [Edit] [Delete] |
  | + Novo Grupo  |     |      |      |                 |
  ```
- Sorting/Filtering por: Nome, Adesão, Data

**Relatórios (/instituicao/relatorios):**
- Gráfico AreaChart de adesão ao longo do tempo (últimos 3 meses)
- Tabela de top grupos por adesão
- Filtros: Data início/fim + Tipo (PDF, CSV)
- Botão "Exportar" com opções de formato
- Preview do PDF antes de download

---

### 5. Auth Gateway (/auth/*)

**Signup - Step 1: Role Selection**
- Hero: `Bem-vindo ao Gamellito` com ilustração
- 4 buttons grande (100% width mobile, 50% desktop):
  ```
  ┌─────────────────────┐
  │  👨‍👩‍👧 Sou Pai/        │
  │     Responsável     │
  └─────────────────────┘
  
  ┌─────────────────────┐
  │  👨‍⚕️ Sou             │
  │   Profissional      │
  └─────────────────────┘
  
  ┌─────────────────────┐
  │  👨‍🏫 Sou Educador     │
  └─────────────────────┘
  
  ┌─────────────────────┐
  │  🏫 Sou de uma      │
  │     Instituição     │
  └─────────────────────┘
  ```

**Signup - Step 2: Form (por role)**

**Role: Familia**
```
┌──────────────────────────────────┐
│ Criar Conta - Responsável        │
├──────────────────────────────────┤
│ Email                            │
│ [________________]               │
│                                  │
│ Senha                            │
│ [________________]               │
│                                  │
│ Nome da Criança                  │
│ [________________]               │
│                                  │
│ Data de Nascimento               │
│ [__ / __ / ____]                 │
│                                  │
│ ☑ Aceito os Termos de Uso        │
│ ☐ Compartilhar com profissionais │
│ ☐ Compartilhar com instituições  │
│ ☐ Receber emails com dicas       │
│ ☐ Contribuir com analytics       │
│                                  │
│ [Criar Conta]                    │
└──────────────────────────────────┘
```

**Role: Profissional**
```
┌──────────────────────────────────┐
│ Criar Conta - Profissional       │
├──────────────────────────────────┤
│ Email                            │
│ [________________]               │
│                                  │
│ Senha                            │
│ [________________]               │
│                                  │
│ Nome Completo                    │
│ [________________]               │
│                                  │
│ CRM/COREN (com validação)        │
│ [________________]               │
│                                  │
│ Estado                           │
│ [Selecione ▼]                    │
│                                  │
│ Especialidade                    │
│ [Selecione ▼]                    │
│                                  │
│ Foto de Perfil                   │
│ [Upload ou Câmera]               │
│                                  │
│ ☑ Aceito os Termos               │
│ ☐ Notificações de pacientes      │
│ ☐ Analytics anônimo              │
│                                  │
│ [Criar Conta]                    │
└──────────────────────────────────┘
```

**Login - Email/Password ou Magic Link**
```
┌──────────────────────────────────┐
│ Entrar no Gamellito              │
├──────────────────────────────────┤
│ [Email] [Magic Link]             │ <- tabs
│                                  │
│ Email                            │
│ [________________]               │
│                                  │
│ Senha                            │
│ [________________]               │
│                                  │
│ [Esqueceu a senha?]              │
│                                  │
│ [Entrar]                         │
│                                  │
│ Não tem conta? [Criar aqui]      │
└──────────────────────────────────┘

Magic Link Tab:
┌──────────────────────────────────┐
│ Email                            │
│ [________________]               │
│                                  │
│ [Enviar Link]                    │
│                                  │
│ ✓ Enviamos um link para seu      │
│   email (válido por 1 hora)      │
└──────────────────────────────────┘
```

---

## 🎨 Design System

**Paleta de Cores:**
- **Primary (Primária):** `#FFC400` (Sun Yellow) — Botões, CTAs, highlights
- **Secondary (Secundária):** `#F26A00` (Orange) — Accents, borders, hover states
- **Accent (Destaque):** `#9B8CF0` (Lilac) — Links, badges, subtle highlights
- **Text (Texto):** `#2B2233` (Ink) — Headlines, body text
- **Background (Fundo):** `#2B2233` (Space Dark) — Dark mode default, ou branco para light mode
- **Neutral (Neutro):** `#F5F5F5` (Light Gray) — Backgrounds de cards, inputs
- **Success:** `#4CAF50` (Green) — Confirmações
- **Warning:** `#FFA500` (Orange Light) — Alertas
- **Danger:** `#EF5350` (Red) — Erros, deletar

**Componentes de UI:**

**Button**
- Border: 3px solid `#2B2233`
- Border-radius: 12px
- Shadow: `4px 4px 0px rgba(0,0,0,0.2)` (pop shadow)
- Hover: Scale 1.05, shadow increase
- Active: Scale 0.98, shadow decrease
- Padding: 12px 24px

**Card**
- Border-radius: 24px
- Border: 3px solid `#2B2233`
- Shadow: `4px 4px 0px rgba(0,0,0,0.15)`
- Padding: 20px
- Background: `#FFFFFF` ou `#F5F5F5`

**Badges**
- Border-radius: 20px
- Padding: 6px 12px
- Font-size: 12px
- Background: Primary com text dark
- Pode incluir avatar do personagem Gamellito

**Input**
- Border: 2px solid `#DDD`
- Border-radius: 8px
- Padding: 12px
- Focus: Border color `#FFC400`
- Placeholder: `#999`

**Modal**
- Backdrop: `rgba(0,0,0,0.5)` com blur 4px
- Card com border-radius 24px
- Close button: X no topo direito
- Animation: Spring from center

**Tipografia:**

- **Títulos (h1-h3):** Baloo 2
  - h1: 48px, weight 800
  - h2: 36px, weight 700
  - h3: 24px, weight 600
  - Line-height: 1.2

- **Body (p, labels):** Nunito
  - Regular: 16px, weight 400
  - Semibold: 16px, weight 600
  - Small: 14px, weight 400
  - Line-height: 1.5

- **Tamanhos fluidos:** Usar `clamp()` para responsividade
  - `h1: clamp(32px, 5vw, 48px)`
  - `p: clamp(14px, 2vw, 16px)`

**Espaçamento (8px grid):**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

**Border Radius:**
- Tight: 4px (inputs, small buttons)
- Normal: 8-12px (buttons, small cards)
- Large: 20px (badges, pills)
- XL: 24px (cards, modals)
- Full: 9999px (avatars, circular)

---

## 🎬 Fluxos de Interação

### Flow 1: Pai Compartilha Dados com Médico

**Objetivo:** Familia autoriza acesso readonly ao profissional

**Steps:**
1. Pai acessa `/familia/crianca/[id]/compartilhamento`
2. Vê QR code único gerado (expires em 7 dias)
3. Pode compartilhar link `https://gamellito.com/convites/abc123xyz` ou QR
4. Médico escaneia QR ou clica link → `/auth/convites/[token]`
5. Médico vê modal: 
   ```
   "Marina quer compartilhar seus dados?"
   Data de nascimento: 12 anos
   Últimos registros: 45
   [Rejeitar] [Aceitar]
   ```
6. Médico escolhe tipo de acesso:
   - ☑ Ver registros (readonly)
   - ☐ Receber notificações
   - ☐ Contactar responsável
7. Clica "Confirmar Acesso"
8. Redirect `/profissional/dashboard`
9. Marina aparece em "Meus Pacientes"
10. Pai vê notificação: "Dr. Silva (Endocrinologista) tem acesso aos seus dados"

**Animations:**
- QR code fade-in com slight scale
- Modal spring animation
- Success toast notification após aceitar

---

### Flow 2: Profissional Gera Relatório PDF

**Objetivo:** Criar relatório de um paciente com dados filtrados

**Steps:**
1. Profissional em `/profissional/paciente/[id]`
2. Vê últimos 20 registros em timeline
3. Clica botão "Gerar Relatório PDF"
4. Modal de filtro abre:
   ```
   Filtrar Relatório
   De: [01/06/2026]
   Até: [30/06/2026]
   
   [Cancelar] [Gerar]
   ```
5. Clica "Gerar" → Loading spinner
6. Preview em nova janela/modal com PDF renderer:
   ```
   RELATÓRIO DE Marina
   01 Jun - 30 Jun, 2026
   
   ---
   RESUMO
   Registros: 45
   Média: 125 mg/dL
   Variabilidade: ±35 mg/dL
   
   ---
   GRÁFICO (LineChart)
   [Visual chart]
   
   ---
   ÚLTIMOS REGISTROS
   Jun 25, 10:30 | 120 mg/dL | Depois do lanche
   Jun 25, 07:15 | 95 mg/dL | Em jejum
   ...
   
   Gerado em: 25 Jun 2026, 14:30
   Por: Dr. Silva
   ```
7. Botão "Baixar PDF" no preview
8. Download: `Marina_Relatorio_Jun2026.pdf`

**Nota importante:** Relatório mostra dados brutos sem interpretação clínica

**Animations:**
- Loading spinner durante geração
- PDF preview fade-in

---

### Flow 3: Criança Compra Avatar com Moedas

**Objetivo:** Gamificação de moedas para desbloquear itens

**Steps:**
1. Criança em `/familia/loja/avatars`
2. Vê 6 avatar skins em grid:
   ```
   ┌──────────────┐
   │ [Imagem]     │
   │ Ninja Avatar │
   │ 50 🪙        │
   │ [Comprar]    │
   └──────────────┘
   ```
3. Saldo topo: `150 🪙` com ícone de moeda animado
4. Clica "Comprar" em um item
5. Modal de confirmação:
   ```
   Comprar "Ninja Avatar"?
   
   Você tem: 150 🪙
   Custo: 50 🪙
   Novo saldo: 100 🪙
   
   [Cancelar] [Confirmar]
   ```
6. Clica "Confirmar"
7. Animação de celebração (confetti ou similar)
8. Saldo atualiza: `150 🪙` → `100 🪙` (com transição)
9. Toast notification: "Parabéns! Desbloqueou 'Ninja Avatar'"
10. Avatar aparece em `/familia/perfil` como desbloqueado

**Animations:**
- Confetti animation no centro
- Contador de moedas com easing ease-out
- Toast slide-in from bottom
- Item marcado como "desbloqueado" com check mark

---

### Flow 4: Educador Compartilha Recurso com Grupo

**Objetivo:** Disseminar conteúdo educativo para turma

**Steps:**
1. Educador em `/educador/recursos`
2. Vê grid de PDFs/vídeos/artigos
3. Encontra artigo "Carboidratos e Diabetes"
4. Clica "Compartilhar com Grupo"
5. Modal abre:
   ```
   Compartilhar Recurso
   
   Selecione o Grupo:
   ☐ Turma 5A (15 alunos)
   ☑ Grupo DM1 Clínica X (8 alunos)
   ☐ Turma 6B (23 alunos)
   
   Mensagem (opcional):
   [Leia este artigo para a próxima aula]
   
   [Cancelar] [Compartilhar]
   ```
6. Clica "Compartilhar"
7. Notificações enviadas aos 8 alunos
8. Toast: "Compartilhado com sucesso!"
9. Recurso aparece em `/educador/grupo/[id]/recursos` dos alunos

---

### Flow 5: Gestor Instituição Visualiza Adesão

**Objetivo:** Monitorar engagement dos grupos

**Steps:**
1. Gestor em `/instituicao/dashboard`
2. Vê card: "78.5% adesão" com trend ↑ +5%
3. Clica para ir a `/instituicao/relatorios`
4. Vê AreaChart com 3 meses de adesão:
   ```
   100% ┐
        │     ╱╲    ╱
    80% │   ╱   ╲╱
        │ ╱
    60% └──────────────
        Abr    Mai   Jun
   ```
5. Tabela abaixo:
   ```
   Grupo         | Membros | Adesão
   Turma 5A      | 25      | 92%
   Turma 6B      | 23      | 78%
   Enfermaria    | 8       | 88%
   ```
6. Clica "Exportar PDF"
7. Modal:
   ```
   Filtrar Relatório
   De: [01/04/2026]
   Até: [30/06/2026]
   Formato: [PDF ▼]
   
   [Exportar]
   ```
8. PDF baixa: `Relatorio_Adesao_Q2_2026.pdf`

---

## 📱 Responsividade

**Breakpoints:**

- **Desktop:** `> 1200px`
  - Multi-column layouts
  - Sidebar sempre visível
  - Full width cards/tables

- **Tablet:** `768px - 1200px`
  - 2 colunas em grids
  - Sidebar collapsa em icon menu
  - Cards em 1-2 col

- **Mobile:** `< 768px`
  - 1 coluna
  - Menu hamburger (hamburger icon top-left)
  - Full-width cards
  - Stack vertical

**Mobile-specific adjustments:**
- Navbar reduz a breadcrumb, mostra só ícone
- Avatar dropdown vira bottom sheet
- Modals ocupam 90vw com padding
- Buttons ocupam 100% de width em mobile
- Tabelas viram cards com scrollable horizontal

---

## 🔐 Considerações de Segurança & Privacidade

**Por Portal:**

| Portal | Acesso | Dados Vistos | Restrições |
|--------|--------|--------------|-----------|
| Familia | Próprio usuário | Seus registros + Loja | Só edita seus dados |
| Profissional | Convite aceito | Pacientes que aceitaram share | Readonly (sem editar) |
| Educador | Próprio usuário | Grupos e recursos que criou | Não vê dados pessoais |
| Instituição | Admin da org | Agregados (grupos, adesão) | Não vê registros individuais |
| Auth | Público | Nenhum | Só signup/login |

**Auditoria:**
- Log de quem acessou cada ficha
- Log de downloads de PDFs
- Log de compartilhamentos
- Timestamps em todos os eventos

---

## 📋 Próximas Steps

### Implementação Técnica

1. **Criar estrutura de arquivos Figma** (20 min)
   - Frame por portal
   - Componentes reutilizáveis (Button, Card, Modal, etc)
   - Design tokens (cores, espaçamento, tipografia)

2. **Aplicar design system** (40 min)
   - Paleta de cores em todas as frames
   - Tipografia com Baloo 2 + Nunito
   - Componentes base

3. **Criar wireframes detalhados** (60 min)
   - Cada portal com todas as vistas principais
   - Grid guidelines visíveis
   - Anotações de interação

4. **Adicionar prototiping** (40 min)
   - Links entre frames (navegação)
   - Interações básicas (botões clicáveis)
   - Flow principal de cada use case

5. **Validar com Marina** (30 min)
   - Feedback visual
   - Ajustes de layout/espaçamento
   - Aprovação de cores

6. **Code Connect** (60 min)
   - Mapear componentes Figma aos React
   - Documentar imports
   - Setup para dev implement

### Desenvolvimento Frontend

1. Setup routing por portal
2. Criar componentes base (Button, Card, Modal, etc)
3. Build layouts principais (Navbar, Sidebar, etc)
4. Integrar com dados (API calls)
5. Adicionar animações e transitions
6. Testing (unit + e2e)

### Desenvolvimento Backend

1. Auth flow com roles
2. Permissões e access control por portal
3. APIs para cada entidade (Paciente, Grupo, Recurso, etc)
4. Geração de PDFs
5. QR code generation
6. Notificações

---

## 📚 Referências & Assets Necessários

**Fontes:**
- Baloo 2 (Google Fonts)
- Nunito (Google Fonts)

**Ícones:**
- Tabler Icons (svg)
- Emoji (Unicode)

**Bibliotecas React:**
- `recharts` — Gráficos
- `react-qr-code` — QR codes
- `framer-motion` — Animações
- `react-hot-toast` — Notificações
- `jspdf` + `html2canvas` — PDFs

**Ilustrações:**
- Personagem Gamellito (mascote)
- Ícones de categorias (Seringa, Comida, Exercício, Psicologia)
- Hero illustrations por portal

---

## ✅ Checklist de Validação

- [ ] Todos os 5 portais com layouts principais
- [ ] Design system aplicado (cores, tipografia, components)
- [ ] Responsividade testada (desktop, tablet, mobile)
- [ ] Fluxos de interação mapeados
- [ ] Anotações de animação/transição
- [ ] Assets e referências linkadas
- [ ] Marina revisou e aprovou
- [ ] Dev team tem Figma link + specs
- [ ] Code Connect configurado
- [ ] Ready para implementação!

