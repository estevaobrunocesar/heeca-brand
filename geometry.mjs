// Geometria da marca Heeca — única fonte da verdade (build.mjs e logo.tsx derivam daqui).
//
// Conceito "Tipografia Exclusiva" (handoff HEECA_BRAND_KIT_DEV_v1.0, set/2026): logotipo geométrico
// desenhado, sem fonte — "um logotipo minimalista e sofisticado, onde a tipografia ganha protagonismo.
// Linhas precisas, formas únicas e um detalhe na letra H que representa conexão".
// O **arco vermelho é a barra do H** (conexão, movimento, evolução) e as **barras superiores dos E**
// são vermelhas e destacadas. HE = Heloísa · CA = Catharina.
//
// Os SVGs entregues no zip são um rascunho; esta geometria foi medida pixel a pixel no painel
// aprovado (reference/conceito_tipografia_exclusiva.png) — proporções, pesos e espaçamento vêm de lá.
//
// Malha: altura das maiúsculas = 100 u (y 0 = topo, y 100 = base). Pesos: haste do H 28 u,
// haste do E/C 26/25 u, barras horizontais 20 u. Larguras: H 115, E 85, C 87, A 111.

const f2 = (n) => +n.toFixed(2);

export const COLORS = {
  red: "#E31B23", // Primary — arco, barras dos E, CTA
  redHover: "#B90F19", // Primary Hover
  black: "#15171A", // Black — letras, símbolo, base do dark mode
  graphite: "#30343A", // Graphite — superfícies
  textSecondary: "#667085",
  border: "#E5E7EB",
  warm: "#F7F4EF", // institucional / áreas suaves
  white: "#FFFFFF",
  ink: "#15171A",
};

// ---------------------------------------------------------------------------
// Símbolo: as duas hastes do H + o arco. Caixa 148 × 100 (o arco ultrapassa as hastes dos dois lados).
// ---------------------------------------------------------------------------
export const VIEW = { w: 148, h: 100 };
export const STEM = { w: 28, left: 17, right: 104 }; // hastes do H
const ARC = { y: 81.5, outerR: 90.6, innerR: 148.2, midR: 108.9 }; // arco: pontas em (0,81.5) e (148,81.5)

export const PATHS = {
  stemL: { x: STEM.left, y: 0, w: STEM.w, h: 100 },
  stemR: { x: STEM.right, y: 0, w: STEM.w, h: 100 },
  /** Crescente: borda externa (R 90,6 — ápice y 43,2) e interna (R 148,2 — ápice y 61,7), pontas afiadas. */
  arc: `M0 ${ARC.y}A${ARC.outerR} ${ARC.outerR} 0 0 1 ${VIEW.w} ${ARC.y}A${ARC.innerR} ${ARC.innerR} 0 0 0 0 ${ARC.y}Z`,
  /** Linha média do arco — só para animar o traçado com máscara. */
  arcCenter: `M0 ${ARC.y}A${ARC.midR} ${ARC.midR} 0 0 1 ${VIEW.w} ${ARC.y}`,
  arcCenterLength: f2(ARC.midR * 2 * Math.asin(VIEW.w / 2 / ARC.midR)),
};

const rect = (r, fill, cls = "") => `<rect${cls}${cls ? "" : ""} x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${fill}"/>`;

/**
 * Conteúdo do símbolo (sem <svg>). h = cor das hastes (preto / branco em fundo escuro / currentColor);
 * accent = cor do arco (vermelho institucional; igual a h nas versões monocromáticas).
 * cls = prefixo de classe para animar (p1 hastes, p2 arco).
 */
export function symbolInner({ h, accent }, cls = "") {
  const c = (n) => (cls ? ` class="${cls}${n}"` : "");
  return (
    `<rect${c(1)} x="${PATHS.stemL.x}" y="0" width="${STEM.w}" height="100" fill="${h}"/>` +
    `<rect${c(1)} x="${PATHS.stemR.x}" y="0" width="${STEM.w}" height="100" fill="${h}"/>` +
    `<path${c(2)} d="${PATHS.arc}" fill="${accent}"/>`
  );
}

// ---------------------------------------------------------------------------
// Logotipo HEECA — letras desenhadas (não é fonte). Caixa 573 × 100.
//   H: duas hastes; a barra é o arco vermelho.
//   E: barra superior vermelha destacada + corpo preto (braço do meio, haste, braço inferior).
//   C: anel de cantos arredondados com o lado direito aberto.
//   A: Λ sem travessão, ápice chanfrado.
// ---------------------------------------------------------------------------
export const WORDMARK = { w: 573, h: 100, x: { H: 0, E1: 163, E2: 266, C: 370, A: 462 } };

/** Corpo preto do E (braço do meio 74 u, haste 26 u, braço inferior 85 u) — sem a barra vermelha. */
const E_BODY = "M0 40H74V60H26V80H85V100H0Z";
/** Barra superior vermelha do E (destacada: 20 u de barra, 20 u de respiro). */
const E_BAR = { x: 0, y: 0, w: 85, h: 20 };
const C_PATH = "M87 0H21A21 21 0 0 0 0 21V79A21 21 0 0 0 21 100H84V80H36A11 11 0 0 1 25 69V31A11 11 0 0 1 36 20H87Z";
const A_PATH = "M0 100L43.5 0H67.5L111 100H87L55.5 27.9L24 100Z";

/**
 * Logotipo completo (sem <svg>), a partir de (0,0) com maiúsculas de 100 u.
 * ink = cor das letras; accent = cor do arco e das barras dos E.
 * cls = prefixo de classe para animar (l0 H, l1/l2 E, l3 C, l4 A, p2 arco).
 */
export function wordmarkInner({ ink, accent }, cls = "") {
  const c = (n) => (cls ? ` class="${cls}${n}"` : "");
  const X = WORDMARK.x;
  // O transform vai num <g> externo, sem classe: a animação termina em `transform: none` e
  // sobrescreveria o atributo se ele estivesse no mesmo elemento.
  const e = (x, i) =>
    `<g transform="translate(${x} 0)"><g${c(i)}><rect x="${E_BAR.x}" y="${E_BAR.y}" width="${E_BAR.w}" height="${E_BAR.h}" fill="${accent}"/><path d="${E_BODY}" fill="${ink}"/></g></g>`;
  return [
    `<rect${c(0)} x="${X.H + STEM.left}" y="0" width="${STEM.w}" height="100" fill="${ink}"/>`,
    `<rect${c(0)} x="${X.H + STEM.right}" y="0" width="${STEM.w}" height="100" fill="${ink}"/>`,
    `<path${cls ? ` class="${cls}arc"` : ""} d="${PATHS.arc}" fill="${accent}"/>`,
    e(X.E1, 1),
    e(X.E2, 2),
    `<g transform="translate(${X.C} 0)"><path${c(3)} d="${C_PATH}" fill="${ink}"/></g>`,
    `<g transform="translate(${X.A} 0)"><path${c(4)} d="${A_PATH}" fill="${ink}"/></g>`,
  ].join("");
}

/** Peças do logotipo para o React (mesma geometria, sem strings SVG). */
export const WORDMARK_PARTS = {
  stems: [{ x: WORDMARK.x.H + STEM.left, w: STEM.w }, { x: WORDMARK.x.H + STEM.right, w: STEM.w }],
  arc: PATHS.arc,
  arcCenter: PATHS.arcCenter,
  arcCenterLength: PATHS.arcCenterLength,
  eBar: E_BAR,
  eBody: E_BODY,
  eX: [WORDMARK.x.E1, WORDMARK.x.E2],
  c: { x: WORDMARK.x.C, d: C_PATH },
  a: { x: WORDMARK.x.A, d: A_PATH },
};
