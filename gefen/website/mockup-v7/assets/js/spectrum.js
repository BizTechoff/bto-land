/* The analyzer wall: live trace DC - 40 GHz with max-hold, marker and sweep */
(function () {
  var c = document.getElementById('spec');
  if (!c) return;
  var x = c.getContext('2d'), ro = document.getElementById('spec-ro'), hold = null, on = false;
  var PEAKS = [[0.05, 0.5], [0.16, 0.74], [0.3, 0.42], [0.45, 0.9], [0.6, 0.55], [0.74, 0.7], [0.9, 0.48]];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() { var d = Math.min(devicePixelRatio || 1, 2); c.width = c.clientWidth * d; c.height = c.clientHeight * d; x.setTransform(d, 0, 0, d, 0, 0); hold = null; }
  function draw(now) {
    var t = now / 1000, w = c.clientWidth, h = c.clientHeight, pts = [], i, px;
    x.clearRect(0, 0, w, h); x.lineWidth = 1; x.strokeStyle = 'rgba(110,140,200,.13)';
    for (i = 1; i < 12; i++) { x.beginPath(); x.moveTo(w * i / 12, 0); x.lineTo(w * i / 12, h); x.stroke(); }
    for (i = 1; i < 6; i++) { x.beginPath(); x.moveTo(0, h * i / 6); x.lineTo(w, h * i / 6); x.stroke(); }
    for (px = 0; px <= w; px += 2) {
      var f = px / w, v = 0.06 + Math.random() * 0.045;
      for (i = 0; i < PEAKS.length; i++) { var d = (f - PEAKS[i][0]) / 0.009; v += PEAKS[i][1] * (0.82 + 0.18 * Math.sin(t * 2 + i * 1.7)) * Math.exp(-d * d); }
      pts.push([px, h - 28 - v * (h - 64)]);
    }
    if (!hold || hold.length !== pts.length) hold = pts.map(function (p) { return p.slice(); });
    else pts.forEach(function (p, k) { hold[k][1] = Math.min(hold[k][1] + 0.5, p[1]); });
    var path = function (a) { x.beginPath(); a.forEach(function (p, k) { k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); };
    x.strokeStyle = 'rgba(255,170,7,.4)'; path(hold); x.stroke();
    var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(76,195,255,.45)'); g.addColorStop(1, 'rgba(76,195,255,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, h); pts.forEach(function (p) { x.lineTo(p[0], p[1]); }); x.lineTo(w, h); x.fill();
    x.shadowColor = '#4cc3ff'; x.shadowBlur = 12; x.strokeStyle = '#8fdcff'; x.lineWidth = 1.8; path(pts); x.stroke(); x.shadowBlur = 0;
    var pk = PEAKS[Math.floor(t / 2.4) % PEAKS.length], mx = pk[0] * w, my = h - 28 - (0.06 + pk[1]) * (h - 64);
    x.fillStyle = '#ffaa07'; x.beginPath(); x.moveTo(mx, my - 6); x.lineTo(mx - 7, my - 18); x.lineTo(mx + 7, my - 18); x.fill();
    ro.textContent = 'MKR 1  ' + (pk[0] * 40).toFixed(3) + ' GHz  ' + (-60 + pk[1] * 60).toFixed(1) + ' dBm';
    var sw = ((t * 0.2) % 1) * w; x.strokeStyle = 'rgba(255,170,7,.5)'; x.lineWidth = 1; x.beginPath(); x.moveTo(sw, 0); x.lineTo(sw, h); x.stroke();
  }
  addEventListener('resize', size); size(); draw(performance.now());
  if (reduce) return;
  new IntersectionObserver(function (es) { on = es[0].isIntersecting; }).observe(c);
  (function loop() { if (on) requestAnimationFrame(draw); setTimeout(loop, 50); })();
})();
