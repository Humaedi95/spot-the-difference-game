// render.js — one job: draw every frame from engine state.
// The canvas shows the two panels; the HUD and the screen overlays
// (title, level clear, win, game over) are DOM, updated here too.

(function () {
  'use strict';

  var C = window.SpotConfig;
  var canvas = null;
  var ctx = null;

  function $(id) { return document.getElementById(id); }

  function fmtTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function drawPanel(levelId, variant, ox) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox, 0, C.PANEL_W, C.PANEL_H);
    ctx.clip();
    // Scenes draw in panel-local coordinates (0..PANEL_W): shift the
    // origin to this panel so the right panel is not clipped away.
    ctx.translate(ox, 0);
    window.SpotScenes.draw[levelId](ctx, variant);
    ctx.restore();
    // Frame
    ctx.strokeStyle = C.COLORS.panelFrame;
    ctx.lineWidth = 4;
    ctx.strokeRect(ox + 2, 2, C.PANEL_W - 4, C.PANEL_H - 4);
    ctx.save();
    ctx.shadowColor = C.COLORS.panelShadow;
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0)';
    ctx.strokeRect(ox + 2, 2, C.PANEL_W - 4, C.PANEL_H - 4);
    ctx.restore();
  }

  function drawMarker(x, y, ox) {
    var px = ox + x;
    var py = y;
    ctx.strokeStyle = C.COLORS.foundRing;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = C.COLORS.foundFill;
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, Math.PI * 2);
    ctx.fill();
    // Check mark
    ctx.strokeStyle = C.COLORS.foundRing;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px - 8, py);
    ctx.lineTo(px - 2, py + 6);
    ctx.lineTo(px + 9, py - 7);
    ctx.stroke();
  }

  function drawHint(x, y, ox) {
    var pulse = 1 + 0.18 * Math.sin(Date.now() / 130);
    var px = ox + x;
    var py = y;
    ctx.strokeStyle = C.COLORS.hintRing;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(px, py, 24 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawWrong(x, y, ox) {
    var px = ox + x;
    var py = y;
    ctx.strokeStyle = C.COLORS.wrongX;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px - 10, py - 10);
    ctx.lineTo(px + 10, py + 10);
    ctx.moveTo(px + 10, py - 10);
    ctx.lineTo(px - 10, py + 10);
    ctx.stroke();
  }

  function draw() {
    if (!canvas) return;
    var s = window.SpotEngine.state;
    var level = window.SpotEngine.level();
    var list = window.SpotEngine.diffs();
    var rightOx = C.PANEL_W + C.GAP;

    ctx.clearRect(0, 0, C.CANVAS_W, C.CANVAS_H);
    ctx.fillStyle = '#0f1720';
    ctx.fillRect(0, 0, C.CANVAS_W, C.CANVAS_H);

    drawPanel(level.id, 0, 0);
    drawPanel(level.id, 1, rightOx);

    // Panel labels
    ctx.fillStyle = 'rgba(15,23,32,0.75)';
    ctx.fillRect(8, 8, 74, 26);
    ctx.fillRect(rightOx + 8, 8, 74, 26);
    ctx.fillStyle = '#f4ead8';
    ctx.font = 'bold 14px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('ORIGINAL', 16, 22);
    ctx.fillText('SPOT IT!', rightOx + 16, 22);

    // Markers on both panels for every found difference.
    for (var i = 0; i < s.found.length; i++) {
      var d = list[s.found[i]];
      drawMarker(d.x, d.y, 0);
      drawMarker(d.x, d.y, rightOx);
    }

    // Hint pulse, if one is live.
    if (s.hintAt && Date.now() < s.hintAt.until) {
      drawHint(s.hintAt.x, s.hintAt.y, 0);
      drawHint(s.hintAt.x, s.hintAt.y, rightOx);
    }

    // Wrong-click X, while it is live (drawn on the panel it hit).
    if (s.wrongAt && Date.now() < s.wrongAt.until) {
      drawWrong(s.wrongAt.x, s.wrongAt.y, 0);
      drawWrong(s.wrongAt.x, s.wrongAt.y, rightOx);
    }

    updateHud();
    updateOverlays();
  }

  function updateHud() {
    var s = window.SpotEngine.state;
    var level = window.SpotEngine.level();
    $('hud-level').textContent = 'Level ' + (s.levelIndex + 1) + ' of ' + C.LEVELS.length + ' · ' + level.name;
    $('hud-found').textContent = 'Found ' + s.found.length + ' / ' + window.SpotEngine.diffs().length +
      ' · ' + window.SpotEngine.remaining() + ' left';
    $('hud-time').textContent = '⏱ ' + fmtTime(Math.max(0, s.timeLeft));
    $('hud-time').classList.toggle('low', s.timeLeft <= C.LOW_TIME_SECONDS && s.screen === 'playing');
    $('hud-score').textContent = 'Score ' + s.score;
    $('hud-hints').textContent = 'Hints ' + s.hintsLeft + ' (H)';
    $('hud-mute').textContent = window.SpotAudio.isMuted() ? 'Sound off (M)' : 'Sound on (M)';
    var msg = $('hud-message');
    if (s.screen === 'playing') {
      if (s.lastFoundLabel) msg.textContent = 'Nice! You found ' + s.lastFoundLabel + '.';
      else msg.textContent = 'Click a difference — it is in one picture but not the other.';
    } else {
      msg.textContent = '';
    }
  }

  function showOverlay(id) {
    var ids = ['ov-title', 'ov-clear', 'ov-win', 'ov-over'];
    for (var i = 0; i < ids.length; i++) {
      $(ids[i]).classList.toggle('hidden', ids[i] !== id);
    }
  }

  function updateOverlays() {
    var s = window.SpotEngine.state;
    if (s.screen === 'title') {
      showOverlay('ov-title');
    } else if (s.screen === 'levelClear') {
      showOverlay('ov-clear');
      var level = window.SpotEngine.level();
      $('clear-text').textContent = level.name + ' cleared! Time bonus banked. ' +
        'Score: ' + s.score + '.';
    } else if (s.screen === 'win') {
      showOverlay('ov-win');
      $('win-text').textContent = 'Every difference found in all three scenes. ' +
        'Final score: ' + s.score + '.';
    } else if (s.screen === 'gameOver') {
      showOverlay('ov-over');
      $('over-text').textContent = 'Time ran out with ' + window.SpotEngine.remaining() +
        ' difference(s) still hiding. Score: ' + s.score + '.';
    } else {
      showOverlay(null);
    }
  }

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    canvas.width = C.CANVAS_W;
    canvas.height = C.CANVAS_H;
  }

  window.SpotRender = {
    init: init,
    draw: draw,
  };
})();
