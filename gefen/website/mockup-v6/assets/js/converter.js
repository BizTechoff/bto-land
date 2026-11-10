/* GES calculator: dBm <-> mW <-> W, any field drives the other two */
(function () {
  var dbm = document.getElementById('c-dbm'), mw = document.getElementById('c-mw'), w = document.getElementById('c-w');
  if (!dbm) return;
  var show = function (v) { return !isFinite(v) ? '' : Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(3) : +v.toPrecision(6) + ''; };
  dbm.addEventListener('input', function () { var m = Math.pow(10, parseFloat(dbm.value) / 10); mw.value = show(m); w.value = show(m / 1000); });
  mw.addEventListener('input', function () { var m = parseFloat(mw.value); dbm.value = m > 0 ? show(10 * Math.log10(m)) : ''; w.value = show(m / 1000); });
  w.addEventListener('input', function () { var m = parseFloat(w.value) * 1000; dbm.value = m > 0 ? show(10 * Math.log10(m)) : ''; mw.value = show(m); });
})();
