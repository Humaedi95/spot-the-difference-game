// input.js — one job: turn mouse clicks and keys into engine calls.
// The canvas holds two panels: left at x 0..PANEL_W, right at
// x PANEL_W+GAP .. CANVAS_W. A click maps to scene coordinates of the
// panel it landed in; a click in the gap is ignored.

(function () {
  'use strict';

  var C = window.SpotConfig;

  function attach(canvas) {
    canvas.addEventListener('click', function (ev) {
      window.SpotAudio.unlock();
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var cx = (ev.clientX - rect.left) * scaleX;
      var cy = (ev.clientY - rect.top) * scaleY;
      var panel = -1;
      var sx = 0;
      if (cx >= 0 && cx < C.PANEL_W) {
        panel = 0;
        sx = cx;
      } else if (cx >= C.PANEL_W + C.GAP && cx < C.CANVAS_W) {
        panel = 1;
        sx = cx - (C.PANEL_W + C.GAP);
      }
      if (panel === -1) return;
      if (cy < 0 || cy >= C.PANEL_H) return;
      window.SpotEngine.clickAt(sx, cy);
    });

    document.addEventListener('keydown', function (ev) {
      var s = window.SpotEngine.state;
      if (ev.key === 'h' || ev.key === 'H') {
        window.SpotEngine.useHint();
      } else if (ev.key === 'm' || ev.key === 'M') {
        window.SpotAudio.setMuted(!window.SpotAudio.isMuted());
        if (window.SpotRender) window.SpotRender.draw();
      } else if (ev.key === 'r' || ev.key === 'R') {
        window.SpotEngine.restart();
      } else if (ev.key === 'n' || ev.key === 'N') {
        window.SpotEngine.nextLevel();
      } else if ((ev.key === 'Enter' || ev.key === ' ') && s.screen === 'title') {
        ev.preventDefault();
        window.SpotEngine.startGame();
      }
    });
  }

  // Test hook for the CDP play-test driver: click a scene point
  // programmatically and read the outcome back.
  function debugClick(sx, sy) {
    return window.SpotEngine.clickAt(sx, sy);
  }

  window.SpotInput = {
    attach: attach,
    debugClick: debugClick,
  };
})();
