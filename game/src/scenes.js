// scenes.js — one job: draw the three original scenes, twice each.
// Every picture is drawn with canvas shapes (no images, no assets).
// draw(ctx, variant): variant 0 = left panel (the reference),
// variant 1 = right panel (7 differences applied).
// DIFFS lists each difference's scene coordinates + a short label.

(function () {
  'use strict';

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }

  function ellipse(ctx, x, y, rx, ry) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  }

  function poly(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
  }

  function cloud(ctx, x, y, s) {
    ctx.fillStyle = '#ffffff';
    ellipse(ctx, x, y, 34 * s, 16 * s); ctx.fill();
    ellipse(ctx, x - 22 * s, y + 5 * s, 20 * s, 12 * s); ctx.fill();
    ellipse(ctx, x + 24 * s, y + 5 * s, 22 * s, 13 * s); ctx.fill();
  }

  function seagull(ctx, x, y, s) {
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y);
    ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
    ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
    ctx.stroke();
  }

  // ---------- Level 1: Sunny Harbor ----------
  function drawHarbor(ctx, variant) {
    var W = 560, H = 480;
    // Sky
    var sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#7ec8f7');
    sky.addColorStop(1, '#d8f1ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 300);
    // Sun
    ctx.fillStyle = '#ffd23f';
    circle(ctx, 470, 70, 34); ctx.fill();
    ctx.strokeStyle = '#ffd23f';
    ctx.lineWidth = 4;
    for (var a = 0; a < 8; a++) {
      var ang = (a / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(470 + Math.cos(ang) * 42, 70 + Math.sin(ang) * 42);
      ctx.lineTo(470 + Math.cos(ang) * 54, 70 + Math.sin(ang) * 54);
      ctx.stroke();
    }
    // Clouds (difference 7: the cloud at 420,90 is gone in variant 1)
    cloud(ctx, 100, 60, 1);
    cloud(ctx, 250, 45, 0.8);
    if (variant === 0) cloud(ctx, 420, 90, 0.9);
    // Seagulls (difference 1: the gull at 90,70 is gone in variant 1)
    if (variant === 0) seagull(ctx, 90, 70, 1);
    seagull(ctx, 150, 50, 0.9);
    seagull(ctx, 210, 80, 0.8);
    // Sea
    var sea = ctx.createLinearGradient(0, 300, 0, H);
    sea.addColorStop(0, '#2f9be8');
    sea.addColorStop(1, '#1668b4');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 300, W, 180);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 2;
    var wy;
    for (wy = 320; wy < 470; wy += 36) {
      ctx.beginPath();
      ctx.moveTo(20 + ((wy * 7) % 40), wy);
      ctx.quadraticCurveTo(140, wy - 8, 260, wy);
      ctx.quadraticCurveTo(380, wy + 8, 520, wy);
      ctx.stroke();
    }
    // Lighthouse (difference 5: beam + glow on in variant 0, off in 1)
    ctx.fillStyle = '#e8e2d4';
    ctx.fillRect(60, 180, 50, 120);
    ctx.fillStyle = '#e2574c';
    ctx.fillRect(60, 205, 50, 22);
    ctx.fillRect(60, 250, 50, 22);
    ctx.fillStyle = '#334155';
    poly(ctx, [[55, 180], [115, 180], [105, 150], [65, 150]]);
    ctx.fill();
    ctx.fillStyle = '#ffd23f';
    circle(ctx, 85, 165, 10); ctx.fill();
    if (variant === 0) {
      ctx.fillStyle = 'rgba(255,210,63,0.35)';
      poly(ctx, [[85, 165], [200, 120], [200, 210]]);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,210,63,0.9)';
      circle(ctx, 85, 165, 14); ctx.fill();
    }
    // Sailboat
    ctx.fillStyle = '#8b5a2b';
    poly(ctx, [[270, 270], [390, 270], [370, 300], [290, 300]]);
    ctx.fill();
    ctx.fillStyle = '#5d3a17';
    ctx.fillRect(300, 240, 60, 30);
    // Difference 3: cabin window appears only in variant 1
    if (variant === 1) {
      ctx.fillStyle = '#bfe8ff';
      rr(ctx, 322, 248, 16, 14, 4); ctx.fill();
    }
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(328, 130, 5, 115);
    ctx.fillStyle = '#ffffff';
    poly(ctx, [[333, 140], [333, 235], [385, 235]]);
    ctx.fill();
    ctx.fillStyle = '#ffe9a8';
    poly(ctx, [[328, 145], [328, 235], [285, 235]]);
    ctx.fill();
    // Difference 2: flag red in variant 0, blue in variant 1
    ctx.fillStyle = variant === 0 ? '#e2574c' : '#3b82f6';
    poly(ctx, [[333, 130], [360, 137], [333, 145]]);
    ctx.fill();
    // Buoy (difference 4: gone in variant 1)
    if (variant === 0) {
      ctx.fillStyle = '#e2574c';
      poly(ctx, [[468, 372], [492, 372], [484, 396], [476, 396]]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(470, 380, 20, 7);
      ctx.fillStyle = '#334155';
      ctx.fillRect(478, 362, 4, 10);
    }
    // Fish (difference 6: gone in variant 1)
    if (variant === 0) {
      ctx.fillStyle = '#ff9f43';
      ellipse(ctx, 200, 420, 18, 9); ctx.fill();
      poly(ctx, [[216, 420], [228, 412], [228, 428]]);
      ctx.fill();
      ctx.fillStyle = '#334155';
      circle(ctx, 190, 418, 2); ctx.fill();
    }
    // Sandy shore strip
    ctx.fillStyle = '#f2dfae';
    ctx.fillRect(0, 452, W, 28);
    ctx.fillStyle = '#e8c98a';
    ellipse(ctx, 120, 466, 26, 6); ctx.fill();
    ellipse(ctx, 430, 464, 30, 6); ctx.fill();
  }

  // ---------- Level 2: Moonlit Garden ----------
  function drawGarden(ctx, variant) {
    var W = 560, H = 480;
    // Night sky
    var sky = ctx.createLinearGradient(0, 0, 0, 340);
    sky.addColorStop(0, '#0f1e3d');
    sky.addColorStop(1, '#2c4a7c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 340);
    // Stars
    ctx.fillStyle = '#ffffff';
    var stars = [[40, 40], [120, 80], [200, 30], [300, 60], [380, 35], [520, 140], [60, 130], [250, 110], [430, 180], [170, 160], [330, 150], [500, 60]];
    for (var i = 0; i < stars.length; i++) {
      circle(ctx, stars[i][0], stars[i][1], i % 3 === 0 ? 2.5 : 1.5);
      ctx.fill();
    }
    // Moon (difference 1: full in variant 0, crescent in variant 1)
    ctx.fillStyle = '#f7ead0';
    circle(ctx, 470, 80, 30); ctx.fill();
    if (variant === 1) {
      ctx.fillStyle = '#2c4a7c';
      circle(ctx, 482, 72, 26); ctx.fill();
    }
    ctx.fillStyle = 'rgba(247,234,208,0.25)';
    circle(ctx, 470, 80, 40); ctx.fill();
    // Tree (right)
    ctx.fillStyle = '#3d2b1f';
    ctx.fillRect(512, 220, 16, 110);
    ctx.fillStyle = '#1e4d2b';
    circle(ctx, 520, 200, 46); ctx.fill();
    circle(ctx, 488, 220, 32); ctx.fill();
    circle(ctx, 548, 222, 30); ctx.fill();
    // Cottage (left)
    ctx.fillStyle = '#f0d9a8';
    ctx.fillRect(40, 230, 120, 100);
    ctx.fillStyle = '#b3543f';
    poly(ctx, [[28, 232], [172, 232], [100, 178]]);
    ctx.fill();
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(88, 280, 26, 50);
    // Difference 7: cottage window lit in variant 0, dark in variant 1
    ctx.fillStyle = variant === 0 ? '#ffd23f' : '#22314d';
    rr(ctx, 128, 252, 22, 22, 3); ctx.fill();
    ctx.strokeStyle = '#6b4423';
    ctx.lineWidth = 2;
    ctx.strokeRect(128, 252, 22, 22);
    if (variant === 0) {
      ctx.fillStyle = 'rgba(255,210,63,0.25)';
      rr(ctx, 120, 244, 38, 38, 6); ctx.fill();
    }
    // Ground
    ctx.fillStyle = '#2e5d33';
    ctx.fillRect(0, 340, W, 140);
    ctx.fillStyle = '#27512c';
    ellipse(ctx, 120, 400, 130, 18); ctx.fill();
    ellipse(ctx, 420, 430, 150, 20); ctx.fill();
    // Bench (difference 6: 3 slats in variant 0, 2 in variant 1)
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(120, 330, 110, 10);
    ctx.fillRect(126, 340, 8, 26);
    ctx.fillRect(216, 340, 8, 26);
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(120, 352, 110, 8);
    // Cat on the bench (difference 2: present in variant 0 only)
    if (variant === 0) {
      ctx.fillStyle = '#2b2b2b';
      ellipse(ctx, 200, 322, 16, 11); ctx.fill();
      circle(ctx, 212, 312, 8); ctx.fill();
      poly(ctx, [[206, 306], [208, 296], [212, 304]]);
      ctx.fill();
      poly(ctx, [[216, 304], [220, 296], [220, 306]]);
      ctx.fill();
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(186, 326);
      ctx.quadraticCurveTo(172, 320, 176, 306);
      ctx.stroke();
    }
    // Fireflies (difference 4: the one at 250,150 is gone in variant 1)
    ctx.fillStyle = '#d8ff7a';
    if (variant === 0) { circle(ctx, 250, 150, 4); ctx.fill(); }
    circle(ctx, 350, 120, 4); ctx.fill();
    circle(ctx, 450, 200, 4); ctx.fill();
    ctx.fillStyle = 'rgba(216,255,122,0.3)';
    circle(ctx, 350, 120, 10); ctx.fill();
    circle(ctx, 450, 200, 10); ctx.fill();
    // Flower bed (difference 3: tulips red in variant 0, purple in 1)
    var fx;
    for (fx = 0; fx < 5; fx++) {
      var tx = 270 + fx * 22;
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tx, 430);
      ctx.lineTo(tx, 405);
      ctx.stroke();
      ctx.fillStyle = variant === 0 ? '#e2574c' : '#9b59d0';
      circle(ctx, tx, 400, 8); ctx.fill();
      ctx.fillStyle = '#ffb3c1';
      circle(ctx, tx - 3, 397, 3); ctx.fill();
    }
    // Mushroom (difference 5: present in variant 0 only)
    if (variant === 0) {
      ctx.fillStyle = '#f5f0e6';
      ctx.fillRect(474, 424, 10, 16);
      ctx.fillStyle = '#e2574c';
      ctx.beginPath();
      ctx.arc(479, 424, 16, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      circle(ctx, 472, 416, 3); ctx.fill();
      circle(ctx, 486, 418, 2.5); ctx.fill();
    }
    // Stone path
    ctx.fillStyle = '#b9b3a4';
    ellipse(ctx, 90, 452, 22, 8); ctx.fill();
    ellipse(ctx, 150, 462, 22, 8); ctx.fill();
    ellipse(ctx, 210, 452, 22, 8); ctx.fill();
    ellipse(ctx, 270, 462, 22, 8); ctx.fill();
  }

  // ---------- Level 3: Cozy Bakery ----------
  function drawBakery(ctx, variant) {
    var W = 560, H = 480;
    // Wall + floor
    ctx.fillStyle = '#f7e8c8';
    ctx.fillRect(0, 0, W, 400);
    ctx.fillStyle = '#c89b6a';
    ctx.fillRect(0, 400, W, 80);
    ctx.strokeStyle = 'rgba(90,60,30,0.35)';
    ctx.lineWidth = 2;
    var px;
    for (px = 0; px < W; px += 70) {
      ctx.beginPath();
      ctx.moveTo(px, 400);
      ctx.lineTo(px, 480);
      ctx.stroke();
    }
    // Window with curtains (difference 6: pink in variant 0, green in 1)
    ctx.fillStyle = '#bfe8ff';
    ctx.fillRect(50, 70, 110, 130);
    ctx.fillStyle = '#ffffff';
    cloud(ctx, 95, 105, 0.7);
    ctx.fillStyle = '#ffd23f';
    circle(ctx, 135, 95, 12); ctx.fill();
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 70, 110, 130);
    ctx.beginPath();
    ctx.moveTo(105, 70); ctx.lineTo(105, 200);
    ctx.moveTo(50, 135); ctx.lineTo(160, 135);
    ctx.stroke();
    ctx.fillStyle = variant === 0 ? '#f2a7c3' : '#7bc47f';
    poly(ctx, [[40, 60], [70, 60], [62, 210], [40, 210]]);
    ctx.fill();
    poly(ctx, [[140, 60], [170, 60], [170, 210], [148, 210]]);
    ctx.fill();
    // Clock (difference 2: 3:00 in variant 0, 4:30 in variant 1)
    ctx.fillStyle = '#ffffff';
    circle(ctx, 480, 90, 30); ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    circle(ctx, 480, 90, 30); ctx.stroke();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(480, 90);
    ctx.lineTo(480, 72);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(480, 90);
    if (variant === 0) { ctx.lineTo(498, 90); } else { ctx.lineTo(480, 108); }
    ctx.stroke();
    ctx.fillStyle = '#334155';
    circle(ctx, 480, 90, 3); ctx.fill();
    // Shelves with jars (difference 3: jar at 230,138 gone in variant 1)
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(180, 160, 360, 10);
    ctx.fillRect(180, 240, 360, 10);
    var jx;
    for (jx = 0; jx < 4; jx++) {
      if (variant === 1 && jx === 1) continue; // missing jar
      var jxx = 210 + jx * 70;
      ctx.fillStyle = ['#d97b6c', '#7fb3d5', '#a8d08d', '#e8c87a'][jx];
      rr(ctx, jxx, 118, 34, 42, 6); ctx.fill();
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(jxx + 6, 112, 22, 8);
    }
    // Bread on the lower shelf
    ctx.fillStyle = '#d9a05b';
    ellipse(ctx, 230, 232, 26, 10); ctx.fill();
    ellipse(ctx, 300, 232, 26, 10); ctx.fill();
    ellipse(ctx, 370, 232, 26, 10); ctx.fill();
    ctx.strokeStyle = '#a87c3f';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(222, 228); ctx.lineTo(238, 228); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(292, 228); ctx.lineTo(308, 228); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(362, 228); ctx.lineTo(378, 228); ctx.stroke();
    // Counter
    ctx.fillStyle = '#a9713f';
    ctx.fillRect(40, 330, 480, 20);
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(40, 350, 480, 50);
    ctx.fillStyle = '#8b5a2b';
    for (px = 60; px < 520; px += 60) ctx.fillRect(px, 350, 4, 50);
    // Cupcakes (difference 1: cherry on the middle cupcake in variant 0 only)
    var cx;
    for (cx = 0; cx < 3; cx++) {
      var ccx = 190 + cx * 55;
      ctx.fillStyle = '#e8b4b8';
      rr(ctx, ccx - 14, 300, 28, 20, 4); ctx.fill();
      ctx.fillStyle = '#fff5f5';
      ellipse(ctx, ccx, 296, 16, 10); ctx.fill();
      if (cx === 1 && variant === 0) {
        ctx.fillStyle = '#e2574c';
        circle(ctx, ccx, 284, 6); ctx.fill();
        ctx.strokeStyle = '#2e7d32';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ccx, 280); ctx.lineTo(ccx + 4, 274); ctx.stroke();
      }
    }
    // Price sign (difference 7: $5 in variant 0, $6 in variant 1)
    ctx.fillStyle = '#fffbe8';
    rr(ctx, 300, 340, 90, 34, 6); ctx.fill();
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 2;
    ctx.strokeRect(300, 340, 90, 34);
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(variant === 0 ? 'CAKE $5' : 'CAKE $6', 345, 358);
    // Bread tray (difference 4: 3 loaves in variant 0, 2 in variant 1)
    ctx.fillStyle = '#c9c2b4';
    rr(ctx, 400, 388, 120, 12, 5); ctx.fill();
    ctx.fillStyle = '#d9a05b';
    ellipse(ctx, 425, 380, 20, 9); ctx.fill();
    if (variant === 0) { ellipse(ctx, 460, 380, 20, 9); ctx.fill(); }
    ellipse(ctx, 495, 380, 20, 9); ctx.fill();
    // Cat sleeping on the floor (difference 5: present in variant 0 only)
    if (variant === 0) {
      ctx.fillStyle = '#e8a34c';
      ellipse(ctx, 470, 448, 26, 12); ctx.fill();
      circle(ctx, 492, 440, 10); ctx.fill();
      poly(ctx, [[486, 434], [488, 424], [492, 432]]);
      ctx.fill();
      poly(ctx, [[496, 432], [500, 424], [500, 434]]);
      ctx.fill();
      ctx.strokeStyle = '#e8a34c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(446, 452);
      ctx.quadraticCurveTo(432, 448, 436, 436);
      ctx.stroke();
    }
    // Hanging lamp
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(280, 0); ctx.lineTo(280, 40); ctx.stroke();
    ctx.fillStyle = '#ffd23f';
    poly(ctx, [[258, 40], [302, 40], [290, 62], [270, 62]]);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,210,63,0.2)';
    ellipse(ctx, 280, 90, 60, 30); ctx.fill();
  }

  // Difference metadata: scene coordinates, click radius, short label.
  var DIFFS = {
    harbor: [
      { x: 90, y: 70, r: 22, label: 'the missing seagull' },
      { x: 335, y: 138, r: 20, label: 'the sailboat flag' },
      { x: 330, y: 265, r: 18, label: 'the cabin window' },
      { x: 480, y: 380, r: 24, label: 'the missing buoy' },
      { x: 85, y: 128, r: 24, label: 'the lighthouse light' },
      { x: 200, y: 420, r: 22, label: 'the fish in the water' },
      { x: 420, y: 90, r: 26, label: 'the missing cloud' },
    ],
    garden: [
      { x: 470, y: 80, r: 30, label: 'the shape of the moon' },
      { x: 200, y: 328, r: 22, label: 'the cat on the bench' },
      { x: 300, y: 410, r: 22, label: 'the colour of the tulips' },
      { x: 250, y: 150, r: 20, label: 'the missing firefly' },
      { x: 480, y: 420, r: 22, label: 'the missing mushroom' },
      { x: 170, y: 350, r: 20, label: 'the bench slats' },
      { x: 100, y: 250, r: 22, label: 'the cottage window light' },
    ],
    bakery: [
      { x: 240, y: 288, r: 18, label: 'the cherry on the cupcake' },
      { x: 480, y: 90, r: 28, label: 'the time on the clock' },
      { x: 230, y: 138, r: 20, label: 'the missing jar' },
      { x: 460, y: 378, r: 20, label: 'the missing loaf' },
      { x: 470, y: 440, r: 24, label: 'the sleeping cat' },
      { x: 100, y: 130, r: 26, label: 'the colour of the curtains' },
      { x: 330, y: 358, r: 18, label: 'the price on the sign' },
    ],
  };

  window.SpotScenes = {
    draw: { harbor: drawHarbor, garden: drawGarden, bakery: drawBakery },
    DIFFS: DIFFS,
  };
})();
