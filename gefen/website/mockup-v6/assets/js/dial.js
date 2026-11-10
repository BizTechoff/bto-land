/* The hero instrument: a deviation gauge that calibrates itself on load.
   Drag the knob to detune it, press "כיול" and watch it settle back into tolerance. */
(function () {
  var svg = document.getElementById('dial');
  if (!svg) return;
  var NS = 'http://www.w3.org/2000/svg', C = 200, R = 150, SPAN = 120, MAX = 50; // value -50..50 maps to -120deg..120deg
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el = function (n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  var pol = function (deg, r) { var a = (deg - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  var arc = function (v1, v2, r) {
    var a = pol(v1 / MAX * SPAN, r), b = pol(v2 / MAX * SPAN, r), big = Math.abs(v2 - v1) / MAX * SPAN > 180 ? 1 : 0;
    return 'M' + a[0] + ' ' + a[1] + ' A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + b[0] + ' ' + b[1];
  };

  // scale: tolerance bands, ticks, numbers
  var g = document.getElementById('scale');
  el('path', { d: arc(-15, 15, R - 14), class: 'band warn' }, g);
  el('path', { d: arc(-5, 5, R - 14), class: 'band ok' }, g);
  for (var v = -MAX; v <= MAX; v += 1) {
    var maj = v % 10 === 0, mid = v % 5 === 0, deg = v / MAX * SPAN;
    var p1 = pol(deg, R), p2 = pol(deg, R - (maj ? 22 : mid ? 14 : 8));
    el('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: 'tick' + (maj || mid ? '' : ' minor'), 'stroke-width': maj ? 2.6 : mid ? 1.6 : 1 }, g);
    if (maj && v !== 0) { var t = pol(deg, R - 40); el('text', { x: t[0], y: t[1], class: 'tick-num' }, g).textContent = (v > 0 ? '+' : '') + v; }
  }
  // vernier ring
  var vr = document.getElementById('vernier');
  for (var i = 0; i < 120; i++) { var a1 = pol(i * 3, R + 12), a2 = pol(i * 3, R + (i % 5 ? 16 : 22)); el('line', { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1] }, vr); }

  var needle = document.getElementById('needle'), lamp = document.getElementById('lamp'), out = document.getElementById('readout');
  var knob = document.getElementById('knob'), btn = document.getElementById('calibrate');
  var x = -48, vel = 0, target = -48, knobDeg = 0, auto = null;

  function render() {
    needle.setAttribute('transform', 'rotate(' + (x / MAX * SPAN) + ' ' + C + ' ' + C + ')');
    knob.style.transform = 'rotate(' + knobDeg + 'deg)';
    var ppm = x / 10, inTol = Math.abs(x) < 5 && Math.abs(vel) < 0.3;
    out.innerHTML = '<small>DEVIATION</small>' + (ppm >= 0 ? '+' : '') + ppm.toFixed(2) + ' ppm';
    lamp.textContent = inTol ? 'IN TOLERANCE' : 'ADJUSTING';
    lamp.classList.toggle('out', !inTol);
    btn.disabled = Math.abs(target) < 0.5;
  }
  function step() {
    // damped spring + a whisper of measurement noise
    vel += (target - x) * 0.045; vel *= 0.86; x += vel + (Math.random() - 0.5) * 0.08;
    if (auto) { knobDeg += (0 - knobDeg) * 0.06; target = knobDeg / 3; if (Math.abs(knobDeg) < 0.2) { knobDeg = 0; target = 0; auto = null; } }
    render(); requestAnimationFrame(step);
  }
  function calibrate() { auto = true; }

  // the knob: drag around its centre
  var drag = null;
  knob.addEventListener('pointerdown', function (e) {
    var r = knob.getBoundingClientRect(); auto = null;
    drag = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, a: Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)), k: knobDeg };
    knob.setPointerCapture(e.pointerId);
  });
  knob.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var a = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx), d = (a - drag.a) * 180 / Math.PI;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    knobDeg = Math.max(-150, Math.min(150, drag.k + d)); target = knobDeg / 3;
  });
  knob.addEventListener('pointerup', function () { drag = null; });
  knob.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') knobDeg = Math.max(-150, knobDeg - 9);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') knobDeg = Math.min(150, knobDeg + 9);
    else return;
    auto = null; target = knobDeg / 3; e.preventDefault();
  });
  btn.addEventListener('click', calibrate);

  if (reduce) { x = target = 0; render(); return; }
  // the opening story: off scale -> drifted -> self calibration
  setTimeout(function () { knobDeg = 66; target = 22; }, 500);
  setTimeout(calibrate, 2100);
  render(); requestAnimationFrame(step);
})();
