// main.js — one job: start the game and keep it drawing.
// Reads ?shot= for deterministic screenshot staging:
//   ?shot=title | level1-mid | level2-mid | win
// Without it, the game opens on the title screen.

(function () {
  'use strict';

  function start() {
    var canvas = document.getElementById('game-canvas');
    window.SpotRender.init(canvas);
    window.SpotInput.attach(canvas);

    // Buttons
    document.getElementById('btn-start').addEventListener('click', function () {
      window.SpotAudio.unlock();
      window.SpotEngine.startGame();
    });
    document.getElementById('btn-next').addEventListener('click', function () {
      window.SpotAudio.unlock();
      window.SpotEngine.nextLevel();
    });
    document.getElementById('btn-again').addEventListener('click', function () {
      window.SpotAudio.unlock();
      window.SpotEngine.restart();
      window.SpotEngine.startGame();
    });
    document.getElementById('btn-retry').addEventListener('click', function () {
      window.SpotAudio.unlock();
      window.SpotEngine.startGame();
    });
    document.getElementById('btn-hint').addEventListener('click', function () {
      window.SpotAudio.unlock();
      window.SpotEngine.useHint();
    });
    document.getElementById('hud-mute').addEventListener('click', function () {
      window.SpotAudio.setMuted(!window.SpotAudio.isMuted());
      window.SpotRender.draw();
    });

    window.SpotEngine.setOnChange(function () {
      window.SpotRender.draw();
    });

    // Staging for screenshots: an exact frozen state, no ticking timer.
    var params = new URLSearchParams(window.location.search);
    var shot = params.get('shot');
    if (shot) {
      window.SpotEngine.stage(shot);
    }

    // Render loop: cheap enough to redraw every frame; the timer and the
    // hint pulse are the only animated parts, and staging freezes both.
    function loop() {
      window.SpotRender.draw();
      requestAnimationFrame(loop);
    }
    loop();

    // Test handle for the play-test driver.
    window.__game = {
      state: function () { return window.SpotEngine.state; },
      click: function (sx, sy) { return window.SpotInput.debugClick(sx, sy); },
      hint: function () { return window.SpotEngine.useHint(); },
      start: function () { window.SpotEngine.startGame(); },
      next: function () { window.SpotEngine.nextLevel(); },
      diffs: function () { return window.SpotEngine.diffs(); },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
