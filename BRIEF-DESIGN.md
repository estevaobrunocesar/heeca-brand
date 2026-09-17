# Briefing para a equipe de design — marca Heeca

**Objetivo:** partir do kit vetorial já pronto (esta pasta) e produzir o que exige mão de designer:
o render 3D cromado do painel de referência, o refino final das curvas e as peças de motion.
**Não é para redesenhar o símbolo.** A geometria está decidida e já roda nos sistemas.

## 1. O que já existe (e é a base de tudo)

| Item | Onde |
|---|---|
| Referência visual escolhida (painel) | `reference/painel-escolhido.png` |
| Símbolo em vetor, todas as variantes | `dist/symbol/*.svg` |
| Assinaturas (principal, horizontal, com/sem slogan, mono) por produto | `dist/logo/*.svg` |
| Ícones de app, favicons, Open Graph | `dist/icon/`, `dist/favicon/`, `dist/social/` |
| Animação de referência (SVG + React) | `dist/animated/*.svg`, `logo.tsx` |
| Especificação de construção, cores e regras | `README.md` |
| Apresentação navegável com a animação | https://claude.ai/artifact/JaZ9fHz7NXCSDQgCtuYYW7 |

Todos os SVGs são curvas puras (sem fontes embutidas), malha 126 × 100 u, prontos para abrir no
Illustrator / Figma / Blender.

## 2. Entregas pedidas

### 2.1 Refino vetorial (Illustrator ou Figma) — 1 arquivo-mestre
Abrir `dist/symbol/heeca-symbol-heeca-on-dark.svg` e:
- Suavizar a **junção do swoosh com o braço superior do C** (hoje é uma emenda tangente calculada;
  pode ganhar uma transição mais orgânica) e a **ponta fina do swoosh** (afunilar até ~1,5 u).
- Avaliar o **encontro do C com a haste direita** (o C nasce atrás dela) e o cruzamento do swoosh
  sobre a haste direita. Se mudar, manter o traço em 17 u.
- Manter obrigatoriamente: **as duas hastes** (17 × 88 u cada — é o que faz ler H e não I),
  centro e raio do C, ângulo de abertura (±48–50°), altura das maiúsculas do wordmark (62 u),
  cores do README. O painel original tinha uma haste só e lia "IC"; a segunda haste é decisão
  fechada.
- Devolver **SVG limpo** (sem grupos vazios, sem máscaras, coordenadas em 100 u) para eu atualizar
  `geometry.mjs` — a partir daí o gerador reproduz o refino em todas as 120+ peças.

### 2.2 Render 3D "hero" (Blender / Cinema 4D) — para materiais, não para UI
Reproduzir o acabamento do painel: hastes em **metal escovado/cromado** com reflexo vertical,
swoosh e braços em **vermelho laqueado** com brilho suave, fundo `#0B0B0B` com luz vermelha rasante.
- Modelar a partir do SVG mestre (extrusão 6–8 % da altura, chanfro leve nas arestas da haste).
- Entregar: PNG transparente 4000 px (símbolo), PNG 4000 px (logo principal sobre fundo escuro),
  versão horizontal 6000 px, e o arquivo-fonte (.blend / .c4d) com o material salvo.
- Uso: capa de apresentação, site (hero), redes, vídeo. **Nunca** em favicon, ícone, e-mail ou UI —
  nesses contextos vale o vetor flat.

### 2.3 Motion (After Effects) — a partir da animação de referência
A sequência já está validada em código (`dist/animated/heeca-heeca-intro-on-dark.svg`):

| t | Passo | O que acontece |
|---|---|---|
| 0,1 – 1,0 s | 1. H surge | As duas hastes prata sobem (scale Y, ease-out) |
| 1,0 – 1,8 s | 2. C se forma | O C vermelho se desenha nascendo atrás da haste direita |
| 1,8 – 2,75 s | 3. Conexão | Swoosh sai de dentro da haste esquerda (é a barra do H), cruza a direita, sobe e entra no C; braço superior fecha |
| 2,7 – 4,0 s | 4. Nome revela | H·e·e·c·a letra a letra ("ca" em vermelho), depois o slogan em fade |

Pedido: recriar em AE com o render 3D (versão "hero") e com o vetor flat (versão UI), adicionando
o que o código não faz — reflexo de luz correndo pelo cromado no passo 3, partícula/brilho na
ponta do swoosh, som opcional. Entregar MP4 1080p e 4K (fundo escuro), MOV com alpha, GIF 800 px
para redes, e Lottie do flat (para o app nativo).
Manter os tempos acima (±0,2 s): o `LogoIntro` do software usa os mesmos e as duas versões devem
parecer a mesma animação.

### 2.4 Aplicações (opcional, se houver verba)
Cartão, assinatura de e-mail, capa LinkedIn, template de slides, camiseta/adesivo (usar a versão
mono com respiro), papel timbrado. Todas a partir dos SVGs de `dist/logo/`.

## 3. Restrições que não são negociáveis
- Cores exatas do README (prata `#d4d6db` só em fundo escuro; grafite `#1f1f23` em fundo claro;
  vermelho `#e50914`; preto `#0a0a0a`). O cromado e o laqueado do 3D devem **ler** como essas cores.
- O "prata" não existe como cor de UI — em interface é grafite ou prata flat, sem gradiente.
- Wordmark: Montserrat 700, "Hee" + "ca" ("ca" na cor do produto). Grafia sempre **Heeca**. Não trocar a fonte, não condensar.
- Slogan só nas versões principal e horizontal com slogan.
- Por produto muda **só o vermelho** (Ticket azul `#0a6ee6`, Dental laranja `#f06511`,
  Orçamento verde `#0f8a5f`, Vendas roxo `#6d28d9`). As hastes não mudam.
- Sem ®.

## 4. Formato de entrega
- Vetor: SVG + AI/FIG fonte.
- Raster: PNG com alpha, sRGB, tamanhos indicados.
- Vídeo: MP4 H.264 + MOV ProRes 4444 (alpha) + Lottie JSON.
- Nomear como o kit: `heeca-{produto}-{versao}-{variante}` (ex.: `heeca-heeca-principal-3d.png`).

Dúvidas de construção: `README.md` → "Construção". Qualquer mudança de geometria passa por
`geometry.mjs` antes de virar arquivo final — assim o software e os materiais nunca divergem.
