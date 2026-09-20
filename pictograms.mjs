// Pictogramas dos produtos — desenhos de linha na malha 24 × 24 (traço 2, terminais e junções redondos).
// Fonte: Lucide (lucide-static, licença ISC) + desenhos próprios abaixo. Devolve o miolo do SVG (sem <svg>).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Desenhos próprios (mesma gramática do Lucide) para o que a biblioteca não tem. */
const CUSTOM = {
  // dente: coroa com duas raízes
  tooth: `<path d="M12 5.5c-1.6-1.2-3.2-1.9-4.7-1.9C4.5 3.6 3 5.7 3 8.3c0 2.2 1 3.7 1.6 5.6.7 2.3 1 6.6 2.8 6.6 1.9 0 2-4.6 4.6-4.6s2.7 4.6 4.6 4.6c1.8 0 2.1-4.3 2.8-6.6C20 12 21 10.5 21 8.3c0-2.6-1.5-4.7-4.3-4.7-1.5 0-3.1.7-4.7 1.9z"/>`,
};

/** Miolo do pictograma (elementos SVG em 24 × 24, sem atributos de cor — herda stroke do pai). */
export function pictogram(name) {
  if (!name) return "";
  if (CUSTOM[name]) return CUSTOM[name];
  const file = join(HERE, "node_modules/lucide-static/icons", `${name}.svg`);
  if (!existsSync(file)) throw new Error(`pictograma desconhecido: "${name}" (não é Lucide nem CUSTOM)`);
  const svg = readFileSync(file, "utf8");
  const inner = svg.replace(/<!--[\s\S]*?-->/g, "").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return inner.trim();
}

/**
 * Pictograma posicionado numa caixa: <g> com transform e estilo de traço.
 * box = lado da área (em unidades do SVG pai), x/y = canto superior esquerdo, stroke em unidades da malha 24.
 */
export function pictogramGroup(name, { x = 0, y = 0, box = 52, color = "#fff", stroke = 2.2 } = {}) {
  const inner = pictogram(name);
  if (!inner) return "";
  const s = box / 24;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
}
