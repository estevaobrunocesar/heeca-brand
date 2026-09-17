// Gera uma página HTML de apresentação do kit (animação + sistema) a partir de dist/.
//   node scripts/proof-page.mjs <saida.html>
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv[2];
const rd = (p) => readFileSync("dist/" + p, "utf8").replace(/^<svg /, '<svg style="width:100%;height:auto;display:block" ');
const b64 = (p) => readFileSync("dist/" + p).toString("base64");
const anim = rd("animated/heeca-heeca-intro-on-dark.svg");
const animLight = rd("animated/heeca-ticket-intro.svg");
const tiles = [
  ["Logo principal (fundo escuro)", "logo/heeca-heeca-principal-on-dark.svg", "#0a0a0a"],
  ["Horizontal com slogan", "logo/heeca-heeca-horizontal-slogan-on-dark.svg", "#0a0a0a"],
  ["Sobre fundo claro", "logo/heeca-heeca-horizontal-slogan.svg", "#fff"],
  ["Monocromática", "logo/heeca-heeca-horizontal-black.svg", "#fff"],
  ["Ticket", "logo/heeca-ticket-horizontal-on-dark.svg", "#0a0a0a"],
  ["Dental", "logo/heeca-dental-horizontal.svg", "#fff"],
  ["Orçamento", "logo/heeca-orcamento-horizontal-on-dark.svg", "#0a0a0a"],
  ["Vendas", "logo/heeca-vendas-horizontal.svg", "#fff"],
];
const icons =
  ["heeca", "ticket", "dental", "orcamento", "vendas"].map((k) => `<div class="s"><img src="data:image/png;base64,${b64(`icon/heeca-${k}-app-icon-192.png`)}" width="64" height="64" style="border-radius:14px" alt=""><small>${k}</small></div>`).join("") +
  [32, 16].map((s) => `<div class="s"><img src="data:image/png;base64,${b64(`favicon/heeca-heeca-${s}.png`)}" width="${s}" height="${s}" alt=""><small>${s} px</small></div>`).join("");

const html = `<title>Heeca Kit</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&family=IBM+Plex+Mono&display=swap">
<style>
:root{--paper:#fff;--surface:#f6f3f3;--line:#e3dcdc;--ink:#0a0a0a;--ink-2:#3a3335;--muted:#6f6668;--brand:#e50914}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#121011;--surface:#1a1718;--line:#2c2627;--ink:#f5f1f1;--ink-2:#d6cfd0;--muted:#a29899}}
:root[data-theme="dark"]{--paper:#121011;--surface:#1a1718;--line:#2c2627;--ink:#f5f1f1;--ink-2:#d6cfd0;--muted:#a29899}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Montserrat,system-ui,sans-serif;font-size:15px;line-height:1.55;padding-block:0 80px;padding-inline:clamp(16px,4vw,48px)}
.wrap{max-width:1100px;margin:0 auto}h1,h2,h3{margin:0;letter-spacing:-.02em;text-wrap:balance}h1{font-size:clamp(28px,4vw,40px);line-height:1.1}h2{font-size:22px}p{margin:0;max-width:64ch;color:var(--ink-2)}
.eyebrow{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.mono{font-family:"IBM Plex Mono",monospace;font-size:12.5px}
header{padding-block:52px 28px;border-bottom:2px solid var(--brand);display:grid;gap:12px}section{padding-block:44px;border-bottom:1px solid var(--line);display:grid;gap:18px}
.stage{background:#0a0a0a;border-radius:14px;padding:clamp(24px,5vw,56px) clamp(20px,5vw,64px);display:grid;place-items:center}.stage.light{background:#fff;border:1px solid var(--line)}
.stage>div{width:min(100%,620px)}
.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}button{font:600 13px Montserrat,sans-serif;color:var(--ink);background:transparent;border:1px solid var(--line);border-radius:8px;padding:8px 14px;cursor:pointer}button:hover{border-color:var(--ink)}button:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.step{background:var(--surface);border-radius:10px;padding:14px 16px;display:grid;gap:4px}.step b{font-size:13px}.step small{color:var(--muted);font-size:12.5px}.step .t{font-family:"IBM Plex Mono",monospace;font-size:11px;color:var(--brand)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.tile{border-radius:10px;padding:22px;display:grid;gap:12px;align-content:start;border:1px solid var(--line)}.tile .cap{font-size:12px;display:flex;justify-content:space-between}.tile svg{width:100%;height:auto;display:block}
.sizes{display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap}.s{display:grid;gap:6px;justify-items:center}.s small{font-size:11px;color:var(--muted)}
.rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}.rule{background:var(--surface);border-radius:10px;padding:18px;display:grid;gap:6px}.rule p{font-size:13.5px}.rule h3{font-size:14px}
</style>
<div class="wrap">
<header><span class="eyebrow">Heeca · kit vetorial do conceito escolhido · setembro 2026</span><h1>O símbolo escolhido, em vetor — e a animação do painel, validada.</h1><p>Reconstruí o símbolo do painel como geometria — com as duas hastes do H, para ler "HC" e não "IC" — e gerei o sistema inteiro a partir dele: assinaturas, produtos, monocromática, ícones, favicons, Open Graph, SVG animado e componente React. O que não dá para gerar em código — o render 3D cromado — está no briefing para a equipe de design.</p></header>

<section><span class="eyebrow">Animação · conceito do painel</span><h2>1. H surge → 2. C se forma → 3. Conexão → 4. Nome revela</h2>
<div class="stage" id="stage"><div id="anim">${anim}</div></div>
<div class="controls"><button type="button" id="replay">Repetir</button><span class="mono" style="color:var(--muted)">≈ 4 s · SVG autônomo (roda em &lt;img&gt;) · também como &lt;LogoIntro /&gt; em React · respeita prefers-reduced-motion</span></div>
<div class="legend">
<div class="step"><span class="t">0,1 – 1,0 s</span><b>1. H surge</b><small>As duas hastes prata sobem: o H.</small></div>
<div class="step"><span class="t">1,0 – 1,8 s</span><b>2. C se forma</b><small>O C vermelho se desenha nascendo atrás da haste direita.</small></div>
<div class="step"><span class="t">1,8 – 2,75 s</span><b>3. Conexão</b><small>O swoosh sai de dentro da haste esquerda — é a barra do H —, cruza a direita, sobe e entra no C.</small></div>
<div class="step"><span class="t">2,7 – 4,0 s</span><b>4. Nome revela</b><small>H·e·e·c·a letra a letra ("ca" em vermelho), depois o slogan.</small></div>
</div>
<div class="stage light"><div id="anim2">${animLight}</div></div>
<p style="font-size:13.5px"><strong>O ajuste em relação ao painel:</strong> a arte original tinha uma haste só e lia "IC". As duas hastes do H ficam sempre visíveis; o swoosh é a barra do H e o C nasce atrás da haste direita — é o que faz ler "HC" em qualquer tamanho e em uma cor só.</p>
</section>

<section><div class="controls" style="justify-content:space-between"><h2>Sistema</h2><span class="mono" style="color:var(--muted)">todas as peças a partir de uma geometria</span></div>
<div class="tiles">${tiles.map(([n, f, bg]) => `<div class="tile" style="background:${bg};color:${bg === "#fff" ? "#0a0a0a" : "#fff"}"><span class="cap" style="color:${bg === "#fff" ? "#6f6668" : "#9a9192"}"><span>${n}</span></span>${rd(f)}</div>`).join("")}</div>
<div class="tile" style="background:var(--surface)"><span class="cap" style="color:var(--muted)"><span>Ícones de app e favicons</span><span>o símbolo pede fundo escuro em tamanhos pequenos</span></span><div class="sizes">${icons}</div></div>
</section>

<section><span class="eyebrow">Regras</span>
<div class="rules">
<div class="rule"><h3>Cores</h3><p>Prata <span class="mono">#d4d6db</span> só em fundo escuro; em fundo claro as partes do H viram grafite <span class="mono">#1f1f23</span>. Vermelho <span class="mono">#e50914</span> (o <span class="mono">#DC2626</span> do painel é visualmente o mesmo; mantivemos o já aplicado nos sistemas). Preto <span class="mono">#0a0a0a</span>.</p></div>
<div class="rule"><h3>Produtos</h3><p>Só o vermelho muda: swoosh, C, "ca" e o nome do produto. As hastes continuam prata/grafite. <em>Heeca Ticket</em>, <em>Heeca Dental</em>, <em>Heeca Orçamento</em>, <em>Heeca Vendas</em>.</p></div>
<div class="rule"><h3>Monocromática</h3><p>Em uma cor só, uma linha de respiro separa swoosh, hastes e C — sem ela o símbolo vira mancha. Já está nos arquivos <span class="mono">-black</span> e <span class="mono">-white</span>.</p></div>
<div class="rule"><h3>Tamanho mínimo</h3><p>Símbolo 24 px (ícone 48 px). Abaixo disso o desenho não sobrevive — é da natureza dele; o favicon de 16 px é uma mancha reconhecível pela cor, não pela forma.</p></div>
<div class="rule"><h3>Slogan</h3><p>Só na versão principal e na horizontal com slogan, em Montserrat Light com tracking 6 %. Nunca em cabeçalhos, sidebar ou ícones.</p></div>
<div class="rule"><h3>Wordmark</h3><p>"Heeca" em Montserrat 700: "Hee" na cor do H, "ca" na cor do produto. Grafia sempre Heeca.</p></div>
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
