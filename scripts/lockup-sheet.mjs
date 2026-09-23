// Prancha das assinaturas horizontais de todos os produtos (fundo escuro), agrupadas por família.
//   node scripts/lockup-sheet.mjs <saida.png> [on-dark|light]
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";
import { readFileSync, existsSync } from "node:fs";
import { PRODUCTS, FAMILIES } from "../products.mjs";

const out = process.argv[2];
mkdirSync(dirname(out), { recursive: true });
const dark = (process.argv[3] ?? "on-dark") === "on-dark";
const BG = dark ? "#0a0a0a" : "#ffffff", FG = dark ? "#f2eeee" : "#1a1a1a", MUTED = dark ? "#8a8384" : "#7a7274";
const COLS = 3, CELL_W = 400, CELL_H = 118, PAD = 24, LOGO_W = 330;
const fam = {};
for (const p of PRODUCTS) if (p.status !== "planned") (fam[p.family] ??= []).push(p);

let y = PAD;
const comps = [], texts = [];
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
for (const [k, list] of Object.entries(fam)) {
  const f = FAMILIES[k];
  texts.push(`<rect x="${PAD}" y="${y}" width="6" height="16" rx="1" fill="${f.color}"/><text x="${PAD + 14}" y="${y + 13}" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${FG}">${esc(f.label)}</text><text x="${PAD + 14 + f.label.length * 7.4 + 10}" y="${y + 13}" font-family="Arial, sans-serif" font-size="11" fill="${MUTED}">${esc(f.color)}</text>`);
  y += 30;
  let i = 0;
  for (const p of list) {
    const file = `dist/logo/heeca-${p.key}-horizontal${dark ? "-on-dark" : ""}.svg`;
    if (!existsSync(file)) continue;
    const cx = PAD + (i % COLS) * CELL_W, cy = y + Math.floor(i / COLS) * CELL_H;
    const buf = await sharp(readFileSync(file), { density: 160 }).resize({ width: LOGO_W, fit: "inside" }).png().toBuffer();
    const m = await sharp(buf).metadata();
    comps.push({ input: buf, left: cx, top: cy + Math.round((CELL_H - 24 - m.height) / 2) });
    texts.push(`<text x="${cx + 12}" y="${cy + CELL_H - 10}" font-family="Arial, sans-serif" font-size="10" fill="${MUTED}">${esc(`${p.engine} · ${p.status === "live" ? "no ar" : "em breve"}${p.note.startsWith("TRANSIÇÃO") ? " · transição" : ""}`)}</text>`);
    i++;
  }
  y += Math.ceil(list.length / COLS) * CELL_H + 12;
}
const W = PAD * 2 + COLS * CELL_W, H = y + PAD;
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${texts.join("")}</svg>`);
await sharp({ create: { width: W, height: H, channels: 3, background: BG } }).composite([...comps, { input: overlay, left: 0, top: 0 }]).png().toFile(out);
console.log("ok", W, H, comps.length, "assinaturas");
