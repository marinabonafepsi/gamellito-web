# GDD — Universo Gamellito
### Documento de Game Design + Árvore de Habilidades (formato Duolingo) para Educação em Diabetes Tipo 1 (DM1)

> Versão 1.0 — Documento vivo. Cada Unidade é uma "Skill" na árvore; cada Fase é uma lição de 3–5 interações. Todas as fases seguem o formato fixo definido abaixo.

---

## 0. Pilares de Design

1. **Micro-learning absoluto** — nenhuma fase passa de 3–5 interações. Eventos grandes da vida real (ex: "ir à escola") são fatiados em dezenas de mini-fases.
2. **Curva de dificuldade progressiva** — fases iniciais de uma unidade: tempo livre, escolha binária (A/B). Fases finais: timer agressivo, combinação de múltiplas variáveis (carboidrato + insulina + atividade + hora do dia).
3. **Gamellito Tamagotchi** — o mascote reage com sprites de humor a cada acerto/erro; nunca pune com "game over", apenas com feedback emocional e retry.
4. **Economia GCoins + Loja Fidelidade Phygital**:
   - Digital: roupinhas/skins do Gamellito, fundos de tela, acessórios cosméticos.
   - Físico: troca por produtos reais (jogos de tabuleiro/cartas Gamellito), descontos, frete grátis.
5. **Assets por fase** — toda fase lista os arquivos visuais necessários para o time de front-end montar a tela sem ambiguidade.
6. **Nomenclatura de assets**: `bg-*` (fundo), `sprite-gamellito-*` (mascote), `icon-*` (ícone de UI/ação), `char-*` (outros personagens), `sfx-*` (som), `anim-*` (animação/efeito).

### Formato fixo de cada fase

- **Título da Fase**
- **Cenário/História**
- **Mecânica de Jogo & UX**
- **Curva de Dificuldade**
- **Condição de Vitória & Recompensas**
- **Assets Necessários**

---

# PERSONA 1: PACIENTE & FAMÍLIA — A Jornada do Herói

## SEÇÃO 1 — SOBREVIVÊNCIA BÁSICA

### Unidade 1: O Despertar
*Tema: o que é DM1, o pâncreas, a chave mágica da insulina.*

**Fase 1.1 — O Castelo do Corpo**
- Cenário: O corpo é um castelo; o pâncreas é a torre que fabrica "chaves de energia".
- Mecânica: Tela de exploração estática com 3 hotspots tocáveis (pâncreas, sangue, células); toque revela balão de fala do Gamellito explicando em 1 frase.
- Curva: Nenhuma pressão de tempo, apenas descoberta livre — fase 100% introdutória.
- Vitória: Tocar nos 3 hotspots. Recompensa: +20 GCoins, Conquista "Explorador do Castelo".
- Assets: `bg-castelo-corpo-corte.png`, `sprite-gamellito-lupa.png`, `icon-hotspot-pulse.svg`, `char-pancreas-torre.png`.

**Fase 1.2 — A Chave Perdida**
- Cenário: Sem insulina, a "chave" não abre a porta das células e a energia (glicose) fica presa no sangue.
- Mecânica: Drag-and-drop de um ícone-chave (insulina) até uma fechadura na célula; ao errar o alvo, a chave balança e emite "boing".
- Curva: Um único par chave/fechadura, sem timer.
- Vitória: Encaixar a chave 1x. Recompensa: +15 GCoins.
- Assets: `icon-chave-insulina.svg`, `char-celula-porta.png`, `sfx-boing.mp3`, `anim-porta-abre.json`.

**Fase 1.3 — Quiz do Pâncreas Preguiçoso**
- Cenário: Gamellito testa se o jogador entendeu por que o pâncreas "não fabrica mais chaves".
- Mecânica: Múltipla escolha (3 opções), sem timer, com Gamellito piscando o olho na resposta certa.
- Curva: Introduz o formato de quiz que será reusado e acelerado nas próximas unidades.
- Vitória: Acertar 2 de 3. Recompensa: +25 GCoins, avatar Gamellito ganha "chapéu de cientista" (item de loja desbloqueado, não comprado).
- Assets: `sprite-gamellito-cientista.png`, `icon-check-verde.svg`, `icon-x-vermelho.svg`.

**Fase 1.4 — Boas-vindas ao Time**
- Cenário: Encerramento emocional da unidade — Gamellito "adota" o jogador como parceiro de jornada.
- Mecânica: Cutscene tocável (tap-to-continue) de 3 quadros; escolha de nome/apelido do dupla Gamellito.
- Curva: Sem desafio, é fase de vínculo emocional (retenção D1).
- Vitória: Completar os 3 toques. Recompensa: +30 GCoins, Conquista "Início da Jornada", desbloqueia Unidade 2.
- Assets: `bg-abraco-gamellito.png`, `sprite-gamellito-feliz.gif`, `icon-coracao-flutuante.svg`.

---

### Unidade 2: Furando sem Medo
*Tema: glicosímetro, higiene, leitura de números, rodízio de dedos.*

**Fase 2.1 — Monte o Kit**
- Cenário: Preparar a mesa antes de medir a glicemia.
- Mecânica: Drag-and-drop de 4 itens (glicosímetro, lanceta, tira reagente, algodão) para os locais certos na mesa.
- Curva: Itens com contorno-fantasma indicando onde encaixar (baixa dificuldade).
- Vitória: Posicionar os 4 itens. Recompensa: +20 GCoins.
- Assets: `bg-mesa-medicao.png`, `icon-glicosimetro.svg`, `icon-lanceta.svg`, `icon-tira-reagente.svg`, `icon-algodao.svg`.

**Fase 2.2 — Mãos Limpas Primeiro**
- Cenário: Higiene antes de furar o dedo.
- Mecânica: Tap-timing — segurar o dedo embaixo da torneira animada até a barra de "limpeza" encher.
- Curva: Barra de tempo curta (3s), falha se soltar antes.
- Vitória: Encher a barra 1x. Recompensa: +15 GCoins, Conquista "Mãos de Cirurgião".
- Assets: `anim-torneira-agua.json`, `sprite-gamellito-sabao.png`, `icon-barra-progresso.svg`, `sfx-agua-correndo.mp3`.

**Fase 2.3 — O Rodízio dos Dedos**
- Cenário: Explicar por que não se deve furar sempre o mesmo dedo.
- Mecânica: Tela de mão estilizada com 8 pontas de dedo; jogador toca em pontas "descansadas" (verde) evitando as "cansadas" (vermelho), 3 rodadas.
- Curva: Cores de aviso somem progressivamente nas rodadas 2 e 3, exigindo memória.
- Vitória: 3 toques corretos sem erro. Recompensa: +25 GCoins.
- Assets: `char-mao-pontos-dedo.png`, `icon-ponta-verde.svg`, `icon-ponta-vermelha.svg`.

**Fase 2.4 — Fura Rápida (Tap-Timing)**
- Cenário: Simulação da picada real, sem dor, focada em coragem.
- Mecânica: Barra deslizante com "zona alvo"; toque no momento certo para "furar sem sentir".
- Curva: Zona alvo mais estreita que a fase 2.2; velocidade da barra aumenta a cada tentativa.
- Vitória: Acertar a zona 2 de 3 vezes. Recompensa: +30 GCoins, Conquista "Sem Medo da Agulha".
- Assets: `anim-lanceta-clique.json`, `sfx-click-lanceta.mp3`, `sprite-gamellito-corajoso.png`.

**Fase 2.5 — Lendo os Números**
- Cenário: O visor do glicosímetro mostra um número — o que ele significa?
- Mecânica: Slider horizontal tipo termômetro (mg/dL) onde o jogador arrasta um marcador para classificar o número mostrado em Baixo / Normal / Alto.
- Curva: 3 rodadas com números cada vez mais próximos das zonas-limite (ex: 69 vs 71).
- Vitória: Classificar corretamente 3/3. Recompensa: +25 GCoins.
- Assets: `icon-visor-glicosimetro.svg`, `icon-slider-termometro.svg`, `icon-zona-baixo-normal-alto.svg`.

**Fase 2.6 — Desafio: Rotina Completa**
- Cenário: Fase-boss da unidade — executar a medição do zero, sem dicas visuais.
- Mecânica: Combina 2.1+2.2+2.4+2.5 em sequência única, com timer global de 45s.
- Curva: Primeira fase "combo" da seção — soma passos já aprendidos sob pressão de tempo.
- Vitória: Completar a sequência dentro do tempo. Recompensa: +50 GCoins, Conquista "Mestre da Medição", desbloqueia item de loja "óculos de cientista".
- Assets: `bg-mesa-medicao-noite.png`, `icon-timer-circular.svg`, `sprite-gamellito-medalha.png`.

---

### Unidade 3: Alertas Vermelhos
*Tema: Monstro Tremendo (hipo), Monstro com Sede (hiper), Regra dos 15.*

**Fase 3.1 — Conheça o Monstro Tremendo**
- Cenário: Hipoglicemia é personificada como um monstrinho gelado que faz o corpo tremer.
- Mecânica: Cutscene tocável mostrando sintomas (tremor, suor, fome) como "poderes" do monstro sobre o corpo do herói.
- Curva: Introdutória, sem timer.
- Vitória: Avançar os 3 quadros. Recompensa: +15 GCoins.
- Assets: `char-monstro-tremendo.png`, `anim-corpo-tremendo.json`, `sfx-tremor.mp3`.

**Fase 3.2 — Conheça o Monstro com Sede**
- Cenário: Hiperglicemia é o monstro grandão e lento que dá sede e cansaço extremo.
- Mecânica: Igual à 3.1, espelhado para hiperglicemia.
- Curva: Introdutória.
- Vitória: Avançar os 3 quadros. Recompensa: +15 GCoins.
- Assets: `char-monstro-sede.png`, `anim-boca-seca.json`, `sfx-suspiro-cansado.mp3`.

**Fase 3.3 — Caça aos Sintomas (Swipe)**
- Cenário: Cartas de sintomas voam na tela — classificar rápido de qual monstro é cada uma.
- Mecânica: Tinder-swipe — swipe esquerda = Monstro Tremendo, direita = Monstro com Sede.
- Curva: Rodada 1 com 5 cartas e tempo livre; rodada 2 com 8 cartas e 20s no total.
- Vitória: Acertar 8 de 10 no total. Recompensa: +35 GCoins.
- Assets: `icon-carta-sintoma-tremor.svg`, `icon-carta-sintoma-sede.svg`, `sprite-gamellito-detetive.png`.

**Fase 3.4 — A Regra dos 15 (Passo a Passo)**
- Cenário: Ensinar o protocolo: medir, tratar com 15g de carboidrato rápido, esperar 15 min, medir de novo.
- Mecânica: Sequência de 4 cards ordenáveis (drag to reorder) que o jogador deve colocar na ordem certa.
- Curva: Sem timer na primeira tentativa; se errar a ordem, cards voltam embaralhados 1x.
- Vitória: Ordenar corretamente. Recompensa: +30 GCoins, Conquista "Guardião dos 15".
- Assets: `icon-card-medir.svg`, `icon-card-tratar.svg`, `icon-card-esperar.svg`, `icon-relogio-15min.svg`.

**Fase 3.5 — Escolha o Socorro Certo (Hipo)**
- Cenário: Diante do Monstro Tremendo, escolher entre alimentos que tratam a hipo rapidamente.
- Mecânica: Grade de 6 alimentos; tap para selecionar os 2 que somam ~15g de carboidrato rápido (suco, balas de glicose) evitando os de absorção lenta (pão integral, chocolate).
- Curva: Distratores parecidos (ex: "chocolate" parece doce mas é lento por causa da gordura).
- Vitória: Selecionar a combinação correta. Recompensa: +30 GCoins.
- Assets: `icon-suco-caixinha.svg`, `icon-bala-glicose.svg`, `icon-chocolate.svg`, `icon-pao-integral.svg`, `sprite-gamellito-suando-frio.png`.

**Fase 3.6 — Boss: Ataque Duplo Surpresa**
- Cenário: Os dois monstros aparecem juntos em uma pegadinha — o jogador deve primeiro medir para saber qual é o real antes de agir.
- Mecânica: Tela treme (screen-shake leve), jogador deve tocar no glicosímetro antes de qualquer outra ação; depois escolhe o protocolo certo (15g ou hidratação+alerta adulto).
- Curva: Combina leitura de número (2.5) + protocolo (3.4/3.5) + distração visual (dois monstros brigando na tela) — primeira fase multi-sistema da seção.
- Vitória: Medir antes de agir + protocolo correto. Recompensa: +60 GCoins, Conquista "Vencedor dos Monstros", desbloqueia Seção 2.
- Assets: `char-monstro-tremendo.png`, `char-monstro-sede.png`, `anim-tela-tremendo.json`, `sprite-gamellito-vitorioso.png`.

---

## SEÇÃO 2 — A JORNADA DOS ALIMENTOS

### Unidade 4: O Mundo dos Carboidratos
*Tema: energia rápida vs. lenta.*

**Fase 4.1 — Rios de Energia**
- Cenário: Alimentos viram "rios" que enchem o "tanque de energia" do Gamellito em velocidades diferentes.
- Mecânica: Animação comparativa: ao tocar em um alimento, uma barra enche rápido (carbo simples) ou devagar (carbo complexo).
- Curva: Apenas observação, sem erro possível.
- Vitória: Tocar nos 4 alimentos apresentados. Recompensa: +15 GCoins.
- Assets: `icon-alimento-arroz.svg`, `icon-alimento-mel.svg`, `anim-barra-energia-enche.json`.

**Fase 4.2 — Rápido ou Lento? (Swipe)**
- Cenário: Classificar alimentos por velocidade de absorção.
- Mecânica: Tinder-swipe — esquerda "rápido", direita "lento".
- Curva: 6 cartas tempo livre → 10 cartas com 15s.
- Vitória: 8/10 corretas. Recompensa: +25 GCoins.
- Assets: `icon-carta-alimento-diversos.svg` (set), `sfx-swipe.mp3`.

**Fase 4.3 — Monte o Prato Equilibrado**
- Cenário: Primeira introdução à ideia de misturar tipos de carboidrato num prato.
- Mecânica: Drag de 3 alimentos para um prato circular; feedback visual de cor (verde = equilibrado).
- Curva: Apenas 1 combinação certa entre 5 opções, sem timer.
- Vitória: Montar o prato verde. Recompensa: +25 GCoins.
- Assets: `icon-prato-vazio.svg`, `icon-alimento-set-basico.svg`, `anim-prato-brilho-verde.json`.

**Fase 4.4 — Quiz Relâmpago dos Carboidratos**
- Cenário: Fechamento da unidade com perguntas rápidas.
- Mecânica: 5 perguntas de múltipla escolha em sequência, 8s cada.
- Curva: Timer por pergunta introduzido (mais agressivo que unidades anteriores).
- Vitória: 4/5 corretas. Recompensa: +35 GCoins, Conquista "Sabe-Tudo dos Carbos".
- Assets: `icon-timer-8s.svg`, `sprite-gamellito-pensando.png`.

---

### Unidade 5: Os Escudeiros
*Tema: proteínas e gorduras atrasando a absorção.*

**Fase 5.1 — Os Escudeiros Chegam**
- Cenário: Proteína e gordura são personificadas como "escudeiros" que seguram a entrada de energia no castelo.
- Mecânica: Cutscene tocável com 2 personagens novos (Escudeiro Proteína, Escudeiro Gordura).
- Curva: Introdutória.
- Vitória: Avançar 3 quadros. Recompensa: +15 GCoins.
- Assets: `char-escudeiro-proteina.png`, `char-escudeiro-gordura.png`.

**Fase 5.2 — Pizza: Rápida ou Lenta?**
- Cenário: A pizza (carbo + gordura + proteína) é usada como exemplo clássico de absorção lenta e prolongada.
- Mecânica: Balance-meter — arrastar um ponteiro para prever o formato da curva de glicose (pico único vs. prolongado) e comparar com a curva real revelada.
- Curva: Primeira aparição do mecanismo "balance-meter", com tolerância generosa.
- Vitória: Ponteiro dentro da margem de erro. Recompensa: +30 GCoins.
- Assets: `icon-pizza-fatia.svg`, `icon-grafico-curva-glicose.svg`, `icon-ponteiro-balance.svg`.

**Fase 5.3 — Combo Certo, Combo Errado**
- Cenário: Testar se o jogador entende que combinar escudeiros muda o tempo de ação da insulina.
- Mecânica: Múltipla escolha com cenários curtos ("Comeu só bolacha de água e sal" vs "comeu bolacha com queijo") perguntando qual dura mais.
- Curva: Perguntas com pegadinhas de senso comum (ex: fruta com casca x suco de fruta).
- Vitória: 3/4 corretas. Recompensa: +30 GCoins, Conquista "Amigo dos Escudeiros".
- Assets: `icon-bolacha-agua-sal.svg`, `icon-bolacha-queijo.svg`, `sprite-gamellito-confuso.png`.

---

### Unidade 6: O Mestre da Contagem
*Tema: rótulos, matemática visual, combinações complexas, desafio do supermercado.*

**Fase 6.1 — Decifrando o Rótulo**
- Cenário: Primeira leitura guiada de um rótulo nutricional real (simplificado).
- Mecânica: Zoom interativo no rótulo com hotspots (porção, carboidrato total, açúcares).
- Curva: Sem timer, guiado passo a passo.
- Vitória: Tocar nos 3 hotspots corretos. Recompensa: +20 GCoins.
- Assets: `icon-rotulo-nutricional.png`, `icon-lupa-hotspot.svg`.

**Fase 6.2 — Quantos Gramas Tem Aqui?**
- Cenário: Matemática visual — contar carboidratos usando blocos visuais em vez de números soltos.
- Mecânica: Jogador arrasta "blocos de 10g" para igualar o total indicado no rótulo de um alimento.
- Curva: Rodada 1 números redondos (10, 20, 30g); rodada 2 números quebrados (15g, 25g) exigindo blocos menores de 5g.
- Vitória: Igualar o total em 3 alimentos. Recompensa: +30 GCoins.
- Assets: `icon-bloco-10g.svg`, `icon-bloco-5g.svg`, `icon-balanca-visual.svg`.

**Fase 6.3 — Prato Combinado sob Pressão**
- Cenário: Montar um prato de almoço somando corretamente o total de carboidratos de 3 itens simultâneos.
- Mecânica: Fruit-Ninja style — os alimentos "voam" na tela em sequência e o jogador corta (tap) apenas os que, somados, batem com a meta de gramas exibida no topo.
- Curva: Introduz mecânica fruit-ninja; velocidade dos itens aumenta a cada acerto.
- Vitória: Atingir a meta ±5g antes que os itens acabem. Recompensa: +40 GCoins, Conquista "Matemático de Prato".
- Assets: `icon-alimento-voador-set.svg`, `anim-corte-ninja.json`, `sfx-corte-fruta.mp3`.

**Fase 6.4 — Desafio do Supermercado (Boss da Unidade)**
- Cenário: Simulação de corredor de supermercado — escolher entre produtos parecidos pelo menor impacto glicêmico dentro de um orçamento de gramas.
- Mecânica: Cenário tipo "carrinho": grade de produtos com rótulos visíveis; jogador monta uma cesta de 5 itens sem estourar o limite total de carboidratos, com timer de 60s e obstáculos visuais (prateleiras cheias, produtos parecidos lado a lado).
- Curva: Fase mais complexa da Seção 2 — combina leitura de rótulo + matemática + tomada de decisão sob tempo e distração visual.
- Vitória: Cesta dentro do limite ±5g. Recompensa: +60 GCoins, Conquista "Mestre da Contagem", desbloqueia item de loja "carrinho de mercado mini" (acessório do Gamellito).
- Assets: `bg-corredor-supermercado.png`, `icon-produto-set-mercado.svg`, `icon-cesta-compras.svg`, `icon-timer-60s.svg`.

---

## SEÇÃO 3 — A MOCHILA BLINDADA E ROTINA

### Unidade 7: O Inventário
*Tema: kit de medição, insulina extra, resgate rápido.*

**Fase 7.1 — Monte a Mochila Blindada**
- Cenário: Preparar a mochila de saída de casa.
- Mecânica: Drag de 6 itens (glicosímetro, insulina extra, seringa/caneta, carboidrato de resgate, identificação médica, celular) para dentro de uma mochila ilustrada.
- Curva: Sem timer, com contorno-fantasma guia.
- Vitória: 6/6 itens posicionados. Recompensa: +25 GCoins.
- Assets: `icon-mochila-aberta.svg`, `icon-item-mochila-set.svg`.

**Fase 7.2 — O Que Falta?**
- Cenário: A mochila está incompleta — encontrar o item que falta.
- Mecânica: Tela com mochila parcialmente montada; jogador toca no item ausente entre 4 opções.
- Curva: Rodada 1 com item óbvio faltando; rodada 2 com 2 itens faltando e distratores (itens que não pertencem à mochila).
- Vitória: 2 rodadas corretas. Recompensa: +25 GCoins, Conquista "Sempre Preparado".
- Assets: `icon-mochila-incompleta.svg`, `icon-item-intruso.svg`.

**Fase 7.3 — Resgate Rápido (Tap-Timing sob Pressão)**
- Cenário: Simular abrir a mochila em uma emergência de hipoglicemia e achar o carboidrato de resgate rapidamente.
- Mecânica: Tap-timing — mochila balança na tela (screen-shake), jogador precisa tocar no item certo entre distratores em movimento, timer de 8s.
- Curva: Introduz distração visual (tremor) + timer curto, simulando urgência real.
- Vitória: Acertar o item certo antes do tempo acabar. Recompensa: +40 GCoins.
- Assets: `anim-mochila-tremendo.json`, `icon-item-resgate.svg`, `sfx-alarme-suave.mp3`.

---

### Unidade 8: A Selva de Pedra / Escola
*Tema: avaliação da cantina, recreio, explicando o DM1 para amigos.*

**Fase 8.1 — Radar da Cantina**
- Cenário: Escolher lanche na cantina da escola.
- Mecânica: Grade de opções de lanche; tap para selecionar a mais equilibrada, com dica visual (cores) na primeira tentativa.
- Curva: Rodada 1 com dicas coloridas; rodada 2 sem dicas.
- Vitória: 2 escolhas corretas seguidas. Recompensa: +25 GCoins.
- Assets: `bg-cantina-escolar.png`, `icon-lanche-set.svg`.

**Fase 8.2 — Sinal do Recreio (Tap-Timing)**
- Cenário: O sinal toca, o jogador precisa decidir se mede a glicemia antes de correr para o pátio.
- Mecânica: Tap único no botão "medir antes de brincar" dentro de uma janela de tempo curta que aparece após o "sinal" (som + animação de sino).
- Curva: Janela de reação cada vez mais curta em 3 tentativas.
- Vitória: Acertar 2 de 3 janelas. Recompensa: +25 GCoins.
- Assets: `anim-sino-escolar.json`, `sfx-sinal-escola.mp3`, `sprite-gamellito-correndo.png`.

**Fase 8.3 — Explicando para o Amigo**
- Cenário: Um coleguinha pergunta curioso sobre o sensor/aparelho. Escolher a melhor resposta.
- Mecânica: Diálogo de múltipla escolha (estilo visual novel) com 3 falas possíveis; escolha empática ganha mais pontos que a evasiva.
- Curva: Sem timer — foco em soft skills, não em velocidade.
- Vitória: Escolher a resposta empática nas 2 perguntas. Recompensa: +30 GCoins, Conquista "Embaixador do DM1".
- Assets: `char-colega-curioso.png`, `icon-balao-dialogo.svg`.

**Fase 8.4 — Prova Surpresa (Boss)**
- Cenário: Durante uma prova, sintomas leves de hipo aparecem — decidir agir mesmo com "vergonha" social.
- Mecânica: Cenário com timer de prova visível ao fundo (pressão ambiente) + escolha rápida entre "levantar a mão e avisar" ou "ignorar até terminar"; escolher errado gera cutscene de consequência (não é fim de jogo, é aprendizado).
- Curva: Introduz pressão social como variável de dificuldade, além do tempo.
- Vitória: Escolher avisar o professor. Recompensa: +45 GCoins, Conquista "Coragem na Sala de Aula".
- Assets: `bg-sala-de-aula-prova.png`, `char-professor.png`, `icon-relogio-prova.svg`.

---

## SEÇÃO 4 — EVENTOS ÉPICOS E EXTREMOS

### Unidade 9: A Arena
*Tema: educação física, aquecimento, pausa tática no esporte.*

**Fase 9.1 — Aquecendo os Músculos**
- Cenário: Antes da educação física, entender por que medir a glicemia é o "aquecimento invisível".
- Mecânica: Sequência tap-to-continue explicando o efeito do exercício na glicose.
- Curva: Introdutória.
- Vitória: Avançar os quadros. Recompensa: +15 GCoins.
- Assets: `bg-quadra-esportiva.png`, `sprite-gamellito-esportivo.png`.

**Fase 9.2 — Zona Segura para Jogar**
- Cenário: Verificar se o número da glicemia permite atividade física com segurança.
- Mecânica: Slider termômetro (reaproveitado da fase 2.5) com 3 zonas: "coma antes de jogar", "pode jogar", "espere e meça de novo".
- Curva: Números-limite mais próximos das bordas do que na primeira aparição do slider.
- Vitória: 3 classificações corretas. Recompensa: +25 GCoins.
- Assets: `icon-slider-zona-esporte.svg`.

**Fase 9.3 — Pausa Tática (Balance-Meter)**
- Cenário: No meio do jogo, sinais de queda de energia aparecem — decidir o momento certo de pedir pausa.
- Mecânica: Balance-meter — manter um ponteiro numa "zona verde" de energia enquanto ícones de sintomas piscam, arrastando o dedo para cima (comer algo) ou para baixo (continuar) em tempo real.
- Curva: Ponteiro decai mais rápido a cada rodada; primeira fase com mecânica de "manter equilíbrio contínuo" em vez de decisão única.
- Vitória: Manter o ponteiro na zona verde por 15s. Recompensa: +40 GCoins, Conquista "Atleta Esperto".
- Assets: `icon-ponteiro-energia.svg`, `anim-zona-verde-pulsando.json`, `sfx-batimento-cardiaco.mp3`.

**Fase 9.4 — Lanche do Meio-Tempo (Fruit Ninja)**
- Cenário: Escolher rapidamente um lanche de reposição de energia no intervalo do jogo.
- Mecânica: Fruit-ninja — cortar apenas os alimentos de absorção rápida entre os que voam na tela.
- Curva: Velocidade herda o nível mais alto já visto na Unidade 6, reaproveitando maestria.
- Vitória: 8 cortes corretos, máx. 2 erros. Recompensa: +35 GCoins.
- Assets: reaproveita `icon-alimento-voador-set.svg` da fase 6.3.

---

### Unidade 10: Splash!
*Tema: bomba de insulina na natação, timer de medição, lanche pós-natação.*

**Fase 10.1 — Preparando o Mergulho**
- Cenário: Decidir o que fazer com a bomba de insulina antes de entrar na piscina.
- Mecânica: Múltipla escolha guiada com imagens (desconectar bomba temporariamente / usar capa à prova d'água, dependendo do tipo de dispositivo).
- Curva: Introdutória, sem timer.
- Vitória: Escolher a opção correta para o cenário mostrado. Recompensa: +20 GCoins.
- Assets: `bg-piscina.png`, `icon-bomba-insulina.svg`, `icon-capa-impermeavel.svg`.

**Fase 10.2 — Timer da Piscina**
- Cenário: Definir de quanto em quanto tempo sair da água para checar sinais de hipo.
- Mecânica: Arrastar um ponteiro num relógio circular para marcar o intervalo recomendado; feedback visual de "ok" ou "risco".
- Curva: Zona de acerto mais estreita que fases anteriores de relógio.
- Vitória: Marcar dentro da zona seguro. Recompensa: +25 GCoins.
- Assets: `icon-relogio-circular-piscina.svg`.

**Fase 10.3 — Saindo da Água a Tempo (Tap-Timing)**
- Cenário: O alarme do timer toca dentro d'água — reagir rápido para sair e medir.
- Mecânica: Tap-timing com "splash" de fundo animado; janela de reação curta.
- Curva: Janela mais curta que a 8.2, com distração visual de água se movendo.
- Vitória: Reagir a 2 de 3 alarmes. Recompensa: +30 GCoins, Conquista "Nadador Precavido".
- Assets: `anim-agua-ondulando.json`, `sfx-alarme-piscina.mp3`.

**Fase 10.4 — Lanche Pós-Natação (Boss)**
- Cenário: Depois de nadar (esforço prolongado), montar o lanche de recuperação certo.
- Mecânica: Combina slider de classificação de glicemia (10.2) + escolha de prato (6.3/9.4) em sequência única com timer moderado.
- Curva: Primeira fase-boss a encadear 3 mecânicas diferentes em uma sessão contínua.
- Vitória: Completar as 3 etapas corretamente. Recompensa: +50 GCoins, Conquista "Herói da Piscina", desbloqueia skin "Gamellito nadador".
- Assets: `sprite-gamellito-nadador.png`, `bg-piscina-poente.png`.

---

### Unidade 11: Vida Social
*Tema: festa de aniversário, dormindo fora.*

**Fase 11.1 — A Mesa de Doces (Swipe)**
- Cenário: Festa de aniversário com mesa cheia de doces — decidir o que e quanto comer.
- Mecânica: Tinder-swipe entre "posso comer à vontade / com moderação / evitar por agora", com contagem visual de carboidrato acumulando no topo da tela.
- Curva: Itens ficam mais tentadores/parecidos (bolo simples vs. bolo recheado) a cada rodada.
- Vitória: Manter o total acumulado dentro do limite combinado. Recompensa: +35 GCoins.
- Assets: `bg-mesa-festa.png`, `icon-doce-set-festa.svg`, `icon-contador-carbo-topo.svg`.

**Fase 11.2 — Mochila para Dormir Fora**
- Cenário: Montar a mochila especial para uma pijama party na casa de um amigo.
- Mecânica: Reaproveita mecânica de drag da Unidade 7, com itens extras (dose para a manhã seguinte, contato dos pais do amigo).
- Curva: Mais itens que a fase 7.1, exigindo memória do que já foi aprendido.
- Vitória: Montar mochila completa. Recompensa: +30 GCoins, Conquista "Pronto Para Dormir Fora".
- Assets: `icon-mochila-pijama.svg`, `icon-item-extra-set.svg`.

**Fase 11.3 — Conversa com os Pais do Amigo**
- Cenário: Diálogo explicando o essencial do DM1 para um adulto responsável por algumas horas.
- Mecânica: Visual novel — escolher as 3 informações mais importantes entre 6 opções para passar ao adulto (estilo "escolha os cards certos").
- Curva: Distratores plausíveis mas menos críticos (ex: "cor favorita" vs "onde fica o kit de emergência").
- Vitória: Escolher as 3 informações corretas. Recompensa: +35 GCoins.
- Assets: `char-mae-amigo.png`, `icon-card-informacao.svg`.

**Fase 11.4 — Noite Tranquila (Boss)**
- Cenário: Simulação da noite toda — verificação antes de dormir e reação a um alarme noturno simulado.
- Mecânica: Sequência com "passagem de tempo" acelerada (relógio girando) interrompida por um evento aleatório (alarme de glicose baixa à noite) que exige decisão rápida.
- Curva: Introduz aleatoriedade controlada (o evento pode ou não disparar) — jogador deve estar sempre "pronto", reforçando hábito, não memorização de sequência fixa.
- Vitória: Reagir corretamente ao evento (se disparar) ou completar a noite tranquila. Recompensa: +45 GCoins, Conquista "Noite Bem Dormida".
- Assets: `bg-quarto-noite.png`, `anim-relogio-girando.json`, `sfx-alarme-notturno.mp3`.

---

### Unidade 12: Situações de Risco
*Tema: gripe com DM1, viagens de avião, parque de diversões.*

**Fase 12.1 — Dias de Gripe (Regra do "Sick Day")**
- Cenário: Gripado, o corpo se comporta diferente — entender por que não se deve parar a insulina.
- Mecânica: Múltipla escolha com cenários curtos sobre o que fazer estando doente (nunca parar insulina, medir mais vezes, hidratar).
- Curva: Perguntas com mitos comuns como distratores ("já que não estou comendo, paro a insulina" — errado).
- Vitória: 3/4 corretas. Recompensa: +35 GCoins, Conquista "Resistente à Gripe".
- Assets: `bg-quarto-doente.png`, `sprite-gamellito-doente.png`, `icon-termometro-febre.svg`.

**Fase 12.2 — Check-in no Aeroporto (Monte a Mochila de Viagem)**
- Cenário: Preparar a bagagem de mão para uma viagem de avião com todos os itens do tratamento.
- Mecânica: Drag-and-drop com item extra "carta médica/laudo" explicando itens perfurocortantes na bagagem.
- Curva: Cenário com "regras" novas (itens que precisam ficar na bagagem de mão, não no despacho).
- Vitória: Montar a mochila de viagem certa. Recompensa: +30 GCoins.
- Assets: `bg-aeroporto.png`, `icon-laudo-medico.svg`, `icon-mochila-viagem.svg`.

**Fase 12.3 — Fuso Horário e Doses (Puzzle Avançado)**
- Cenário: Ajustar horários de dose ao cruzar fuso horário — puzzle de lógica temporal.
- Mecânica: Arrastar marcadores de horário em uma linha do tempo dupla (origem/destino) para reposicionar as doses.
- Curva: Fase mais cognitivamente complexa da unidade — exige raciocínio sequencial, não apenas reconhecimento.
- Vitória: Reposicionar as doses na janela aceitável. Recompensa: +50 GCoins, Conquista "Viajante Experiente".
- Assets: `icon-linha-tempo-dupla.svg`, `icon-marcador-dose.svg`.

**Fase 12.4 — Parque de Diversões: Fila e Adrenalina (Boss Final da Persona)**
- Cenário: Emoção do brinquedo radical altera a glicemia — decidir sequência de ações entre esperar na fila, medir, e embarcar.
- Mecânica: Fase multi-etapas com timer, combinando slider de classificação + escolha de lanche + decisão de "posso entrar no brinquedo agora?", com distração visual de fila se movendo e som de parque ao fundo.
- Curva: Fase-boss final da Seção 4 — reúne praticamente todas as mecânicas aprendidas (slider, escolha, timer, distração ambiente) na maior pressão de tempo da Persona 1.
- Vitória: Completar as 3 etapas corretamente dentro do tempo. Recompensa: +80 GCoins, Conquista Lendária "Coração de Aventureiro", desbloqueia skin exclusiva "Gamellito aventureiro" + cupom de frete grátis na Loja Fidelidade.
- Assets: `bg-parque-diversoes.png`, `sprite-gamellito-aventureiro.png`, `sfx-ambiente-parque.mp3`, `icon-fila-array.svg`.

---

# PERSONA 2: EDUCADORES E ESCOLA — Foco: Inclusão

### Unidade 1: Radar do Professor
*Tema: identificar sinais visíveis de hipo/hiper em sala.*

**Fase E1.1 — Observando a Turma**
- Cenário: Vista aérea da sala de aula; identificar o aluno com sinais de alerta entre vários alunos "normais".
- Mecânica: Tap em spot-the-difference — tocar no aluno com sinais sutis (suor, palidez) entre 8 alunos ilustrados.
- Curva: Rodada 1 com sinal óbvio (aluno destacado); rodada 2 com sinal sutil e mais alunos na cena.
- Vitória: Identificar corretamente 2/2 rodadas. Recompensa: +25 GCoins, Conquista "Olho Clínico".
- Assets: `bg-sala-de-aula-topo.png`, `char-aluno-set-diverso.png`, `icon-sinal-alerta-sutil.svg`.

**Fase E1.2 — Sintomas ou Manha? (Quiz)**
- Cenário: Desconstruir o preconceito de que sintomas de hipo/hiper são "manha" ou desatenção.
- Mecânica: Múltipla escolha com cenários reais de sala de aula.
- Curva: Perguntas com viés comum como distrator (ex: "ele só quer atenção").
- Vitória: 4/5 corretas. Recompensa: +30 GCoins.
- Assets: `sprite-educador-pensativo.png`, `icon-balao-duvida.svg`.

**Fase E1.3 — Checklist Silencioso**
- Cenário: Sem alarde na frente da turma, o professor confere discretamente os sinais.
- Mecânica: Checklist tocável com 5 itens (tremor, confusão, sede excessiva, etc.), sem timer, foco em memorização dos sinais oficiais.
- Curva: Sem timer, mas exige marcar todos os itens relevantes sem marcar os irrelevantes (distratores).
- Vitória: Marcar corretamente 5/5. Recompensa: +30 GCoins, Conquista "Radar Afiado".
- Assets: `icon-checklist-professor.svg`, `icon-item-sintoma-set.svg`.

---

### Unidade 2: Protocolo de Ação
*Tema: agir no recreio, inclusão no lanche coletivo.*

**Fase E2.1 — O Que Fazer Primeiro?**
- Cenário: Aluno apresenta sinais de hipoglicemia no recreio — ordenar as ações corretas.
- Mecânica: Drag-to-reorder de 4 cards de ação (chamar a coordenação, oferecer carboidrato de resgate, manter calmo, acionar a família).
- Curva: Sem timer na 1ª tentativa; card fora de ordem retorna embaralhado.
- Vitória: Ordem correta. Recompensa: +30 GCoins.
- Assets: `icon-card-acao-professor-set.svg`.

**Fase E2.2 — Lanche Coletivo Inclusivo**
- Cenário: Planejar uma festa de turma incluindo opções seguras para o aluno com DM1 sem o excluir ou expô-lo.
- Mecânica: Montar um cardápio de festa (drag de itens para uma mesa) garantindo que pelo menos 2 opções sejam adequadas, sem "separar" o prato do aluno de forma constrangedora.
- Curva: Introduz variável social (inclusão sem estigma) além da nutricional.
- Vitória: Cardápio com opções inclusivas montado. Recompensa: +35 GCoins, Conquista "Sala Sem Barreiras".
- Assets: `bg-festa-sala-aula.png`, `icon-cardapio-item-set.svg`.

**Fase E2.3 — Simulado de Emergência (Boss)**
- Cenário: Cenário completo e cronometrado de uma emergência leve durante a aula, do sinal de alerta até o acionamento da família.
- Mecânica: Combina E1.1 (observar) + E2.1 (ordenar ações) em sequência única com timer de 60s e leve screen-shake para simular tensão.
- Curva: Fase-boss da Persona 2 — primeira a encadear observação + protocolo sob tempo.
- Vitória: Completar a sequência corretamente no tempo. Recompensa: +60 GCoins, Conquista "Professor Preparado", desbloqueia certificado digital "Educador Gamellito" (cosmético/selo de perfil).
- Assets: `bg-patio-recreio.png`, `icon-timer-60s.svg`, `sprite-educador-confiante.png`.

---

# PERSONA 3: PROFISSIONAIS DE SAÚDE — Foco: Engajamento

### Unidade 1: Mediquês Lúdico
*Tema: explicar o diagnóstico com o Gamellito.*

**Fase P1.1 — Traduzindo o Diagnóstico**
- Cenário: O profissional escolhe a melhor forma de explicar "diabetes tipo 1" para uma criança pequena usando metáforas do universo Gamellito.
- Mecânica: Múltipla escolha entre 3 explicações (uma técnica demais, uma lúdica e precisa, uma simplificada demais/incorreta).
- Curva: Sem timer — foco em qualidade de comunicação, não velocidade.
- Vitória: Escolher a explicação lúdica e correta. Recompensa: +25 GCoins.
- Assets: `sprite-gamellito-medico.png`, `icon-balao-explicacao.svg`.

**Fase P1.2 — Kit de Metáforas**
- Cenário: Associar termos médicos (insulina, glicemia, hipoglicemia) às metáforas já ensinadas ao paciente (chave, rio de energia, monstro tremendo).
- Mecânica: Match-pairs (memory game) entre termo técnico e ícone-metáfora correspondente.
- Curva: 4 pares tempo livre → 6 pares com timer de 30s.
- Vitória: Casar todos os pares dentro do tempo na rodada 2. Recompensa: +30 GCoins, Conquista "Tradutor Gamellito".
- Assets: `icon-termo-tecnico-card.svg`, `icon-metafora-card.svg`.

**Fase P1.3 — Consulta Simulada**
- Cenário: Simular uma consulta curta com um "paciente" (criança ilustrada) usando o app na tela para apoiar a explicação.
- Mecânica: Sequência de diálogo com escolhas de tom (técnico / lúdico / acolhedor); escolhas lúdicas/acolhedoras somam mais "pontos de vínculo".
- Curva: Introduz métrica de "vínculo" cumulativa ao longo de 3 falas.
- Vitória: Atingir pontuação mínima de vínculo. Recompensa: +35 GCoins.
- Assets: `char-paciente-crianca.png`, `icon-medidor-vinculo.svg`.

---

### Unidade 2: Prescrição de Missões
*Tema: receitar missões valendo GCoins extras no app da criança.*

**Fase P2.1 — Escolhendo a Missão Certa**
- Cenário: Com base no perfil da criança (idade, dificuldade recente), o profissional escolhe qual missão do app "prescrever" como reforço.
- Mecânica: Tela de dashboard simplificado mostrando 3 perfis de criança com uma "lacuna de aprendizado" destacada; tap para associar a missão correta a cada perfil.
- Curva: Sem timer — foco em julgamento clínico, não reflexo.
- Vitória: Associar corretamente 3/3. Recompensa: +30 GCoins.
- Assets: `icon-dashboard-perfil-crianca.svg`, `icon-missao-card.svg`.

**Fase P2.2 — Configurando a Recompensa**
- Cenário: Definir quantos GCoins extras uma missão prescrita vai valer, equilibrando incentivo sem "inflacionar" a economia do jogo.
- Mecânica: Slider de valor (10–100 GCoins) com feedback textual indicando se o valor está "baixo incentivo", "equilibrado" ou "excessivo".
- Curva: Introduz noção de balanceamento econômico como parte do "jogo" do profissional.
- Vitória: Definir valor na faixa "equilibrado". Recompensa: +25 GCoins.
- Assets: `icon-slider-gcoins.svg`, `icon-moeda-gcoin.svg`.

**Fase P2.3 — Acompanhando o Progresso (Boss)**
- Cenário: Revisar o resultado da missão prescrita semanas depois e decidir o próximo passo (reforçar, avançar de nível, ou reformular a missão).
- Mecânica: Tela de relatório com gráfico simplificado de progresso; múltipla escolha para a próxima ação com base no padrão apresentado.
- Curva: Fase-boss da Persona 3 — exige interpretar dado visual (não só decorar regra) para decidir a ação certa.
- Vitória: Escolher a ação coerente com o gráfico mostrado. Recompensa: +45 GCoins, Conquista "Mentor Gamellito", desbloqueia selo de perfil "Prescritor Nível Ouro".
- Assets: `icon-grafico-progresso-crianca.svg`, `sprite-gamellito-formatura.png`.

---

## Apêndice A — Sistema de Assets: convenções de nomenclatura

| Prefixo | Uso | Exemplo |
|---|---|---|
| `bg-` | Fundo de cena/tela | `bg-parque-diversoes.png` |
| `sprite-gamellito-` | Mascote em estado emocional/traje específico | `sprite-gamellito-aventureiro.png` |
| `char-` | Outros personagens (monstros, colegas, adultos) | `char-monstro-tremendo.png` |
| `icon-` | Ícone de UI, item ou ação | `icon-bala-glicose.svg` |
| `anim-` | Animação/efeito (Lottie/JSON ou GIF) | `anim-tela-tremendo.json` |
| `sfx-` | Efeito sonoro | `sfx-alarme-suave.mp3` |

## Apêndice B — Mecânicas core (glossário rápido)

- **Tinder-swipe**: classificação binária/ternária por arraste lateral de cards.
- **Tap-timing**: toque numa janela de tempo específica (curta = difícil).
- **Balance-meter**: manter um valor dentro de uma zona-alvo por tempo contínuo, com decaimento.
- **Fruit Ninja style**: cortar/tocar itens em movimento que atendem a um critério, sob tempo.
- **Drag-and-drop / reorder**: posicionar ou ordenar itens visualmente.
- **Slider termômetro**: classificar um valor numérico numa escala visual de zonas.

## Apêndice C — Economia GCoins (referência rápida por dificuldade de fase)

| Tipo de fase | Faixa de GCoins |
|---|---|
| Introdutória/cutscene | 15–20 |
| Padrão (1 mecânica) | 25–35 |
| Avançada (2 mecânicas) | 35–50 |
| Boss de unidade | 45–60 |
| Boss de seção/persona | 60–80 |

## Apêndice D — Próximos passos sugeridos

1. Priorizar produção de assets compartilhados entre fases (ex: `icon-alimento-voador-set.svg`, `icon-slider-termometro.svg`) para reduzir custo de arte.
2. Validar com endocrinologista pediátrico as regras clínicas simplificadas (Regra dos 15, sick day, ajuste de fuso) antes de finalizar textos em produção.
3. Expandir a árvore com novas Unidades por persona conforme feedback de uso (ex: Persona 1 — "Adolescência e Independência"; Persona 2 — "Educação Física Avançada"; Persona 3 — "Telemonitoramento").
