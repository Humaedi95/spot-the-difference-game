// engine.js — one job: the game's state machine and rules.
// Screens: title, playing, levelClear, win, gameOver.
// The engine never touches the DOM directly except through render hooks:
// it owns state; render.js draws it.

(function () {
  'use strict';

  var C = window.SpotConfig;

  function freshState() {
    return {
      screen: 'title', // title | playing | levelClear | win | gameOver
      levelIndex: 0,
      found: [], // indices into the level's DIFFS
      score: 0,
      timeLeft: 0,
      hintsLeft: C.HINTS_PER_LEVEL,
      hintAt: null, // {x, y, until} while a hint pulse is showing
      wrongAt: null, // {x, y, panel, until} while a wrong-click X shows
      lastFoundLabel: '',
      frozen: false, // staging mode: the timer never ticks
      startedAt: 0,
    };
  }

  var state = freshState();
  var timerId = null;
  var onChange = null; // render hook, set by main.js

  function level() {
    return C.LEVELS[state.levelIndex];
  }

  function diffs() {
    return window.SpotScenes.DIFFS[level().id];
  }

  function remaining() {
    return diffs().length - state.found.length;
  }

  function notify() {
    if (onChange) onChange();
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (state.frozen) return;
    timerId = setInterval(function () {
      if (state.screen !== 'playing') return;
      state.timeLeft -= 1;
      if (state.timeLeft <= C.LOW_TIME_SECONDS && state.timeLeft > 0) {
        window.SpotAudio.tick();
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        state.screen = 'gameOver';
        stopTimer();
        window.SpotAudio.wrong();
      }
      notify();
    }, 1000);
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = [];
    state.timeLeft = level().timeLimit;
    state.hintsLeft = C.HINTS_PER_LEVEL;
    state.hintAt = null;
    state.wrongAt = null;
    state.lastFoundLabel = '';
    state.screen = 'playing';
    startTimer();
    notify();
  }

  function startGame() {
    state.score = 0;
    startLevel(0);
  }

  // A click landed on scene coordinates (sx, sy) of either panel.
  // Returns 'found' | 'wrong' | 'ignored'.
  function clickAt(sx, sy) {
    if (state.screen !== 'playing') return 'ignored';
    var list = diffs();
    for (var i = 0; i < list.length; i++) {
      if (state.found.indexOf(i) !== -1) continue;
      var d = list[i];
      var dx = sx - d.x;
      var dy = sy - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.push(i);
        state.score += C.POINTS_FOUND;
        state.lastFoundLabel = d.label;
        window.SpotAudio.found();
        if (state.found.length === list.length) {
          state.score += state.timeLeft * C.TIME_BONUS_PER_SECOND;
          stopTimer();
          if (state.levelIndex === C.LEVELS.length - 1) {
            state.screen = 'win';
            window.SpotAudio.win();
          } else {
            state.screen = 'levelClear';
            window.SpotAudio.levelClear();
          }
        }
        notify();
        return 'found';
      }
    }
    state.score = Math.max(0, state.score + C.POINTS_WRONG);
    state.wrongAt = { x: sx, y: sy, until: Date.now() + 600 };
    window.SpotAudio.wrong();
    notify();
    return 'wrong';
  }

  function useHint() {
    if (state.screen !== 'playing') return false;
    if (state.hintsLeft <= 0) return false;
    var list = diffs();
    var open = [];
    for (var i = 0; i < list.length; i++) {
      if (state.found.indexOf(i) === -1) open.push(i);
    }
    if (open.length === 0) return false;
    var pick = open[Math.floor(Math.random() * open.length)];
    state.hintAt = { x: list[pick].x, y: list[pick].y, until: Date.now() + C.HINT_PULSE_MS };
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score + C.POINTS_HINT);
    window.SpotAudio.hint();
    notify();
    return true;
  }

  function nextLevel() {
    if (state.screen !== 'levelClear') return;
    startLevel(state.levelIndex + 1);
  }

  function restart() {
    stopTimer();
    state = freshState();
    state.frozen = false;
    notify();
  }

  // Deterministic staging for screenshots (?shot=...): set an exact state
  // with a frozen timer so the frame never changes between renders.
  function stage(shot) {
    stopTimer();
    state = freshState();
    state.frozen = true;
    if (shot === 'title') {
      state.screen = 'title';
    } else if (shot === 'level1-mid') {
      state.screen = 'playing';
      state.levelIndex = 0;
      state.found = [0, 1, 2];
      state.score = 300;
      state.timeLeft = 97;
      state.lastFoundLabel = 'the cabin window';
    } else if (shot === 'level2-mid') {
      state.screen = 'playing';
      state.levelIndex = 1;
      state.found = [0, 1];
      state.score = 500;
      state.timeLeft = 120;
      state.lastFoundLabel = 'the cat on the bench';
    } else if (shot === 'win') {
      state.screen = 'win';
      state.levelIndex = 2;
      state.found = [0, 1, 2, 3, 4, 5, 6];
      state.score = 2740;
      state.timeLeft = 63;
    } else {
      state.screen = 'title';
    }
    notify();
  }

  window.SpotEngine = {
    get state() { return state; },
    level: level,
    diffs: diffs,
    remaining: remaining,
    startGame: startGame,
    startLevel: startLevel,
    clickAt: clickAt,
    useHint: useHint,
    nextLevel: nextLevel,
    restart: restart,
    stage: stage,
    setOnChange: function (fn) { onChange = fn; },
  };
})();
