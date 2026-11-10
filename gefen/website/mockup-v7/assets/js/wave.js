/* Hero: a field of points carrying a signal. Every cycle it starts noisy (out of calibration)
   and settles into a clean wave - the HUD goes from CALIBRATING to IN TOLERANCE. */
(function () {
  var c = document.getElementById('field');
  if (!c) return;
  var x = c.getContext('2d'), W, H, NX, NZ, dpr, t0 = performance.now(), on = true;
  var state = document.getElementById('hud-state'), dev = document.getElementById('hud-dev');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, CYCLE = 12;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    NX = W < 700 ? 46 : 96; NZ = W < 700 ? 34 : 48;
  }
  var hash = function (i, j, k) { var s = Math.sin(i * 12.9898 + j * 78.233 + k * 37.719) * 43758.5453; return s - Math.floor(s); };
  function frame(now) {
    if (!on) return;
    var t = (now - t0) / 1000, p = (t % CYCLE) / CYCLE;
    var noise = reduce ? 0 : p < 0.34 ? Math.pow(1 - p / 0.34, 2) : 0;       // 1 -> 0 during the first third
    x.clearRect(0, 0, W, H);
    var m = W < 700, hor = H * (m ? 0.42 : 0.36), f = H * (m ? 0.62 : 0.9), camH = 1.25, span = m ? 4.6 : 9, depth = 9;
    for (var j = NZ - 1; j >= 0; j--) {
      var z = 0.9 + (j / NZ) * depth, k = f / z, fade = 1 - j / NZ;
      for (var i = 0; i < NX; i++) {
        var wx = (i / (NX - 1) - 0.5) * span * (1 + z * 0.22);
        var d = Math.sqrt(wx * wx + (z - 5) * (z - 5));
        var y = Math.sin(d * 2.1 - t * 2.2) * 0.26 * Math.exp(-d * 0.12) + Math.sin(wx * 0.9 + t * 0.7) * 0.07;
        y += (hash(i, j, Math.floor(t * 9)) - 0.5) * 1.5 * noise;
        var sx = W / 2 + wx * k, sy = hor + (camH - y) * k;
        if (sx < -4 || sx > W + 4 || sy > H + 4) continue;
        var lift = Math.max(0, Math.min(1, y * 2.4 + 0.5)), r = Math.max(0.6, 2.4 * fade + lift * 1.2);
        x.fillStyle = 'rgba(' + Math.round(20 + 200 * lift) + ',' + Math.round(140 + 100 * lift) + ',255,' + (0.18 + 0.8 * fade * (0.35 + lift * 0.65)).toFixed(3) + ')';
        x.fillRect(sx - r / 2, sy - r / 2, r, r);
      }
    }
    if (state) {
      var ok = noise < 0.02;
      state.textContent = ok ? 'IN TOLERANCE' : 'CALIBRATING ' + Math.round((1 - noise) * 100) + '%';
      state.classList.toggle('ok', ok);
      dev.textContent = 'DEV ' + (noise * 48 + Math.sin(t * 3) * 0.02).toFixed(2) + ' ppm';
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  addEventListener('resize', size); size();
  new IntersectionObserver(function (es) { var was = on; on = es[0].isIntersecting; if (on && !was) requestAnimationFrame(frame); }).observe(c);
  requestAnimationFrame(frame);
})();
