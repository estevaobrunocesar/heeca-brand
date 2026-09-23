# Heeca — kit de marca

Identidade da plataforma Heeca (heeca.com.br) e do ecossistema: 20 produtos verticais (Beauty, Wellness,
Bronze, Ink, Piercing, Move, Mind, Nutri, Dental, Med, Fono, Pet, Food, Service, Build, Atelier, Event, Studio,
Class, Store) + Ticket e Invoice. Motores (Core, Schedule, Health, Commerce, Service, Project, Studio) são
arquitetura e não têm logo.

**Direção aprovada: Tipografia Exclusiva** (handoff `reference/HEECA_BRAND_KIT_DEV_v1.0/`, set/2026).
"Um logotipo minimalista e sofisticado, onde a tipografia ganha protagonismo. Linhas precisas, formas únicas
e um detalhe na letra H que representa conexão." O **arco vermelho é a barra do H** — conexão, movimento e
evolução — e as **barras superiores dos E** são vermelhas e destacadas. HE = Heloísa · CA = Catharina.
O logotipo é **desenho, não fonte**: nunca substitua por texto digitado.

Os SVGs que vieram no zip do handoff são um rascunho (arco em S, letras fora de proporção); a geometria
deste kit foi **medida pixel a pixel no painel aprovado** (`reference/conceito_tipografia_exclusiva.png`) —
proporções, pesos e espaçamento vêm de lá.

> **Conceito único.** Este é o único conceito de marca da Heeca e dos seus sistemas. Os estudos
> anteriores (símbolo H+C com swoosh; "Pessoas", com duas figuras) foram descartados e removidos do
> repositório em 23/09/2026 — não reintroduza nenhum deles em arte, código ou material.

- Briefing para a equipe de design (refino das curvas, render 3D, motion): [BRIEF-DESIGN.md](BRIEF-DESIGN.md)

## Fonte da verdade

| Arquivo | Papel |
|---|---|
| `products.csv` | **Catálogo de produtos**: chave, nome, família, motor, status, público, sigla (opcional), pictograma |
| `products.mjs` | Lê o CSV, dá a cor pela família (dois tons), gera a sigla única, valida; `node products.mjs` imprime |
| `geometry.mjs` | **Geometria do logotipo e do símbolo** + paleta — mude aqui, nunca nos arquivos gerados |
| `pictograms.mjs` | Pictogramas dos ícones de produto (Lucide + desenhos próprios) |
| `build.mjs` | Composições, ícones, animação; gera `dist/` e `logo.tsx` |
| `logo.tsx` | **Gerado.** Componente React (`Logo`, `HeecaWordmark`, `HeecaSymbol`, `HeecaAppIcon`, `LogoIntro`) — copiado para cada projeto |
| `tokens.css` | Tokens do handoff como custom properties |
| `fonts/` | Inter 400/600 (OFL) — só para converter nome do produto e slogan em curvas. O logotipo não usa fonte |
| `reference/` | Painel aprovado e o kit original do handoff — **única** referência válida da marca |

```bash
pnpm install
pnpm build          # regenera dist/ e logo.tsx
pnpm assets         # sincroniza favicon/ícones dos projetos sem script próprio (--check só confere)
```

Produto novo = **uma linha em `products.csv`** (`key` = slug de código/URL/arquivos, `name` = nome comercial de
uma palavra ≤ 9 letras, `family`, `engine`, `status`, `icon` opcional) + `pnpm build` + copiar `logo.tsx`
para os projetos. Segmentos (nail, lash, pizzaria…) **não** são linhas: são configuração dentro do produto.

## O sistema para muitos produtos

- **Heeca como marca-mãe**: o logotipo e o símbolo são sempre os mesmos, nas cores institucionais.
  Nenhum produto tem logotipo próprio nem muda a cor do arco.
- **O produto entra como segunda linha**, em caixa alta (Inter 600, tracking 0,18 em), na cor da sua família.
- **Cor é da família (mercado), não do produto** — 13 famílias, ΔE ≥ 22 entre quaisquer duas. Cada família tem
  dois tons: `color` (fundo do ícone, texto sobre claro) e `onDark` (texto sobre fundo escuro).
- **Sigla de 2 letras, única na plataforma**, gerada (1ª+2ª letra → 1ª+consoante → 3 letras) ou fixada no CSV.
- **Ícone de app do produto** = fundo na cor da família + pictograma branco + o H pequeno no canto. O ícone da
  plataforma é Heeca Black com o H e o arco. É o que distingue 20 ícones Heeca lado a lado num celular.
- `status`: `live`/`soon` geram o kit completo; `planned` gera só o ícone (para o mapa do ecossistema).

## O que tem em `dist/`

```
symbol/    heeca-symbol.svg / -on-dark.svg      H + arco (fundo claro / escuro)
           heeca-symbol-black.svg / -white.svg  uma cor só
           heeca-symbol-{produto}(-on-dark).svg idênticos (compatibilidade com os scripts dos projetos)
logo/      heeca-{produto}-principal(-on-dark).svg          centralizado, com slogan ("logo principal")
           heeca-{produto}-vertical(-on-dark).svg           centralizado, sem slogan
           heeca-{produto}-horizontal(-on-dark).svg         cabeçalhos, e-mails
           heeca-{produto}-horizontal-slogan(-on-dark).svg  materiais
           heeca-{produto}-horizontal-black.svg / -white.svg
icon/      heeca-{produto}-app-icon.svg + -{512,192,180}.png
favicon/   heeca-{produto}.ico (16/32/48) · .svg · -{16,32,48}.png
social/    heeca-{produto}-og.png               1200 × 630
animated/  heeca-{produto}-intro(-on-dark).svg  SVG animado autônomo (CSS interno; roda em <img>)
```

## Regras

- **Cores.** Primary `#E31B23` (arco, barras dos E, CTA), Primary Hover `#B90F19`, Black `#15171A`
  (letras, símbolo), Graphite `#30343A` (superfícies), Text Secondary `#667085`, Border `#E5E7EB`,
  Warm `#F7F4EF`, branco. Em fundo escuro as letras ficam brancas; **o arco não muda de cor**.
- **Não redesenhar, distorcer, inclinar, aplicar filtros ou alterar as cores do logotipo** (regra do handoff).
- **Logotipo.** `HEECA` é curva, nunca texto: não substitua por fonte, não condense, não mude o tracking.
  Em texto corrido a grafia é **Heeca**.
- **Produtos.** Só a segunda linha muda (nome em caixa alta, cor da família). Em fundo escuro use o tom
  `onDark` (os SVGs `-on-dark` já vêm assim).
- **Slogan.** "Sistemas que fazem o seu negócio evoluir." — Inter 400, na largura exata do logotipo
  (alinhado pela haste do H). Só na versão principal e na horizontal com slogan. Nunca em cabeçalhos,
  sidebar, ícones ou favicons.
- **Monocromática.** Tudo em uma cor (`-black` / `-white`): o arco se funde às hastes e continua legível
  pelas pontas que ultrapassam o H.
- **Tamanho mínimo.** Logotipo 90 px de largura (maiúsculas ≈ 16 px); símbolo 20 px; ícone de app 48 px.
- **Área de proteção.** A altura do H em todos os lados (os SVGs já trazem 20 u ≈ 1/5 da altura; em
  aplicações, reserve os 100 u completos).
- **Interface.** Inter 400/500/600/700/800. Base clara, bastante respiro, cards com bordas suaves e sombras
  discretas; dark mode com Heeca Black. Vermelho é acento — não deve dominar a tela. Não usar só cor para
  comunicar estado. Sem ® (marca não registrada).

## No código

`logo.tsx` é gerado pelo build e copiado para `src/components/brand/logo.tsx` de cada projeto.
Exporta `HEECA_FAMILIES`, `HEECA_PRODUCTS`, `HEECA_COLORS`, `Logo`, `HeecaWordmark`, `HeecaSymbol`,
`HeecaAppIcon` e `LogoIntro`. O logotipo é SVG puro (não depende de fonte); o nome do produto e o slogan
usam `var(--font-ui, var(--font-brand, Inter))` — o app define `--font-ui` com a Inter via next/font.
Letras em `currentColor` (seguem o tema); `onDark` força branco.

```tsx
<Logo product="ticket" size={20} />                      // sidebar, cabeçalho (size = altura das maiúsculas)
<Logo product="ticket" variant="vertical" slogan />      // materiais, telas grandes
<Logo product="ticket" variant="symbol" size={28} />     // avatar
<LogoIntro product="ticket" onDark size={40} />          // abertura animada (o arco varre e conecta)
<HeecaAppIcon product="beauty" size={48} />              // ícone do produto (mapa, seletor, avatar)
```

`LogoIntro`: hastes sobem · o arco varre da esquerda para a direita · E, E, C, A entram · nome · slogan
(≈ 2,5 s) e respeita `prefers-reduced-motion`.

## Construção (maiúsculas = 100 u)

- **H** (115 u): hastes de 28 u em x 17 e 104 — **sem barra preta**; a barra é o arco.
- **Arco** (148 × 38,3 u): pontas em (0; 81,5) e (148; 81,5); borda externa R 90,6 (ápice y 43,2),
  interna R 148,2 (ápice y 61,7). Ultrapassa as duas hastes em 17 u.
- **E** (85 u): quatro faixas de 20 u — barra vermelha (0–20), respiro (20–40), braço do meio 74 u (40–60),
  respiro (60–80), braço inferior 85 u (80–100); haste de 26 u ligando do meio à base.
- **C** (87 u): anel de cantos arredondados (externo 21 u, interno 11 u) com o lado direito aberto;
  braços de 20 u, haste de 25 u, terminais cortados na vertical.
- **A** (111 u): Λ sem travessão, ápice chanfrado de 24 u, pernas de 24 u, vértice interno em y 27,9.
- **Espaçamento** (entre tintas): H→E 31 · E→E 18 · E→C 19 · C→A 8. Logotipo completo: 573 × 100 u.
- **Símbolo**: só o H com o arco — caixa 148 × 100 u.

## Pranchas e proposta de site

```bash
pnpm catalog     # imprime o catálogo (famílias, motores, siglas) e avisos de validação
pnpm sheets      # dist/site/assinaturas-{escuro,claro}.png e icones.png — todos os produtos numa prancha
pnpm proposal    # dist/site/home-proposta.html — proposta navegável da home do portal com os ícones reais
```
