# Heeca — kit de marca

Identidade da plataforma Heeca (heeca.com.br) e dos produtos Ticket, Dental, Orçamento e Vendas.
Conceito escolhido pela família em setembro de 2026, ajustado para ler "HC" e não "IC": **as duas
hastes do H em prata; o swoosh vermelho é a barra do H e vira o braço superior do C; o C vermelho
nasce atrás da haste direita.** Prata = H (Heloísa); vermelho = o gesto que forma o C (Catharina).
O nome é **He·e·ca**: Heloísa e Catharina.

- Apresentação do kit com a animação: https://claude.ai/artifact/JaZ9fHz7NXCSDQgCtuYYW7
- Briefing para a equipe de design (render 3D, refino, motion): [BRIEF-DESIGN.md](BRIEF-DESIGN.md)

## Fonte da verdade

| Arquivo | Papel |
|---|---|
| `geometry.mjs` | **Geometria do símbolo** (haste, C, swoosh) — mude aqui, nunca nos arquivos gerados |
| `build.mjs` | Paleta, produtos, wordmark, slogan e todas as composições; gera `dist/` e `logo.tsx` |
| `logo.tsx` | **Gerado.** Componente React (`Logo`, `HeecaSymbol`, `LogoIntro`) — copiado para cada projeto |
| `tokens.css` | Cores como custom properties |
| `fonts/` | Montserrat 300/500/700 (OFL), só para converter texto em curvas no build |
| `scripts/proof-page.mjs` | Gera a página de apresentação a partir de `dist/` |

```bash
pnpm install
pnpm build          # regenera dist/ e logo.tsx
```

Produto novo = uma linha em `PRODUCTS` (`build.mjs`; `key` = chave de código, `name` = nome comercial, `file` = slug dos arquivos se diferir) + `pnpm build` + copiar `logo.tsx` para os projetos.

## O que tem em `dist/`

```
symbol/    heeca-symbol-{produto}-on-dark.svg   prata + cor (fundo escuro — a versão de referência)
           heeca-symbol-{produto}.svg           grafite + cor (fundo claro)
           heeca-symbol-black.svg / -white.svg  uma cor só, com linha de respiro entre as partes
logo/      heeca-{produto}-principal(-on-dark).svg          vertical com slogan ("logo principal")
           heeca-{produto}-vertical(-on-dark).svg           vertical sem slogan
           heeca-{produto}-horizontal(-on-dark).svg         cabeçalhos, e-mails
           heeca-{produto}-horizontal-slogan(-on-dark).svg  materiais
           heeca-{produto}-horizontal-black.svg / -white.svg
icon/      heeca-{produto}-app-icon.svg + -{512,192,180}.png   fundo #0a0a0a, símbolo prata + cor
favicon/   heeca-{produto}.ico (16/32/48) · .svg · -{16,32,48}.png
social/    heeca-{produto}-og.png               1200 × 630
animated/  heeca-{produto}-intro(-on-dark).svg  SVG animado autônomo (CSS interno; roda em <img>)
```

## Regras

- **Cores.** Prata `#d4d6db` só em fundo escuro; em fundo claro as partes do H viram grafite `#1f1f23`.
  Vermelho `#e50914`. Preto `#0a0a0a`. Branco `#ffffff`. (O `#DC2626` do painel original é
  visualmente equivalente; mantivemos o vermelho já aplicado nos sistemas.)
- **Produtos.** Só a cor do produto muda: swoosh, C, "ca" e o nome do produto.
  As hastes continuam prata/grafite.
- **Wordmark.** "Heeca" em Montserrat 700, tracking −3 %: "Hee" na cor do H, "ca" na cor do produto;
  nome do produto em Montserrat 500 na cor do produto. A grafia é sempre **Heeca** (nunca HeeCa).
- **Slogan.** "Sistemas que fazem o seu negócio evoluir." — Montserrat 300, tracking +6 %, duas linhas.
  Só na versão principal e na horizontal com slogan. Nunca em cabeçalhos, sidebar, ícones ou favicons.
- **Monocromática.** Em uma cor só, uma linha de respiro (5 u, na cor do fundo) separa swoosh, hastes
  e C — sem ela o símbolo vira mancha. Já está nos arquivos `-black` / `-white`.
- **Tamanho mínimo.** Símbolo 24 px; ícone de app 48 px; assinatura horizontal 120 px de largura.
  Em 16 px o símbolo é uma mancha reconhecível pela cor — por isso o favicon usa fundo escuro.
- **Área de respiro.** 12 u (≈ 10 % da altura do símbolo) em todos os lados; os SVGs já vêm com ela.
- **Não.** Redesenhar o swoosh, engrossar/afinar o traço, inclinar, gradiente ou brilho em UI
  (o cromado é só para o render 3D de materiais — ver BRIEF), colocar o slogan em tamanhos pequenos,
  usar ® (marca não registrada).

## No código

`logo.tsx` é gerado pelo build e copiado para `src/components/brand/logo.tsx` de cada projeto
(Ticket e Schedule acrescentam a constante `BRAND` no fim). O app define `--font-brand` com a
Montserrat via next/font, pesos **300/500/700**. Partes do H em `currentColor` (seguem o tema);
`onDark` força a prata.

```tsx
<Logo product="ticket" size={26} />                      // sidebar, cabeçalho
<Logo product="ticket" variant="vertical" slogan />      // materiais, telas grandes
<Logo product="ticket" variant="symbol" size={28} />     // avatar
<LogoIntro product="ticket" onDark size={44} />          // abertura animada (login, splash)
```

`LogoIntro` executa a sequência do painel — 1. H surge (duas hastes) · 2. C se forma (nasce da haste direita) · 3. conexão (swoosh = barra) · 4. nome revela —
em ≈ 4 s e respeita `prefers-reduced-motion`.

## Construção (malha 126 × 100 u)

- Hastes: x 10 → 27 e x 62 → 79 (17 u), y 6 → 94, cantos 1,5 u.
- C: centro (94, 52), raio central 30 u, traço 17 u, terminais redondos. Arco de −70° a 48° pela
  esquerda (o dorso fica atrás da haste direita); braço superior de −70° a −48° continua o swoosh.
- Swoosh: cúbica de (14, 66) — dentro da haste esquerda — → (40, 60) → tangente → ponto −70° do C;
  largura 7 → 17 u. É a barra do H.
- Wordmark: maiúsculas = 62 u (haste tem 88 u); baseline na base da haste (y 94).
