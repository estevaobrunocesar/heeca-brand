// Kit de marca Heeca — gerador único de todos os arquivos.
//
//   pnpm install && pnpm build        (ou: node build.mjs)
//
// Geometria do logotipo e do símbolo em geometry.mjs; composições, ícones e o componente React aqui.
// Tudo em dist/ é saída: logotipo (horizontal/vertical, com e sem slogan, monocromáticas), símbolo,
// ícones de app, favicons (PNG + .ico), Open Graph, SVG animado e logo.tsx.
// Nunca edite dist/ nem logo.tsx à mão.
//
// Produto novo = uma linha em products.csv (ver products.mjs: família → cor, sigla gerada, status).

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";
import { VIEW, COLORS, STEM, PATHS, WORDMARK, WORDMARK_PARTS, symbolInner, wordmarkInner } from "./geometry.mjs";
import { PRODUCTS, FAMILIES, WARNINGS } from "./products.mjs";
import { pictogram, pictogramGroup } from "./pictograms.mjs";
if (WARNINGS.length) { console.warn("products.csv:"); WARNINGS.forEach((w) => console.warn("  - " + w)); }

const OUT = "dist";
const { black: BLACK, red: RED, white: WHITE, warm: WARM, textSecondary: TEXT2 } = COLORS;
export const SLOGAN = "Sistemas que fazem o seu negócio evoluir.";

export { PRODUCTS, FAMILIES };

const f2 = (n) => +n.toFixed(2);
const svgDoc = (w, h, inner, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${f2(w)}" height="${f2(h)}" viewBox="0 0 ${f2(w)} ${f2(h)}"${extra}>${inner}</svg>\n`;

// ---------------------------------------------------------------------------
// Tipografia de apoio — Inter (handoff: "Interface: Inter"). O LOGOTIPO não usa fonte: é desenho
// (geometry.mjs). Inter entra só no nome do produto (600) e no slogan (400), convertidos em curvas.
// ---------------------------------------------------------------------------
const inter = { 400: opentype.loadSync("fonts/Inter-400.ttf"), 600: opentype.loadSync("fonts/Inter-600.ttf") };
const CAP = inter[400].tables.os2.sCapHeight / inter[400].unitsPerEm; // ≈ 0,727
const NAME_OPT = { letterSpacing: 0.18, kerning: true };
const SLOGAN_OPT = { letterSpacing: 0, kerning: true };
const textWidth = (font, str, fs, opt) => font.getAdvanceWidth(str, fs, opt) - (opt.letterSpacing || 0) * fs;
const textPath = (font, str, x, y, fs, fill, opt, cls = "") =>
  `<path${cls ? ` class="${cls}"` : ""} d="${font.getPath(str, x, y, fs, opt).toPathData(2)}" fill="${fill}"/>`;

// ---------------------------------------------------------------------------
// Composições — logotipo 573 × 100 (maiúsculas = 100 u), símbolo 148 × 100.
//   Bloco: HEECA · nome do produto (Inter 600, caixa alta, cor da família) · slogan (Inter 400,
//   na largura exata do logotipo). Respiro de 20 u em volta (a regra de aplicação é a altura do H).
// ---------------------------------------------------------------------------
const PAD = 20;
const NAME_CAP = 24; // altura das maiúsculas do nome do produto
const GAP_NAME = 26; // respiro entre a base do logotipo e o topo do nome
const GAP_SLOGAN = 20;

// As linhas de apoio alinham pela HASTE do H (x 17) e terminam na ponta do A — como no painel.
const TEXT = { x: STEM.left, w: WORDMARK.w - STEM.left };
const sloganFs = TEXT.w / textWidth(inter[400], SLOGAN, 1, SLOGAN_OPT);
const sloganCap = sloganFs * CAP;

/** Altura total do bloco (logotipo + linhas opcionais), a partir do topo das maiúsculas. */
function blockHeight({ name, slogan }) {
  let h = WORDMARK.h;
  if (name) h += GAP_NAME + NAME_CAP;
  if (slogan) h += GAP_SLOGAN + sloganCap;
  return h;
}

/**
 * Logotipo completo. center = versão vertical (tudo centralizado); cls = prefixo para animação.
 * ink/accent: cor das letras / do arco e das barras dos E.
 */
function logoInner(product, { ink, accent, nameColor, sloganColor }, { slogan = false, center = false, cls = "" } = {}) {
  const name = product.name ? product.name.toUpperCase() : null;
  let out = wordmarkInner({ ink, accent }, cls), y = WORDMARK.h;
  if (name) {
    const fs = NAME_CAP / CAP, w = textWidth(inter[600], name, fs, NAME_OPT);
    y += GAP_NAME + NAME_CAP;
    out += textPath(inter[600], name, center ? TEXT.x + (TEXT.w - w) / 2 : TEXT.x, y, fs, nameColor, NAME_OPT, cls && `${cls}n`);
  }
  if (slogan) {
    y += GAP_SLOGAN + sloganCap;
    out += textPath(inter[400], SLOGAN, TEXT.x, y, sloganFs, sloganColor, SLOGAN_OPT, cls && `${cls}s`);
  }
  return out;
}

/** Arquivo do logotipo (horizontal = alinhado à esquerda; vertical = centralizado). */
function logoFile(product, colors, opts = {}) {
  const h = blockHeight({ name: product.name, slogan: opts.slogan });
  const inner = `<g transform="translate(${PAD} ${PAD})">${logoInner(product, colors, opts)}</g>`;
  return { svg: svgDoc(WORDMARK.w + PAD * 2, h + PAD * 2, inner), w: WORDMARK.w + PAD * 2, h: h + PAD * 2 };
}

/** Símbolo isolado (H + arco). */
const symbolFile = (o, pad = PAD) =>
  svgDoc(VIEW.w + pad * 2, VIEW.h + pad * 2, `<g transform="translate(${pad} ${pad})">${symbolInner(o)}</g>`);

// ---------------------------------------------------------------------------
// Ícones
// ---------------------------------------------------------------------------
/** Ícone da plataforma: fundo Heeca Black, hastes brancas e arco vermelho (como no painel). */
function platformIconSvg({ rounded = false, bg = BLACK } = {}) {
  const rx = rounded ? ' rx="22.5"' : "";
  const s = 0.6, ox = (100 - VIEW.w * s) / 2, oy = (100 - VIEW.h * s) / 2;
  return svgDoc(100, 100, `<rect width="100" height="100"${rx} fill="${bg}"/><g transform="translate(${f2(ox)} ${f2(oy)}) scale(${s})">${symbolInner({ h: WHITE, accent: RED })}</g>`);
}
/** Mistura hex com branco/preto (t de 0 a 1). */
function mix(hex, target, t) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const o = target === "white" ? [255, 255, 255] : [0, 0, 0];
  return "#" + c.map((v, i) => Math.round(v + (o[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
/**
 * Ícone de produto: fundo na cor da FAMÍLIA, pictograma (ou sigla) branco e o símbolo H pequeno no
 * canto — o produto se distingue pelo pictograma, a família pela cor, a Heeca pelo H (marca-mãe).
 */
function productIconSvg(p, { rounded = false } = {}) {
  const rx = rounded ? ' rx="22.5"' : "";
  const gid = `g-${p.key}`;
  const defs = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${mix(p.color, "white", 0.14)}"/><stop offset="1" stop-color="${mix(p.color, "black", 0.18)}"/></linearGradient><linearGradient id="${gid}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
  const bg = `<rect width="100" height="100"${rx} fill="url(#${gid})"/><rect width="100" height="100"${rx} fill="url(#${gid}-s)"/>`;
  let mark;
  if (p.icon) {
    mark = pictogramGroup(p.icon, { x: 21, y: 15, box: 56, color: WHITE, stroke: 1.9 });
  } else {
    const fs = p.sigla.length > 2 ? 40 : 50;
    const w = inter[600].getAdvanceWidth(p.sigla, fs, { kerning: true });
    mark = textPath(inter[600], p.sigla, (100 - w) / 2, 64, fs, WHITE, { kerning: true });
  }
  const mini = `<g transform="translate(66 74) scale(0.2)" opacity="0.95">${symbolInner({ h: WHITE, accent: WHITE })}</g>`;
  return svgDoc(100, 100, defs + bg + mark + mini);
}
const appIconSvg = (p, opts) => (p.name ? productIconSvg(p, opts) : platformIconSvg(opts));

/** Open Graph 1200 × 630: fundo Heeca Black, logotipo com slogan centralizado. */
function ogSvg(product) {
  const { svg, w, h } = logoFile(pd(product), onDark(product), { slogan: true, center: true });
  const targetW = 760, scale = targetW / w;
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return svgDoc(1200, 630, `<rect width="1200" height="630" fill="${BLACK}"/><g transform="translate(${(1200 - targetW) / 2} ${(630 - h * scale) / 2}) scale(${f2(scale)})">${inner}</g>`);
}

// ---------------------------------------------------------------------------
// Animação — hastes sobem · o arco varre da esquerda para a direita (o "detalhe que conecta")
// · E, E, C, A entram · nome do produto · slogan.
// ---------------------------------------------------------------------------
const ANIM_CSS = (p) => `
  .${p}0{opacity:0;transform-box:fill-box;transform-origin:50% 100%;animation:${p}up .5s cubic-bezier(.2,.8,.2,1) .1s forwards}
  .${p}arc{clip-path:inset(0 100% 0 0);animation:${p}sweep .7s cubic-bezier(.4,0,.2,1) .55s forwards}
  .${p}1,.${p}2,.${p}3,.${p}4,.${p}n,.${p}s{opacity:0;animation:${p}rise .4s ease-out forwards}
  .${p}1{animation-delay:1.15s}.${p}2{animation-delay:1.27s}.${p}3{animation-delay:1.39s}.${p}4{animation-delay:1.51s}
  .${p}n{animation-delay:1.8s}.${p}s{animation-delay:2s;animation-duration:.6s}
  @keyframes ${p}up{from{opacity:0;transform:scaleY(.2)}to{opacity:1;transform:none}}
  @keyframes ${p}sweep{to{clip-path:inset(0 0 0 0)}}
  @keyframes ${p}rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){[class^="${p}"]{animation:none!important;opacity:1!important;transform:none!important;clip-path:none!important}}
`.replace(/\s+/g, " ");
function animatedSvg(product, colors) {
  const { svg } = logoFile(product, colors, { slogan: true, cls: "a" });
  return svg.replace("><g transform", `><style>${ANIM_CSS("a")}</style><g transform`);
}

// ---------------------------------------------------------------------------
// Componente React gerado (mesma geometria)
// ---------------------------------------------------------------------------
function logoTsx() {
  const products = PRODUCTS.map((p) => `  ${JSON.stringify(p.key)}: { name: ${JSON.stringify(p.name)}, color: ${JSON.stringify(p.color)}, fullName: ${JSON.stringify(p.name ? `Heeca ${p.name}` : "Heeca")}, colorOnDark: ${JSON.stringify(p.colorOnDark)}, family: ${JSON.stringify(p.family)}, engine: ${JSON.stringify(p.engine)}, sigla: ${JSON.stringify(p.sigla)} },`).join("\n");
  const pictos = PRODUCTS.filter((p) => p.icon).map((p) => `  ${JSON.stringify(p.key)}: ${JSON.stringify(pictogram(p.icon))},`).join("\n");
  const families = Object.entries(FAMILIES).map(([k, f]) => `  ${k}: { label: ${JSON.stringify(f.label)}, color: ${JSON.stringify(f.color)}, onDark: ${JSON.stringify(f.onDark)} },`).join("\n");
  const W = WORDMARK_PARTS;
  return `/**
 * Marca Heeca — componente compartilhado entre o portal e os produtos.
 * GERADO por brand/build.mjs a partir de brand/geometry.mjs — não edite; rode \`pnpm build\` em brand/.
 *
 * Conceito "Tipografia Exclusiva": o logotipo HEECA é desenho (curvas), nunca texto — o arco vermelho
 * é a barra do H e as barras superiores dos E são vermelhas. O símbolo é o H com o arco.
 * Cores: letras em \`currentColor\` por padrão (seguem o tema), \`onDark\` força branco; o arco é sempre
 * o vermelho institucional. Nome do produto e slogan usam Inter (var(--font-ui), com fallback).
 *
 *   <Logo product="ticket" size={26} />          logotipo + TICKET          (cabeçalho, sidebar)
 *   <Logo product="ticket" variant="vertical" /> tudo centralizado          (login) — slogan opcional
 *   <Logo product="ticket" variant="symbol" />   só o símbolo (H + arco)    (avatar, favicon inline)
 *   <LogoIntro product="ticket" />               abertura animada (o arco varre e conecta)
 */
import type { CSSProperties } from "react";

/** Pictogramas (miolo SVG 24 × 24, traço herdado). Fonte: Lucide (ISC) + desenhos próprios em brand/pictograms.mjs. */
export const HEECA_PICTOGRAMS: Partial<Record<string, string>> = {
${pictos}
};

/** Famílias (a cor é da família; os produtos herdam). Fonte: brand/products.mjs. */
export const HEECA_FAMILIES = {
${families}
} as const;
export type HeecaFamily = keyof typeof HEECA_FAMILIES;

/** Produtos (fonte: brand/products.csv). sigla é única na plataforma; color = cor da família. */
export const HEECA_PRODUCTS = {
${products}
} as const;
export type HeecaProduct = keyof typeof HEECA_PRODUCTS;
export const SLOGAN = ${JSON.stringify(SLOGAN)};

/** Tokens do handoff (color.brand.*). */
export const HEECA_COLORS = { red: ${JSON.stringify(RED)}, redHover: ${JSON.stringify(COLORS.redHover)}, black: ${JSON.stringify(BLACK)}, graphite: ${JSON.stringify(COLORS.graphite)}, textSecondary: ${JSON.stringify(TEXT2)}, border: ${JSON.stringify(COLORS.border)}, warm: ${JSON.stringify(WARM)} } as const;

const RED = HEECA_COLORS.red;
const SYMBOL = { w: ${VIEW.w}, h: ${VIEW.h} };
const WORD = { w: ${WORDMARK.w}, h: ${WORDMARK.h} };
const G = {
  stems: ${JSON.stringify(W.stems)},
  stemY: 0,
  arc: ${JSON.stringify(W.arc)},
  symbolStems: [{ x: ${STEM.left}, w: ${STEM.w} }, { x: ${STEM.right}, w: ${STEM.w} }],
  eBar: ${JSON.stringify(W.eBar)},
  eBody: ${JSON.stringify(W.eBody)},
  eX: ${JSON.stringify(W.eX)},
  c: ${JSON.stringify(W.c)},
  a: ${JSON.stringify(W.a)},
};

/** \`size\` é a altura de referência do sinal; as maiúsculas do logotipo têm 62 % dela. */
const CAP_RATIO = 0.62;

/** Fonte de apoio (nome do produto e slogan): Inter. O logotipo não usa fonte. */
const UI_FONT = "var(--font-ui, var(--font-brand, Inter)), Inter, system-ui, sans-serif";

type SymbolProps = { h?: string; accent?: string; size?: number; title?: string; className?: string; style?: CSSProperties; cls?: string };

/** Símbolo: o H com o arco. \`size\` = altura em px (caixa ${VIEW.w} × ${VIEW.h}). */
export function HeecaSymbol({ h = "currentColor", accent = RED, size = 32, title, className, style, cls }: SymbolProps) {
  return (
    <svg viewBox={\`0 0 \${SYMBOL.w} \${SYMBOL.h}\`} height={size} width={(size * SYMBOL.w) / SYMBOL.h} className={className} style={style} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {G.symbolStems.map((s, i) => <rect key={i} className={cls ? \`\${cls}0\` : undefined} x={s.x} y={0} width={s.w} height={100} fill={h} />)}
      <path className={cls ? \`\${cls}arc\` : undefined} d={G.arc} fill={accent} />
    </svg>
  );
}

/** Logotipo HEECA em curvas. \`height\` = altura das maiúsculas em px. */
export function HeecaWordmark({ ink = "currentColor", accent = RED, height = 16, className, style, cls }: { ink?: string; accent?: string; height?: number; className?: string; style?: CSSProperties; cls?: string }) {
  const k = (n: string) => (cls ? \`\${cls}\${n}\` : undefined);
  return (
    <svg viewBox={\`0 0 \${WORD.w} \${WORD.h}\`} height={height} width={(height * WORD.w) / WORD.h} className={className} style={{ display: "block", ...style }} aria-hidden="true">
      {G.stems.map((s, i) => <rect key={i} className={k("0")} x={s.x} y={0} width={s.w} height={100} fill={ink} />)}
      <path className={k("arc")} d={G.arc} fill={accent} />
      {/* o transform fica no <g> externo: a animação termina em transform:none e sobrescreveria o atributo */}
      {G.eX.map((x, i) => (
        <g key={i} transform={\`translate(\${x} 0)\`}>
          <g className={k(String(i + 1))}>
            <rect x={G.eBar.x} y={G.eBar.y} width={G.eBar.w} height={G.eBar.h} fill={accent} />
            <path d={G.eBody} fill={ink} />
          </g>
        </g>
      ))}
      <g transform={\`translate(\${G.c.x} 0)\`}><path className={k("3")} d={G.c.d} fill={ink} /></g>
      <g transform={\`translate(\${G.a.x} 0)\`}><path className={k("4")} d={G.a.d} fill={ink} /></g>
    </svg>
  );
}

export type LogoProps = {
  product?: HeecaProduct;
  variant?: "horizontal" | "vertical" | "symbol";
  /** Superfície sempre escura: letras em branco. */
  onDark?: boolean;
  /** Mostra o slogan sob o logotipo (só em tamanhos grandes: login, materiais). */
  slogan?: boolean;
  /** Altura de referência em px: no variant "symbol" é a altura do símbolo; nos demais, as
   * maiúsculas do logotipo têm 62 % dela (mesma escala visual do kit anterior). */
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export function Logo({ product = "heeca", variant = "horizontal", onDark = false, slogan = false, size = 32, className, style }: LogoProps) {
  const p = HEECA_PRODUCTS[product];
  const ink = onDark ? "#FFFFFF" : "currentColor";
  const productColor = onDark ? p.colorOnDark : p.color;
  if (variant === "symbol") return <HeecaSymbol h={ink} size={size} title={p.fullName} className={className} style={style} />;
  const center = variant === "vertical";
  const cap = size * CAP_RATIO;
  const nameStyle: CSSProperties = { fontFamily: UI_FONT, fontWeight: 600, fontSize: cap * 0.33, letterSpacing: "0.18em", lineHeight: 1, color: productColor, textTransform: "uppercase", whiteSpace: "nowrap", marginRight: "-0.18em" };
  const sloganStyle: CSSProperties = { fontFamily: UI_FONT, fontWeight: 400, fontSize: cap * 0.31, lineHeight: 1.35, color: onDark ? "#C9CBD1" : "var(--heeca-text-secondary, #667085)", whiteSpace: "nowrap" };
  return (
    <span className={className} style={{ display: "inline-grid", gap: cap * 0.26, justifyItems: center ? "center" : "start", textAlign: center ? "center" : "left", ...style }} aria-label={p.fullName} role="img">
      <HeecaWordmark ink={ink} height={cap} />
      {p.name ? <span style={nameStyle}>{p.name}</span> : null}
      {slogan ? <span style={sloganStyle}>{SLOGAN}</span> : null}
    </span>
  );
}

/**
 * Ícone de app/produto (o mesmo desenho de dist/icon): fundo na cor da família, pictograma branco e o
 * H pequeno no canto. A plataforma ("heeca") usa fundo Heeca Black com o H e o arco.
 */
export function HeecaAppIcon({ product, size = 48, radius = 22.5, className, style }: { product: HeecaProduct; size?: number; radius?: number; className?: string; style?: CSSProperties }) {
  const p = HEECA_PRODUCTS[product];
  const mark = (h: string, accent: string) => (
    <>
      {G.symbolStems.map((s, i) => <rect key={i} x={s.x} y={0} width={s.w} height={100} fill={h} />)}
      <path d={G.arc} fill={accent} />
    </>
  );
  if (!p.name) {
    const s = 0.6;
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} role="img" aria-label="Heeca">
        <rect width="100" height="100" rx={radius} fill={HEECA_COLORS.black} />
        <g transform={\`translate(\${((100 - SYMBOL.w * s) / 2).toFixed(2)} \${((100 - SYMBOL.h * s) / 2).toFixed(2)}) scale(\${s})\`}>{mark("#FFFFFF", RED)}</g>
      </svg>
    );
  }
  const picto = HEECA_PICTOGRAMS[product];
  const gid = \`hg-\${product}\`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} role="img" aria-label={p.fullName}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stopColor={p.color} stopOpacity={0.86} /><stop offset="1" stopColor={p.color} /></linearGradient>
        <linearGradient id={\`\${gid}-s\`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0.16} /><stop offset="0.5" stopColor="#fff" stopOpacity={0} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={radius} fill={p.color} />
      <rect width="100" height="100" rx={radius} fill={\`url(#\${gid})\`} />
      <rect width="100" height="100" rx={radius} fill={\`url(#\${gid}-s)\`} />
      {picto ? (
        <g transform="translate(21 15) scale(2.3333)" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: picto }} />
      ) : (
        <text x="50" y="64" textAnchor="middle" fontFamily={UI_FONT} fontWeight={600} fontSize={p.sigla.length > 2 ? 40 : 50} fill="#fff">{p.sigla}</text>
      )}
      <g transform="translate(66 74) scale(0.2)" opacity={0.95}>{mark("#fff", "#fff")}</g>
    </svg>
  );
}

/**
 * Abertura animada (~2,5 s): hastes sobem · o arco varre e conecta · E, E, C, A entram · nome · slogan.
 * Respeita prefers-reduced-motion (mostra o estado final). Use em splash/login; não em cabeçalhos.
 */
export function LogoIntro({ product = "heeca", onDark = true, size = 64, slogan = true, className, style }: Omit<LogoProps, "variant">) {
  const p = HEECA_PRODUCTS[product];
  const ink = onDark ? "#FFFFFF" : "currentColor";
  const productColor = onDark ? p.colorOnDark : p.color;
  const cap = size * CAP_RATIO;
  const css = \`${ANIM_CSS("hi-").replace(/`/g, "\\`")}\`;
  return (
    <span className={className} style={{ display: "inline-grid", gap: cap * 0.26, justifyItems: "start", ...style }} aria-label={p.fullName} role="img">
      <style>{css}</style>
      <HeecaWordmark ink={ink} height={cap} cls="hi-" />
      {p.name ? <span className="hi-n" style={{ fontFamily: UI_FONT, fontWeight: 600, fontSize: cap * 0.33, letterSpacing: "0.18em", lineHeight: 1, color: productColor, textTransform: "uppercase", whiteSpace: "nowrap" }}>{p.name}</span> : null}
      {slogan ? <span className="hi-s" style={{ fontFamily: UI_FONT, fontWeight: 400, fontSize: cap * 0.31, lineHeight: 1.35, color: onDark ? "#C9CBD1" : "var(--heeca-text-secondary, #667085)", whiteSpace: "nowrap" }}>{SLOGAN}</span> : null}
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

// O logotipo não muda de cor entre produtos (marca-mãe): só o nome do produto usa a cor da família.
const onDark = (p) => ({ ink: WHITE, accent: RED, nameColor: p?.colorOnDark ?? RED, sloganColor: "#C9CBD1" });
const onLight = (p) => ({ ink: BLACK, accent: RED, nameColor: p?.color ?? RED, sloganColor: TEXT2 });
const pd = (p) => ({ ...p, color: p.colorOnDark });
const mono = (c) => ({ ink: c, accent: c, nameColor: c, sloganColor: c });

write("symbol/heeca-symbol.svg", symbolFile({ h: BLACK, accent: RED }));
write("symbol/heeca-symbol-on-dark.svg", symbolFile({ h: WHITE, accent: RED }));
write("symbol/heeca-symbol-black.svg", symbolFile({ h: BLACK, accent: BLACK }));
write("symbol/heeca-symbol-white.svg", symbolFile({ h: WHITE, accent: WHITE }));

for (const p of PRODUCTS) {
  const k = p.file ?? p.key;
  const iconSvg = appIconSvg(p);
  write(`icon/heeca-${k}-app-icon.svg`, appIconSvg(p, { rounded: true }));
  write(`icon/heeca-${k}-app-icon-192.png`, await png(iconSvg, 192));
  if (p.status === "planned") continue; // planejados: só o ícone (para o mapa do ecossistema)
  // símbolo por produto: mesmo desenho (compatibilidade com os scripts de assets dos projetos)
  write(`symbol/heeca-symbol-${k}-on-dark.svg`, symbolFile({ h: WHITE, accent: RED }));
  write(`symbol/heeca-symbol-${k}.svg`, symbolFile({ h: BLACK, accent: RED }));
  write(`logo/heeca-${k}-principal-on-dark.svg`, logoFile(pd(p), onDark(p), { slogan: true, center: true }).svg);
  write(`logo/heeca-${k}-principal.svg`, logoFile(p, onLight(p), { slogan: true, center: true }).svg);
  write(`logo/heeca-${k}-vertical-on-dark.svg`, logoFile(pd(p), onDark(p), { center: true }).svg);
  write(`logo/heeca-${k}-vertical.svg`, logoFile(p, onLight(p), { center: true }).svg);
  write(`logo/heeca-${k}-horizontal-on-dark.svg`, logoFile(pd(p), onDark(p)).svg);
  write(`logo/heeca-${k}-horizontal.svg`, logoFile(p, onLight(p)).svg);
  write(`logo/heeca-${k}-horizontal-slogan-on-dark.svg`, logoFile(pd(p), onDark(p), { slogan: true }).svg);
  write(`logo/heeca-${k}-horizontal-slogan.svg`, logoFile(p, onLight(p), { slogan: true }).svg);
  write(`logo/heeca-${k}-horizontal-black.svg`, logoFile(p, mono(BLACK)).svg);
  write(`logo/heeca-${k}-horizontal-white.svg`, logoFile(p, mono(WHITE)).svg);
  for (const size of [512, 180]) write(`icon/heeca-${k}-app-icon-${size}.png`, await png(iconSvg, size));
  const favs = [];
  for (const size of [16, 32, 48]) { const buf = await png(iconSvg, size); write(`favicon/heeca-${k}-${size}.png`, buf); favs.push({ size, buf }); }
  write(`favicon/heeca-${k}.ico`, ico(favs));
  write(`favicon/heeca-${k}.svg`, appIconSvg(p, { rounded: true }));
  write(`social/heeca-${k}-og.png`, await sharp(Buffer.from(ogSvg(p)), { density: 96 }).png({ compressionLevel: 9 }).toBuffer());
  write(`animated/heeca-${k}-intro-on-dark.svg`, animatedSvg(pd(p), onDark(p)));
  write(`animated/heeca-${k}-intro.svg`, animatedSvg(p, onLight(p)));
}

writeFileSync("logo.tsx", logoTsx());
console.log("ok: brand/dist + logo.tsx");
