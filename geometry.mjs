// Geometria do símbolo HeeCa — única fonte da verdade (build.mjs e logo.tsx derivam daqui).
//
// Conceito (escolhido pela família, set/2026, ajustado para ler "HC" e não "IC"): as DUAS hastes
// do H em prata; o swoosh vermelho é a barra do H — sai de dentro da haste esquerda, sobe, passa
// por cima da direita e vira o braço superior do C; o C vermelho nasce atrás da haste direita.
// Leitura: prata = H (Heloísa), vermelho = o gesto que forma o C (Catharina).
//
// Malha 126 × 100 u. Hastes x 10→27 e 62→79, y 6→94. C: centro (94,52), raio central 30, traço 17
// (o dorso fica quase todo atrás da haste direita). Swoosh: cúbica de (14,66) até o ponto −70° do C,
// tangente à circunferência; largura 7 → 17 u.

export const VIEW = { w: 126, h: 100 };
export const COLORS = {
  silver: "#d4d6db", // "prata" em superfície escura
  graphite: "#1f1f23", // equivalente da prata em superfície clara
  ink: "#0a0a0a",
  white: "#ffffff",
  red: "#e50914",
};

const C = { cx: 94, cy: 52, R: 30, w: 17 };
const rad = (d) => (d * Math.PI) / 180;
const f2 = (n) => +n.toFixed(2);
const pt = (deg) => [f2(C.cx + C.R * Math.cos(rad(deg))), f2(C.cy + C.R * Math.sin(rad(deg)))];
const arc = (a0, a1, viaLeft = false) => {
  const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
  return `M${x0} ${y0}A${C.R} ${C.R} 0 ${viaLeft ? 1 : 0} ${viaLeft ? 0 : 1} ${x1} ${y1}`;
};

// Swoosh: polígono afunilado ao longo de uma Bézier cúbica
const END = pt(-70);
const T = [Math.sin(rad(70)), Math.cos(rad(70))]; // tangente da circunferência em −70°
const P = [[14, 66], [40, 60], [END[0] - 26 * T[0], END[1] - 26 * T[1]], END];
function swooshPath(w0 = 7, w1 = C.w, n = 48) {
  const B = (t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); };
  const D = (t) => { const u = 1 - t; return [0, 1].map((k) => 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k])); };
  const L = [], R = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, [x, y] = B(t), [dx, dy] = D(t), l = Math.hypot(dx, dy);
    const nx = -dy / l, ny = dx / l, w = (w0 + (w1 - w0) * Math.pow(t, 0.75)) / 2;
    L.push([x + nx * w, y + ny * w]); R.push([x - nx * w, y - ny * w]);
  }
  const s = (p) => p.map(([x, y]) => `${f2(x)} ${f2(y)}`);
  return `M${s(L).join("L")}L${s(R.reverse()).join("L")}Z`;
}
/** Linha central do swoosh (para animar o traçado com máscara). */
export const SWOOSH_CENTER = `M${P[0][0]} ${P[0][1]}C${f2(P[1][0])} ${f2(P[1][1])} ${f2(P[2][0])} ${f2(P[2][1])} ${f2(P[3][0])} ${f2(P[3][1])}`;

export const PATHS = {
  stem: { x: 10, y: 6, w: 17, h: 88, rx: 1.5 },
  stemR: { x: 62, y: 6, w: 17, h: 88, rx: 1.5 },
  cBase: arc(-70, 48, true), // C (cor do produto), de −70° a 48° pela esquerda — dorso atrás da haste
  topArm: arc(-70, -48), // continuação do swoosh até a ponta superior
  swoosh: swooshPath(),
  strokeWidth: C.w,
};

/**
 * Conteúdo do símbolo (sem <svg>). h = cor das partes do H (prata/grafite/currentColor);
 * accent = cor do produto; knock = cor do fundo para abrir respiro entre as partes (versão mono).
 */
export function symbolInner({ h, accent, knock = null }) {
  const stroke = (d, color, w = C.w) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const rect = (r, color, grow = 0) => `<rect x="${r.x - grow}" y="${r.y - grow}" width="${r.w + grow * 2}" height="${r.h + grow * 2}" rx="${r.rx}" fill="${color}"/>`;
  return [
    stroke(PATHS.cBase, accent),
    knock ? rect(PATHS.stem, knock, 2.5) + rect(PATHS.stemR, knock, 2.5) : "",
    rect(PATHS.stem, h),
    rect(PATHS.stemR, h),
    knock ? `<path d="${PATHS.swoosh}" fill="none" stroke="${knock}" stroke-width="5" stroke-linejoin="round"/>` : "",
    `<path d="${PATHS.swoosh}" fill="${accent}"/>`,
    stroke(PATHS.topArm, accent),
  ].join("");
}
