// Proposta de home para heeca.com.br com a marca e os ícones de produto do kit.
//   node scripts/site-proposal.mjs <saida.html>
// Página estática (mockup navegável). Tudo inline: SVGs de dist/, sem dependências externas além das fontes.
import { readFileSync, writeFileSync } from "node:fs";
import { PRODUCTS, FAMILIES } from "../products.mjs";

const out = process.argv[2];
const svg = (p, style = "") => readFileSync("dist/" + p, "utf8").replace(/^<svg /, `<svg style="${style}" `).replace(/ width="[\d.]+" height="[\d.]+"/, "");
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const products = PRODUCTS.filter((p) => p.name && !p.note.startsWith("TRANSIÇÃO"));
const ORDER = ["beauty", "health", "pet", "food", "service", "home", "fashion", "events", "education", "commerce", "ops", "finance"];
const byFam = {};
for (const p of products) (byFam[p.family] ??= []).push(p);

const ENGINES = [
  ["Schedule", "Agenda, clientes, lembretes e pacotes", "Beauty · Wellness · Bronze · Ink · Piercing · Move · Pet · Class"],
  ["Health", "Prontuário, sessões e retorno", "Dental · Mind · Nutri · Med · Fono"],
  ["Commerce", "Catálogo, pedidos, estoque e caixa", "Food · Store"],
  ["Service", "Orçamento, visita, OS e cobrança", "Service"],
  ["Project", "Orçamentos complexos, contratos e etapas", "Build · Atelier · Event"],
  ["Studio", "Sessões, entregas e portfólio", "Studio"],
  ["Core", "Conta única, cobrança, notificações e IA", "todos"],
];

const card = (p) => `
  <a class="card" href="#" style="--fam:${p.color};--fam-dark:${p.colorOnDark}">
    <div class="card-top">${svg(`icon/heeca-${p.key}-app-icon.svg`, "width:56px;height:56px;border-radius:14px;flex:none")}
      <span class="pill ${p.status === "live" ? "live" : ""}">${p.status === "live" ? "Disponível" : "Em breve"}</span></div>
    <h3>Hee<span>ca</span> <b>${esc(p.name)}</b></h3>
    <p>${esc(p.audience.split(" · ").slice(0, 4).join(" · "))}${p.audience.split(" · ").length > 4 ? " e mais" : ""}</p>
    <span class="more">Conhecer <i>→</i></span>
  </a>`;

const shelf = ORDER.filter((f) => byFam[f]).map((f) => `
  <section class="family" style="--fam:${FAMILIES[f].color}">
    <header><span class="rail"></span><h2>${esc(FAMILIES[f].label)}</h2><small>${byFam[f].length} ${byFam[f].length === 1 ? "sistema" : "sistemas"}</small></header>
    <div class="cards">${byFam[f].map(card).join("")}</div>
  </section>`).join("");

const html = `<title>Heeca — nova home</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap">
<style>
  :root{--ink:#0b0a0a;--ink-2:#3b3436;--muted:#6f6668;--paper:#f7f4f4;--paper-2:#efeaea;--line:#e2dada;--white:#fff;--brand:#e50914;--silver:#d4d6db}
  *{box-sizing:border-box}html{scroll-behavior:smooth}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:Montserrat,ui-sans-serif,system-ui,sans-serif;font-size:15.5px;line-height:1.55;-webkit-font-smoothing:antialiased}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1180px;margin:0 auto;padding-inline:clamp(16px,4vw,40px)}
  h1,h2,h3{margin:0;letter-spacing:-.02em;text-wrap:balance}
  .eyebrow{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}

  /* header */
  .nav{position:sticky;top:0;z-index:10;background:rgba(11,10,10,.86);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08)}
  .nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:24px}
  .nav ul{display:flex;gap:28px;list-style:none;margin:0;padding:0;font-size:14px;font-weight:500;color:#cfc7c8}
  .nav .actions{display:flex;gap:10px;align-items:center}
  .btn{display:inline-flex;align-items:center;gap:8px;border-radius:10px;padding:11px 18px;font-weight:600;font-size:14px;border:1px solid transparent;transition:transform .15s,background .15s}
  .btn:hover{transform:translateY(-1px)}
  .btn-red{background:var(--brand);color:#fff}.btn-ghost{color:#fff;border-color:rgba(255,255,255,.18)}.btn-dark{background:var(--ink);color:#fff}.btn-line{border-color:var(--line);color:var(--ink);background:#fff}
  @media (max-width:820px){.nav ul{display:none}}

  /* hero */
  .hero{background:var(--ink);color:#fff;position:relative;overflow:hidden}
  .hero::before{content:"";position:absolute;inset:auto -20% -60% -10%;height:80%;background:radial-gradient(ellipse at 30% 100%,rgba(229,9,20,.28),rgba(229,9,20,0) 60%);pointer-events:none}
  .hero .wrap{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:48px;align-items:center;padding-block:clamp(56px,9vw,120px)}
  @media (max-width:900px){.hero .wrap{grid-template-columns:1fr}}
  .hero .eyebrow{color:#ff5a62}
  .hero h1{font-size:clamp(38px,5.4vw,66px);font-weight:300;line-height:1.06;margin-top:16px}
  .hero h1 b{font-weight:700;color:var(--brand)}
  .hero p{color:#c9c1c2;font-size:clamp(16px,1.4vw,19px);max-width:52ch;margin:22px 0 30px}
  .hero .cta{display:flex;gap:12px;flex-wrap:wrap}
  .hero .note{color:#8a8283;font-size:13px;margin-top:16px}
  .hero-art{display:grid;justify-items:center}
  .hero-art svg{width:min(100%,560px);height:auto}
  .hero-icons{display:flex;gap:10px;margin-top:34px;flex-wrap:wrap;justify-content:center;max-width:560px}
  .hero-icons svg{width:44px;height:44px;border-radius:11px;box-shadow:0 8px 24px rgba(0,0,0,.35)}

  /* números */
  .band{background:#141112;color:#e9e2e3;border-top:1px solid rgba(255,255,255,.06)}
  .band .wrap{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;padding-block:28px}
  .band b{display:block;font-size:30px;font-weight:600;letter-spacing:-.03em;color:#fff}
  .band span{font-size:13px;color:#a39a9b}

  /* prateleira */
  .shelf{padding-block:clamp(56px,7vw,96px)}
  .shelf-head{display:grid;gap:12px;max-width:66ch;margin-bottom:44px}
  .shelf-head .eyebrow{color:var(--brand)}
  .shelf-head h2{font-size:clamp(28px,3.6vw,44px);font-weight:600;line-height:1.1}
  .shelf-head p{margin:0;color:var(--ink-2);font-size:17px}
  .family{margin-bottom:40px}
  .family header{display:flex;align-items:center;gap:12px;margin-bottom:16px}
  .family .rail{width:5px;height:22px;border-radius:3px;background:var(--fam)}
  .family h2{font-size:19px;font-weight:600}
  .family small{color:var(--muted);font-size:13px}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
  .card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px;display:grid;gap:10px;align-content:start;transition:transform .18s,box-shadow .18s,border-color .18s}
  .card:hover{transform:translateY(-3px);box-shadow:0 18px 40px -22px rgba(20,10,12,.35);border-color:color-mix(in srgb,var(--fam) 40%,var(--line))}
  .card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
  .pill{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:5px 9px;border-radius:999px;background:var(--paper-2);color:var(--muted)}
  .pill.live{background:#e6f5ec;color:#0b6b4a}
  .card h3{font-size:21px;font-weight:700;letter-spacing:-.03em}
  .card h3 span{color:var(--fam)}.card h3 b{font-weight:500;color:var(--fam)}
  .card p{margin:0;color:var(--ink-2);font-size:13.5px;line-height:1.5}
  .card .more{margin-top:6px;font-size:13px;font-weight:600;color:var(--fam);display:inline-flex;gap:6px;align-items:center}
  .card .more i{font-style:normal;transition:transform .18s}.card:hover .more i{transform:translateX(3px)}

  /* motores */
  .engines{background:var(--ink);color:#fff;padding-block:clamp(56px,7vw,96px)}
  .engines .head{display:grid;gap:12px;max-width:62ch;margin-bottom:40px}
  .engines .eyebrow{color:#ff5a62}
  .engines h2{font-size:clamp(28px,3.4vw,42px);font-weight:600;line-height:1.1}
  .engines p{margin:0;color:#c9c1c2;font-size:17px}
  .engine-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden}
  .engine{background:var(--ink);padding:26px 24px;display:grid;gap:8px;align-content:start}
  .engine b{font-size:22px;font-weight:600;letter-spacing:-.02em}
  .engine b em{font-style:normal;color:var(--silver);font-weight:300}
  .engine span{color:#c9c1c2;font-size:14px}
  .engine small{color:#8a8283;font-size:12.5px;letter-spacing:.02em}

  /* como funciona */
  .how{padding-block:clamp(56px,7vw,96px)}
  .how .head{display:grid;gap:12px;max-width:62ch;margin-bottom:40px}
  .how .eyebrow{color:var(--brand)}.how h2{font-size:clamp(28px,3.4vw,42px);font-weight:600;line-height:1.1}
  .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;counter-reset:s}
  .step{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px;display:grid;gap:10px;position:relative;counter-increment:s}
  .step::before{content:counter(s,decimal-leading-zero);font-size:12px;font-weight:600;letter-spacing:.12em;color:var(--brand)}
  .step b{font-size:19px;font-weight:600;letter-spacing:-.02em}.step p{margin:0;color:var(--ink-2);font-size:14.5px}

  /* cta final */
  .final{background:linear-gradient(180deg,#141112,var(--ink));color:#fff;padding-block:clamp(64px,8vw,110px);text-align:center}
  .final .sym svg{width:120px;height:auto;margin:0 auto 26px;display:block}
  .final h2{font-size:clamp(30px,4vw,50px);font-weight:300;line-height:1.08}.final h2 b{font-weight:700;color:var(--brand)}
  .final p{color:#c9c1c2;max-width:50ch;margin:18px auto 30px}
  footer{background:var(--ink);color:#8a8283;border-top:1px solid rgba(255,255,255,.08);font-size:13px}
  footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;padding-block:28px;align-items:center}
  footer svg{height:30px;width:auto}
  footer nav{display:flex;gap:18px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<div class="nav"><div class="wrap">
  <a href="#" aria-label="Heeca">${svg("logo/heeca-heeca-horizontal-on-dark.svg", "height:34px;width:auto;display:block")}</a>
  <ul><li>Sistemas</li><li>Preços</li><li>A Heeca</li><li>Contato</li></ul>
  <div class="actions"><a class="btn btn-ghost" href="#">Entrar</a><a class="btn btn-red" href="#">Criar conta</a></div>
</div></div>

<section class="hero"><div class="wrap">
  <div>
    <span class="eyebrow">Plataforma Heeca</span>
    <h1>Sistemas que fazem<br>o seu negócio <b>evoluir.</b></h1>
    <p>Vinte sistemas para quem vive de agenda, atendimento, pedidos ou obra — cada um do jeito do seu ramo, todos na mesma conta e na mesma fatura. Contrate online, pague por Pix ou cartão, comece em minutos.</p>
    <div class="cta"><a class="btn btn-red" href="#sistemas">Ver os sistemas →</a><a class="btn btn-ghost" href="#">Criar conta gratuita</a></div>
    <p class="note">14 dias grátis · sem cartão de crédito · cancele quando quiser</p>
  </div>
  <div class="hero-art">
    ${svg("animated/heeca-heeca-intro-on-dark.svg")}
    <div class="hero-icons">${products.slice(0, 12).map((p) => svg(`icon/heeca-${p.key}-app-icon.svg`)).join("")}</div>
  </div>
</div></section>

<div class="band"><div class="wrap">
  <div><b>20</b><span>sistemas verticais, um por ramo</span></div>
  <div><b>1</b><span>conta, uma fatura, um login para tudo</span></div>
  <div><b>7</b><span>motores compartilhados por baixo</span></div>
  <div><b>Pix</b><span>cartão ou boleto — pela Asaas</span></div>
</div></div>

<section class="shelf" id="sistemas"><div class="wrap">
  <div class="shelf-head">
    <span class="eyebrow">Os sistemas</span>
    <h2>Um sistema para o seu ramo — não um sistema genérico com o nome do seu ramo.</h2>
    <p>Cada produto Heeca nasce de um mercado e fala a língua dele: cadeira e comanda no salão, prontuário no consultório, orçamento e OS no prestador. A cor diz a família; o nome diz o ofício.</p>
  </div>
  ${shelf}
</div></section>

<section class="engines"><div class="wrap">
  <div class="head">
    <span class="eyebrow">Por dentro</span>
    <h2>Sete motores. Vinte experiências.</h2>
    <p>Os sistemas compartilham a mesma engenharia — agenda, cobrança, notificações, IA — e por isso evoluem juntos: o que melhora no Beauty aparece no Pet na semana seguinte.</p>
  </div>
  <div class="engine-grid">${ENGINES.map(([n, what, who]) => `<div class="engine"><b><em>Heeca</em> ${n}</b><span>${what}</span><small>${who}</small></div>`).join("")}</div>
</div></section>

<section class="how"><div class="wrap">
  <div class="head"><span class="eyebrow">Como funciona</span><h2>Do cadastro ao primeiro cliente em uma tarde.</h2></div>
  <div class="steps">
    <div class="step"><b>Crie sua conta Heeca</b><p>Uma conta para a empresa. Convide a equipe; cada pessoa entra em todos os sistemas com o mesmo acesso.</p></div>
    <div class="step"><b>Escolha os sistemas</b><p>Adicione o que o seu negócio usa — um salão pode ter Beauty e Invoice; uma clínica, Dental e Mind. Cada um com seu plano.</p></div>
    <div class="step"><b>Uma fatura, todos os meses</b><p>Pix, cartão ou boleto. Mude de plano, pause ou cancele pelo portal, sem ligar para ninguém.</p></div>
  </div>
</div></section>

<section class="final">
  <div class="sym">${svg("symbol/heeca-symbol-heeca-on-dark.svg")}</div>
  <h2>Comece pelo sistema que <b>faz falta hoje.</b></h2>
  <p>Os outros estarão a um clique quando você precisar — na mesma conta, sem migração, sem outro login.</p>
  <a class="btn btn-red" href="#">Criar conta gratuita</a>
</section>

<footer><div class="wrap">
  ${svg("logo/heeca-heeca-horizontal-on-dark.svg")}
  <nav><a href="#">Sistemas</a><a href="#">Preços</a><a href="#">Termos de uso</a><a href="#">Privacidade</a><a href="#">contato@heeca.com.br</a></nav>
  <span>© 2026 Heeca Tecnologia</span>
</div></footer>
`;
writeFileSync(out, html);
console.log("ok", out);
