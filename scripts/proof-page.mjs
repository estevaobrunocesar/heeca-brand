// Gera uma página HTML de apresentação do kit (animação + sistema) a partir de dist/.
//   node scripts/proof-page.mjs <saida.html>
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv[2];
mkdirSync(dirname(out), { recursive: true });
const rd = (p) => readFileSync("dist/" + p, "utf8").replace(/^<svg /, '<svg style="width:100%;height:auto;display:block" ');
const b64 = (p) => readFileSync("dist/" + p).toString("base64");
const anim = rd("animated/heeca-heeca-intro-on-dark.svg");
const animLight = rd("animated/heeca-dental-intro.svg");
const tiles = [
  ["Logo principal (fundo escuro)", "logo/heeca-heeca-principal-on-dark.svg", "#15171A"],
  ["Horizontal com slogan", "logo/heeca-heeca-horizontal-slogan-on-dark.svg", "#15171A"],
  ["Sobre fundo claro", "logo/heeca-heeca-horizontal-slogan.svg", "#fff"],
  ["Monocromática", "logo/heeca-heeca-horizontal-black.svg", "#fff"],
  ["Ticket", "logo/heeca-ticket-horizontal-on-dark.svg", "#15171A"],
  ["Dental", "logo/heeca-dental-horizontal.svg", "#fff"],
  ["Invoice", "logo/heeca-invoice-horizontal-on-dark.svg", "#15171A"],
  ["Store", "logo/heeca-store-horizontal.svg", "#fff"],
];
const icons =
  ["heeca", "ticket", "dental", "invoice", "store", "beauty", "pet"].map((k) => `<div class="s"><img src="data:image/png;base64,${b64(`icon/heeca-${k}-app-icon-192.png`)}" width="64" height="64" style="border-radius:14px" alt=""><small>${k}</small></div>`).join("") +
  [32, 16].map((s) => `<div class="s"><img src="data:image/png;base64,${b64(`favicon/heeca-heeca-${s}.png`)}" width="${s}" height="${s}" alt=""><small>${s} px</small></div>`).join("");

const html = `<title>Heeca Kit</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&family=IBM+Plex+Mono&display=swap">
<style>
:root{--paper:#fff;--surface:#f6f3f3;--line:#e3dcdc;--ink:#15171A;--ink-2:#3a3335;--muted:#667085;--brand:#E31B23}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#121011;--surface:#1a1718;--line:#2c2627;--ink:#f5f1f1;--ink-2:#d6cfd0;--muted:#a29899}}
:root[data-theme="dark"]{--paper:#121011;--surface:#1a1718;--line:#2c2627;--ink:#f5f1f1;--ink-2:#d6cfd0;--muted:#a29899}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Montserrat,system-ui,sans-serif;font-size:15px;line-height:1.55;padding-block:0 80px;padding-inline:clamp(16px,4vw,48px)}
.wrap{max-width:1100px;margin:0 auto}h1,h2,h3{margin:0;letter-spacing:-.02em;text-wrap:balance}h1{font-size:clamp(28px,4vw,40px);line-height:1.1}h2{font-size:22px}p{margin:0;max-width:64ch;color:var(--ink-2)}
.eyebrow{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.mono{font-family:"IBM Plex Mono",monospace;font-size:12.5px}
header{padding-block:52px 28px;border-bottom:2px solid var(--brand);display:grid;gap:12px}section{padding-block:44px;border-bottom:1px solid var(--line);display:grid;gap:18px}
.stage{background:#15171A;border-radius:14px;padding:clamp(24px,5vw,56px) clamp(20px,5vw,64px);display:grid;place-items:center}.stage.light{background:#fff;border:1px solid var(--line)}
.stage>div{width:min(100%,620px)}
.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}button{font:600 13px Montserrat,sans-serif;color:var(--ink);background:transparent;border:1px solid var(--line);border-radius:8px;padding:8px 14px;cursor:pointer}button:hover{border-color:var(--ink)}button:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.step{background:var(--surface);border-radius:10px;padding:14px 16px;display:grid;gap:4px}.step b{font-size:13px}.step small{color:var(--muted);font-size:12.5px}.step .t{font-family:"IBM Plex Mono",monospace;font-size:11px;color:var(--brand)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.tile{border-radius:10px;padding:22px;display:grid;gap:12px;align-content:start;border:1px solid var(--line)}.tile .cap{font-size:12px;display:flex;justify-content:space-between}.tile svg{width:100%;height:auto;display:block}
.sizes{display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap}.s{display:grid;gap:6px;justify-items:center}.s small{font-size:11px;color:var(--muted)}
.rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}.rule{background:var(--surface);border-radius:10px;padding:18px;display:grid;gap:6px}.rule p{font-size:13.5px}.rule h3{font-size:14px}
</style>
<div class="wrap">
<header><span class="eyebrow">Heeca · Tipografia Exclusiva · kit vetorial · setembro 2026</span><h1>O logotipo do painel em vetor — e o sistema inteiro gerado a partir dele.</h1><p>O arco vermelho é a barra do H: o detalhe que conecta. HE = Heloísa, CA = Catharina. A partir dessa geometria saem as assinaturas, os produtos, a monocromática, os ícones, favicons, Open Graph, SVG animado e componente React. O que não dá para gerar em código — o render 3D cromado — está no briefing para a equipe de design.</p></header>

<section><span class="eyebrow">Animação · conceito do painel</span><h2>1. As hastes → 2. O arco conecta → 3. As letras → 4. Assinatura</h2>
<div class="stage" id="stage"><div id="anim">${anim}</div></div>
<div class="controls"><button type="button" id="replay">Repetir</button><span class="mono" style="color:var(--muted)">≈ 3 s · SVG autônomo (roda em &lt;img&gt;) · também como &lt;LogoIntro /&gt; em React · respeita prefers-reduced-motion</span></div>
<div class="legend">
<div class="step"><span class="t">0,1 – 0,6 s</span><b>1. As hastes</b><small>As duas hastes do H sobem.</small></div>
<div class="step"><span class="t">0,55 – 1,25 s</span><b>2. O arco conecta</b><small>O arco varre da esquerda para a direita e vira a barra do H.</small></div>
<div class="step"><span class="t">1,15 – 1,9 s</span><b>3. As letras</b><small>E, E, C, A entram uma a uma, com as barras vermelhas.</small></div>
<div class="step"><span class="t">1,8 – 2,6 s</span><b>4. Assinatura</b><small>Nome do produto e, por fim, o slogan em fade.</small></div>
</div>
<div class="stage light"><div id="anim2">${animLight}</div></div>
<p style="font-size:13.5px"><strong>Medido no painel:</strong> proporções, pesos e espaçamento foram extraídos pixel a pixel da arte aprovada — os SVGs que vieram no zip do handoff eram um rascunho (arco em S, A com travessão) e foram descartados. O logotipo é curva pura: nunca texto digitado.</p>
</section>

<section><div class="controls" style="justify-content:space-between"><h2>Sistema</h2><span class="mono" style="color:var(--muted)">todas as peças a partir de uma geometria</span></div>
<div class="tiles">${tiles.map(([n, f, bg]) => `<div class="tile" style="background:${bg};color:${bg === "#fff" ? "#0a0a0a" : "#fff"}"><span class="cap" style="color:${bg === "#fff" ? "#6f6668" : "#9a9192"}"><span>${n}</span></span>${rd(f)}</div>`).join("")}</div>
<div class="tile" style="background:var(--surface)"><span class="cap" style="color:var(--muted)"><span>Ícones de app e favicons</span><span>produto: cor da família + pictograma + figuras no canto; plataforma: Heeca Black + figuras</span></span><div class="sizes">${icons}</div></div>
</section>

<section><span class="eyebrow">Regras</span>
<div class="rules">
<div class="rule"><h3>Cores</h3><p>Black <span class="mono">#15171A</span> (letras), Primary <span class="mono">#E31B23</span> (arco, barras dos E, CTA), Primary Hover <span class="mono">#B90F19</span>, Graphite <span class="mono">#30343A</span>, Warm <span class="mono">#F7F4EF</span>, Text Secondary <span class="mono">#667085</span>. Em fundo escuro as letras ficam brancas; o arco não muda.</p></div>
<div class="rule"><h3>Produtos</h3><p>O logotipo é sempre o mesmo (marca-mãe). O produto entra como segunda linha em caixa alta (Inter 600), na cor da família: <em>HEECA / TICKET</em>, <em>HEECA / DENTAL</em>, <em>HEECA / INVOICE</em>, <em>HEECA / STORE</em>.</p></div>
<div class="rule"><h3>Monocromática</h3><p>Tudo em uma cor: o arco se funde às hastes e continua legível pelas pontas que ultrapassam o H. Arquivos <span class="mono">-black</span> e <span class="mono">-white</span>.</p></div>
<div class="rule"><h3>Tamanho mínimo</h3><p>Logotipo 90 px de largura (maiúsculas ≈ 16 px); símbolo 20 px; ícone de app 48 px. O favicon usa o ícone de app.</p></div>
<div class="rule"><h3>Slogan</h3><p>Inter 400, uma linha na largura exata do logotipo, alinhada pela haste do H. Só na versão principal e na horizontal com slogan.</p></div>
<div class="rule"><h3>Logotipo</h3><p>Desenho, não fonte: não substituir por texto, não distorcer, inclinar ou aplicar efeitos. Em texto corrido, Heeca.</p></div>
</div></section>
</div>
<script>
const stage=document.getElementById("stage"),a1=document.getElementById("anim"),a2=document.getElementById("anim2");const h1=a1.innerHTML,h2=a2.innerHTML;
function play(){a1.innerHTML="";a2.innerHTML="";void stage.offsetWidth;a1.innerHTML=h1;a2.innerHTML=h2;}
document.getElementById("replay").addEventListener("click",play);
if(!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(play,7000);
</script>`;
writeFileSync(out, html);
console.log("ok", out);
