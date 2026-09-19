/**
 * Marca Heeca — componente compartilhado entre o portal e os produtos.
 * GERADO por brand/build.mjs a partir de brand/geometry.mjs — não edite; rode `pnpm build` em brand/.
 *
 * Símbolo: duas hastes (H) + swoosh que é a barra do H e vira o braço superior do C + C atrás da haste direita.
 * Cores: partes do H em `currentColor` por padrão (seguem o tema); `onDark` força a prata do kit;
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
  heeca: { name: "", color: "#e50914", fullName: "Heeca" },
  ticket: { name: "Ticket", color: "#0a6ee6", fullName: "Heeca Ticket" },
  dental: { name: "Dental", color: "#f06511", fullName: "Heeca Dental" },
  budget: { name: "Orçamento", color: "#0f8a5f", fullName: "Heeca Orçamento" },
  vendas: { name: "Vendas", color: "#6d28d9", fullName: "Heeca Vendas" },
  nail: { name: "Nail", color: "#c8306f", fullName: "Heeca Nail" },
  barbearia: { name: "Barbearia", color: "#a86618", fullName: "Heeca Barbearia" },
} as const;
export type HeecaProduct = keyof typeof HEECA_PRODUCTS;
export const SLOGAN = "Sistemas que fazem o seu negócio evoluir.";

const SILVER = "#d4d6db";
const VIEW = { w: 126, h: 100 };
const SW = 17;
const D = {
  cBase: "M104.26 23.81A30 30 0 1 0 114.07 74.29",
  topArm: "M104.26 23.81A30 30 0 0 1 114.07 29.71",
  swoosh: "M14.79 69.41L16.68 69.2L18.58 68.81L20.5 68.29L22.43 67.68L24.39 66.97L26.36 66.18L28.34 65.31L30.34 64.38L32.35 63.38L34.38 62.33L36.41 61.22L38.46 60.07L40.51 58.88L42.58 57.66L44.65 56.41L46.73 55.13L48.81 53.83L50.89 52.52L52.97 51.21L55.05 49.89L57.13 48.57L59.2 47.27L61.27 45.97L63.32 44.7L65.37 43.44L67.4 42.22L69.42 41.04L71.41 39.89L73.39 38.79L75.34 37.74L77.27 36.74L79.16 35.81L81.02 34.94L82.83 34.14L84.61 33.42L86.33 32.79L88 32.23L89.62 31.76L91.16 31.38L92.63 31.1L94.03 30.9L95.34 30.8L96.55 30.78L97.68 30.84L98.72 30.98L99.67 31.19L100.54 31.46L101.35 31.8L107.17 15.82L104.88 15.19L102.59 14.76L100.29 14.53L98.01 14.48L95.76 14.59L93.53 14.85L91.33 15.25L89.16 15.76L87.01 16.39L84.88 17.12L82.77 17.93L80.68 18.83L78.6 19.8L76.52 20.85L74.46 21.95L72.4 23.12L70.35 24.34L68.3 25.6L66.25 26.91L64.22 28.26L62.18 29.64L60.15 31.05L58.13 32.49L56.11 33.94L54.1 35.41L52.1 36.89L50.11 38.38L48.13 39.86L46.15 41.34L44.2 42.81L42.25 44.27L40.33 45.71L38.42 47.12L36.53 48.51L34.66 49.86L32.81 51.18L30.99 52.45L29.2 53.68L27.43 54.85L25.7 55.97L23.99 57.03L22.33 58.02L20.7 58.94L19.11 59.8L17.56 60.59L16.06 61.3L14.61 61.95L13.21 62.59Z",
  swooshCenter: "M14 66C40 60 79.83 14.92 104.26 23.81",
};

type SymbolProps = { h?: string; accent: string; size?: number; title?: string; className?: string; style?: CSSProperties };

/** Símbolo em malha 126 × 100 (sem área de respiro). `size` = altura em px. */
export function HeecaSymbol({ h = "currentColor", accent, size = 32, title, className, style }: SymbolProps) {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} height={size} width={(size * VIEW.w) / VIEW.h} className={className} style={style} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d={D.cBase} fill="none" stroke={accent} strokeWidth={SW} strokeLinecap="round" />
      <rect x={10} y={6} width={17} height={88} rx={1.5} fill={h} />
      <rect x={62} y={6} width={17} height={88} rx={1.5} fill={h} />
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
  const css = `
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
  `;
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: size * 0.1, ...style }} aria-label={p.fullName} role="img">
      <style>{css}</style>
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} height={size} width={(size * VIEW.w) / VIEW.h} aria-hidden="true">
        <defs><mask id="hi-sw"><path className="hi-mask" d={D.swooshCenter} fill="none" stroke="#fff" strokeWidth={24} strokeLinecap="round" /></mask></defs>
        <path className="hi-c" d={D.cBase} fill="none" stroke={p.color} strokeWidth={SW} strokeLinecap="round" />
        <rect className="hi-stem" x={10} y={6} width={17} height={88} rx={1.5} fill={h} />
        <rect className="hi-rstem" x={62} y={6} width={17} height={88} rx={1.5} fill={h} />
        <g mask="url(#hi-sw)"><path d={D.swoosh} fill={p.color} /></g>
        <path className="hi-arm" d={D.topArm} fill="none" stroke={p.color} strokeWidth={SW} strokeLinecap="round" />
      </svg>
      <span style={{ display: "grid", gap: fontSize * 0.12 }}>
        <span style={{ fontFamily: BRAND_FONT, fontWeight: 700, fontSize, letterSpacing: "-0.03em", lineHeight: 1, whiteSpace: "nowrap" }}>
          {letters.map(([ch, color], i) => <span key={i} className="hi-l" style={{ display: "inline-block", color, animationDelay: `${2.7 + i * 0.1}s` }}>{ch}</span>)}
          {p.name ? <span className="hi-l" style={{ display: "inline-block", fontWeight: 500, color: p.color, animationDelay: "3.2s" }}>&nbsp;{p.name}</span> : null}
        </span>
        {slogan ? <span className="hi-slogan" style={{ fontFamily: BRAND_FONT, fontWeight: 300, fontSize: fontSize * 0.29, letterSpacing: "0.06em", lineHeight: 1.3, color: h }}>{SLOGAN}</span> : null}
      </span>
    </span>
  );
}
