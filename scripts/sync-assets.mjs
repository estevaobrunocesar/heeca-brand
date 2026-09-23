// Sincroniza os assets de marca dos projetos que não têm um script próprio de assets.
// Os projetos maiores (site, ticket, consulta, beauty, piercing) têm o seu scripts/brand-assets.mjs;
// este cobre os demais, para nenhum ficar com arte de um conceito antigo.
//
//   node scripts/sync-assets.mjs            # copia
//   node scripts/sync-assets.mjs --check    # só confere (sai 1 se algum estiver desatualizado)

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const KIT = resolve("dist");
const ROOT = resolve("..");
if (!existsSync(KIT)) { console.error("dist/ não existe — rode `pnpm build` primeiro"); process.exit(1); }

/** projeto → produto do kit + destinos (destino relativo ao projeto → arquivo em dist/). */
const PROJECTS = {
  heeca_vendas: {
    product: "store",
    files: {
      "public/brand/favicon.ico": "favicon/heeca-store.ico",
      "public/brand/favicon.svg": "favicon/heeca-store.svg",
      "public/brand/favicon-32.png": "favicon/heeca-store-32.png",
      "public/brand/apple-touch-icon.png": "icon/heeca-store-app-icon-180.png",
      "public/brand/icon-192.png": "icon/heeca-store-app-icon-192.png",
      "public/brand/icon-512.png": "icon/heeca-store-app-icon-512.png",
      "public/brand/og.png": "social/heeca-store-og.png",
      "public/brand/logo.svg": "logo/heeca-store-horizontal.svg",
    },
  },
  hecca_psico: { product: "mind", files: { "src/app/favicon.ico": "favicon/heeca-mind.ico" } },
  heeca_ink: { product: "ink", files: { "src/app/favicon.ico": "favicon/heeca-ink.ico" } },
  heeca_move: { product: "move", files: { "src/app/favicon.ico": "favicon/heeca-move.ico" } },
  heeca_beauty: { product: "beauty", files: { "src/app/favicon.ico": "favicon/heeca-beauty.ico" } },
};

const check = process.argv.includes("--check");
let stale = 0, copied = 0;
for (const [project, { files }] of Object.entries(PROJECTS)) {
  const base = join(ROOT, project);
  if (!existsSync(base)) { console.warn(`! ${project}: pasta não encontrada, pulando`); continue; }
  for (const [dest, src] of Object.entries(files)) {
    const from = join(KIT, src), to = join(base, dest);
    if (!existsSync(from)) { console.warn(`! ${project}: ${src} não existe no kit`); continue; }
    const same = existsSync(to) && statSync(to).size === statSync(from).size && readFileSync(to).equals(readFileSync(from));
    if (same) continue;
    if (check) { console.log(`desatualizado: ${project}/${dest}`); stale++; continue; }
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    copied++;
  }
}
if (check) { console.log(stale ? `${stale} arquivo(s) desatualizado(s)` : "ok: tudo em dia"); process.exit(stale ? 1 : 0); }
console.log(`ok: ${copied} arquivo(s) copiado(s) em ${Object.keys(PROJECTS).length} projetos`);
