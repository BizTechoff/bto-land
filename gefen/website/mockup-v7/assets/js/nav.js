/* Top bar turns solid on scroll, full-screen menu opens / closes, the current scene is marked in the menu */
(function () {
  var nav = document.querySelector('.nav'), ov = document.getElementById('overlay');
  var onScroll = function () { nav.classList.toggle('solid', scrollY > 20); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var open = function (v) { ov.classList.toggle('open', v); document.body.style.overflow = v ? 'hidden' : ''; };
  document.querySelector('.burger').addEventListener('click', function () { open(true); });
  ov.querySelector('.close').addEventListener('click', function () { open(false); });
  ov.addEventListener('click', function (e) { if (e.target.closest('a')) open(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  var links = [].slice.call(document.querySelectorAll('.menu a'));
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('.scene[id]').forEach(function (s) { io.observe(s); });
})();
