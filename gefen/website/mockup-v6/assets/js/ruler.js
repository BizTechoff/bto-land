/* The frequency ruler: DC to 40 GHz on a log scale, the lab's domains on it, and a sweeping marker */
(function () {
  var svg = document.getElementById('ruler');
  if (!svg) return;
  var NS = 'http://www.w3.org/2000/svg', W = 1160, X0 = 20, X1 = W - 20, Y = 92;
  var F0 = Math.log10(1e3), F1 = Math.log10(40e9); // 1 kHz .. 40 GHz (DC sits at the left edge)
  var fx = function (hz) { return X0 + (Math.log10(hz) - F0) / (F1 - F0) * (X1 - X0); };
  var el = function (n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  svg.setAttribute('viewBox', '0 0 ' + W + ' 170');
  var labs = { 6: '1 MHz', 9: '1 GHz' };
  for (var e = 3; e <= 10; e++) for (var m = 1; m < 10; m++) {
    var hz = m * Math.pow(10, e); if (hz > 40e9) break;
    var x = fx(hz), maj = m === 1;
    el('line', { x1: x, y1: Y, x2: x, y2: Y - (maj ? 26 : 12), class: 'r-tick' + (maj ? ' maj' : '') });
    if (maj && labs[e]) el('text', { x: x, y: Y + 20, class: 'r-lab' }).textContent = labs[e];
  }
  el('text', { x: X0, y: Y + 20, class: 'r-lab' }).textContent = 'DC';
  el('text', { x: fx(40e9) - 10, y: Y + 20, class: 'r-lab' }).textContent = '40 GHz';
  el('line', { x1: X0, y1: Y, x2: X1, y2: Y, class: 'r-tick maj' });
  // domains as bands above the scale
  var doms = [['Telecom', 3e3, 2e8, '#8fd4ff'], ['RF', 1e5, 6e9, '#4cc3ff'], ['Cellular', 4e8, 7e9, '#7ee0c3'], ['Microwave', 6e9, 40e9, '#ffd27a']];
  doms.forEach(function (d, i) {
    var g = el('g', { class: 'dom' }), x1 = fx(d[1]), x2 = fx(d[2]), y = 8 + (i % 2) * 26;
    el('rect', { x: x1, y: y, width: x2 - x1, height: 22, fill: d[3], opacity: .9 }, g);
    el('text', { x: (x1 + x2) / 2, y: y + 11 }, g).textContent = d[0];
  });
  var fib = el('g', { class: 'dom' });
  el('rect', { x: X1 - 220, y: 138, width: 220, height: 22, fill: '#c9b6ff' }, fib);
  el('text', { x: X1 - 110, y: 149 }, fib).textContent = 'Fiber Optics · 1310/1550 nm';
  // sweeping marker
  var cur = el('line', { y1: 4, y2: Y + 4, class: 'cursor' }), lab = el('text', { y: Y + 40, class: 'cur-lab' });
  var fmt = function (hz) { return hz >= 1e9 ? (hz / 1e9).toFixed(2) + ' GHz' : hz >= 1e6 ? (hz / 1e6).toFixed(1) + ' MHz' : (hz / 1e3).toFixed(0) + ' kHz'; };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, t0 = performance.now();
  function frame(n) {
    var u = reduce ? .92 : (Math.sin((n - t0) / 2600) + 1) / 2, hz = Math.pow(10, F0 + u * (F1 - F0)), x = fx(hz);
    cur.setAttribute('x1', x); cur.setAttribute('x2', x); lab.setAttribute('x', Math.min(X1 - 40, Math.max(X0 + 40, x))); lab.textContent = fmt(hz);
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
