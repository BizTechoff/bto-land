<!DOCTYPE html>
<!-- בס"ד -->
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מלאך הזכויות · ארכיטקטורה אינטראקטיבית</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Assistant:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* בס"ד */
/* ============================================================
   Malach HaZchuyot - Architecture Viz Styles
   ============================================================ */

:root {
  --paper:#F5F1E8; --paper-shade:#ECE6D5; --paper-deep:#E0D9C2;
  --ink:#1A1F2E; --ink-soft:#4A5060; --ink-mute:#8B8E96;
  --accent:#C2410C; --accent-deep:#7A2A0A; --accent-soft:#F4D9C8;
  --signal:#166534; --signal-soft:#D9EDD9;
  --warn:#A16207; --warn-soft:#FBEFCB;
  --info:#1E40AF; --info-soft:#DAE5F5;
  --serif:'Frank Ruhl Libre','David',serif;
  --sans:'Assistant','Arial Hebrew',system-ui,sans-serif;
  --mono:'JetBrains Mono','Menlo',monospace;
}

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--paper);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.bsd-mark{position:fixed;top:0.5rem;right:1rem;font-family:var(--serif);font-size:0.85rem;color:var(--ink-mute);font-style:italic;z-index:100;background:var(--paper);padding:0.1rem 0.4rem}
.app{max-width:1280px;margin:0 auto;padding:2.5rem 1.5rem}

/* HEADER */
header.top{padding:2.5rem 0 2rem;border-bottom:3px double var(--ink);margin-bottom:2rem;text-align:center}
header.top .label{font-family:var(--mono);font-size:0.75rem;color:var(--accent);letter-spacing:0.25em;text-transform:uppercase;margin-bottom:1rem;font-weight:600}
header.top h1{font-family:var(--serif);font-weight:900;font-size:clamp(1.8rem,4vw,2.8rem);line-height:1.1;margin-bottom:0.5rem;letter-spacing:-0.02em}
header.top h1 .accent{color:var(--accent);font-style:italic}
header.top .subtitle{font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:1.05rem;max-width:640px;margin:0 auto}

/* NAV / BREADCRUMB */
.nav-bar{display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;padding:1rem 1.2rem;background:var(--paper-shade);border:1px solid var(--ink);margin-bottom:2rem;font-family:var(--mono);font-size:0.78rem;letter-spacing:0.05em}
.nav-crumb{display:inline-flex;align-items:center;gap:0.4rem;color:var(--ink-soft);cursor:pointer;padding:0.3rem 0.6rem;background:transparent;border:none;font-family:inherit;font-size:inherit;transition:color 0.2s;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nav-crumb:hover{color:var(--accent)}
.nav-crumb.active{color:var(--accent);font-weight:600}
.nav-sep{color:var(--ink-mute);font-size:0.7rem}
.zoom-indicator{margin-right:auto;font-family:var(--mono);font-size:0.7rem;color:var(--ink-mute);letter-spacing:0.15em;text-transform:uppercase;display:flex;align-items:center;gap:0.5rem}
.zoom-bars{display:inline-flex;gap:2px;align-items:flex-end}
.zoom-bar{width:4px;background:var(--ink-mute);transition:all 0.3s}
.zoom-bar:nth-child(1){height:5px}
.zoom-bar:nth-child(2){height:9px}
.zoom-bar:nth-child(3){height:13px}
.zoom-bar:nth-child(4){height:17px}
.zoom-bar:nth-child(5){height:21px}
.zoom-bar.active{background:var(--accent)}

/* VIEWPORT */
.viewport{position:relative;min-height:600px;border:1px solid var(--ink);background:var(--paper);overflow:hidden;padding:2.5rem 2rem}

.level{display:none;animation:fadeUp 0.5s ease-out}
.level.active{display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* ROOT - LEVEL 1 */
.system-root{text-align:center;padding:1rem 0}
.system-emblem{display:inline-block;margin:0 auto 2rem;padding:3rem 5rem;background:var(--ink);color:var(--paper);position:relative;overflow:hidden}
.system-emblem::before,.system-emblem::after{content:'';position:absolute;top:0;width:8px;height:100%;background:var(--accent)}
.system-emblem::before{right:0}
.system-emblem::after{left:0}
.system-emblem .wing{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.3em;color:var(--accent);margin-bottom:0.6rem}
.system-emblem h2{font-family:var(--serif);font-weight:900;font-size:2.4rem;line-height:0.95;letter-spacing:-0.02em;margin:0;font-style:italic}
.system-emblem h2 .accent{color:var(--accent)}
.system-tagline{font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:1.1rem;max-width:600px;margin:0 auto 2.5rem}

.tracks-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:2rem}
.track-card{background:var(--paper-shade);border:1px solid var(--ink);padding:1.8rem 1.5rem;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;text-align:right;font-family:inherit}
.track-card::before{content:'';position:absolute;top:0;right:0;width:100%;height:5px;transition:height 0.3s}
.track-card:hover{transform:translateY(-3px);box-shadow:0 6px 0 var(--ink)}
.track-card:hover::before{height:8px}
.track-card.t1::before{background:var(--accent)}
.track-card.t2::before{background:var(--info)}
.track-card.t3::before{background:var(--signal)}
.track-card .num{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.2em;color:var(--accent);font-weight:600;margin-bottom:0.6rem}
.track-card.t2 .num{color:var(--info)}
.track-card.t3 .num{color:var(--signal)}
.track-card h3{font-family:var(--serif);font-size:1.4rem;font-weight:700;margin-bottom:0.5rem;line-height:1.2}
.track-card .desc{font-size:0.92rem;color:var(--ink-soft);line-height:1.5;margin-bottom:1rem}
.track-card .arrow-cta{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.15em;color:var(--accent);text-transform:uppercase;font-weight:600;display:flex;align-items:center;gap:0.4rem}
.track-card.t2 .arrow-cta{color:var(--info)}
.track-card.t3 .arrow-cta{color:var(--signal)}

.legend{display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;margin:2rem 0 0;padding:1rem;background:var(--paper-shade);border:1px solid var(--ink);font-family:var(--mono);font-size:0.7rem;letter-spacing:0.05em}
.legend-item{display:flex;align-items:center;gap:0.5rem}
.legend-swatch{width:14px;height:14px;border:1px solid var(--ink)}
.legend-swatch.user{background:var(--signal-soft)}
.legend-swatch.platform{background:var(--accent-soft)}
.legend-swatch.external{background:var(--info-soft)}
.legend-swatch.system{background:var(--ink)}

/* TRACK HEADER - LEVEL 2 */
.track-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;padding-bottom:1rem;border-bottom:2px solid var(--ink);flex-wrap:wrap;gap:1rem}
.track-header h2{font-family:var(--serif);font-weight:700;font-size:1.8rem;line-height:1.1}
.track-header h2 small{display:block;font-family:var(--mono);font-size:0.7rem;color:var(--ink-mute);letter-spacing:0.15em;text-transform:uppercase;font-weight:400;margin-top:0.3rem}
.track-badge{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;padding:0.4rem 0.9rem;font-weight:600}
.track-badge.t1{background:var(--accent);color:var(--paper)}
.track-badge.t2{background:var(--info);color:var(--paper)}
.track-badge.t3{background:var(--signal);color:var(--paper)}

.track-intro{margin-bottom:2rem;font-family:var(--serif);font-style:italic;font-size:1.05rem;color:var(--ink-soft);line-height:1.6}

/* LANES */
.lane-wrap{margin-bottom:1.8rem}
.lane-label{font-family:var(--mono);font-size:0.7rem;color:var(--accent);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:0.6rem;font-weight:600;display:flex;align-items:center;gap:0.5rem}
.lane-label::before{content:'';width:30px;height:2px;background:var(--accent)}
.lane-label.external::before{background:var(--info)}
.lane-label.external{color:var(--info)}
.lane-label.platform::before{background:var(--accent-deep)}
.lane-label.platform{color:var(--accent-deep)}
.lane-label.user::before{background:var(--signal)}
.lane-label.user{color:var(--signal)}

.actors-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.8rem}
.actor{background:var(--paper-shade);border:1px solid var(--ink);padding:1rem 0.9rem;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;font-family:inherit}
.actor:hover{transform:translateY(-2px);background:var(--paper-deep)}
.actor.external{background:var(--info-soft);border-color:var(--info)}
.actor.platform{background:var(--accent-soft);border-color:var(--accent)}
.actor.user{background:var(--signal-soft);border-color:var(--signal)}
.actor .role-tag{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.15em;color:var(--ink-mute);font-weight:600;text-transform:uppercase;margin-bottom:0.3rem}
.actor h4{font-family:var(--serif);font-size:0.95rem;font-weight:700;line-height:1.2;margin:0;color:var(--ink)}
.actor .actor-en{font-family:var(--mono);font-size:0.65rem;color:var(--ink-mute);letter-spacing:0.05em;direction:ltr;margin-top:0.3rem}
.actor::after{content:'⤴';position:absolute;top:0.4rem;left:0.5rem;color:var(--accent);font-size:0.85rem;opacity:0.4;transition:opacity 0.2s}
.actor:hover::after{opacity:1}

/* FLOW */
.flow-section{margin-top:2.5rem}
.flow-title{font-family:var(--serif);font-size:1.3rem;font-weight:700;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--ink-mute)}
.flow-stage{margin:1.2rem 0;background:var(--paper-shade);border:1px solid var(--ink);padding:1.2rem 1.5rem;position:relative}
.flow-stage::before{content:'';position:absolute;top:0;right:0;width:5px;height:100%;background:var(--accent)}
.flow-stage.t2::before{background:var(--info)}
.flow-stage.t3::before{background:var(--signal)}
.flow-stage h3{font-family:var(--serif);font-size:1.15rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.6rem}
.flow-stage h3 .step-num{font-family:var(--serif);font-style:italic;font-weight:900;color:var(--accent);font-size:1.4rem;line-height:1}
.flow-stage.t2 h3 .step-num{color:var(--info)}
.flow-stage.t3 h3 .step-num{color:var(--signal)}
.flow-stage p{font-size:0.95rem;color:var(--ink-soft);margin-bottom:0.7rem;line-height:1.55}
.flow-stage .ops-mini{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.7rem;padding-top:0.7rem;border-top:1px dashed var(--ink-mute)}
.op-chip{font-family:var(--mono);font-size:0.65rem;padding:0.25rem 0.6rem;letter-spacing:0.05em;border:1px solid var(--ink);background:var(--paper);cursor:pointer;transition:all 0.2s;color:var(--ink)}
.op-chip:hover{background:var(--accent);color:var(--paper);border-color:var(--accent)}

/* ACTOR DETAIL - LEVEL 3 */
.detail-panel{background:var(--paper);padding:0;position:relative}
.detail-header{padding:1.5rem 1.8rem;background:var(--paper-shade);border:1px solid var(--ink);border-right:6px solid var(--accent);margin-bottom:1.5rem}
.detail-header.user{border-right-color:var(--signal)}
.detail-header.external{border-right-color:var(--info)}
.detail-header.platform{border-right-color:var(--accent)}
.scope-tag{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:0.5rem}
.detail-header h2{font-family:var(--serif);font-size:1.7rem;font-weight:700;margin-bottom:0.3rem;line-height:1.2}
.detail-header .name-en{font-family:var(--mono);font-size:0.8rem;color:var(--ink-mute);letter-spacing:0.05em;direction:ltr;margin-bottom:0.8rem}
.detail-header .description{font-size:1rem;line-height:1.6;color:var(--ink)}

.detail-section{margin-bottom:1.8rem}
.detail-section-title{font-family:var(--mono);font-size:0.7rem;color:var(--accent);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:0.7rem;font-weight:600;display:flex;align-items:center;gap:0.5rem}
.detail-section-title::before{content:'';width:30px;height:2px;background:var(--accent)}

.iface-list,.notes-block{background:var(--paper-shade);border:1px solid var(--ink);padding:1rem 1.2rem;font-size:0.92rem;line-height:1.6}
.iface-list ul{list-style:none}
.iface-list li{padding:0.3rem 0;border-bottom:1px dashed var(--ink-mute);display:flex;align-items:center;gap:0.6rem}
.iface-list li:last-child{border-bottom:none}
.iface-list li::before{content:'⟢';color:var(--accent);font-weight:700}

/* OPERATIONS */
.ops-section{margin:1.5rem 0}
.ops-title{font-family:var(--serif);font-size:1.2rem;font-weight:700;margin-bottom:0.8rem;color:var(--ink)}
.ops-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0.8rem}
.op-card{background:var(--paper-shade);border:1px solid var(--ink);padding:1rem 1.2rem;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;font-family:inherit;text-align:right}
.op-card::before{content:'';position:absolute;top:0;right:0;width:4px;height:100%;background:var(--accent);transition:width 0.2s}
.op-card:hover{background:var(--paper-deep);transform:translateY(-1px)}
.op-card:hover::before{width:7px}
.op-card .op-mark{font-family:var(--mono);font-size:0.62rem;color:var(--accent);letter-spacing:0.1em;font-weight:600;margin-bottom:0.4rem}
.op-card h4{font-family:var(--serif);font-weight:700;font-size:1rem;margin:0;color:var(--ink);line-height:1.3}
.op-card .op-arrow{color:var(--accent);font-size:0.85rem;opacity:0.5;position:absolute;top:0.5rem;left:0.7rem}

.related-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-top:0.8rem}
.related-card{background:var(--paper-shade);border:1px solid var(--ink-mute);padding:0.7rem 0.9rem;cursor:pointer;transition:all 0.2s;font-family:inherit;text-align:right}
.related-card:hover{border-color:var(--accent);background:var(--paper-deep)}
.related-card .key{font-family:var(--mono);font-size:0.62rem;color:var(--accent);letter-spacing:0.15em;text-transform:uppercase;font-weight:600;margin-bottom:0.3rem}
.related-card .val{font-family:var(--serif);font-weight:600;font-size:0.92rem;color:var(--ink);direction:ltr;text-align:right}
.related-card .file{font-family:var(--mono);font-size:0.65rem;color:var(--ink-mute);direction:ltr;text-align:right;margin-top:0.2rem}

/* OPERATION DETAIL - LEVEL 4 */
.op-detail-panel{background:var(--paper);padding:0;position:relative}
.op-detail-header{padding:1.8rem 2rem;background:var(--ink);color:var(--paper);position:relative;overflow:hidden;margin-bottom:1.5rem}
.op-detail-header::after{content:'';position:absolute;top:0;left:0;width:8px;height:100%;background:var(--accent)}
.op-detail-header .scope-tag{color:var(--accent)}
.op-detail-header h2{font-family:var(--serif);font-size:1.6rem;font-weight:700;color:var(--paper);line-height:1.2;margin:0}

.op-quad{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem}
.op-quad-card{background:var(--paper-shade);border:1px solid var(--ink);padding:1.2rem 1.4rem;position:relative;overflow:hidden}
.op-quad-card::before{content:'';position:absolute;top:0;right:0;width:5px;height:100%;background:var(--accent)}
.op-quad-card.what::before{background:var(--accent-deep)}
.op-quad-card.when::before{background:var(--signal)}
.op-quad-card.how::before{background:var(--info)}
.op-quad-card.who::before{background:var(--warn)}
.op-quad-label{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;margin-bottom:0.5rem}
.op-quad-card.what .op-quad-label{color:var(--accent-deep)}
.op-quad-card.when .op-quad-label{color:var(--signal)}
.op-quad-card.how .op-quad-label{color:var(--info)}
.op-quad-card.who .op-quad-label{color:var(--warn)}
.op-quad-card p{font-size:0.95rem;line-height:1.6;color:var(--ink);margin:0}
.op-actors-mini{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.5rem}
.op-actors-mini .actor-chip{font-family:var(--mono);font-size:0.65rem;padding:0.25rem 0.6rem;letter-spacing:0.05em;border:1px solid var(--ink);background:var(--paper);cursor:pointer;transition:all 0.2s}
.op-actors-mini .actor-chip:hover{background:var(--ink);color:var(--paper)}
.op-actors-mini .actor-chip.user{background:var(--signal-soft);border-color:var(--signal)}
.op-actors-mini .actor-chip.user:hover{background:var(--signal);color:var(--paper)}
.op-actors-mini .actor-chip.platform{background:var(--accent-soft);border-color:var(--accent)}
.op-actors-mini .actor-chip.platform:hover{background:var(--accent);color:var(--paper)}
.op-actors-mini .actor-chip.external{background:var(--info-soft);border-color:var(--info)}
.op-actors-mini .actor-chip.external:hover{background:var(--info);color:var(--paper)}

/* ENTITY/METHOD DETAIL */
.tech-detail-panel{background:var(--paper-shade);border:1px solid var(--ink);padding:2rem;margin-top:1rem}
.tech-detail-panel h3{font-family:var(--serif);font-size:1.4rem;margin-bottom:0.5rem}
.tech-detail-panel .file-path{font-family:var(--mono);font-size:0.78rem;color:var(--ink-mute);direction:ltr;text-align:right;margin-bottom:1rem}
.tech-detail-panel .tech-desc{font-size:0.95rem;line-height:1.6;margin-bottom:1rem}
.tech-detail-panel .signature{background:var(--ink);color:var(--paper);padding:0.8rem 1rem;font-family:var(--mono);font-size:0.78rem;direction:ltr;text-align:right;line-height:1.5;margin-bottom:1rem;overflow-x:auto}
.tech-detail-panel .fields{margin-top:1rem}
.fields-list{list-style:none;padding:0}
.fields-list li{font-family:var(--mono);font-size:0.78rem;padding:0.3rem 0;border-bottom:1px dashed var(--ink-mute);direction:ltr;text-align:right;color:var(--ink)}
.fields-list li:last-child{border-bottom:none}

/* GLOBAL GRAPH */
.graph-section{margin:2rem 0;padding:1.5rem;background:var(--paper-shade);border:1px solid var(--ink)}
.graph-title{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:1rem}
.graph-wrap{position:relative;width:100%;overflow-x:auto}
.graph-wrap svg{width:100%;height:auto;min-width:600px}

/* BACK BUTTON */
.back-btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:var(--ink);color:var(--paper);border:none;font-family:var(--mono);font-size:0.75rem;letter-spacing:0.1em;cursor:pointer;text-transform:uppercase;font-weight:500;margin-bottom:1.5rem;transition:all 0.2s}
.back-btn:hover{background:var(--accent)}

/* FOOTER */
footer{margin-top:3rem;padding-top:2rem;border-top:1px solid var(--ink-mute);font-family:var(--mono);font-size:0.7rem;color:var(--ink-mute);letter-spacing:0.1em;text-align:center;line-height:1.7}
footer strong{color:var(--ink)}
.footer-quote{margin-top:0.6rem;font-family:var(--serif);font-size:0.95rem;font-style:italic;color:var(--ink-soft);letter-spacing:0}

/* RESPONSIVE */
@media (max-width:900px){
  .tracks-grid{grid-template-columns:1fr}
  .actors-row{grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}
  .ops-grid{grid-template-columns:1fr}
  .related-grid{grid-template-columns:1fr}
  .op-quad{grid-template-columns:1fr}
  .system-emblem{padding:2rem 2rem}
  .system-emblem h2{font-size:1.8rem}
  .legend{flex-direction:column;align-items:flex-start;gap:0.6rem}
}

@media (max-width:600px){
  .app{padding:1.5rem 0.8rem}
  .viewport{padding:1.5rem 1rem}
  .nav-bar{font-size:0.7rem}
  .zoom-indicator{display:none}
  .actors-row{grid-template-columns:repeat(2,1fr)}
}

</style>
</head>
<body>
<div class="bsd-mark">בס״ד</div>

<div class="app">

  <header class="top">
    <div class="label">⟢ &nbsp; ארכיטקטורת מערכת · INTERACTIVE DRILL-DOWN &nbsp; ⟣</div>
    <h1>מלאך <span class="accent">הזכויות</span></h1>
    <p class="subtitle">תרשים מערכת אינטרקטיבי — לחץ על כל אלמנט כדי לחקור פנימה</p>
  </header>

  <div id="nav-container"></div>

  <div id="viewport" class="viewport"></div>

  <footer>
    <strong>מלאך הזכויות</strong> · ארכיטקטורה אינטראקטיבית · BizTechoff™<br>
    Hod HaSharon, IL · biztechoff.co.il
    <div class="footer-quote">— אני לא מתחנן לרשות. אני מפעיל את החוק עליה. —</div>
  </footer>

</div>

<script>
/**
 * ============================================================
 * Malach HaZchuyot - Architecture Data (Single Source of Truth)
 * ============================================================
 *
 * This file holds ALL the data for the architecture viz.
 * Edit here to add/modify actors, operations, or links.
 *
 * Schema:
 *   tracks       - Top-level workflows (Intake / Execution / Admin)
 *   actors       - All entities involved (citizens, lawyers, modules)
 *   operations   - Atomic actions (single source of truth, referenced from many actors)
 *   entities     - DB tables / data models (DigitalTwin, RightModule, ClaimCase)
 *   methods      - Key technical methods (referenced from operations)
 *   connections  - Global graph of who-talks-to-whom
 *
 * To add a new operation:
 *   1. Add entry to operations { id, ... }
 *   2. Reference its id from actor.relatedOps
 *
 * ============================================================
 */

const ARCH_DATA = {

  /* ================================================================
     TRACKS
     ================================================================ */
  tracks: {
    intake: {
      id: 'intake',
      number: '01',
      name: 'קליטת בקשה חדשה',
      nameEn: 'Intake Track',
      color: 't1',
      desc: 'מהרגע שהאזרח שולח הודעה ראשונה ב-WhatsApp ועד שהבקשה מוכנה להגשה. כל ה-Intake, חילוץ הנתונים, וההתאמה מול הקטלוג.',
      lanes: [
        { type: 'user', label: 'המשתמש', actors: ['citizen'] },
        { type: 'external', label: 'גורמים חיצוניים', actors: ['whatsapp', 'llm', 'idf'] },
        { type: 'platform', label: 'מודולים בפלטפורמה', actors: ['ai-intake', 'vision', 'twin', 'catalog', 'eligibility'] }
      ],
      flow: [
        { step: '01', title: 'קבלת הודעה ראשונה', desc: 'אזרח שולח הודעה ב-WhatsApp ("היי, אני מילואימניק..."). הודעה נכנסת דרך ספק ה-WhatsApp ל-AI Intake.', ops: ['op_send_msg', 'op_receive_webhook', 'op_load_session'] },
        { step: '02', title: 'שיחה אדפטיבית · חילוץ נתונים', desc: 'ה-AI שואל שאלות מותאמות הקשר. כל תשובה מעדכנת את ה-Twin. אם המשתמש שולח צילום — Vision Extractor מחלץ נתונים מובנים.', ops: ['op_pick_question', 'op_call_llm', 'op_classify_doc', 'op_extract_doc', 'op_update_twin'] },
        { step: '03', title: 'אימות מסמכים מול מקורות חיצוניים', desc: 'תעודת מילואים — אימות תוקף מול פורטל צה"ל. אם פגה — האזרח מקבל הסבר איך לחדש.', ops: ['op_validate_doc', 'op_check_idf', 'op_request_renewal'] },
        { step: '04', title: 'הרצת התאמה מול קטלוג הזכויות', desc: 'ה-Twin המעודכן רץ מול כל המודולים בקטלוג. ה-Eligibility Engine מחזיר רשימת זכויות תואמות + סכומים משוערים.', ops: ['op_load_modules', 'op_run_predicates', 'op_compute_amount'] },
        { step: '05', title: 'סיכום והצעה לאזרח', desc: 'תוצאות מסונתזות לשפה טבעית: "מצאתי 2 זכויות בסך משוער של ₪650 לשנה. להגיש?". האזרח לוחץ "מאשר".', ops: ['op_synthesize_response', 'op_user_confirm', 'op_handoff_to_agent'] }
      ]
    },

    execution: {
      id: 'execution',
      number: '02',
      name: 'תפעול הבקשה',
      nameEn: 'Execution Track',
      color: 't2',
      desc: 'מהרגע שהבקשה הוגשה ועד למימוש. כל המעקב, השעונים, השגות, ערעורים, ומנגנון אישור־שתיקה.',
      lanes: [
        { type: 'user', label: 'המשתמש', actors: ['citizen'] },
        { type: 'external', label: 'גורמים חיצוניים', actors: ['municipality', 'appeal-cmt', 'lawyer-advisor', 'signing'] },
        { type: 'platform', label: 'מודולים בפלטפורמה', actors: ['adapters', 'claim-agent', 'queue', 'mailbox'] }
      ],
      flow: [
        { step: '01', title: 'הגשה לרשות', desc: 'Claim Agent יוצר תיק חדש במצב SUBMITTED. בוחר את ה-Adapter המתאים (ת"א / ירושלים / חיפה) ומבצע הגשה לרשות.', ops: ['op_create_claim', 'op_choose_adapter', 'op_submit_to_authority'] },
        { step: '02', title: 'הפעלת שעון אישור־שתיקה', desc: 'BullMQ יוצר job עם delay של 60 יום. המצב משתנה ל-FOLLOWUP. אזרח מקבל הודעה: "הוגש. אעדכן אותך."', ops: ['op_start_silent_clock', 'op_notify_user_submitted'] },
        { step: '03', title: 'מעקב פעיל · 60 יום', desc: 'כל 14 יום: בדיקת סטטוס בפורטל הרשות (Polling). מקביל: Inbound Mailbox מאזין למייל מהרשות.', ops: ['op_poll_status', 'op_receive_authority_email', 'op_update_claim_state'] },
        { step: '04A', title: 'תרחיש: הרשות אישרה', desc: 'תגובה חיובית התקבלה. המצב משתנה ל-APPROVED. אזרח מקבל הודעה עם מספר אסמכתא וסכום ההנחה.', ops: ['op_mark_approved', 'op_notify_user_success'] },
        { step: '04B', title: 'תרחיש: הרשות שתקה', desc: 'אחרי 60 יום, ה-job מתעורר. נשלח מכתב רשמי לרשות לפי תקנה 3ו(ה). זכייה אוטומטית.', ops: ['op_silent_approval_triggered', 'op_send_silent_letter'] },
        { step: '04C', title: 'תרחיש: הרשות דחתה', desc: 'Claude מנתח את עילת הדחייה. אם ניתן ערר אוטונומי — מוכן כתב ערר, נשלח לעו"ד הליווי דרך שירות החתימה.', ops: ['op_analyze_rejection', 'op_prepare_appeal', 'op_lawyer_sign_appeal', 'op_submit_appeal'] }
      ]
    },

    admin: {
      id: 'admin',
      number: '03',
      name: 'תצוגת ניהול',
      nameEn: 'Admin Track',
      color: 't3',
      desc: 'פאנל ה-Admin שמציג את המצב הנוכחי בכל רגע נתון — תיקים, חתימות, סטטיסטיקות, ויד אנושית במקרה הצורך.',
      lanes: [
        { type: 'user', label: 'משתמשים פנימיים', actors: ['operator', 'founder', 'dpo'] },
        { type: 'external', label: 'גורמים חיצוניים', actors: ['senior-lawyer', 'privacy-authority'] },
        { type: 'platform', label: 'מודולים בפלטפורמה', actors: ['admin-panel', 'auth-mod', 'audit-log', 'dashboards'] }
      ],
      flow: [
        { step: '01', title: 'תצוגת תיקים פעילים', desc: 'טבלה של כל התיקים הפתוחים, מסוננים לפי סטטוס. כל תיק מציג שם אזרח (מוסתר חלקית), עיר, מודול, וזמן עד דדליין הבא.', ops: ['op_login_admin', 'op_view_active_cases', 'op_filter_cases'] },
        { step: '02', title: 'ניהול מודולי זכויות', desc: 'יצירה ועריכה של מודולים חדשים. שליחת מודול לחתימת עו"ד. קבלה אוטומטית של PDF חתום.', ops: ['op_create_module', 'op_edit_module', 'op_send_for_signature', 'op_receive_signed_pdf'] },
        { step: '03', title: 'תיקים שדורשים יד אנושית', desc: 'תור נפרד של תיקים במצב HUMAN_LAWYER_REQUIRED. Operator מקבל התראה ופותח את התיק.', ops: ['op_human_required_alert', 'op_assign_to_lawyer', 'op_pause_silent_clock'] },
        { step: '04', title: 'סטטיסטיקות וביצועים', desc: 'Dashboards חיים: תיקים פעילים, אחוז הצלחה לכל עיר, זמן ממוצע למימוש, סכום מצטבר שהושג ללקוחות.', ops: ['op_view_dashboards', 'op_export_report'] },
        { step: '05', title: 'פיקוח פרטיות וציות', desc: 'DPO ניגש ל-Audit Log ובודק רישומי גישה. במקרה של בקשת מחיקה — מבצע ע"י Admin Panel.', ops: ['op_register_data_archive', 'op_audit_access', 'op_user_deletion_request', 'op_periodic_dpo_report'] }
      ]
    }
  },

  /* ================================================================
     ACTORS - all 26 entities
     ================================================================ */
  actors: {

    /* === USER LANE === */
    citizen: {
      name: 'אזרח',
      nameEn: 'Citizen',
      tag: 'END USER',
      layer: 'user',
      desc: 'מבקש הזכות. מספק פרטים, מעלה מסמכים, ומאשר הגשה.',
      interfaces: ['WhatsApp בלבד', 'בעברית', '24/7'],
      relatedOps: ['op_send_msg', 'op_user_confirm', 'op_notify_user_submitted', 'op_notify_user_success', 'op_user_deletion_request'],
      relatedEntities: ['DigitalTwin', 'ClaimCase'],
      notes: 'ה-Twin שלו מתעדכן בכל שיחה. כל פעולה מתועדת ב-Audit Log. רשאי למחוק את כל נתוניו בכל זמן.'
    },

    operator: {
      name: 'Operator',
      nameEn: 'Junior Lawyer',
      tag: 'INTERNAL',
      layer: 'user',
      desc: 'משפטן זוטר שמנהל את המערכת מבפנים — יוצר מודולים, מטפל במקרים חריגים.',
      interfaces: ['Admin Panel (Angular SPA)', 'גישה אחרי 2FA', 'דומיין ניהול נפרד'],
      relatedOps: ['op_login_admin', 'op_view_active_cases', 'op_create_module', 'op_edit_module', 'op_send_for_signature', 'op_human_required_alert', 'op_assign_to_lawyer'],
      relatedEntities: ['RightModule', 'ClaimCase', 'AuditLog'],
      notes: 'בעל הסמכות הבכירה במערכת לאחר בעל המוצר. גישה מלאה לאודיט.'
    },

    founder: {
      name: 'בעל המוצר',
      nameEn: 'Product Owner',
      tag: 'INTERNAL',
      layer: 'user',
      desc: 'הבעלים העסקי של הפלטפורמה. רואה את התמונה הרחבה.',
      interfaces: ['Admin Panel · גישת בעלים', 'Dashboards מסונתזים בלבד'],
      relatedOps: ['op_view_dashboards', 'op_export_report'],
      relatedEntities: ['Dashboards'],
      notes: 'אין גישה לנתונים אישיים של אזרחים אלא דרך DPO. רואה רק נתונים אגרגטיביים.'
    },

    dpo: {
      name: 'DPO',
      nameEn: 'Data Protection Officer',
      tag: 'INTERNAL',
      layer: 'user',
      desc: 'אחראי על ציות לתקנות הפרטיות. עצמאי משאר ההנהלה.',
      interfaces: ['Admin Panel · גישת DPO', 'Audit Log מלא'],
      relatedOps: ['op_audit_access', 'op_user_deletion_request', 'op_periodic_dpo_report', 'op_register_data_archive'],
      relatedEntities: ['AuditLog', 'DigitalTwin'],
      notes: 'יכול להיות חיצוני (יועץ פרטיות במשרת חלקית) או פנימי. עלות: ₪2,000-4,000 לחודש.'
    },

    /* === EXTERNAL LANE === */
    whatsapp: {
      name: 'ספק WhatsApp',
      nameEn: 'WhatsApp Provider',
      tag: 'CHANNEL',
      layer: 'external',
      desc: 'ערוץ ההודעות בין האזרח למערכת. מספק webhook להודעות נכנסות ו-API להודעות יוצאות.',
      interfaces: ['Webhook על הודעות נכנסות', 'REST API להודעות יוצאות', 'תמיכה בקבצים: PDF, JPG, PNG'],
      relatedOps: ['op_send_msg', 'op_receive_webhook'],
      relatedEntities: [],
      notes: 'בשלב הראשון - ספק לא־רשמי. בעתיד מעבר ל-360dialog (BSP רשמי) לאחר אימות מול Meta.'
    },

    llm: {
      name: 'שירות LLM',
      nameEn: 'Claude API',
      tag: 'AI SERVICE',
      layer: 'external',
      desc: 'מנוע ה-AI שמבין שיחה, חולץ נתונים, ומסנתז תשובות. רץ במהלך שיחות ובניתוח דחיות.',
      interfaces: ['REST API', 'JSON Schema לחילוץ', 'תשלום לפי טוקנים'],
      relatedOps: ['op_call_llm', 'op_classify_doc', 'op_extract_doc', 'op_synthesize_response', 'op_analyze_rejection', 'op_prepare_appeal'],
      relatedEntities: [],
      notes: 'תמחור: $5 למיליון טוקנים בקלט, $20 למיליון בפלט. אינו שומר נתונים בין קריאות.'
    },

    idf: {
      name: 'פורטל המילואים',
      nameEn: 'IDF Miluim Portal',
      tag: 'SOURCE',
      layer: 'external',
      desc: 'מקור הסמכות לתעודות מילואים פעיל. אימות תוקף.',
      interfaces: ['ממשק הזדהות לאזרח', 'הוצאת תעודה דיגיטלית'],
      relatedOps: ['op_check_idf', 'op_request_renewal'],
      relatedEntities: [],
      notes: 'בשלב הראשון - האזרח מוציא תעודה ידנית ומעלה. בעתיד - אינטגרציה ישירה אם תיפתח.'
    },

    municipality: {
      name: 'רשות מקומית',
      nameEn: 'Municipality',
      tag: 'AUTHORITY',
      layer: 'external',
      desc: 'הגוף שאליו מוגשת ההשגה. ממנה מתקבלת תגובה (אישור / דחייה / בקשה למסמך).',
      interfaces: ['פורטל מקוון (ת"א)', 'מייל רשמי', 'דואר רשום'],
      relatedOps: ['op_submit_to_authority', 'op_poll_status', 'op_receive_authority_email', 'op_send_silent_letter'],
      relatedEntities: ['ClaimCase'],
      notes: 'אם לא ענתה תוך 60 יום - מנגנון אישור־שתיקה מופעל לפי תקנה 3ו(ה).'
    },

    'appeal-cmt': {
      name: 'ועדת ערר',
      nameEn: 'Appeal Committee',
      tag: 'AUTHORITY',
      layer: 'external',
      desc: 'ערכאה מנהלית מקבילה לעירייה. דנה בעררים נגד החלטות מנהל הארנונה.',
      interfaces: ['קבלת כתב ערר בכתב', 'דיון פורמלי', 'מתן החלטה'],
      relatedOps: ['op_submit_appeal'],
      relatedEntities: ['ClaimCase'],
      notes: 'אין מנגנון אישור־שתיקה לוועדה. החלטתה ניתנת לערעור בבית משפט מינהלי תוך 30 יום.'
    },

    'lawyer-advisor': {
      name: 'עו"ד הליווי',
      nameEn: 'Advisor Lawyer',
      tag: 'PROFESSIONAL',
      layer: 'external',
      desc: 'עו"ד שמלווה את הפלטפורמה ומאשר ניסוחי ערעורים.',
      interfaces: ['קבלת מסמכים דרך שירות חתימה', 'אישור או תיקון ניסוח'],
      relatedOps: ['op_lawyer_sign_appeal'],
      relatedEntities: ['ClaimCase'],
      notes: 'שכר טרחה: ₪150-300 לערר. לא נחשב לייצוג משפטי - רק אישור ניסוח.'
    },

    signing: {
      name: 'שירות חתימה',
      nameEn: 'eSign Service',
      tag: 'SERVICE',
      layer: 'external',
      desc: 'מנהל את תהליך החתימות הדיגיטליות לפי חוק חתימה אלקטרונית.',
      interfaces: ['REST API', 'webhook על השלמת חתימה', 'אחסון PDF חתומים'],
      relatedOps: ['op_send_for_signature', 'op_receive_signed_pdf', 'op_lawyer_sign_appeal'],
      relatedEntities: ['RightModule'],
      notes: 'תמחור לפי הספק שייבחר. אופציות: Zoho Sign, DocuSign, או חלופות ישראליות.'
    },

    'senior-lawyer': {
      name: 'עו"ד מוסמך',
      nameEn: 'Module Signer',
      tag: 'PROFESSIONAL',
      layer: 'external',
      desc: 'חותם דיגיטלית על מודולי זכויות לפני שהם הופכים LIVE.',
      interfaces: ['שירות חתימה דיגיטלית', 'מייל'],
      relatedOps: ['op_send_for_signature', 'op_receive_signed_pdf'],
      relatedEntities: ['RightModule'],
      notes: 'נדרשת חתימה חדשה לכל גרסה. שכר טרחה: ₪2,500-5,000 חד״פ למודול.'
    },

    'privacy-authority': {
      name: 'רשות הפרטיות',
      nameEn: 'Privacy Authority',
      tag: 'REGULATOR',
      layer: 'external',
      desc: 'רגולטור הפרטיות במשרד המשפטים. מפקח על מאגרי מידע.',
      interfaces: ['רישום מאגר מידע', 'דוחות תקופתיים', 'ביקורות'],
      relatedOps: ['op_register_data_archive', 'op_periodic_dpo_report'],
      relatedEntities: [],
      notes: 'רישום ראשוני וחידוש שנתי. מספר המאגר חייב להופיע במדיניות הפרטיות.'
    },

    /* === PLATFORM LANE === */
    'ai-intake': {
      name: 'AI Intake',
      nameEn: 'Conversation Layer',
      tag: 'MODULE 01',
      layer: 'platform',
      desc: 'הדלת הקדמית. מנהל שיחות, חולץ נתונים, ומחבר בין כל המודולים האחרים.',
      interfaces: ['Webhook listener', 'Session manager (Redis)', 'API ל-Claude', 'הזנת Twin'],
      relatedOps: ['op_receive_webhook', 'op_load_session', 'op_pick_question', 'op_call_llm', 'op_synthesize_response'],
      relatedEntities: ['ConversationSession', 'DigitalTwin'],
      relatedMethods: ['IntakeController.processMessage', 'IntakeController.nextQuestion'],
      notes: 'Session TTL: 24 שעות. אם משתמש חוזר אחרי 24 שעות - שיחה חדשה אבל Twin שמור.'
    },

    vision: {
      name: 'Vision Extractor',
      nameEn: 'Document Reader',
      tag: 'SUB-MODULE',
      layer: 'platform',
      desc: 'מחלץ נתונים מובנים מצילומי מסמכים (תעודות, חשבונות).',
      interfaces: ['קלט: תמונה (JPG/PNG/PDF)', 'פלט: JSON תואם schema'],
      relatedOps: ['op_classify_doc', 'op_extract_doc', 'op_validate_doc'],
      relatedEntities: ['DigitalTwin'],
      relatedMethods: ['VisionService.extractFromImage', 'VisionService.validateExtracted'],
      notes: 'משתמש ב-Claude Vision. במקרה של אי-וודאות - מבקש אישור מפורש מהאזרח.'
    },

    twin: {
      name: 'Digital Twin',
      nameEn: 'User Profile',
      tag: 'MODULE 02',
      layer: 'platform',
      desc: 'ייצוג דיגיטלי מובנה של האזרח. מתעדכן בכל שיחה ומשמש בסיס לכל החישובים.',
      interfaces: ['PostgreSQL Entity (Remult)', 'JSONB לשדות מקוננים', 'Event log'],
      relatedOps: ['op_update_twin'],
      relatedEntities: ['DigitalTwin'],
      relatedMethods: ['TwinController.updateField', 'TwinController.getTwin'],
      notes: 'מוצפן at-rest. גישה דרך JWT + RBAC. כל שינוי נשמר ב-event log.'
    },

    catalog: {
      name: 'Rights Catalog',
      nameEn: 'Signed Modules',
      tag: 'MODULE 03',
      layer: 'platform',
      desc: 'מאגר מודולי הזכויות החתומים. גרסאות מנוהלות עם semantic versioning.',
      interfaces: ['PostgreSQL + S3 (PDF חתום)', 'API לקריאה'],
      relatedOps: ['op_load_modules', 'op_create_module', 'op_edit_module', 'op_send_for_signature', 'op_receive_signed_pdf'],
      relatedEntities: ['RightModule', 'RightVersion'],
      relatedMethods: ['CatalogController.getModule', 'CatalogController.publishModule'],
      notes: 'בשלב הראשון - 2 מודולים: ארנונה למילואים, ארנונה לאזרחים ותיקים.'
    },

    eligibility: {
      name: 'Eligibility Engine',
      nameEn: 'Matching Logic',
      tag: 'MODULE 04',
      layer: 'platform',
      desc: 'מריץ Twin × Catalog ומחזיר רשימת זכויות זכאיות + סכומים.',
      interfaces: ['פונקציה pure (אין state)', 'קלט: Twin + Module', 'פלט: EvalResult'],
      relatedOps: ['op_run_predicates', 'op_compute_amount'],
      relatedEntities: ['DigitalTwin', 'RightModule'],
      relatedMethods: ['EligibilityController.evaluate', 'EligibilityController.classify'],
      notes: 'ביצועים: פחות מ-50ms לכל זכות. אין קריאות LLM - חישוב מקומי.'
    },

    adapters: {
      name: 'Authority Adapters',
      nameEn: '3 City Connectors',
      tag: 'MODULE 05',
      layer: 'platform',
      desc: 'חיבורים ייעודיים לכל רשות מקומית. כל אחד יודע את הפורמט והפרוטוקול הנכונים.',
      interfaces: ['Interface אחיד: submit / pollStatus / respondTo', '3 adapters: ת"א, ירושלים, חיפה'],
      relatedOps: ['op_choose_adapter', 'op_submit_to_authority', 'op_poll_status', 'op_send_silent_letter', 'op_submit_appeal'],
      relatedEntities: ['ClaimCase'],
      relatedMethods: ['AuthorityAdapter.submit', 'AuthorityAdapter.pollStatus'],
      notes: 'כל Adapter מודול נפרד שניתן לעדכן ללא נגיעה בליבה. ת"א משתמש ב-browser automation, ירושלים במייל.'
    },

    'claim-agent': {
      name: 'Claim Agent',
      nameEn: 'State Machine',
      tag: 'MODULE 06',
      layer: 'platform',
      desc: 'הסוכן הנודניק שמטפל בכל תיק לאורך זמן. מנהל מצבים ושעונים.',
      interfaces: ['BullMQ jobs', 'State Machine', 'קישור ל-Adapters ול-Twin'],
      relatedOps: ['op_handoff_to_agent', 'op_create_claim', 'op_start_silent_clock', 'op_update_claim_state', 'op_mark_approved', 'op_silent_approval_triggered', 'op_analyze_rejection', 'op_prepare_appeal', 'op_pause_silent_clock'],
      relatedEntities: ['ClaimCase', 'ClaimEvent'],
      relatedMethods: ['ClaimController.createClaim', 'ClaimController.transitionTo', 'ClaimController.onClaimEvent'],
      notes: '17 מצבים אפשריים בתוך State Machine. מצבי הערעור הוספו בגרסה האחרונה.'
    },

    queue: {
      name: 'Queue Manager',
      nameEn: 'BullMQ + Redis',
      tag: 'INFRA',
      layer: 'platform',
      desc: 'מנהל את כל ה-jobs המתוזמנים: שעון אישור־שתיקה, polling, התראות.',
      interfaces: ['Redis backend', 'BullMQ API', 'Persistent jobs'],
      relatedOps: ['op_start_silent_clock', 'op_silent_approval_triggered', 'op_poll_status'],
      relatedEntities: [],
      relatedMethods: ['SilentApprovalQueue.add', 'SilentApprovalQueue.process'],
      notes: 'תור נפרד לכל רשות כדי לא להציף ולקבל חסימה. Jobs שורדים נפילת שרת.'
    },

    mailbox: {
      name: 'Inbound Mailbox',
      nameEn: 'Reply Handler',
      tag: 'CHANNEL',
      layer: 'platform',
      desc: 'מאזין למיילים נכנסים מרשויות. כל תיק מקבל כתובת ייחודית.',
      interfaces: ['Webhook נכנס מ-Resend', 'pattern: claims+{id}@inbound.malach-hazchuyot.co.il', 'אימות חתימה דיגיטלית'],
      relatedOps: ['op_receive_authority_email'],
      relatedEntities: ['ClaimCase'],
      relatedMethods: ['MailboxHandler.onInboundMail', 'MailboxHandler.classifyEmail'],
      notes: 'משתמש ב-Resend (אותו ספק שמשמש את הפלטפורמה גם ל-outbound). דו־כיווני, ספק אחד, חשבונית אחת. תגובה תוך שניות מקבלת המייל.'
    },

    'admin-panel': {
      name: 'Admin Panel',
      nameEn: 'Angular SPA',
      tag: 'MODULE 07',
      layer: 'platform',
      desc: 'Angular SPA נפרד מהאתר הציבורי. גישה רק עם 2FA.',
      interfaces: ['Angular RTL', 'דומיין: admin.malach-hazchuyot.co.il', 'JWT + 2FA'],
      relatedOps: ['op_login_admin', 'op_view_active_cases', 'op_filter_cases', 'op_create_module', 'op_edit_module', 'op_human_required_alert', 'op_assign_to_lawyer', 'op_view_dashboards', 'op_export_report'],
      relatedEntities: ['User', 'AuditLog'],
      relatedMethods: [],
      notes: 'כל פעולה נרשמת ב-Audit Log עם user, timestamp, IP, ופעולה.'
    },

    'auth-mod': {
      name: 'Auth Module',
      nameEn: 'JWT + 2FA',
      tag: 'INFRA',
      layer: 'platform',
      desc: 'אבטחת גישה. מודול קיים שכבר נבנה ב-BizTechoff.',
      interfaces: ['HttpOnly cookies', 'Refresh tokens', '2FA via SMS/TOTP'],
      relatedOps: ['op_login_admin'],
      relatedEntities: ['User'],
      relatedMethods: ['AuthController.login', 'AuthController.refresh'],
      notes: 'מודול גנרי שמשמש את כל מערכות BizTechoff. תומך multi-tenant.'
    },

    'audit-log': {
      name: 'Audit Log',
      nameEn: 'Access Tracking',
      tag: 'INFRA',
      layer: 'platform',
      desc: 'תיעוד כל גישה לנתוני אזרחים. חובה לפי תקנות אבטחת מידע.',
      interfaces: ['PostgreSQL append-only table', 'אין מחיקה'],
      relatedOps: ['op_audit_access', 'op_periodic_dpo_report'],
      relatedEntities: ['AuditLog'],
      relatedMethods: ['AuditService.logAccess', 'AuditService.report'],
      notes: 'נתונים נשמרים לפי החוק (לפחות 24 חודשים). DPO רשאי לגשת.'
    },

    dashboards: {
      name: 'Dashboards',
      nameEn: 'Live Metrics',
      tag: 'VIEW',
      layer: 'platform',
      desc: 'הצגת KPIs בזמן אמת לבעל המוצר.',
      interfaces: ['Angular Dashboard', 'נתונים אגרגטיביים בלבד'],
      relatedOps: ['op_view_dashboards', 'op_export_report'],
      relatedEntities: [],
      relatedMethods: ['DashboardService.getKPIs'],
      notes: 'אין חשיפה של פרטי אזרחים ספציפיים אלא דרך הרשאות מתאימות.'
    }
  },

  /* ================================================================
     OPERATIONS - 53 atomic operations (single source of truth)
     ================================================================ */
  operations: {

    /* === Track 01 · Intake === */
    op_send_msg: {
      title: 'שליחת הודעה ב-WhatsApp',
      what: 'אזרח שולח הודעה ראשונה — "היי, שמעתי שמגיעה לי הנחה" — דרך וואטסאפ. זה הצעד הראשון של כל מסע. אין צורך באפליקציה, ברישום, או בכל פעולה מוקדמת.',
      when: 'ביוזמת האזרח, בכל שעה ובכל יום.',
      how: 'האזרח כותב הודעה למספר העסקי של מלאך הזכויות (כמו לכל איש קשר רגיל) ושולח. ההודעה מועברת מיידית מהשרתים של ספק WhatsApp לפלטפורמה דרך webhook.',
      who: ['citizen', 'whatsapp'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_receive_webhook: {
      title: 'קליטת הודעה במערכת',
      what: 'הפלטפורמה מקבלת את ההודעה מספק WhatsApp. בודקת אם זה משתמש ותיק או חדש, וטוענת את ה-Session המתאים.',
      when: 'תוך שניות מרגע ששלחה לאזרח.',
      how: 'ספק WhatsApp שולח HTTP POST ל-endpoint הציבורי שלנו. ה-AI Intake מקבל את ההודעה, מזהה את שולח ההודעה לפי מספר הטלפון, וטוען נתונים מ-Redis.',
      who: ['whatsapp', 'ai-intake'],
      relatedEntity: 'ConversationSession',
      relatedMethod: 'IntakeController.processMessage'
    },

    op_load_session: {
      title: 'טעינת היסטוריית שיחה',
      what: 'אם האזרח כבר התחיל שיחה קודמת — נטענים הנתונים שהספיק לתת. אם זה הראשון פעם — נוצרת רשומה חדשה.',
      when: 'עם כל הודעה שמתקבלת.',
      how: 'Redis מאחסן את ה-Session עם מפתח של מספר הטלפון. TTL: 24 שעות. אחרי 24 שעות שיחה חדשה מתחילה אבל ה-Twin כבר נשמר ב-PostgreSQL.',
      who: ['ai-intake'],
      relatedEntity: 'ConversationSession',
      relatedMethod: null
    },

    op_pick_question: {
      title: 'בחירת השאלה הבאה',
      what: 'ה-AI מחליט מה לשאול את האזרח עכשיו. הוא לא שואל רשימה קבועה — אלא מסתכל מה כבר יודעים על האזרח, ובוחר את השאלה הכי קריטית שחסרה.',
      when: 'אחרי כל תשובה של האזרח, לפני שמשיבים לו.',
      how: 'בודקים את ה-Twin הקיים — אילו שדות מאוכלסים? אילו לא? אם חסר "סטטוס מילואים" - שואלים על זה. אם הכל יש - לא שואלים יותר ועוברים להרצת התאמה.',
      who: ['ai-intake'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'IntakeController.nextQuestion'
    },

    op_call_llm: {
      title: 'קריאה לשירות AI',
      what: 'הפלטפורמה שולחת ל-Claude את כל היסטוריית השיחה ומבקשת ממנו את התשובה הבאה. לכן ה-AI נשמע טבעי - הוא רואה את כל מה שנאמר עד כה.',
      when: 'בכל שאלה לאזרח, בכל סינתזה של תשובה, בכל ניתוח של דחייה.',
      how: 'API call ל-Claude עם system prompt קבוע + היסטוריית השיחה + השדות החסרים ב-Twin. ה-LLM מחזיר טקסט טבעי בעברית או JSON מובנה לפי הצורך.',
      who: ['ai-intake', 'llm'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_classify_doc: {
      title: 'זיהוי סוג מסמך',
      what: 'כשאזרח שולח צילום, ה-AI קודם מזהה במה מדובר: תעודת מילואים? חשבון ארנונה? תעודת ת.ז? לפי הזיהוי - יודעים מה לחלץ.',
      when: 'מיד אחרי קבלת קובץ.',
      how: 'קריאה ראשונה ל-Claude Vision עם השאלה: "איזה סוג מסמך זה?". התשובה ממיינת ל-schema הנכון לחילוץ בשלב הבא.',
      who: ['vision', 'llm'],
      relatedEntity: null,
      relatedMethod: 'VisionService.extractFromImage'
    },

    op_extract_doc: {
      title: 'חילוץ נתונים מהמסמך',
      what: 'ברגע שיודעים שזו תעודת מילואים, ה-AI מחלץ ממנה את כל השדות: מספר ת.ז, שם, תאריך תוקף, מספר אישי. החילוץ הוא מובנה - JSON, לא טקסט חופשי.',
      when: 'מיד אחרי זיהוי סוג המסמך.',
      how: 'קריאה שנייה ל-Claude Vision עם schema מוגדר. ה-LLM מחזיר JSON תואם, וצוות ולידציה אוטומטי בודק שהשדות הגיוניים.',
      who: ['vision', 'llm'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'VisionService.extractFromImage'
    },

    op_validate_doc: {
      title: 'אימות הנתונים שחולצו',
      what: 'בודקים שהנתונים שחולצו תקינים: ת.ז עם ספרת ביקורת חוקית, תאריכים בפורמט נכון, שדות חובה לא ריקים. אם משהו חסר או חשוד - מבקשים מהאזרח לאשר או לצלם שוב.',
      when: 'מיד אחרי החילוץ.',
      how: 'בדיקות אוטומטיות (חוקיות ת.ז) + בדיקת תוקף (תאריך התעודה לא פג) + הצלבה עם נתונים שכבר קיימים ב-Twin.',
      who: ['vision'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'VisionService.validateExtracted'
    },

    op_check_idf: {
      title: 'אימות תוקף תעודת מילואים',
      what: 'אם האזרח שלח תעודת מילואים, בודקים שהיא בתוקף לפי הנתונים שעליה (אין צורך בחיבור ישיר לצה"ל - התעודה עצמה כוללת תאריך תפוגה).',
      when: 'בעת חילוץ הנתונים מהתעודה.',
      how: 'השוואת תאריך התפוגה שעל התעודה לתאריך היום. בעתיד - אם תיפתח אינטגרציה לפורטל המילואים, נוסיף בדיקה ישירה.',
      who: ['vision', 'idf'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_request_renewal: {
      title: 'בקשה לחידוש תעודה',
      what: 'אם תעודת המילואים פגה, ה-AI מסביר לאזרח איך להוציא אחת חדשה ב-2 דקות מהפורטל של צה"ל ושולח לו את הקישור הישיר.',
      when: 'כשמתגלה תעודה פגה.',
      how: 'הודעת WhatsApp עם קישור ישיר לפורטל המילואים + הסבר תמציתי איך להוציא תעודה.',
      who: ['ai-intake', 'citizen'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_update_twin: {
      title: 'עדכון פרופיל האזרח',
      what: 'כל פיסת מידע שנאספה — מהשיחה, מהמסמכים, מהאישורים — נשמרת בפרופיל הדיגיטלי של האזרח. הפרופיל הזה הוא הבסיס לכל החישובים הבאים.',
      when: 'בכל שלב של השיחה שבו מתקבל מידע חדש.',
      how: 'עדכון רשומה ב-PostgreSQL דרך Remult. כל שינוי נשמר גם ב-event log כדי שאפשר יהיה לחזור אחורה ולראות מה היה מצב הפרופיל בכל רגע נתון.',
      who: ['ai-intake', 'twin'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'TwinController.updateField'
    },

    op_load_modules: {
      title: 'טעינת קטלוג הזכויות',
      what: 'הפלטפורמה טוענת את כל מודולי הזכויות הפעילים מהקטלוג — נכון להיום זה ארנונה למילואים וארנונה לאזרחים ותיקים.',
      when: 'לפני הרצת בדיקת זכאות.',
      how: 'שליפה מ-PostgreSQL של כל המודולים במצב LIVE. כל מודול כולל את ה-Predicates (תנאי הזכאות) ואת נוסחת החישוב.',
      who: ['catalog', 'eligibility'],
      relatedEntity: 'RightModule',
      relatedMethod: 'CatalogController.getModule'
    },

    op_run_predicates: {
      title: 'הרצת תנאי זכאות',
      what: 'ה-Eligibility Engine לוקח את הפרופיל של האזרח ובודק לכל מודול זכות אם הוא עומד בכל התנאים. מילואימניק? כן. גר בתל אביב? כן. שוכר? כן. אם הכל עבר — הוא זכאי.',
      when: 'אחרי שהפרופיל מאוכלס מספיק.',
      how: 'פונקציה pure שמקבלת Twin + Module ומחזירה תוצאה: PASS / FAIL / MISSING. אם MISSING - מסומן בדיוק איזה שדה חסר.',
      who: ['eligibility'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'EligibilityController.evaluate'
    },

    op_compute_amount: {
      title: 'חישוב סכום ההנחה',
      what: 'אם האזרח זכאי, מחשבים כמה זה שווה לו בכסף. למשל: 5% הנחה על חשבון ארנונה של ₪9,000 = ₪450 לשנה.',
      when: 'אחרי שהזכאות אושרה.',
      how: 'נוסחת החישוב מוגדרת בתוך המודול. אם יש Policy Override לעיר ספציפית (ת"א נותנת 5%, אבל עיר אחרת רק 3%) - הוא מתחשב בזה.',
      who: ['eligibility'],
      relatedEntity: 'RightModule',
      relatedMethod: 'EligibilityController.evaluate'
    },

    op_synthesize_response: {
      title: 'סינתזת תשובה טבעית',
      what: 'במקום להציג לאזרח JSON של זכויות, ה-AI מנסח תשובה אנושית: "מצאתי שני זכויות שמגיעות לך בסך משוער של ₪650 לשנה. רוצה שאתחיל להגיש?".',
      when: 'אחרי הרצת בדיקת הזכאות.',
      how: 'קריאה ל-Claude עם רשימת הזכויות שנמצאו והסכומים. הבקשה: "ניסוח טבעי בעברית, ידידותי, עם הצעת המשך".',
      who: ['ai-intake', 'llm'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_user_confirm: {
      title: 'אישור האזרח להגיש',
      what: 'האזרח לוחץ על "מאשר" — או אומר "כן, תגיש". זה הרגע הקריטי שבו הוא מעניק לפלטפורמה ייפוי כוח להגיש בשמו.',
      when: 'אחרי שהאזרח רואה את ההצעה ומחליט.',
      how: 'WhatsApp Quick Reply Button או הודעת טקסט. האישור נשמר ב-DB עם timestamp, IP, וגרסת ההסכם שאישר.',
      who: ['citizen'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_handoff_to_agent: {
      title: 'העברה ל-Claim Agent',
      what: 'מהרגע שהאזרח אישר, ה-AI Intake מסיים את תפקידו ומעביר את הטיפול ל-Claim Agent — הסוכן שלוקח אחריות על התיק עד הסוף.',
      when: 'מיד אחרי האישור.',
      how: 'יצירת רשומה חדשה ב-ClaimCase, קישור ל-Twin ול-Module הרלוונטי. ה-Claim Agent מתחיל את ה-State Machine שלו.',
      who: ['ai-intake', 'claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'ClaimController.createClaim'
    },

    /* === Track 02 · Execution === */
    op_create_claim: {
      title: 'יצירת תיק חדש',
      what: 'נוצר "תיק" במערכת שמייצג את הבקשה הספציפית הזו של האזרח הזה לזכות הזו. כל השלבים מכאן ועד המימוש קשורים לתיק הזה.',
      when: 'מיד אחרי האישור של האזרח.',
      how: 'INSERT ל-ClaimCase עם userId, moduleId, מצב התחלתי DRAFT, ו-timestamp. כל שינוי בתיק יתועד מכאן והלאה.',
      who: ['claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'ClaimController.createClaim'
    },

    op_choose_adapter: {
      title: 'בחירת מסלול הגשה',
      what: 'לפי העיר של האזרח, הפלטפורמה בוחרת איך להגיש: בתל אביב — דרך הפורטל המקוון. בירושלים — במייל רשמי. בחיפה — כPDF חתום.',
      when: 'לפני ביצוע ההגשה.',
      how: 'lookup לפי municipalityId של האזרח. כל Adapter מודול נפרד שיודע את הפורמט והכללים של אותה עיר.',
      who: ['claim-agent', 'adapters'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'AuthorityAdapter.submit'
    },

    op_submit_to_authority: {
      title: 'הגשה בפועל לרשות',
      what: 'הבקשה הולכת לעירייה. בתל אביב — סוכן דפדפן ממלא טופס מקוון. בירושלים — נשלח מייל רשמי. בחיפה — מודפס PDF ונשלח. בכל המקרים, מקבלים מספר אסמכתא חזרה.',
      when: 'מיד אחרי בחירת ה-Adapter.',
      how: 'תל אביב: Playwright פותח דפדפן, נכנס לפורטל, ממלא ושולח. ירושלים: SMTP שולח מייל לאגף הגביה. חיפה: יצירת PDF + שליחה. בכל מקרה - שמירת מספר אסמכתא.',
      who: ['adapters', 'municipality'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'AuthorityAdapter.submit'
    },

    op_start_silent_clock: {
      title: 'הפעלת שעון אישור־שתיקה',
      what: 'מהרגע שההגשה נשלחה, יש לעירייה 60 יום לענות. אם היא שותקת — הזכות מתקבלת אוטומטית לפי החוק. הסוכן מפעיל שעון פנימי שיתעורר בדיוק ביום ה-60.',
      when: 'מיד אחרי ההגשה.',
      how: 'BullMQ יוצר job עם delay של 60 יום. ה-job ישכב במנוחה ב-Redis ויתעורר בדיוק בזמן הנכון. הוא ישרוד גם אם השרת ייפול וייקום.',
      who: ['claim-agent', 'queue'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'SilentApprovalQueue.add'
    },

    op_notify_user_submitted: {
      title: 'עדכון האזרח על ההגשה',
      what: 'האזרח מקבל הודעת WhatsApp: "הוגש לעירייה. מספר אסמכתא 12345. אעדכן אותך כשמשהו יקרה."',
      when: 'מיד אחרי ההגשה.',
      how: 'WhatsApp message פשוט. זו ההודעה האחרונה ל-60 יום אם הכל הולך חלק.',
      who: ['ai-intake', 'citizen'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_poll_status: {
      title: 'בדיקת סטטוס תקופתית',
      what: 'כל 14 יום, הפלטפורמה בודקת אם משהו השתנה בעירייה — האם נוסף תיעוד? האם הסטטוס השתנה? אם כן, מטפלים בהתאם.',
      when: 'אוטומטית, כל 14 יום מההגשה.',
      how: 'BullMQ scheduled job שרץ פעם ב-14 יום לכל תיק פעיל. ניגש לפורטל הרשות (אם קיים), משווה למצב הקודם, ואם יש שינוי - מפעיל חוקים מתאימים.',
      who: ['queue', 'adapters', 'municipality'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'AuthorityAdapter.pollStatus'
    },

    op_receive_authority_email: {
      title: 'קבלת תגובה מהרשות',
      what: 'כשהעירייה עונה — אישור, דחייה, בקשת מסמך — התשובה מגיעה במייל לכתובת ייחודית של התיק (claims+12345@inbound.malach-hazchuyot.co.il). יש תיבה אחת קבועה במערכת, וה-+12345 הוא תג ייחודי שמזהה את התיק.',
      when: 'בכל פעם שהעירייה עונה.',
      how: 'Resend (ספק המייל שלנו) מקבל את המייל ושולח webhook לפלטפורמה תוך שניות. ה-Mailbox מאמת חתימה דיגיטלית, מזהה את התיק לפי הכתובת, ומפעיל ניתוח של התוכן עם Claude.',
      who: ['municipality', 'mailbox'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'MailboxHandler.onInboundMail'
    },

    op_update_claim_state: {
      title: 'עדכון מצב התיק',
      what: 'אחרי שתשובת העירייה התקבלה, הסוכן מעדכן את מצב התיק: APPROVED / REJECTED / NEED_DOC. כל מעבר מצב מתועד.',
      when: 'אחרי קבלת תשובה מהרשות.',
      how: 'State Machine מורחב עם 17 מצבים. כל מעבר מבוצע דרך transitionTo() שמתעד גם את הסיבה והנתונים.',
      who: ['claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'ClaimController.transitionTo'
    },

    op_mark_approved: {
      title: 'סימון התיק כמאושר',
      what: 'העירייה אישרה את ההנחה. הסוכן רושם את התיק כ-APPROVED, שומר את מספר האסמכתא הסופי, ואת הסכום שיוחזר.',
      when: 'בקבלת תשובה חיובית.',
      how: 'UPDATE לרשומת ClaimCase, יצירת אירוע ב-ClaimEvent, וביטול ה-job של 60 יום (כי כבר אין בו צורך).',
      who: ['claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_notify_user_success: {
      title: 'הודעת זכייה לאזרח',
      what: 'האזרח מקבל הודעה: "מצוין! העירייה אישרה. ההנחה: ₪450. אסמכתא: 12345. מצורף האישור הרשמי."',
      when: 'מיד אחרי שהתיק סומן כמאושר.',
      how: 'WhatsApp message + מצורף ה-PDF של האישור הרשמי שהתקבל מהעירייה.',
      who: ['ai-intake', 'citizen'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_silent_approval_triggered: {
      title: 'הפעלת מנגנון אישור־שתיקה',
      what: 'עברו 60 יום והעירייה לא ענתה. השעון מתעורר. לפי תקנה 3ו(ה) — ההשגה התקבלה אוטומטית. הסוכן מתחיל לפעול.',
      when: 'בדיוק יום 60 אחרי ההגשה (או 90 אם ביקשו הארכה).',
      how: 'ה-BullMQ job מתעורר, בודק שהמצב עדיין FOLLOWUP (כלומר העירייה לא ענתה), ומשנה ל-SILENT_APPROVAL_TRIGGERED.',
      who: ['queue', 'claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'SilentApprovalQueue.process'
    },

    op_send_silent_letter: {
      title: 'שליחת מכתב זכייה לעירייה',
      what: 'נשלח מכתב רשמי לעירייה: "בהתאם לתקנה 3ו(ה), השגתנו מתאריך X נחשבת מתקבלת. אנא עדכנו את הרישומים." זו הצהרה משפטית, לא בקשה.',
      when: 'מיד אחרי הפעלת מנגנון אישור־שתיקה.',
      how: 'מכתב מתואר אוטומטית עם הפרטים מהתיק, נשלח במייל ובדואר רשום לעירייה. תוכן המכתב חתום על ידי עו"ד מראש כתבנית.',
      who: ['adapters', 'municipality'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_analyze_rejection: {
      title: 'ניתוח עילת דחייה',
      what: 'אם העירייה דחתה, ה-AI קורא את הנימוק שלה ומבין למה. האם יש חוסר במסמך? פרשנות שגויה של החוק? סיבה פרוצדורלית? לכל סוג סיבה - אסטרטגיה אחרת.',
      when: 'מיד אחרי קבלת דחייה.',
      how: 'Claude מסווג את הדחייה לאחת מ-5 קטגוריות. לפי הקטגוריה - בוחרים אסטרטגיית המשך: השלמה, ערר, פנייה לנציב, או העברה לעו"ד.',
      who: ['claim-agent', 'llm'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_prepare_appeal: {
      title: 'הכנת כתב ערר',
      what: 'אם הדחייה נראית לא צודקת, ה-AI מכין כתב ערר משפטי מובנה: עובדות, רקע משפטי, נימוקי הערר, ובקשה.',
      when: 'אחרי שהדחייה סווגה כמתאימה לערר אוטונומי.',
      how: 'Claude מקבל את כל המסמכים מהתיק + ניתוח הדחייה ומחזיר טיוטה של כתב ערר. הטיוטה תקבל בדיקה משפטית של עו"ד הליווי.',
      who: ['claim-agent', 'llm'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_lawyer_sign_appeal: {
      title: 'אישור עו"ד הליווי',
      what: 'עו"ד הליווי מקבל את הטיוטה, בודק שהניסוח משפטי תקין, מתקן אם צריך, וחותם דיגיטלית. שכר טרחה: ₪150-300 לערר.',
      when: 'אחרי שטיוטת הערר מוכנה.',
      how: 'הטיוטה נשלחת לעו"ד דרך שירות החתימה הדיגיטלית. הוא בודק, מתקן אם צריך, וחותם. ה-PDF החתום חוזר לפלטפורמה.',
      who: ['lawyer-advisor', 'signing'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_submit_appeal: {
      title: 'הגשת ערר לוועדת הערר',
      what: 'הערר החתום מוגש רשמית לוועדת הערר של העירייה. דדליין: 30 יום מקבלת הדחייה. אם פספסנו - איבדנו את הזכות לערר.',
      when: 'תוך 30 יום מקבלת הדחייה.',
      how: 'דרך Authority Adapter — בדואר רשום בארבעה עותקים, או דרך פורטל מקוון של העירייה אם קיים. אישור קבלה נשמר.',
      who: ['adapters', 'appeal-cmt'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    /* === Track 03 · Admin === */
    op_login_admin: {
      title: 'כניסה לפאנל הניהול',
      what: 'Operator נכנס לכתובת admin.malach-hazchuyot.co.il. מזין שם משתמש, סיסמה, וקוד 2FA. רק מי שעבר את שלושת השלבים יכול להמשיך.',
      when: 'בכל כניסה לפאנל.',
      how: 'JWT httpOnly cookies + refresh tokens + 2FA דרך SMS או TOTP (אפליקציה כמו Google Authenticator). כל ניסיון כניסה נרשם ב-Audit Log.',
      who: ['operator', 'auth-mod'],
      relatedEntity: 'User',
      relatedMethod: 'AuthController.login'
    },

    op_view_active_cases: {
      title: 'תצוגת תיקים פעילים',
      what: 'Operator רואה טבלה של כל התיקים הפתוחים. שם של האזרח (מוסתר חלקית כדי לשמור על פרטיות), עיר, סוג זכות, מצב, ומתי הדדליין הבא.',
      when: 'במסך הראשי של הפאנל.',
      how: 'שאילתה ל-PostgreSQL עם JOIN בין ClaimCase, DigitalTwin, ו-RightModule. סינון אוטומטי של תיקים שמטופלים על ידי Operator הנוכחי.',
      who: ['operator', 'admin-panel'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_filter_cases: {
      title: 'סינון תיקים לפי פרמטרים',
      what: 'Operator יכול לסנן: לפי עיר, לפי מצב (FOLLOWUP / REJECTED / APPEAL), לפי דחיפות (תיקים קרובים לדדליין), לפי סוג זכות.',
      when: 'בתוך מסך התיקים.',
      how: 'פילטרים בצד הקליינט (Angular) שמתורגמים ל-WHERE clauses ב-DB. כל סינון משאיר את ה-state ב-URL כדי שאפשר יהיה לחזור.',
      who: ['operator', 'admin-panel'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_create_module: {
      title: 'יצירת מודול זכות חדש',
      what: 'Operator (משפטן זוטר) יוצר מודול זכות חדש: כותב את שם הזכות, את התנאים (Predicates), את נוסחת החישוב, ואת המסמכים הנדרשים. המודול נשמר במצב DRAFT.',
      when: 'כשמתפרסם חוק חדש או כשמתחילים לתמוך בזכות חדשה.',
      how: 'טופס באפליקציה עם validation. ה-Operator יכול גם להזין טקסט משפטי וה-AI יציע טיוטה התחלתית של ה-Predicates.',
      who: ['operator', 'catalog'],
      relatedEntity: 'RightModule',
      relatedMethod: 'CatalogController.publishModule'
    },

    op_edit_module: {
      title: 'עריכת מודול קיים',
      what: 'אם החוק התעדכן (למשל שיעור ההנחה השתנה), Operator עורך את המודול. כל שינוי יוצר גרסה חדשה (semantic versioning) - הגרסה הישנה לא נמחקת.',
      when: 'בעדכוני חקיקה או תיקוני ניסוח.',
      how: 'יצירת RightModule חדש עם version מעודכן. הישן עובר ל-DEPRECATED. תיקים פתוחים תחת הישן ממשיכים בו עד סיום.',
      who: ['operator', 'catalog'],
      relatedEntity: 'RightModule',
      relatedMethod: null
    },

    op_send_for_signature: {
      title: 'שליחה לחתימת עו"ד',
      what: 'מודול חדש או מעודכן נשלח לעו"ד מוסמך לחתימה דיגיטלית. רק לאחר חתימה - המודול הופך LIVE ויכול לשמש בהגשות.',
      when: 'אחרי שהעריכה הושלמה ואושרה פנימית.',
      how: 'יצירת PDF עם כל פרטי המודול, שליחתו דרך שירות חתימה (Zoho Sign וכד') לעו"ד. ה-PDF החתום חוזר ב-webhook.',
      who: ['admin-panel', 'signing', 'senior-lawyer'],
      relatedEntity: 'RightModule',
      relatedMethod: null
    },

    op_receive_signed_pdf: {
      title: 'קבלת המודול החתום',
      what: 'אחרי שהעו"ד חתם, ה-PDF החתום מתקבל אוטומטית, נשמר ב-S3, והמודול עובר למצב LIVE. מהרגע הזה הוא יכול לשמש בבדיקות זכאות.',
      when: 'מיד אחרי שהעו"ד סיים לחתום.',
      how: 'webhook משירות החתימה. ה-PDF נשמר ב-S3 עם hash, חתימה מאומתת אוטומטית, וה-RightModule.status מתעדכן ל-LIVE.',
      who: ['signing', 'catalog'],
      relatedEntity: 'RightModule',
      relatedMethod: null
    },

    op_human_required_alert: {
      title: 'התראה על תיק שצריך עו"ד',
      what: 'יש תיקים שהמערכת לא יכולה לטפל בהם אוטונומית — למשל כשנדרש ערעור לבית משפט מינהלי. במקרה כזה, Operator מקבל התראה והתיק עובר לעו"ד אנושי.',
      when: 'כשתיק עובר למצב HUMAN_LAWYER_REQUIRED.',
      how: 'Notification בתוך ה-Admin Panel + מייל ל-Operator. רשימה ייעודית של תיקים שדורשים יד אנושית.',
      who: ['claim-agent', 'admin-panel', 'operator'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_assign_to_lawyer: {
      title: 'הקצאת התיק לעו"ד',
      what: 'Operator בוחר עו"ד מתאים מהרשימה ומעביר אליו את התיק עם כל ההיסטוריה. שעון אישור־שתיקה נעצר עד שהעו"ד מחזיר תשובה.',
      when: 'אחרי שהתיק סומן כדורש עו"ד.',
      how: 'יצירת חבילה (PDF + מסמכים נלווים) ושליחתה לעו"ד. רישום הפעולה ב-ClaimEvent. השעון של 60 יום מושהה.',
      who: ['operator', 'admin-panel'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_pause_silent_clock: {
      title: 'השהיית שעון אישור־שתיקה',
      what: 'כשתיק עובר לטיפול אנושי, השעון האוטומטי של 60 יום נעצר — כי זה כבר לא הליך אוטונומי. הוא יחזור לפעול רק אם התיק יחזור למסלול האוטומטי.',
      when: 'כשתיק עובר ל-HUMAN_LAWYER_REQUIRED.',
      how: 'BullMQ job מקבל פקודת pause. ניתן יהיה להפעיל אותו שוב אם הסטטוס משתנה.',
      who: ['claim-agent', 'queue'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_view_dashboards: {
      title: 'צפייה בסטטיסטיקות',
      what: 'בעל המוצר רואה בזמן אמת: כמה תיקים פעילים, אחוז ההצלחה לכל עיר, זמן ממוצע למימוש, סכום מצטבר שהושג ללקוחות. הכל אגרגטיבי - בלי פרטי אזרחים ספציפיים.',
      when: 'במסך ה-Dashboards של הפאנל.',
      how: 'שאילתות מסונתזות ל-DB עם GROUP BY. נתונים אישיים מסוכמים ולא מוצגים פרטנית. עדכון בכל רענון של המסך.',
      who: ['founder', 'dashboards'],
      relatedEntity: null,
      relatedMethod: 'DashboardService.getKPIs'
    },

    op_export_report: {
      title: 'יצוא דוח',
      what: 'בעל המוצר יכול להוריד דוח Excel או PDF של תקופה ספציפית - חודשי, רבעוני, שנתי. שימושי לחשבונאות ולמדידת ביצועים.',
      when: 'לפי בקשה.',
      how: 'בחירת תקופה ופורמט. השרת מייצר את הדוח, שומר זמנית ב-S3, ושולח לינק להורדה. כל יצוא נרשם ב-Audit Log.',
      who: ['founder', 'dashboards'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_register_data_archive: {
      title: 'רישום מאגר מידע',
      what: 'לפי החוק הישראלי, חובה לרשום את המאגר של נתוני האזרחים ברשם מאגרי המידע (במשרד המשפטים). זה תהליך פורמלי שמתבצע פעם ראשונה ומחודש שנתית.',
      when: 'לפני השקת המוצר לציבור, ובחידוש שנתי.',
      how: 'מילוי טופס מקוון באתר רשם מאגרי המידע: סוג מאגר, מטרת השימוש, סוגי נתונים, סטנדרטי אבטחה. תשלום אגרה. קבלת מספר רישום שיופיע במדיניות הפרטיות. הלקוח מבצע - BizTechoff מספקת את התיעוד הטכני.',
      who: ['dpo', 'privacy-authority'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_audit_access: {
      title: 'בדיקת רישומי גישה',
      what: 'DPO ניגש ל-Audit Log ובודק מי ניגש לאיזה מידע ומתי. אם יש דפוס חשוד (גישות חריגות, גישה למידע ללא סיבה), DPO חוקר.',
      when: 'תקופתית (חודשי/רבעוני) ועם כל אירוע חריג.',
      how: 'שאילתות ל-AuditLog table. סינון לפי משתמש, תאריך, סוג פעולה. ייצוא לדוח סוף תקופה.',
      who: ['dpo', 'audit-log'],
      relatedEntity: 'AuditLog',
      relatedMethod: 'AuditService.report'
    },

    op_user_deletion_request: {
      title: 'בקשת מחיקה מאזרח',
      what: 'אזרח רשאי לבקש שמערכת תמחק את כל הנתונים שלה עליו. הבקשה מתבצעת תוך 30 יום, ומתועדת — מי ביצע, מתי, מה נמחק.',
      when: 'בכל פעם שאזרח מבקש מחיקה.',
      how: 'בקשה דרך WhatsApp או מייל. DPO מאשר. Admin Panel מבצע מחיקה רכה (soft delete) של ה-Twin, מסמכים, ושיחות. אחרי 30 יום - מחיקה קשה. תיעוד הפעולה לעולם נשמר.',
      who: ['citizen', 'dpo', 'admin-panel'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: null
    },

    op_periodic_dpo_report: {
      title: 'דוח DPO תקופתי',
      what: 'אחת לתקופה (לרוב שנתי), DPO כותב דוח פנימי על מצב הציות לתקנות הפרטיות: כמה אירועים, איזה תיקונים בוצעו, מה הצפי לתקופה הבאה.',
      when: 'שנתי או לפי דרישה רגולטורית.',
      how: 'DPO ניגש ל-Audit Log, מסכם נתונים מצטברים, כותב הסבר על אירועים חריגים, ומציג להנהלה. במקרה של דליפת מידע - דיווח לרשות הפרטיות תוך 24 שעות.',
      who: ['dpo', 'privacy-authority'],
      relatedEntity: 'AuditLog',
      relatedMethod: null
    }
  },

  /* ================================================================
     ENTITIES - DB Tables / Data Models
     ================================================================ */
  entities: {
    DigitalTwin: {
      name: 'DigitalTwin',
      desc: 'הפרופיל הדיגיטלי של האזרח. כולל זהות, סטטוס, היסטוריה, ומסמכים.',
      fields: ['id', 'userId', 'identity (JSONB)', 'status (JSONB)', 'history (JSONB)', 'documents (JSONB[])', 'createdAt', 'updatedAt'],
      file: 'shared/entity/DigitalTwin.ts'
    },
    RightModule: {
      name: 'RightModule',
      desc: 'מודול זכות בודד. כולל את התנאים, החישוב, ופרטי ההגשה. חתום דיגיטלית.',
      fields: ['id', 'slug', 'version', 'status (DRAFT|LIVE|DEPRECATED)', 'predicates (JSONB)', 'calculation (JSONB)', 'signedAt', 'signedBy', 'signedPdfS3Key'],
      file: 'shared/entity/RightModule.ts'
    },
    RightVersion: {
      name: 'RightVersion',
      desc: 'גרסה היסטורית של מודול זכות. מאפשר חזרה אחורה לתיקים פעילים שנפתחו תחת גרסה ישנה.',
      fields: ['id', 'moduleId', 'version', 'effectiveFrom', 'effectiveUntil', 'snapshot (JSONB)'],
      file: 'shared/entity/RightVersion.ts'
    },
    ClaimCase: {
      name: 'ClaimCase',
      desc: 'תיק בודד של זכות שהוגשה. מנוהל על ידי State Machine.',
      fields: ['id', 'userId', 'twinId', 'moduleId', 'status', 'authorityId', 'submittedAt', 'silentClockEndsAt', 'rejectionReason', 'currentStage'],
      file: 'shared/entity/ClaimCase.ts'
    },
    ClaimEvent: {
      name: 'ClaimEvent',
      desc: 'כל אירוע שקרה בתיק ספציפי - מעבר מצב, התכתבות, מסמך שהתקבל.',
      fields: ['id', 'claimId', 'eventType', 'fromStatus', 'toStatus', 'data (JSONB)', 'createdAt'],
      file: 'shared/entity/ClaimEvent.ts'
    },
    ConversationSession: {
      name: 'ConversationSession',
      desc: 'מצב שיחה אקטיבית באמצעות AI Intake. נשמר ב-Redis עם TTL.',
      fields: ['userId', 'phoneNumber', 'history[]', 'currentField', 'startedAt', 'lastMessageAt'],
      file: 'shared/entity/ConversationSession.ts'
    },
    AuditLog: {
      name: 'AuditLog',
      desc: 'יומן גישה לכל פעולה במערכת. append-only.',
      fields: ['id', 'userId', 'action', 'targetType', 'targetId', 'ipAddress', 'userAgent', 'timestamp'],
      file: 'shared/entity/AuditLog.ts'
    },
    User: {
      name: 'User',
      desc: 'משתמש פנימי - Operator, founder, DPO, או lawyer. לא אזרחים.',
      fields: ['id', 'email', 'role (operator|founder|dpo|lawyer)', 'twoFactorSecret', 'createdAt'],
      file: 'shared/entity/User.ts'
    }
  },

  /* ================================================================
     METHODS - Key technical methods
     ================================================================ */
  methods: {
    'IntakeController.processMessage': {
      name: 'IntakeController.processMessage',
      signature: 'async processMessage(userId: string, message: Message): Promise<Response>',
      desc: 'נקודת כניסה לכל הודעת WhatsApp. מטפלת בטעינת session, עיבוד ההודעה, וכל ה-flow של הקליטה.',
      file: 'shared/controller/IntakeController.ts'
    },
    'IntakeController.nextQuestion': {
      name: 'IntakeController.nextQuestion',
      signature: 'async nextQuestion(twin: DigitalTwin): Promise<NextQ | null>',
      desc: 'בוחרת איזו שאלה לשאול את האזרח לפי שדות חסרים ב-Twin.',
      file: 'shared/controller/IntakeController.ts'
    },
    'TwinController.updateField': {
      name: 'TwinController.updateField',
      signature: 'async updateField(userId: string, path: string, value: any): Promise<DigitalTwin>',
      desc: 'מעדכנת שדה ספציפי בפרופיל. כל שינוי נשמר ב-event log.',
      file: 'shared/controller/TwinController.ts'
    },
    'TwinController.getTwin': {
      name: 'TwinController.getTwin',
      signature: 'async getTwin(userId: string): Promise<DigitalTwin>',
      desc: 'מחזירה את הפרופיל המלא של אזרח.',
      file: 'shared/controller/TwinController.ts'
    },
    'CatalogController.getModule': {
      name: 'CatalogController.getModule',
      signature: 'async getModule(slug: string, version?: string): Promise<RightModule>',
      desc: 'מחזירה מודול זכות חי לפי slug. אם version מצוין - מחזירה את הגרסה הספציפית.',
      file: 'shared/controller/CatalogController.ts'
    },
    'CatalogController.publishModule': {
      name: 'CatalogController.publishModule',
      signature: 'async publishModule(module: RightModule): Promise<void>',
      desc: 'מפרסמת מודול חדש - מפעילה zerimat חתימה ובסוף מעבירה ל-LIVE.',
      file: 'shared/controller/CatalogController.ts'
    },
    'EligibilityController.evaluate': {
      name: 'EligibilityController.evaluate',
      signature: 'evaluate(twin: DigitalTwin, module: RightModule): EvalResult',
      desc: 'הפונקציה המרכזית של בדיקת זכאות. מריצה Predicates ומחזירה תוצאה.',
      file: 'shared/controller/EligibilityController.ts'
    },
    'EligibilityController.classify': {
      name: 'EligibilityController.classify',
      signature: 'classify(results: PredicateResult[]): EligibilityResult',
      desc: 'מסווגת את התוצאות ל-ELIGIBLE / NOT_ELIGIBLE / INFO_NEEDED.',
      file: 'shared/controller/EligibilityController.ts'
    },
    'AuthorityAdapter.submit': {
      name: 'AuthorityAdapter.submit',
      signature: 'async submit(claim: ClaimCase, twin: DigitalTwin): Promise<SubmissionResult>',
      desc: 'מבצעת הגשה לרשות הספציפית. כל Adapter מממש את הממשק הזה אחרת.',
      file: 'shared/services/AuthorityAdapter.ts'
    },
    'AuthorityAdapter.pollStatus': {
      name: 'AuthorityAdapter.pollStatus',
      signature: 'async pollStatus(referenceId: string): Promise<ClaimStatus>',
      desc: 'בודקת סטטוס תיק בפורטל הרשות.',
      file: 'shared/services/AuthorityAdapter.ts'
    },
    'ClaimController.createClaim': {
      name: 'ClaimController.createClaim',
      signature: 'async createClaim(userId: string, moduleId: string): Promise<ClaimCase>',
      desc: 'יוצרת תיק חדש ומפעילה את ה-State Machine.',
      file: 'shared/controller/ClaimController.ts'
    },
    'ClaimController.transitionTo': {
      name: 'ClaimController.transitionTo',
      signature: 'async transitionTo(claimId: string, newStatus: ClaimStage, data?: any): Promise<void>',
      desc: 'מעבירה תיק למצב חדש ומתעדת אירוע ב-ClaimEvent.',
      file: 'shared/controller/ClaimController.ts'
    },
    'ClaimController.onClaimEvent': {
      name: 'ClaimController.onClaimEvent',
      signature: 'async onClaimEvent(claimId: string, event: ClaimEvent): Promise<void>',
      desc: 'מטפלת באירועים שמגיעים מבחוץ - תגובת רשות, אישור־שתיקה, וכו.',
      file: 'shared/controller/ClaimController.ts'
    },
    'SilentApprovalQueue.add': {
      name: 'SilentApprovalQueue.add',
      signature: 'async add(claimId: string, delayDays: number): Promise<Job>',
      desc: 'יוצרת job של אישור־שתיקה עם delay. ה-job יתעורר בדיוק ביום ה-X.',
      file: 'server/queues/SilentApprovalQueue.ts'
    },
    'SilentApprovalQueue.process': {
      name: 'SilentApprovalQueue.process',
      signature: 'process(job: Job): Promise<void>',
      desc: 'מטפלת ב-job שהתעורר. בודקת אם הרשות ענתה - אם לא, מפעילה את המנגנון.',
      file: 'server/queues/SilentApprovalQueue.ts'
    },
    'MailboxHandler.onInboundMail': {
      name: 'MailboxHandler.onInboundMail',
      signature: 'async onInboundMail(email: InboundEmail): Promise<void>',
      desc: 'מטפלת במייל שהתקבל מרשות. מזהה את התיק ומעבירה ל-Claim Agent.',
      file: 'server/handlers/MailboxHandler.ts'
    },
    'MailboxHandler.classifyEmail': {
      name: 'MailboxHandler.classifyEmail',
      signature: 'async classifyEmail(body: string): Promise<EmailIntent>',
      desc: 'משתמשת ב-Claude כדי לסווג מייל - אישור / דחייה / בקשת מסמך.',
      file: 'server/handlers/MailboxHandler.ts'
    },
    'AuthController.login': {
      name: 'AuthController.login',
      signature: 'async login(email: string, password: string, otp: string): Promise<AuthResponse>',
      desc: 'אימות שלוש שכבות - סיסמה + OTP + JWT.',
      file: 'shared/controller/AuthController.ts'
    },
    'AuthController.refresh': {
      name: 'AuthController.refresh',
      signature: 'async refresh(refreshToken: string): Promise<AuthResponse>',
      desc: 'rotation של tokens - מנפיקה JWT חדש.',
      file: 'shared/controller/AuthController.ts'
    },
    'VisionService.extractFromImage': {
      name: 'VisionService.extractFromImage',
      signature: 'async extractFromImage(imageS3Key: string, schema: Schema): Promise<ExtractedData>',
      desc: 'מחלצת נתונים מובנים מתמונה לפי schema.',
      file: 'shared/services/VisionService.ts'
    },
    'VisionService.validateExtracted': {
      name: 'VisionService.validateExtracted',
      signature: 'validateExtracted(data: ExtractedData): ValidationResult',
      desc: 'בודקת תקינות הנתונים שחולצו (ספרת ביקורת ת.ז וכו).',
      file: 'shared/services/VisionService.ts'
    },
    'AuditService.logAccess': {
      name: 'AuditService.logAccess',
      signature: 'async logAccess(userId: string, action: string, target: string): Promise<void>',
      desc: 'רושמת גישה ב-Audit Log. נקראת אוטומטית על ידי middleware.',
      file: 'shared/services/AuditService.ts'
    },
    'AuditService.report': {
      name: 'AuditService.report',
      signature: 'async report(from: Date, to: Date): Promise<AuditReport>',
      desc: 'מייצרת דוח גישות לתקופה. רק DPO ו-founder יכולים להריץ.',
      file: 'shared/services/AuditService.ts'
    },
    'DashboardService.getKPIs': {
      name: 'DashboardService.getKPIs',
      signature: 'async getKPIs(period: Period): Promise<KPIs>',
      desc: 'מחשבת מטריקות לתקופה - תיקים פעילים, אחוז הצלחה, סכומים.',
      file: 'shared/services/DashboardService.ts'
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.ARCH_DATA = ARCH_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARCH_DATA;
}

</script>
<script>
// בס"ד
/* ============================================================
   Malach HaZchuyot - Architecture Viz Logic
   ============================================================ */

(function() {
  'use strict';

  const data = window.ARCH_DATA;

  // ============================================================
  // State
  // ============================================================
  const state = {
    level: 'root',           // root | track | actor | operation | tech
    trackId: null,
    actorId: null,
    operationId: null,
    techType: null,          // entity | method
    techId: null,
    history: []              // for back navigation
  };

  // ============================================================
  // Helpers
  // ============================================================
  function el(html) {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
  }

  function pushHistory() {
    state.history.push({ ...state, history: undefined });
  }

  function goBack() {
    if (state.history.length === 0) {
      goRoot();
      return;
    }
    const prev = state.history.pop();
    Object.assign(state, prev);
    render();
  }

  function findActorTrack(actorId) {
    for (const trackId in data.tracks) {
      const track = data.tracks[trackId];
      for (const lane of track.lanes) {
        if (lane.actors.includes(actorId)) return trackId;
      }
    }
    return null;
  }

  // ============================================================
  // Navigation actions
  // ============================================================
  function goRoot() {
    state.history = [];
    state.level = 'root';
    state.trackId = null;
    state.actorId = null;
    state.operationId = null;
    render();
  }

  function goTrack(trackId) {
    pushHistory();
    state.level = 'track';
    state.trackId = trackId;
    state.actorId = null;
    state.operationId = null;
    render();
  }

  function goActor(actorId) {
    pushHistory();
    state.level = 'actor';
    state.actorId = actorId;
    if (!state.trackId) state.trackId = findActorTrack(actorId);
    render();
  }

  function goOperation(opId) {
    pushHistory();
    state.level = 'operation';
    state.operationId = opId;
    render();
  }

  function goTech(type, id) {
    pushHistory();
    state.level = 'tech';
    state.techType = type;
    state.techId = id;
    render();
  }

  // ============================================================
  // Render: Breadcrumb
  // ============================================================
  function renderBreadcrumb() {
    const crumbs = ['<button class="nav-crumb' + (state.level === 'root' ? ' active' : '') + '" onclick="window.ArchApp.goRoot()">⌂ מלאך הזכויות</button>'];

    if (state.trackId && (state.level === 'track' || state.level === 'actor' || state.level === 'operation' || state.level === 'tech')) {
      const track = data.tracks[state.trackId];
      crumbs.push('<span class="nav-sep">›</span>');
      crumbs.push('<button class="nav-crumb' + (state.level === 'track' ? ' active' : '') + '" onclick="window.ArchApp.goTrack(\'' + state.trackId + '\')">' + track.name + '</button>');
    }

    if (state.actorId && (state.level === 'actor' || state.level === 'operation' || state.level === 'tech')) {
      const actor = data.actors[state.actorId];
      crumbs.push('<span class="nav-sep">›</span>');
      crumbs.push('<button class="nav-crumb' + (state.level === 'actor' ? ' active' : '') + '" onclick="window.ArchApp.goActor(\'' + state.actorId + '\')">' + actor.name + '</button>');
    }

    if (state.operationId && (state.level === 'operation' || state.level === 'tech')) {
      const op = data.operations[state.operationId];
      crumbs.push('<span class="nav-sep">›</span>');
      crumbs.push('<button class="nav-crumb' + (state.level === 'operation' ? ' active' : '') + '" onclick="window.ArchApp.goOperation(\'' + state.operationId + '\')">' + op.title + '</button>');
    }

    if (state.level === 'tech') {
      const techData = state.techType === 'entity' ? data.entities[state.techId] : data.methods[state.techId];
      if (techData) {
        crumbs.push('<span class="nav-sep">›</span>');
        crumbs.push('<button class="nav-crumb active">' + techData.name + '</button>');
      }
    }

    // Zoom indicator
    const zoomLevels = { root: 1, track: 2, actor: 3, operation: 4, tech: 5 };
    const currentZoom = zoomLevels[state.level];
    const zoomLabels = { 1: 'ZOOM-OUT', 2: 'TRACK VIEW', 3: 'ACTOR VIEW', 4: 'OPERATION VIEW', 5: 'TECH DETAIL' };

    let zoomBars = '';
    for (let i = 1; i <= 5; i++) {
      zoomBars += '<span class="zoom-bar' + (i <= currentZoom ? ' active' : '') + '"></span>';
    }

    return '<div class="nav-bar">' + crumbs.join('') +
      '<div class="zoom-indicator">' +
      '<span>' + zoomLabels[currentZoom] + '</span>' +
      '<span class="zoom-bars">' + zoomBars + '</span>' +
      '</div></div>';
  }

  // ============================================================
  // Render: ROOT level
  // ============================================================
  function renderRoot() {
    const tracks = data.tracks;
    let html = '<div class="level active"><div class="system-root">';

    html += '<div class="system-emblem">';
    html += '<div class="wing">⟢ SYSTEM ⟣</div>';
    html += '<h2>מלאך <span class="accent">הזכויות</span></h2>';
    html += '</div>';

    html += '<p class="system-tagline">פלטפורמה אזרחית 24/7 לאיתור והגשה אוטונומית של זכויות בארנונה — מבוססת על שלושה מסלולי ליבה</p>';

    html += '<div class="tracks-grid">';
    for (const trackId in tracks) {
      const t = tracks[trackId];
      html += '<button class="track-card ' + t.color + '" onclick="window.ArchApp.goTrack(\'' + trackId + '\')">';
      html += '<div class="num">TRACK · ' + t.number + '</div>';
      html += '<h3>' + t.name + '</h3>';
      html += '<div class="desc">' + t.desc + '</div>';
      html += '<div class="arrow-cta"><span>חקור פנימה</span><span>←</span></div>';
      html += '</button>';
    }
    html += '</div>';

    html += '<div class="legend">';
    html += '<div class="legend-item"><div class="legend-swatch user"></div><span>משתמש קצה</span></div>';
    html += '<div class="legend-item"><div class="legend-swatch platform"></div><span>מודולים בפלטפורמה</span></div>';
    html += '<div class="legend-item"><div class="legend-swatch external"></div><span>גורמים חיצוניים</span></div>';
    html += '</div>';

    html += '</div></div>';
    return html;
  }

  // ============================================================
  // Render: TRACK level
  // ============================================================
  function renderTrack() {
    const track = data.tracks[state.trackId];
    let html = '<div class="level active">';

    html += '<button class="back-btn" onclick="window.ArchApp.goBack()">← חזרה</button>';

    html += '<div class="track-header">';
    html += '<h2>מסלול ' + track.number + ' — ' + track.name + '<small>' + track.nameEn + '</small></h2>';
    html += '<span class="track-badge ' + track.color + '">TRACK ' + track.number + '</span>';
    html += '</div>';

    html += '<p class="track-intro">' + track.desc + '</p>';

    // Lanes with actors
    for (const lane of track.lanes) {
      html += '<div class="lane-wrap">';
      html += '<div class="lane-label ' + lane.type + '">' + lane.label + '</div>';
      html += '<div class="actors-row">';
      for (const actorId of lane.actors) {
        const actor = data.actors[actorId];
        if (!actor) continue;
        html += '<button class="actor ' + actor.layer + '" onclick="window.ArchApp.goActor(\'' + actorId + '\')">';
        html += '<div class="role-tag">' + actor.tag + '</div>';
        html += '<h4>' + actor.name + '</h4>';
        html += '<div class="actor-en">' + actor.nameEn + '</div>';
        html += '</button>';
      }
      html += '</div></div>';
    }

    // Flow stages
    html += '<div class="flow-section">';
    html += '<h3 class="flow-title">זרימת התהליך</h3>';
    for (const stage of track.flow) {
      html += '<div class="flow-stage ' + track.color + '">';
      html += '<h3><span class="step-num">' + stage.step + '</span>' + stage.title + '</h3>';
      html += '<p>' + stage.desc + '</p>';
      if (stage.ops && stage.ops.length) {
        html += '<div class="ops-mini">';
        for (const opId of stage.ops) {
          const op = data.operations[opId];
          if (!op) continue;
          html += '<button class="op-chip" onclick="window.ArchApp.goOperation(\'' + opId + '\')">' + op.title + '</button>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  // ============================================================
  // Render: ACTOR level
  // ============================================================
  function renderActor() {
    const actor = data.actors[state.actorId];
    if (!actor) return renderRoot();

    let html = '<div class="level active">';
    html += '<button class="back-btn" onclick="window.ArchApp.goBack()">← חזרה</button>';

    html += '<div class="detail-panel">';

    // Header
    html += '<div class="detail-header ' + actor.layer + '">';
    html += '<div class="scope-tag">' + actor.tag + '</div>';
    html += '<h2>' + actor.name + '</h2>';
    html += '<div class="name-en">' + actor.nameEn + '</div>';
    html += '<div class="description">' + actor.desc + '</div>';
    html += '</div>';

    // Interfaces
    if (actor.interfaces && actor.interfaces.length) {
      html += '<div class="detail-section">';
      html += '<div class="detail-section-title">ממשקים</div>';
      html += '<div class="iface-list"><ul>';
      for (const iface of actor.interfaces) {
        html += '<li>' + iface + '</li>';
      }
      html += '</ul></div></div>';
    }

    // Operations
    if (actor.relatedOps && actor.relatedOps.length) {
      html += '<div class="ops-section">';
      html += '<div class="detail-section-title">פעולות שמבצע השחקן</div>';
      html += '<div class="ops-grid">';
      for (const opId of actor.relatedOps) {
        const op = data.operations[opId];
        if (!op) continue;
        html += '<button class="op-card" onclick="window.ArchApp.goOperation(\'' + opId + '\')">';
        html += '<span class="op-arrow">←</span>';
        html += '<div class="op-mark">OPERATION</div>';
        html += '<h4>' + op.title + '</h4>';
        html += '</button>';
      }
      html += '</div></div>';
    }

    // Related entities + methods
    const hasEntities = actor.relatedEntities && actor.relatedEntities.length;
    const hasMethods = actor.relatedMethods && actor.relatedMethods.length;
    if (hasEntities || hasMethods) {
      html += '<div class="detail-section">';
      html += '<div class="detail-section-title">קישורים טכניים</div>';
      html += '<div class="related-grid">';

      if (hasEntities) {
        for (const entId of actor.relatedEntities) {
          const ent = data.entities[entId];
          if (!ent) continue;
          html += '<button class="related-card" onclick="window.ArchApp.goTech(\'entity\',\'' + entId + '\')">';
          html += '<div class="key">ENTITY</div>';
          html += '<div class="val">' + ent.name + '</div>';
          html += '<div class="file">' + ent.file + '</div>';
          html += '</button>';
        }
      }

      if (hasMethods) {
        for (const methId of actor.relatedMethods) {
          const meth = data.methods[methId];
          if (!meth) continue;
          html += '<button class="related-card" onclick="window.ArchApp.goTech(\'method\',\'' + methId + '\')">';
          html += '<div class="key">METHOD</div>';
          html += '<div class="val">' + meth.name + '</div>';
          html += '<div class="file">' + meth.file + '</div>';
          html += '</button>';
        }
      }

      html += '</div></div>';
    }

    // Notes
    if (actor.notes) {
      html += '<div class="detail-section">';
      html += '<div class="detail-section-title">הערה</div>';
      html += '<div class="notes-block">' + actor.notes + '</div>';
      html += '</div>';
    }

    html += '</div></div>';
    return html;
  }

  // ============================================================
  // Render: OPERATION level
  // ============================================================
  function renderOperation() {
    const op = data.operations[state.operationId];
    if (!op) return renderRoot();

    let html = '<div class="level active">';
    html += '<button class="back-btn" onclick="window.ArchApp.goBack()">← חזרה</button>';

    html += '<div class="op-detail-panel">';

    // Header
    html += '<div class="op-detail-header">';
    html += '<div class="scope-tag">OPERATION · פעולה אטומית</div>';
    html += '<h2>' + op.title + '</h2>';
    html += '</div>';

    // The 4 quadrants: WHAT / WHEN / HOW / WHO
    html += '<div class="op-quad">';

    html += '<div class="op-quad-card what">';
    html += '<div class="op-quad-label">מה זה</div>';
    html += '<p>' + op.what + '</p>';
    html += '</div>';

    html += '<div class="op-quad-card when">';
    html += '<div class="op-quad-label">מתי קורה</div>';
    html += '<p>' + op.when + '</p>';
    html += '</div>';

    html += '<div class="op-quad-card how">';
    html += '<div class="op-quad-label">איך מתבצע</div>';
    html += '<p>' + op.how + '</p>';
    html += '</div>';

    html += '<div class="op-quad-card who">';
    html += '<div class="op-quad-label">מי מעורב</div>';
    html += '<div class="op-actors-mini">';
    for (const actorId of (op.who || [])) {
      const actor = data.actors[actorId];
      if (!actor) continue;
      html += '<button class="actor-chip ' + actor.layer + '" onclick="window.ArchApp.goActor(\'' + actorId + '\')">' + actor.name + '</button>';
    }
    html += '</div></div>';

    html += '</div>';

    // Related entity / method
    if (op.relatedEntity || op.relatedMethod) {
      html += '<div class="detail-section">';
      html += '<div class="detail-section-title">קישורים טכניים</div>';
      html += '<div class="related-grid">';

      if (op.relatedEntity) {
        const ent = data.entities[op.relatedEntity];
        if (ent) {
          html += '<button class="related-card" onclick="window.ArchApp.goTech(\'entity\',\'' + op.relatedEntity + '\')">';
          html += '<div class="key">ENTITY</div>';
          html += '<div class="val">' + ent.name + '</div>';
          html += '<div class="file">' + ent.file + '</div>';
          html += '</button>';
        }
      }

      if (op.relatedMethod) {
        const meth = data.methods[op.relatedMethod];
        if (meth) {
          html += '<button class="related-card" onclick="window.ArchApp.goTech(\'method\',\'' + op.relatedMethod + '\')">';
          html += '<div class="key">METHOD</div>';
          html += '<div class="val">' + meth.name + '</div>';
          html += '<div class="file">' + meth.file + '</div>';
          html += '</button>';
        }
      }

      html += '</div></div>';
    }

    html += '</div></div>';
    return html;
  }

  // ============================================================
  // Render: TECH (Entity or Method) level
  // ============================================================
  function renderTech() {
    const isEntity = state.techType === 'entity';
    const item = isEntity ? data.entities[state.techId] : data.methods[state.techId];
    if (!item) return renderRoot();

    let html = '<div class="level active">';
    html += '<button class="back-btn" onclick="window.ArchApp.goBack()">← חזרה</button>';

    html += '<div class="tech-detail-panel">';
    html += '<div class="scope-tag">' + (isEntity ? 'ENTITY · מודל נתונים' : 'METHOD · פונקציה טכנית') + '</div>';
    html += '<h3>' + item.name + '</h3>';
    html += '<div class="file-path">' + item.file + '</div>';
    html += '<div class="tech-desc">' + item.desc + '</div>';

    if (!isEntity && item.signature) {
      html += '<div class="signature">' + item.signature + '</div>';
    }

    if (isEntity && item.fields) {
      html += '<div class="fields"><div class="detail-section-title">שדות</div>';
      html += '<ul class="fields-list">';
      for (const field of item.fields) {
        html += '<li>' + field + '</li>';
      }
      html += '</ul></div>';
    }

    html += '</div></div>';
    return html;
  }

  // ============================================================
  // Main render
  // ============================================================
  function render() {
    const navContainer = document.getElementById('nav-container');
    const viewport = document.getElementById('viewport');

    if (navContainer) navContainer.innerHTML = renderBreadcrumb();

    if (!viewport) return;

    let html = '';
    switch (state.level) {
      case 'root': html = renderRoot(); break;
      case 'track': html = renderTrack(); break;
      case 'actor': html = renderActor(); break;
      case 'operation': html = renderOperation(); break;
      case 'tech': html = renderTech(); break;
    }

    viewport.innerHTML = html;
    viewport.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================================
  // Public API
  // ============================================================
  window.ArchApp = {
    goRoot, goTrack, goActor, goOperation, goTech, goBack, render
  };

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();

</script>
</body>
</html>
