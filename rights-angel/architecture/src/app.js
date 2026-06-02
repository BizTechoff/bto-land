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
