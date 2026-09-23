# Briefing para a equipe de design — marca Heeca (Tipografia Exclusiva)

**Objetivo:** partir do kit vetorial já pronto (esta pasta) e produzir o que exige mão de designer:
o refino final das curvas do logotipo, o render "hero" e as peças de motion.
**Não é para redesenhar a marca.** A direção está aprovada (handoff v1.0) e já roda nos sistemas.

## 1. O que já existe (e é a base de tudo)

| Item | Onde |
|---|---|
| Painel aprovado (referência visual oficial) | `reference/conceito_tipografia_exclusiva.png` |
| Handoff original (README, guia PDF, tokens, SVGs de rascunho) | `reference/HEECA_BRAND_KIT_DEV_v1.0/` |
| Logotipo em vetor, todas as variantes | `dist/logo/*.svg` |
| Símbolo (H + arco) | `dist/symbol/*.svg` |
| Ícones de app, favicons, Open Graph | `dist/icon/`, `dist/favicon/`, `dist/social/` |
| Animação de referência (SVG + React) | `dist/animated/*.svg`, `logo.tsx` |
| Especificação de construção, cores e regras | `README.md` |

Todos os SVGs são curvas puras (sem fontes embutidas), maiúsculas de 100 u, prontos para abrir no
Illustrator / Figma / Blender.

> **Atenção:** os SVGs dentro de `reference/HEECA_BRAND_KIT_DEV_v1.0/logos/` são um rascunho (arco em S
> atravessando as letras, espaçamento irregular, A com travessão). Não use. A geometria válida é a de
> `geometry.mjs` / `dist/`, medida diretamente no painel aprovado.

## 2. Entregas pedidas

### 2.1 Refino vetorial (Illustrator ou Figma) — 1 arquivo-mestre
Abrir `dist/logo/heeca-heeca-horizontal.svg` e, com o painel ao lado:
- Refinar o **arco**: hoje são dois arcos de círculo (R 90,6 externo e R 148,2 interno) com pontas
  afiadas. Avaliar um afunilamento mais orgânico nas pontas e a espessura no cruzamento com as hastes.
- Revisar os **encaixes ópticos**: o corte dos braços do C, o ápice chanfrado do A, o respiro de 20 u
  entre a barra vermelha e o corpo do E.
- Conferir o **espaçamento** (H→E 31 · E→E 18 · E→C 19 · C→A 8) em tamanhos grandes (fachada) e
  pequenos (favicon), onde o par C–A é o mais apertado.
- Manter obrigatoriamente: arco como barra do H (sem barra preta), barras superiores dos E vermelhas e
  destacadas, A sem travessão, pesos (haste 28 / braços 20) e as cores do README.
- Devolver **SVG limpo** (coordenadas em 100 u, sem grupos vazios nem máscaras) para atualizarmos
  `geometry.mjs` — a partir daí o gerador reproduz o refino em todas as peças e no componente React.

### 2.2 Render "hero" (Blender / Cinema 4D) — para materiais, não para UI
Reproduzir o acabamento do painel: letras com **relevo suave e bisel**, preto profundo com reflexo
discreto, arco em **vermelho laqueado**, fundo claro com luz lateral (ou Heeca Black com luz rasante).
- Modelar a partir do SVG mestre (extrusão 6–8 % da altura, chanfro leve).
- Entregar: PNG transparente 4000 px (logotipo), 4000 px (símbolo), versão horizontal 6000 px e o
  arquivo-fonte (.blend / .c4d) com o material salvo.
- Uso: capa de apresentação, site (hero), redes, vídeo. **Nunca** em favicon, ícone, e-mail ou UI.

### 2.3 Motion (After Effects) — a partir da animação de referência
A sequência já está validada em código (`dist/animated/heeca-heeca-intro-on-dark.svg`):

| t | Passo | O que acontece |
|---|---|---|
| 0,1 – 0,6 s | 1. As hastes | As duas hastes do H sobem (scale Y, ease-out) |
| 0,55 – 1,25 s | 2. O arco conecta | O arco varre da esquerda para a direita e vira a barra do H |
| 1,15 – 1,9 s | 3. As letras | E, E, C, A entram uma a uma (as barras vermelhas junto com cada E) |
| 1,8 – 2,6 s | 4. Assinatura | Nome do produto e, por fim, o slogan em fade |

Pedido: recriar em AE com o render (versão "hero") e com o vetor flat (versão UI), acrescentando o que o
código não faz — brilho correndo pelo arco no passo 2, leve profundidade nas letras. Entregar MP4 1080p e
4K (fundo claro e escuro), MOV com alpha, GIF 800 px e Lottie do flat (para o app nativo).
Manter os tempos acima (±0,2 s): o `LogoIntro` do software usa os mesmos.

### 2.4 Aplicações (opcional, se houver verba)
Cartão, assinatura de e-mail, capa LinkedIn, template de slides, camiseta/adesivo (versão mono),
papelaria e fachada — como no painel. Todas a partir dos SVGs de `dist/logo/`.

## 3. Restrições que não são negociáveis
- Cores exatas do handoff: `#E31B23`, `#B90F19`, `#15171A`, `#30343A`, `#667085`, `#E5E7EB`, `#F7F4EF`.
- O logotipo é desenho: **não substituir por fonte**, não distorcer, inclinar ou aplicar efeitos.
- Por produto muda **só a segunda linha** (nome em caixa alta, Inter 600, cor da família). O arco é sempre
  vermelho institucional.
- Slogan só nas versões principal e horizontal com slogan, alinhado pela haste do H.
- Interface em Inter; vermelho como acento, nunca dominante.
- Sem ®.

## 4. Formato de entrega
- Vetor: SVG + AI/FIG fonte.
- Raster: PNG com alpha, sRGB, tamanhos indicados.
- Vídeo: MP4 H.264 + MOV ProRes 4444 (alpha) + Lottie JSON.
- Nomear como o kit: `heeca-{produto}-{versao}-{variante}` (ex.: `heeca-heeca-horizontal-hero.png`).

Dúvidas de construção: `README.md` → "Construção". Qualquer mudança de geometria passa por
`geometry.mjs` antes de virar arquivo final — assim o software e os materiais nunca divergem.
