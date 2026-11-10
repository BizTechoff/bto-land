/* Info tiles: each tile shows its panel */
(function () {
  var tabs = [].slice.call(document.querySelectorAll('.tiles button[data-panel]'));
  var pick = function (id) {
    tabs.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.panel === id); });
    document.querySelectorAll('.panel').forEach(function (p) { p.hidden = p.id !== id; });
  };
  tabs.forEach(function (b) { b.addEventListener('click', function () { pick(b.dataset.panel); }); });
  window.gefenPickPanel = pick;
})();
