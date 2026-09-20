// Prancha de contato: todos os ícones de dist/icon agrupados por família.
//   node scripts/contact-sheet.mjs <saida.png>
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { PRODUCTS, FAMILIES } from "../products.mjs";

const out = process.argv[2];
mkdirSync(dirname(out), { recursive: true });
const S = 56, GAP = 12, PER = 16, W = 16 + PER * (S + GAP) + 4;
const fam = {};
for (const p of PRODUCTS) (fam[p.family] ??= []).push(p);

let y = 16;
const comps = [], texts = [];
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
for (const [k, list] of Object.entries(fam)) {
  const f = FAMILIES[k];
  texts.push(`<text x="16" y="${y + 14}" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#222">${esc(`${f.label} · ${f.color} · ${list.length}`)}</text>`);
  y += 24;
  let x = 16, col = 0;
  for (const p of list) {
    const svg = readFileSync(`dist/icon/heeca-${p.key}-app-icon.svg`);
    const buf = await sharp(svg, { density: 150 }).resize(S, S).png().toBuffer();
    comps.push({ input: buf, left: x, top: y });
    texts.push(`<text x="${x + S / 2}" y="${y + S + 13}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="${p.status === "live" ? 700 : 400}" fill="${p.status === "live" ? "#0a0a0a" : "#777"}">${esc(p.name || "Heeca")}</text>`);
    x += S + GAP; col++;
    if (col === PER) { col = 0; x = 16; y += S + 28; }
  }
  if (col) y += S + 28;
  y += 10;
}
const H = y + 8;
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${texts.join("")}</svg>`);
await sharp({ create: { width: W, height: H, channels: 3, background: "#f4f2f2" } })
  .composite([...comps, { input: overlay, left: 0, top: 0 }])
  .png()
  .toFile(out);
console.log("ok", W, H, comps.length, "ícones");
