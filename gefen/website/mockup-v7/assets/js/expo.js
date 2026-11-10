/* Exhibition mode for the booth TV: full screen, every scene gets its turn, in a loop.
   Start with the button or with ?expo in the address. Leave with Esc or the exit button. */
(function () {
  var scenes = [].slice.call(document.querySelectorAll('.scene')), bar = document.getElementById('expo-bar');
  if (!bar) return;
  var track = bar.querySelector('.track'), DUR = 9000, timer = 0, idx = 0, running = false;
  var panels = ['p-faq', 'p-calc', 'p-tables'], pi = 0;
  scenes.forEach(function () { track.appendChild(document.createElement('i')); });
  var marks = [].slice.call(track.children);
  function go(n) {
    idx = n % scenes.length;
    marks.forEach(function (m, k) { m.className = k < idx ? 'done' : k === idx ? 'now' : ''; });
    if (scenes[idx].id === 'info' && window.gefenPickPanel) window.gefenPickPanel(panels[pi++ % panels.length]);
    scenes[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    timer = setTimeout(function () { go(idx + 1); }, DUR);
  }
  function start() {
    if (running) return; running = true;
    document.body.classList.add('expo'); bar.style.setProperty('--dur', DUR + 'ms');
    var el = document.documentElement; if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
    setTimeout(function () { go(0); }, 300);
  }
  function stop() {
    if (!running) return; running = false; clearTimeout(timer);
    document.body.classList.remove('expo');
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
  }
  document.querySelectorAll('[data-expo]').forEach(function (b) { b.addEventListener('click', start); });
  bar.querySelector('button').addEventListener('click', stop);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') stop(); });
  if (/[?&]expo\b/.test(location.search)) start();
})();
