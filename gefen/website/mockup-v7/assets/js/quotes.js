/* One big testimonial at a time, changing every few seconds */
(function () {
  var qs = [].slice.call(document.querySelectorAll('.quotes blockquote')), dots = [].slice.call(document.querySelectorAll('.dots i')), i = 0;
  if (!qs.length) return;
  var show = function (n) { i = n % qs.length; qs.forEach(function (q, k) { q.classList.toggle('on', k === i); }); dots.forEach(function (d, k) { d.classList.toggle('on', k === i); }); };
  show(0);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(function () { show(i + 1); }, 6000);
})();
