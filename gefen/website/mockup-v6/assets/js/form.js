/* Mockup only: the request form shows what the visitor will see after sending */
(function () {
  var f = document.querySelector('form.req');
  if (!f) return;
  f.addEventListener('submit', function (e) { e.preventDefault(); f.querySelector('button').textContent = 'הבקשה התקבלה (הדגמה)'; });
})();
