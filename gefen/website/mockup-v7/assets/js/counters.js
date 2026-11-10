/* Big numbers count up when they enter the screen (the HTML already holds the final value) */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, from = to > 1000 ? to - 120 : 0, t1 = performance.now();
      (function step(n) { var p = Math.min(1, (n - t1) / 1800); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t1);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });
})();
