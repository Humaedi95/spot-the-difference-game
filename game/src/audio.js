// audio.js — one job: every sound, made with WebAudio (no audio files).
// The context is created lazily on the first user gesture (autoplay policy).

(function () {
  'use strict';

  var ctx = null;
  var muted = false;

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, startIn, dur, type, vol) {
    if (muted) return;
    var ac = ensure();
    if (!ac) return;
    var t0 = ac.currentTime + startIn;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  window.SpotAudio = {
    // A satisfying two-note chime when a difference is found.
    found: function () {
      tone(660, 0, 0.14, 'sine', 0.14);
      tone(990, 0.09, 0.22, 'sine', 0.14);
    },
    // A dull buzz for a wrong click.
    wrong: function () {
      tone(140, 0, 0.16, 'square', 0.06);
    },
    // A soft tick when the hint is used.
    hint: function () {
      tone(520, 0, 0.1, 'triangle', 0.1);
      tone(780, 0.08, 0.14, 'triangle', 0.1);
    },
    // A tick in the last seconds of a level.
    tick: function () {
      tone(880, 0, 0.05, 'square', 0.04);
    },
    // A little fanfare when a level is cleared.
    levelClear: function () {
      tone(523, 0, 0.14, 'triangle', 0.12);
      tone(659, 0.12, 0.14, 'triangle', 0.12);
      tone(784, 0.24, 0.22, 'triangle', 0.12);
    },
    // A longer fanfare for winning the whole game.
    win: function () {
      var notes = [523, 659, 784, 1047, 784, 1047];
      for (var i = 0; i < notes.length; i++) tone(notes[i], i * 0.13, 0.2, 'triangle', 0.12);
    },
    setMuted: function (m) { muted = !!m; },
    isMuted: function () { return muted; },
    unlock: function () { ensure(); },
  };
})();
