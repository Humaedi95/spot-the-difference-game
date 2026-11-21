// config.js — one job: every tunable number for Twin Scenes.
// The game is "Twin Scenes": two near-identical pictures side by side.
// Find every difference. No libraries, no network, no assets.

(function () {
  'use strict';

  var PANEL_W = 560;
  var PANEL_H = 480;
  var GAP = 40;
  var CANVAS_W = PANEL_W * 2 + GAP; // 1160
  var CANVAS_H = PANEL_H; // 480

  window.SpotConfig = {
    PANEL_W: PANEL_W,
    PANEL_H: PANEL_H,
    GAP: GAP,
    CANVAS_W: CANVAS_W,
    CANVAS_H: CANVAS_H,

    // One level = one pair of scenes, 7 differences each.
    LEVELS: [
      { id: 'harbor', name: 'Sunny Harbor', timeLimit: 150, diffCount: 7 },
      { id: 'garden', name: 'Moonlit Garden', timeLimit: 150, diffCount: 7 },
      { id: 'bakery', name: 'Cozy Bakery', timeLimit: 150, diffCount: 7 },
    ],

    POINTS_FOUND: 100,
    POINTS_WRONG: -10,
    POINTS_HINT: -25,
    TIME_BONUS_PER_SECOND: 5,
    HINTS_PER_LEVEL: 3,
    HINT_PULSE_MS: 2500,
    CLICK_RADIUS: 26,
    LOW_TIME_SECONDS: 10,

    COLORS: {
      page: '#1d2733',
      panelFrame: '#f4ead8',
      panelShadow: 'rgba(0,0,0,0.45)',
      foundRing: '#37d67a',
      foundFill: 'rgba(55,214,122,0.18)',
      hintRing: '#ffd23f',
      wrongX: '#ff5a5a',
      accent: '#ffd23f',
      accentDark: '#2b2118',
      text: '#f4ead8',
      muted: '#9fb0c3',
    },
  };
})();
