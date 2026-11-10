/* Top bar: solid after scrolling, mobile menu toggle */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var onScroll = function () { nav.classList.toggle('solid', scrollY > 10); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = nav.querySelector('.burger'), menu = nav.querySelector('.menu');
  if (burger) burger.addEventListener('click', function () {
    var open = menu.style.display === 'flex';
    menu.style.cssText = open ? '' : 'display:flex;flex-direction:column;position:absolute;top:var(--nav-h);inset-inline:0;background:#fff;padding:12px 20px;border-bottom:1px solid var(--line)';
  });
})();
