// Catálogo de produtos do kit — lê products.csv (fonte da verdade) e devolve PRODUCTS com
// família, cor da família, sigla (gerada, única) e status. Valida nomes e chaves.
//
//   node products.mjs           → imprime a tabela e os avisos
//
// Regras:
//  - key: minúscula, única, [a-z0-9-]; é o slug (arquivos, URL, data-accent, product= no componente)
//  - name: uma palavra, ≤ 9 letras (o lockup "Heeca + nome" foi calibrado até aí); vazio = plataforma
//  - family: uma das FAMILIES; a COR vem da família, nunca do produto
//  - sigla: 2 letras (3 em último caso), única na plataforma; gerada = 1ª + 2ª letra, em colisão
//    1ª + próxima consoante, depois 1ª + 3ª letra…, depois as 3 primeiras (pode ser fixada no CSV)
//  - status: live | soon | planned — o build gera o kit completo para live/soon e só ícone para planned

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Famílias = motores + segmentos. A cor é a identidade da família (ΔE ≥ 22 entre quaisquer duas). */
export const FAMILIES = {
  platform: { label: "Plataforma", color: "#e50914", engine: "portal" },
  ops: { label: "Atendimento e operações", color: "#0a6ee6", engine: "Ticket" },
  finance: { label: "Financeiro", color: "#0f8a5f", engine: "Invoice" },
  beauty: { label: "Beleza, estética e cuidados pessoais", color: "#c8306f", engine: "Schedule" },
  health: { label: "Saúde, terapias e bem-estar", color: "#f06511", engine: "Schedule" },
  food: { label: "Alimentação e pequenos estabelecimentos", color: "#b45309", engine: "Commerce" },
  service: { label: "Profissionais autônomos", color: "#0e7490", engine: "Service" },
  education: { label: "Educação e aulas particulares", color: "#1e3a8a", engine: "Schedule" },
  pet: { label: "Pet services", color: "#4d7c0f", engine: "Schedule" },
  home: { label: "Casa e construção", color: "#57534e", engine: "Service" },
  fashion: { label: "Moda, costura e personalização", color: "#86198f", engine: "Commerce" },
  events: { label: "Eventos e profissionais criativos", color: "#881337", engine: "Service" },
  commerce: { label: "Comércio local", color: "#6d28d9", engine: "Commerce" },
};

function parseCsv(text) {
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(",");
  return lines.filter(Boolean).map((line) => {
    // campos simples (sem vírgula dentro) — o CSV é nosso
    const cells = line.split(",");
    const row = {};
    cols.forEach((c, i) => (row[c] = (cells[i] ?? "").trim()));
    // note pode conter vírgulas: junta o resto
    if (cells.length > cols.length) row.note = cells.slice(cols.length - 1).join(",").trim();
    return row;
  });
}

const VOWELS = "aeiouy";
/** Candidatas de sigla em ordem de preferência. */
function siglaCandidates(name) {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (n.length < 2) return [n.padEnd(2, "x")];
  const out = [n[0] + n[1]];
  for (let i = 2; i < n.length; i++) if (!VOWELS.includes(n[i])) out.push(n[0] + n[i]);
  for (let i = 2; i < n.length; i++) out.push(n[0] + n[i]);
  if (n.length >= 3) out.push(n.slice(0, 3)); // sem par livre com a inicial: três letras (como "Lrc")
  for (let i = 1; i < n.length - 1; i++) out.push(n[i] + n[i + 1]);
  return [...new Set(out)];
}
const titleCase = (s) => s[0].toUpperCase() + s.slice(1);

export function loadProducts(csvPath = join(HERE, "products.csv")) {
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  const warnings = [];
  const keys = new Set(), names = new Set(), siglas = new Set();
  const products = [];

  // 1ª passada: siglas fixadas no CSV têm prioridade
  for (const r of rows) if (r.sigla) siglas.add(r.sigla.toLowerCase());

  for (const r of rows) {
    const { key, name, family, status } = r;
    if (!/^[a-z0-9-]+$/.test(key)) warnings.push(`chave inválida: "${key}"`);
    if (keys.has(key)) warnings.push(`chave repetida: "${key}"`);
    keys.add(key);
    if (!FAMILIES[family]) warnings.push(`${key}: família desconhecida "${family}"`);
    if (!["live", "soon", "planned"].includes(status)) warnings.push(`${key}: status "${status}"`);
    if (name) {
      if (names.has(name.toLowerCase())) warnings.push(`nome repetido: "${name}" (${key})`);
      names.add(name.toLowerCase());
      if (name.length > 9) warnings.push(`${key}: "${name}" tem ${name.length} letras (limite 9)`);
      if (/\s/.test(name)) warnings.push(`${key}: "${name}" tem espaço — nome é uma palavra`);
    }
    let sigla = r.sigla ? r.sigla.toLowerCase() : null;
    if (!sigla && name) {
      sigla = siglaCandidates(name).find((c) => !siglas.has(c));
      if (!sigla) warnings.push(`${key}: sem sigla livre para "${name}"`);
      else siglas.add(sigla);
    }
    products.push({
      key,
      name,
      family,
      color: FAMILIES[family]?.color ?? "#000000",
      sigla: sigla ? titleCase(sigla) : "",
      status,
      audience: r.audience,
      note: r.note || "",
    });
  }
  return { products, warnings };
}

export const { products: PRODUCTS, warnings: WARNINGS } = loadProducts();

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const byFamily = {};
  for (const p of PRODUCTS) (byFamily[p.family] ??= []).push(p);
  for (const [f, list] of Object.entries(byFamily)) {
    console.log(`\n${FAMILIES[f].label} (${FAMILIES[f].color}, motor ${FAMILIES[f].engine}) — ${list.length}`);
    for (const p of list) console.log(`  ${p.sigla.padEnd(3)} ${p.name.padEnd(10)} ${p.status.padEnd(8)} ${p.audience}${p.note ? "  ⚠ " + p.note : ""}`);
  }
  console.log(`\n${PRODUCTS.length} produtos · ${new Set(PRODUCTS.map((p) => p.sigla)).size} siglas distintas`);
  if (WARNINGS.length) { console.log("\nAVISOS:"); WARNINGS.forEach((w) => console.log("  - " + w)); }
}
