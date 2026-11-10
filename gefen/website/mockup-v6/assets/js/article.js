/* Article: reading progress bar and the table of contents follows the section on screen */
(function () {
  var bar = document.getElementById('progress'), links = [].slice.call(document.querySelectorAll('.toc a'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    var cur = 0; secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 160) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
  }, { passive: true });
})();
