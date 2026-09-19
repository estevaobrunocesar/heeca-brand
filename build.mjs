// Kit de marca HeeCa — gerador único de todos os arquivos.
//
//   pnpm install && pnpm build        (ou: node build.mjs)
//
// Geometria do símbolo em geometry.mjs; paleta e wordmark aqui. Tudo em dist/ é saída:
// símbolo, assinaturas (vertical "principal" com slogan, horizontal com/sem slogan) por produto,
// monocromáticas, ícones de app, favicons (PNG + .ico), Open Graph, SVG animado e o componente
// React (logo.tsx). Nunca edite dist/ nem logo.tsx à mão.
//
// Produto novo = uma linha em PRODUCTS.

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";
import { VIEW, COLORS, PATHS, SWOOSH_CENTER, symbolInner } from "./geometry.mjs";

const OUT = "dist";
const { silver: SILVER, graphite: GRAPHITE, ink: INK, white: WHITE } = COLORS;
export const SLOGAN = ["Sistemas que fazem", "o seu negócio evoluir."];

// Cor de cada produto. O nome vazio é a plataforma (heeca.com.br). `key` é o identificador de código
// (não muda); `file` (opcional) é o slug dos arquivos gerados quando o nome comercial difere da chave.
export const PRODUCTS = [
  { key: "heeca", name: "", color: COLORS.red },
  { key: "ticket", name: "Ticket", color: "#0a6ee6" },
  { key: "dental", name: "Dental", file: "dental", color: "#f06511" },
  { key: "invoice", name: "Invoice", color: "#0f8a5f" },
  { key: "store", name: "Store", color: "#6d28d9" },
  { key: "nail", name: "Nail", color: "#c8306f" },
  { key: "cut", name: "Cut", color: "#a86618" },
];

const svgDoc = (w, h, inner, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"${extra}>${inner}</svg>\n`;
const symbolSvg = (o) => symbolInner(o);

// ---------------------------------------------------------------------------
// Tipografia — Montserrat 700 ("Hee" + "ca"), 500 (nome do produto), 300 (slogan). Curvas.
// ---------------------------------------------------------------------------
const bold = opentype.loadSync("fonts/Montserrat-700.ttf");
const medium = opentype.loadSync("fonts/Montserrat-500.ttf");
const light = opentype.loadSync("fonts/Montserrat-300.ttf");
const CAP = bold.tables.os2.sCapHeight / bold.unitsPerEm; // ≈ 0,70
const OPT = { letterSpacing: -0.03, kerning: true };
const SLOGAN_OPT = { letterSpacing: 0.06, kerning: true };
const WORD_GAP = 0.26;

const unionBox = (a, b) => (a ? { x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1), x2: Math.max(a.x2, b.x2), y2: Math.max(a.y2, b.y2) } : b);
/** Desenha trechos [fonte, texto, cor, gapBefore(em), opções] em sequência a partir de (x, baseline y). */
function typeset(runs, x, y, fontSize) {
  const paths = [];
  let cursor = x, bbox = null;
  for (const [font, text, fill, gapBefore = 0, opt = OPT] of runs) {
    cursor += gapBefore * fontSize;
    const p = font.getPath(text, cursor, y, fontSize, opt);
    paths.push({ d: p.toPathData(3), fill });
    cursor += font.getAdvanceWidth(text, fontSize, opt);
    bbox = unionBox(bbox, p.getBoundingBox());
  }
  return { paths, width: cursor - x, bbox, svg: paths.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join("") };
}
const runsWidth = (runs, fs) => runs.reduce((w, [font, text, , gap = 0, opt = OPT]) => w + gap * fs + font.getAdvanceWidth(text, fs, opt), 0);

/** "Heeca": "Hee" na cor do H, "ca" na cor do produto; + nome do produto em 500 na cor do produto. */
const wordRuns = (product, h) => {
  const runs = [[bold, "Hee", h], [bold, "ca", product.color]];
  if (product.name) runs.push([medium, product.name, product.color, WORD_GAP]);
  return runs;
};
const sloganRuns = (h) => SLOGAN.map((line) => [[light, line, h, 0, SLOGAN_OPT]]);

// ---------------------------------------------------------------------------
// Composições — símbolo ocupa VIEW (126 × 100); altura das maiúsculas do wordmark = 62 u
// (a haste tem 88 u; o wordmark ligeiramente menor que a haste, como no painel).
// ---------------------------------------------------------------------------
const PAD = 12;
const CAPH = 62;

/** Símbolo isolado. */
function symbolFile(o, pad = PAD) {
  return svgDoc(VIEW.w + pad * 2, VIEW.h + pad * 2, `<g transform="translate(${pad} ${pad})">${symbolSvg(o)}</g>`);
}

/** Horizontal: símbolo à esquerda, wordmark alinhado pela base da haste (y = 94); slogan opcional em 2 linhas abaixo. */
function horizontalFile(product, o, { slogan = false } = {}) {
  const fs = CAPH / CAP;
  const x = VIEW.w + 10;
  const baseline = PATHS.stem.y + PATHS.stem.h - (slogan ? 22 : 0);
  const word = typeset(wordRuns(product, o.h), x, baseline, fs);
  let inner = symbolSvg(o) + word.svg, bottom = Math.max(baseline, word.bbox.y2), right = x + word.width;
  if (slogan) {
    const sfs = fs * 0.29;
    let y = baseline + sfs * 1.35;
    for (const runs of sloganRuns(o.h)) { const t = typeset(runs, x + 2, y, sfs); inner += t.svg; right = Math.max(right, x + 2 + t.width); bottom = Math.max(bottom, t.bbox.y2); y += sfs * 1.3; }
  }
  const w = right + PAD * 2, h = Math.max(VIEW.h, bottom + 2) + PAD * 2;
  return svgDoc(+w.toFixed(2), +h.toFixed(2), `<g transform="translate(${PAD} ${PAD})">${inner}</g>`);
}

/** Vertical ("logo principal"): símbolo centralizado, wordmark abaixo, slogan em 2 linhas. */
function verticalFile(product, o, { slogan = true } = {}) {
  const fs = (CAPH * 0.9) / CAP;
  const wordW = runsWidth(wordRuns(product, o.h), fs);
  const width = Math.max(VIEW.w, wordW) + PAD * 2;
  const cx = width / 2;
  let y = PAD + VIEW.h + 6 + fs * CAP; // baseline do wordmark
  let inner = `<g transform="translate(${cx - VIEW.w / 2} ${PAD})">${symbolSvg(o)}</g>`;
  const word = typeset(wordRuns(product, o.h), cx - wordW / 2, y, fs);
  inner += word.svg;
  let bottom = word.bbox.y2;
  if (slogan) {
    const sfs = fs * 0.27;
    y += sfs * 1.9;
    for (const runs of sloganRuns(o.h)) { const w = runsWidth(runs, sfs); const t = typeset(runs, cx - w / 2, y, sfs); inner += t.svg; bottom = t.bbox.y2; y += sfs * 1.3; }
  }
  return svgDoc(+width.toFixed(2), +(bottom + PAD).toFixed(2), inner);
}

/** Ícone de app: fundo quase-preto, símbolo prata + cor do produto a ~62 %. */
function appIconSvg(accent, { rounded = false, bg = INK } = {}) {
  const rx = rounded ? ' rx="22.5"' : "";
  const s = 0.62, ox = (100 - VIEW.w * s) / 2, oy = (100 - VIEW.h * s) / 2;
  return svgDoc(100, 100, `<rect width="100" height="100"${rx} fill="${bg}"/><g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s})">${symbolSvg({ h: SILVER, accent })}</g>`);
}

/** Open Graph 1200 × 630: fundo quase-preto, assinatura horizontal com slogan. */
function ogSvg(product) {
  const logo = horizontalFile(product, { h: SILVER, accent: product.color }, { slogan: true });
  const [, w, h] = logo.match(/width="([\d.]+)" height="([\d.]+)"/).map(Number);
  const targetW = 720, scale = targetW / w;
  const inner = logo.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return svgDoc(1200, 630, `<rect width="1200" height="630" fill="${INK}"/><g transform="translate(${(1200 - targetW) / 2} ${(630 - h * scale) / 2}) scale(${scale})">${inner}</g>`);
}

/**
 * SVG animado autônomo (CSS dentro do SVG; roda em <img>). Sequência do painel de conceito:
 * 1. H surge (duas hastes) · 2. C se forma (nasce atrás da haste direita) · 3. Conexão (swoosh = barra do H) · 4. Nome revela.
 */
function animatedSvg(product, o) {
  const fs = CAPH / CAP;
  const x = VIEW.w + 10, baseline = PATHS.stem.y + PATHS.stem.h - 22;
  const letters = [[bold, "H", o.h], [bold, "e", o.h], [bold, "e", o.h], [bold, "c", product.color], [bold, "a", product.color]];
  let cursor = x, word = "", right = x;
  letters.forEach(([font, t, fill], i) => {
    const p = font.getPath(t, cursor, baseline, fs, OPT);
    word += `<path class="l l${i}" d="${p.toPathData(3)}" fill="${fill}"/>`;
    cursor += font.getAdvanceWidth(t, fs, OPT);
  });
  right = cursor;
  if (product.name) { const t = typeset([[medium, product.name, product.color, WORD_GAP]], cursor, baseline, fs); word += `<g class="l l5">${t.svg}</g>`; right = cursor + t.width; }
  const sfs = fs * 0.29; let sy = baseline + sfs * 1.35, slogan = "", bottom = VIEW.h;
  for (const runs of sloganRuns(o.h)) { const t = typeset(runs, x + 2, sy, sfs); slogan += t.svg; right = Math.max(right, x + 2 + t.width); bottom = Math.max(bottom, t.bbox.y2 + 2); sy += sfs * 1.3; }
  const W = right + PAD * 2, H = bottom + PAD * 2;
  const rs = PATHS.stemR, s = PATHS.stem;
  const css = `
    .stem, .rstem { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); }
    .hc-c, .hc-arm { stroke-dasharray: 200; stroke-dashoffset: 200; }
    .mask-line { stroke-dasharray: 160; stroke-dashoffset: 160; }
    .l, .slogan { opacity: 0; }
    .stem  { animation: up .55s cubic-bezier(.2,.8,.2,1) .1s forwards; }
    .rstem { animation: up .55s cubic-bezier(.2,.8,.2,1) .25s forwards; }
    .hc-c { animation: draw .8s cubic-bezier(.4,0,.2,1) 1.0s forwards; }
    .mask-line { animation: draw .75s cubic-bezier(.4,0,.2,1) 1.8s forwards; }
    .hc-arm { animation: draw .35s ease-out 2.4s forwards; }
    .l0 { animation: rise .4s ease-out 2.7s forwards; } .l1 { animation: rise .4s ease-out 2.8s forwards; }
    .l2 { animation: rise .4s ease-out 2.9s forwards; } .l3 { animation: rise .4s ease-out 3.0s forwards; }
    .l4 { animation: rise .4s ease-out 3.1s forwards; } .l5 { animation: rise .4s ease-out 3.2s forwards; }
    .slogan { animation: fadein .6s ease-out 3.4s forwards; }
    @keyframes up { to { transform: scaleY(1); } }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    @keyframes fadein { to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } .stem, .rstem, .hc-c, .hc-arm, .l, .slogan { opacity: 1; transform: none; stroke-dashoffset: 0; } .mask-line { stroke-dashoffset: 0; } }
  `.replace(/\s+/g, " ");
  const inner = `<style>${css}</style>
  <defs><mask id="sw"><path class="mask-line" d="${SWOOSH_CENTER}" fill="none" stroke="#fff" stroke-width="24" stroke-linecap="round"/></mask></defs>
  <g transform="translate(${PAD} ${PAD})">
    <path class="hc-c" d="${PATHS.cBase}" fill="none" stroke="${product.color}" stroke-width="${PATHS.strokeWidth}" stroke-linecap="round"/>
    <rect class="stem" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.rx}" fill="${o.h}"/>
    <rect class="rstem" x="${rs.x}" y="${rs.y}" width="${rs.w}" height="${rs.h}" rx="${rs.rx}" fill="${o.h}"/>
    <g mask="url(#sw)"><path d="${PATHS.swoosh}" fill="${product.color}"/></g>
    <path class="hc-arm" d="${PATHS.topArm}" fill="none" stroke="${product.color}" stroke-width="${PATHS.strokeWidth}" stroke-linecap="round"/>
    ${word}<g class="slogan">${slogan}</g>
  </g>`;
  return svgDoc(+W.toFixed(2), +H.toFixed(2), inner);
}

// ---------------------------------------------------------------------------
// Componente React gerado (mesma geometria)
// ---------------------------------------------------------------------------
function logoTsx() {
  const s = PATHS.stem, rs = PATHS.stemR;
  const products = PRODUCTS.map((p) => `  ${p.key}: { name: ${JSON.stringify(p.name)}, color: ${JSON.stringify(p.color)}, fullName: ${JSON.stringify(p.name ? `Heeca ${p.name}` : "Heeca")} },`).join("\n");
  return `/**
 * Marca Heeca — componente compartilhado entre o portal e os produtos.
 * GERADO por brand/build.mjs a partir de brand/geometry.mjs — não edite; rode \`pnpm build\` em brand/.
 *
 * Símbolo: duas hastes (H) + swoosh que é a barra do H e vira o braço superior do C + C atrás da haste direita.
 * Cores: partes do H em \`currentColor\` por padrão (seguem o tema); \`onDark\` força a prata do kit;
 * a cor do produto é fixa. Wordmark "Heeca": "Hee" na cor do H, "ca" na cor do produto (texto,
 * Montserrat via --font-brand — o app define a variável com next/font, pesos 300/500/700).
 *
 *   <Logo product="ticket" />                    símbolo + "Heeca Ticket"   (cabeçalho, sidebar)
 *   <Logo product="ticket" variant="vertical" /> símbolo sobre o nome       (login) — slogan opcional
 *   <Logo product="ticket" variant="symbol" />   só o símbolo               (avatar, favicon inline)
 *   <LogoIntro product="ticket" />               animação de abertura (H → C → conexão → nome)
 */
import type { CSSProperties } from "react";

export const HEECA_PRODUCTS = {
${products}
} as const;
export type HeecaProduct = keyof typeof HEECA_PRODUCTS;
export const SLOGAN = ${JSON.stringify(SLOGAN.join(" "))};

const SILVER = ${JSON.stringify(SILVER)};
const VIEW = { w: ${VIEW.w}, h: ${VIEW.h} };
const SW = ${PATHS.strokeWidth};
const D = {
  cBase: ${JSON.stringify(PATHS.cBase)},
  topArm: ${JSON.stringify(PATHS.topArm)},
  swoosh: ${JSON.stringify(PATHS.swoosh)},
  swooshCenter: ${JSON.stringify(SWOOSH_CENTER)},
};

type SymbolProps = { h?: string; accent: string; size?: number; title?: string; className?: string; style?: CSSProperties };

/** Símbolo em malha ${VIEW.w} × ${VIEW.h} (sem área de respiro). \`size\` = altura em px. */
export function HeecaSymbol({ h = "currentColor", accent, size = 32, title, className, style }: SymbolProps) {
  return (
    <svg viewBox={\`0 0 \${VIEW.w} \${VIEW.h}\`} height={size} width={(size * VIEW.w) / VIEW.h} className={className} style={style} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={D.cBase} fill="none" stroke={accent} strokeWidth={SW} strokeLinecap="round" />
      <rect x={${s.x}} y={${s.y}} width={${s.w}} height={${s.h}} rx={${s.rx}} fill={h} />
      <rect x={${rs.x}} y={${rs.y}} width={${rs.w}} height={${rs.h}} rx={${rs.rx}} fill={h} />
      <path d={D.swoosh} fill={accent} />
      <path d={D.topArm} fill="none" stroke={accent} strokeWidth={SW} strokeLinecap="round" />
    </svg>
  );
}

export type LogoProps = {
  product?: HeecaProduct;
  variant?: "horizontal" | "vertical" | "symbol";
  /** Superfície sempre escura: partes do H na prata do kit. */
  onDark?: boolean;
  /** Mostra o slogan sob o wordmark (só em tamanhos grandes: login, materiais). */
  slogan?: boolean;
  /** Altura do símbolo em px. */
  size?: number;
  className?: string;
  style?: CSSProperties;
};

const BRAND_FONT = "var(--font-brand)";

export function Logo({ product = "heeca", variant = "horizontal", onDark = false, slogan = false, size = 32, className, style }: LogoProps) {
  const p = HEECA_PRODUCTS[product];
  const h = onDark ? SILVER : "currentColor";
  const fontSize = (size * 0.62) / 0.7; // maiúsculas = 62 % da altura do símbolo
  const wordmark: CSSProperties = { fontFamily: BRAND_FONT, fontWeight: 700, fontSize, letterSpacing: "-0.03em", lineHeight: 1, color: h, whiteSpace: "nowrap" };
  const sloganStyle: CSSProperties = { fontFamily: BRAND_FONT, fontWeight: 300, fontSize: fontSize * 0.29, letterSpacing: "0.06em", lineHeight: 1.3, color: h, opacity: 0.9 };
  const name = (
    <>
      Hee<span style={{ color: p.color }}>ca</span>
      {p.name ? <> <span style={{ fontWeight: 500, color: p.color }}>{p.name}</span></> : null}
    </>
  );
  if (variant === "symbol") return <HeecaSymbol h={h} accent={p.color} size={size} title={p.fullName} className={className} style={style} />;
  if (variant === "vertical") {
    return (
      <span className={className} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: size * 0.08, textAlign: "center", ...style }} aria-label={p.fullName} role="img">
        <HeecaSymbol h={h} accent={p.color} size={size} />
        <span style={{ ...wordmark, fontSize: fontSize * 0.9 }}>{name}</span>
        {slogan ? <span style={{ ...sloganStyle, fontSize: fontSize * 0.26, maxWidth: size * 2.4 }}>{SLOGAN}</span> : null}
      </span>
    );
  }
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: size * 0.1, ...style }} aria-label={p.fullName} role="img">
      <HeecaSymbol h={h} accent={p.color} size={size} />
      <span style={{ display: "grid", gap: fontSize * 0.12 }}>
        <span style={wordmark}>{name}</span>
        {slogan ? <span style={sloganStyle}>{SLOGAN}</span> : null}
      </span>
    </span>
  );
}

/**
 * Abertura animada (~3,5 s): 1. H surge · 2. C se forma · 3. conexão (swoosh) · 4. nome revela.
 * Respeita prefers-reduced-motion (mostra o estado final). Use em splash/login; não em cabeçalhos.
 */
export function LogoIntro({ product = "heeca", onDark = true, size = 96, slogan = true, className, style }: Omit<LogoProps, "variant">) {
  const p = HEECA_PRODUCTS[product];
  const h = onDark ? SILVER : "currentColor";
  const fontSize = (size * 0.62) / 0.7;
  const letters: [string, string][] = [["H", h], ["e", h], ["e", h], ["c", p.color], ["a", p.color]];
  const css = \`
    .hi-stem,.hi-rstem{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(0)}
    .hi-c,.hi-arm{stroke-dasharray:200;stroke-dashoffset:200}
    .hi-mask{stroke-dasharray:160;stroke-dashoffset:160}
    .hi-l,.hi-slogan{opacity:0}
    .hi-stem{animation:hi-up .55s cubic-bezier(.2,.8,.2,1) .1s forwards}
    .hi-rstem{animation:hi-up .55s cubic-bezier(.2,.8,.2,1) .25s forwards}
    .hi-c{animation:hi-draw .8s cubic-bezier(.4,0,.2,1) 1s forwards}
    .hi-mask{animation:hi-draw .75s cubic-bezier(.4,0,.2,1) 1.8s forwards}
    .hi-arm{animation:hi-draw .35s ease-out 2.4s forwards}
    .hi-l{animation:hi-rise .4s ease-out forwards}
    .hi-slogan{animation:hi-fade .6s ease-out 3.4s forwards}
    @keyframes hi-up{to{transform:scaleY(1)}}
    @keyframes hi-draw{to{stroke-dashoffset:0}}@keyframes hi-rise{from{opacity:0;transform:translateY(.06em)}to{opacity:1;transform:none}}@keyframes hi-fade{to{opacity:1}}
    @media (prefers-reduced-motion:reduce){.hi-stem,.hi-rstem,.hi-c,.hi-arm,.hi-mask,.hi-l,.hi-slogan{animation:none!important}.hi-stem,.hi-rstem,.hi-c,.hi-arm,.hi-l,.hi-slogan{opacity:1;transform:none;stroke-dashoffset:0}.hi-mask{stroke-dashoffset:0}}
  \`;
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: size * 0.1, ...style }} aria-label={p.fullName} role="img">
      <style>{css}</style>
      <svg viewBox={\`0 0 \${VIEW.w} \${VIEW.h}\`} height={size} width={(size * VIEW.w) / VIEW.h} aria-hidden="true">
        <defs><mask id="hi-sw"><path className="hi-mask" d={D.swooshCenter} fill="none" stroke="#fff" strokeWidth={24} strokeLinecap="round" /></mask></defs>
        <path className="hi-c" d={D.cBase} fill="none" stroke={p.color} strokeWidth={SW} strokeLinecap="round" />
        <rect className="hi-stem" x={${s.x}} y={${s.y}} width={${s.w}} height={${s.h}} rx={${s.rx}} fill={h} />
        <rect className="hi-rstem" x={${rs.x}} y={${rs.y}} width={${rs.w}} height={${rs.h}} rx={${rs.rx}} fill={h} />
        <g mask="url(#hi-sw)"><path d={D.swoosh} fill={p.color} /></g>
        <path className="hi-arm" d={D.topArm} fill="none" stroke={p.color} strokeWidth={SW} strokeLinecap="round" />
      </svg>
      <span style={{ display: "grid", gap: fontSize * 0.12 }}>
        <span style={{ fontFamily: BRAND_FONT, fontWeight: 700, fontSize, letterSpacing: "-0.03em", lineHeight: 1, whiteSpace: "nowrap" }}>
          {letters.map(([ch, color], i) => <span key={i} className="hi-l" style={{ display: "inline-block", color, animationDelay: \`\${2.7 + i * 0.1}s\` }}>{ch}</span>)}
          {p.name ? <span className="hi-l" style={{ display: "inline-block", fontWeight: 500, color: p.color, animationDelay: "3.2s" }}>&nbsp;{p.name}</span> : null}
        </span>
        {slogan ? <span className="hi-slogan" style={{ fontFamily: BRAND_FONT, fontWeight: 300, fontSize: fontSize * 0.29, letterSpacing: "0.06em", lineHeight: 1.3, color: h }}>{SLOGAN}</span> : null}
      </span>
    </span>
  );
}
`;
}

// ---------------------------------------------------------------------------
// Utilidades de saída
// ---------------------------------------------------------------------------
function write(rel, content) { const p = join(OUT, rel); mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, content); }
const png = (svg, size) => sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
function ico(pngs) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dir = []; let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) { const e = Buffer.alloc(16); e.writeUInt8(size >= 256 ? 0 : size, 0); e.writeUInt8(size >= 256 ? 0 : size, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12); offset += buf.length; dir.push(e); }
  return Buffer.concat([header, ...dir, ...pngs.map((p) => p.buf)]);
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const onDark = (p) => ({ h: SILVER, accent: p.color });
const onLight = (p) => ({ h: GRAPHITE, accent: p.color });
const monoBlack = { h: INK, accent: INK, knock: WHITE };
const monoWhite = { h: WHITE, accent: WHITE, knock: INK };

write("symbol/heeca-symbol-black.svg", symbolFile(monoBlack));
write("symbol/heeca-symbol-white.svg", symbolFile(monoWhite));

for (const p of PRODUCTS) {
  const k = p.file ?? p.key;
  write(`symbol/heeca-symbol-${k}-on-dark.svg`, symbolFile(onDark(p)));
  write(`symbol/heeca-symbol-${k}.svg`, symbolFile(onLight(p)));
  write(`logo/heeca-${k}-principal-on-dark.svg`, verticalFile(p, onDark(p)));
  write(`logo/heeca-${k}-principal.svg`, verticalFile(p, onLight(p)));
  write(`logo/heeca-${k}-vertical-on-dark.svg`, verticalFile(p, onDark(p), { slogan: false }));
  write(`logo/heeca-${k}-vertical.svg`, verticalFile(p, onLight(p), { slogan: false }));
  write(`logo/heeca-${k}-horizontal-on-dark.svg`, horizontalFile(p, onDark(p)));
  write(`logo/heeca-${k}-horizontal.svg`, horizontalFile(p, onLight(p)));
  write(`logo/heeca-${k}-horizontal-slogan-on-dark.svg`, horizontalFile(p, onDark(p), { slogan: true }));
  write(`logo/heeca-${k}-horizontal-slogan.svg`, horizontalFile(p, onLight(p), { slogan: true }));
  write(`logo/heeca-${k}-horizontal-black.svg`, horizontalFile({ ...p, color: INK }, monoBlack));
  write(`logo/heeca-${k}-horizontal-white.svg`, horizontalFile({ ...p, color: WHITE }, monoWhite));
  const iconSvg = appIconSvg(p.color);
  write(`icon/heeca-${k}-app-icon.svg`, appIconSvg(p.color, { rounded: true }));
  for (const size of [512, 192, 180]) write(`icon/heeca-${k}-app-icon-${size}.png`, await png(iconSvg, size));
  // Favicons: símbolo sobre fundo escuro (em 16 px o símbolo precisa do contraste do fundo)
  const favs = [];
  for (const size of [16, 32, 48]) { const buf = await png(iconSvg, size); write(`favicon/heeca-${k}-${size}.png`, buf); favs.push({ size, buf }); }
  write(`favicon/heeca-${k}.ico`, ico(favs));
  write(`favicon/heeca-${k}.svg`, appIconSvg(p.color, { rounded: true }));
  write(`social/heeca-${k}-og.png`, await sharp(Buffer.from(ogSvg(p)), { density: 96 }).png({ compressionLevel: 9 }).toBuffer());
  write(`animated/heeca-${k}-intro-on-dark.svg`, animatedSvg(p, onDark(p)));
  write(`animated/heeca-${k}-intro.svg`, animatedSvg(p, onLight(p)));
}

writeFileSync("logo.tsx", logoTsx());
console.log("ok: brand/dist + logo.tsx");
