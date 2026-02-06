---
layout: layouts/base.njk
title: Games
permalink: /games/index.html
bodyClass: games-page
---

# Games

## 象棋广场舞

这是一个把中国象棋棋盘和广场舞节奏融合的小玩法：  
系统会给出舞步方向（上/下/左/右），你要在节拍结束前按顺序输入。每次成功，棋盘上的“棋子观众”会被你带动起舞并加分。

<div class="dance-game">
  <div class="dance-game__topbar">
    <div class="dance-game__stats">
      <span>分数：<strong id="score">0</strong></span>
      <span>连击：<strong id="combo">0</strong></span>
      <span>失误：<strong id="misses">0</strong>/3</span>
    </div>
    <div class="dance-game__controls">
      <button id="startGame" type="button">开始</button>
      <button id="resetGame" type="button">重置</button>
    </div>
  </div>

  <div class="dance-game__music">
    <label for="musicMode">背景音乐：</label>
    <select id="musicMode">
      <option value="off">关闭</option>
      <option value="beatA">内置节奏 A</option>
      <option value="beatB">内置节奏 B</option>
    </select>
    <button id="toggleMusic" type="button">播放/暂停</button>
    <label for="customMusic">上传你的音乐：</label>
    <input id="customMusic" type="file" accept="audio/*" />
    <audio id="customAudio" controls></audio>
  </div>

  <div class="dance-game__yt">
    <div class="dance-game__yt-controls">
      <a class="yt-open-link" href="https://music.youtube.com" target="_blank" rel="noopener noreferrer">打开 YouTube Music 挑选</a>
    </div>
  </div>

  <div id="statusText" class="dance-game__status">点击“开始”，跟着节拍跳起来。</div>

  <div class="dance-game__combo">
    <div>当前舞步：</div>
    <div id="targetCombo" class="dance-game__target">-</div>
    <div id="inputCombo" class="dance-game__input">-</div>
    <div class="dance-game__timer-wrap">
      <div id="timerBar" class="dance-game__timer"></div>
    </div>
  </div>

  <div id="board" class="dance-board" aria-label="Xiangqi dance board"></div>

  <div class="dance-pad" aria-label="Direction pad">
    <button type="button" data-dir="up">↑</button>
    <button type="button" data-dir="left">←</button>
    <button type="button" data-dir="down">↓</button>
    <button type="button" data-dir="right">→</button>
  </div>
</div>

<script>
  (function () {
    try {
    const ROWS = 10;
    const COLS = 9;
    const MAX_MISSES = 3;
    const STEP_POOL = ["up", "down", "left", "right"];
    const DIR_LABEL = { up: "↑", down: "↓", left: "←", right: "→" };

    const boardEl = document.getElementById("board");
    const scoreEl = document.getElementById("score");
    const comboEl = document.getElementById("combo");
    const missesEl = document.getElementById("misses");
    const targetComboEl = document.getElementById("targetCombo");
    const inputComboEl = document.getElementById("inputCombo");
    const statusTextEl = document.getElementById("statusText");
    const timerBarEl = document.getElementById("timerBar");
    const startBtn = document.getElementById("startGame");
    const resetBtn = document.getElementById("resetGame");
    const padButtons = document.querySelectorAll(".dance-pad button");

    const musicModeEl = document.getElementById("musicMode");
    const toggleMusicBtn = document.getElementById("toggleMusic");
    const customMusicEl = document.getElementById("customMusic");
    const customAudioEl = document.getElementById("customAudio");

    let cells = [];
    let pieces = [];
    let player = { r: 9, c: 4 };
    let score = 0;
    let combo = 0;
    let misses = 0;
    let running = false;
    let roundDeadline = null;
    let roundTimer = null;
    let timerRaf = null;
    let currentTarget = [];
    let currentInput = [];

    let audioCtx = null;
    let beatInterval = null;
    let isBeatPlaying = false;

    function makeBoard() {
      boardEl.innerHTML = "";
      cells = [];
      for (let r = 0; r < ROWS; r += 1) {
        for (let c = 0; c < COLS; c += 1) {
          const cell = document.createElement("div");
          cell.className = "dance-cell";
          cell.dataset.r = String(r);
          cell.dataset.c = String(c);
          boardEl.appendChild(cell);
          cells.push(cell);
        }
      }
    }

    function getCell(r, c) {
      return cells[r * COLS + c];
    }

    function seedPieces() {
      pieces = [];
      const seeds = [
        [0, 0, "車"], [0, 2, "象"], [0, 4, "將"], [0, 6, "象"], [0, 8, "車"],
        [2, 1, "炮"], [2, 7, "炮"], [3, 0, "卒"], [3, 2, "卒"], [3, 4, "卒"],
        [3, 6, "卒"], [3, 8, "卒"]
      ];
      seeds.forEach(function (s) {
        pieces.push({ r: s[0], c: s[1], text: s[2], active: true });
      });
    }

    function renderBoard() {
      cells.forEach(function (cell) {
        cell.textContent = "";
        cell.classList.remove("is-player", "is-dancing", "is-beat");
      });

      pieces.forEach(function (p) {
        if (!p.active) return;
        const cell = getCell(p.r, p.c);
        if (!cell) return;
        cell.textContent = p.text;
      });

      const playerCell = getCell(player.r, player.c);
      if (playerCell) {
        playerCell.classList.add("is-player");
        playerCell.textContent = "帅";
      }
    }

    function randomStep(len) {
      const out = [];
      for (let i = 0; i < len; i += 1) {
        out.push(STEP_POOL[Math.floor(Math.random() * STEP_POOL.length)]);
      }
      return out;
    }

    function formatSteps(arr) {
      return arr.map(function (d) { return DIR_LABEL[d]; }).join(" ");
    }

    function updateStats() {
      scoreEl.textContent = String(score);
      comboEl.textContent = String(combo);
      missesEl.textContent = String(misses);
    }

    function clearTimers() {
      if (roundTimer) {
        clearTimeout(roundTimer);
        roundTimer = null;
      }
      if (timerRaf) {
        cancelAnimationFrame(timerRaf);
        timerRaf = null;
      }
    }

    function timerTick() {
      if (!roundDeadline || !running) return;
      const now = Date.now();
      const left = Math.max(0, roundDeadline - now);
      const total = 4500;
      const p = (left / total) * 100;
      timerBarEl.style.width = p + "%";
      if (left > 0) timerRaf = requestAnimationFrame(timerTick);
    }

    function activateRandomAudience() {
      const alive = pieces.filter(function (p) { return p.active; });
      if (!alive.length) return;
      const pick = alive[Math.floor(Math.random() * alive.length)];
      const cell = getCell(pick.r, pick.c);
      if (!cell) return;
      cell.classList.add("is-dancing");
      setTimeout(function () {
        cell.classList.remove("is-dancing");
      }, 450);
    }

    function maybeClearPiece() {
      const alive = pieces.filter(function (p) { return p.active; });
      if (!alive.length) return;
      const pick = alive[Math.floor(Math.random() * alive.length)];
      pick.active = false;
    }

    function movePlayer(dir) {
      if (dir === "up") player.r = Math.max(0, player.r - 1);
      if (dir === "down") player.r = Math.min(ROWS - 1, player.r + 1);
      if (dir === "left") player.c = Math.max(0, player.c - 1);
      if (dir === "right") player.c = Math.min(COLS - 1, player.c + 1);
    }

    function startRound() {
      clearTimers();
      currentInput = [];
      currentTarget = randomStep(4);
      targetComboEl.textContent = formatSteps(currentTarget);
      inputComboEl.textContent = "-";
      statusTextEl.textContent = "跟上节拍，按方向键（或点下方按钮）。";
      roundDeadline = Date.now() + 4500;
      timerBarEl.style.width = "100%";
      timerTick();

      roundTimer = setTimeout(function () {
        handleRoundFail("超时了，下一轮继续。");
      }, 4500);
    }

    function handleRoundSuccess() {
      clearTimers();
      combo += 1;
      score += 20 + combo * 5;
      updateStats();
      activateRandomAudience();
      if (combo % 3 === 0) {
        maybeClearPiece();
      }
      renderBoard();
      statusTextEl.textContent = "节奏命中，继续！";
      setTimeout(startRound, 700);
    }

    function handleRoundFail(msg) {
      clearTimers();
      combo = 0;
      misses += 1;
      updateStats();
      statusTextEl.textContent = msg;
      if (misses >= MAX_MISSES) {
        endGame("游戏结束：广场舞队伍散场了。");
        return;
      }
      setTimeout(startRound, 700);
    }

    function inputStep(dir) {
      if (!running) return;
      currentInput.push(dir);
      movePlayer(dir);
      renderBoard();
      inputComboEl.textContent = formatSteps(currentInput);
      const idx = currentInput.length - 1;
      if (currentInput[idx] !== currentTarget[idx]) {
        handleRoundFail("舞步踩错了。");
        return;
      }
      if (currentInput.length === currentTarget.length) {
        handleRoundSuccess();
      }
    }

    function endGame(msg) {
      running = false;
      clearTimers();
      statusTextEl.textContent = msg + " 最终分数：" + score;
      targetComboEl.textContent = "-";
      inputComboEl.textContent = "-";
      timerBarEl.style.width = "0%";
    }

    function resetGame() {
      running = false;
      clearTimers();
      score = 0;
      combo = 0;
      misses = 0;
      player = { r: 9, c: 4 };
      seedPieces();
      renderBoard();
      updateStats();
      statusTextEl.textContent = "点击“开始”，跟着节拍跳起来。";
      targetComboEl.textContent = "-";
      inputComboEl.textContent = "-";
      timerBarEl.style.width = "0%";
    }

    function startGame() {
      resetGame();
      running = true;
      statusTextEl.textContent = "准备好，广场舞开始。";
      setTimeout(startRound, 500);
    }

    function ensureAudioCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    }

    function triggerBeat(freq, duration, gainVal) {
      ensureAudioCtx();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    function startBeatMusic() {
      stopBeatMusic();
      const mode = musicModeEl.value;
      if (mode === "off") return;
      isBeatPlaying = true;
      let tick = 0;
      beatInterval = setInterval(function () {
        if (!isBeatPlaying) return;
        if (mode === "beatA") {
          triggerBeat(tick % 4 === 0 ? 130 : 200, 0.12, 0.08);
        } else {
          triggerBeat(tick % 3 === 0 ? 160 : 240, 0.09, 0.07);
          if (tick % 2 === 0) triggerBeat(320, 0.05, 0.04);
        }
        tick += 1;
      }, 380);
    }

    function stopBeatMusic() {
      isBeatPlaying = false;
      if (beatInterval) {
        clearInterval(beatInterval);
        beatInterval = null;
      }
    }

    startBtn.addEventListener("click", startGame);
    resetBtn.addEventListener("click", resetGame);

    padButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        inputStep(btn.dataset.dir);
      });
    });

    window.addEventListener("keydown", function (e) {
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
      };
      if (!map[e.key]) return;
      e.preventDefault();
      inputStep(map[e.key]);
    });

    musicModeEl.addEventListener("change", function () {
      if (isBeatPlaying) startBeatMusic();
    });

    toggleMusicBtn.addEventListener("click", function () {
      if (isBeatPlaying) {
        stopBeatMusic();
      } else {
        startBeatMusic();
      }
    });

    customMusicEl.addEventListener("change", function () {
      const file = customMusicEl.files && customMusicEl.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      customAudioEl.src = url;
      customAudioEl.loop = true;
      customAudioEl.play().catch(function () {});
    });

    if (!boardEl || !startBtn || !resetBtn) return;
    makeBoard();
    resetGame();
    } catch (err) {
      const status = document.getElementById("statusText");
      if (status) status.textContent = "棋盘初始化失败，请刷新页面重试。";
    }
  })();
</script>

<hr />

## 3D 简易射击

更接近 `RIVALS` 的快节奏对枪感版本：  
点击画布锁定鼠标后，`WASD` 移动，`Shift` 冲刺，`空格/J` 射击，`1/2` 切武器，`ESC` 退出鼠标锁定。

<div class="shooter3d">
  <div class="shooter3d__hud">
    <span>生命：<strong id="shooterHp">100</strong></span>
    <span>击杀：<strong id="shooterKills">0</strong></span>
    <span>武器：<strong id="shooterWeapon">SMG</strong></span>
    <span>连杀：<strong id="shooterStreak">0</strong></span>
    <span>状态：<strong id="shooterState">准备中</strong></span>
    <button id="shooterRestart" type="button">重新开始</button>
  </div>
  <div class="shooter3d__hint">点击画布进入鼠标视角</div>
  <canvas id="shooterCanvas" width="900" height="440" aria-label="3D shooter canvas"></canvas>
</div>

<script>
  (function () {
    const canvas = document.getElementById("shooterCanvas");
    const hpEl = document.getElementById("shooterHp");
    const killsEl = document.getElementById("shooterKills");
    const weaponEl = document.getElementById("shooterWeapon");
    const streakEl = document.getElementById("shooterStreak");
    const stateEl = document.getElementById("shooterState");
    const restartBtn = document.getElementById("shooterRestart");
    if (!canvas || !hpEl || !killsEl || !weaponEl || !streakEl || !stateEl || !restartBtn) return;

    const ctx = canvas.getContext("2d");
    const map = [
      "############",
      "#..........#",
      "#..##......#",
      "#..........#",
      "#.....###..#",
      "#..........#",
      "#..#.......#",
      "#......#...#",
      "#..........#",
      "#...##.....#",
      "#..........#",
      "############"
    ];
    const mapW = map[0].length;
    const mapH = map.length;
    const FOV = Math.PI / 3;
    const MAX_DEPTH = 16;
    const keys = Object.create(null);
    const weapons = {
      smg: { label: "SMG", cooldown: 0.1, damage: 14, spread: 0.035, recoil: 0.012 },
      rifle: { label: "RIFLE", cooldown: 0.24, damage: 34, spread: 0.016, recoil: 0.02 }
    };

    let player = { x: 2.5, y: 2.5, a: 0, hp: 100 };
    let kills = 0;
    let streak = 0;
    let enemies = [];
    let running = true;
    let lastTs = performance.now();
    let shootCd = 0;
    let hitFlash = 0;
    let muzzleFlash = 0;
    let pointerLocked = false;
    let currentWeapon = "smg";
    let spawnCd = 0;

    function spawnEnemies() {
      enemies = [
        { x: 8.5, y: 2.5, hp: 44, alive: true, fireCd: 0.4, vx: 0, vy: 0, strafeT: 0 },
        { x: 9.0, y: 8.0, hp: 44, alive: true, fireCd: 0.9, vx: 0, vy: 0, strafeT: 0 },
        { x: 5.5, y: 6.5, hp: 44, alive: true, fireCd: 0.6, vx: 0, vy: 0, strafeT: 0 },
        { x: 2.5, y: 9.0, hp: 44, alive: true, fireCd: 1.1, vx: 0, vy: 0, strafeT: 0 }
      ];
    }

    function spawnOneEnemy() {
      const spots = [
        [8.5, 2.5], [9, 8], [5.5, 6.5], [2.5, 9], [8.5, 9], [2.5, 5.5]
      ];
      const pick = spots[Math.floor(Math.random() * spots.length)];
      enemies.push({ x: pick[0], y: pick[1], hp: 44, alive: true, fireCd: 0.8, vx: 0, vy: 0, strafeT: 0 });
    }

    function isWall(x, y) {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      if (xi < 0 || yi < 0 || xi >= mapW || yi >= mapH) return true;
      return map[yi][xi] === "#";
    }

    function castRay(angle) {
      const step = 0.02;
      let d = 0;
      while (d < MAX_DEPTH) {
        const rx = player.x + Math.cos(angle) * d;
        const ry = player.y + Math.sin(angle) * d;
        if (isWall(rx, ry)) return d;
        d += step;
      }
      return MAX_DEPTH;
    }

    function move(dx, dy) {
      const nx = player.x + dx;
      const ny = player.y + dy;
      if (!isWall(nx, player.y)) player.x = nx;
      if (!isWall(player.x, ny)) player.y = ny;
    }

    function normalizeAngle(a) {
      while (a < -Math.PI) a += Math.PI * 2;
      while (a > Math.PI) a -= Math.PI * 2;
      return a;
    }

    function setWeapon(id) {
      if (!weapons[id]) return;
      currentWeapon = id;
      weaponEl.textContent = weapons[id].label;
    }

    function shoot() {
      if (!running || shootCd > 0) return;
      const gun = weapons[currentWeapon];
      shootCd = gun.cooldown;
      muzzleFlash = 0.08;
      const center = player.a + (Math.random() - 0.5) * gun.spread;
      player.a += (Math.random() - 0.5) * gun.recoil;
      let best = null;
      enemies.forEach(function (e) {
        if (!e.alive) return;
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const dist = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        const diff = Math.abs(normalizeAngle(ang - center));
        if (diff > 0.08) return;
        const wallD = castRay(ang);
        if (wallD + 0.05 < dist) return;
        if (!best || dist < best.dist) best = { e: e, dist: dist };
      });
      if (best) {
        best.e.hp -= gun.damage;
        if (best.e.hp <= 0 && best.e.alive) {
          best.e.alive = false;
          kills += 1;
          streak += 1;
        }
      } else {
        streak = 0;
      }
    }

    function update(dt) {
      if (!running) return;
      const sprint = keys["shift"] ? 1.7 : 1;
      const moveSpeed = 2.65 * sprint * dt;
      const fwdX = Math.cos(player.a);
      const fwdY = Math.sin(player.a);
      const sideX = Math.cos(player.a + Math.PI / 2);
      const sideY = Math.sin(player.a + Math.PI / 2);

      if (keys["w"]) move(fwdX * moveSpeed, fwdY * moveSpeed);
      if (keys["s"]) move(-fwdX * moveSpeed, -fwdY * moveSpeed);
      if (keys["a"]) move(-sideX * moveSpeed, -sideY * moveSpeed);
      if (keys["d"]) move(sideX * moveSpeed, sideY * moveSpeed);

      enemies.forEach(function (e) {
        if (!e.alive) return;
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.hypot(dx, dy);
        const angleToPlayer = Math.atan2(dy, dx);
        e.strafeT -= dt;
        if (e.strafeT <= 0) {
          const side = Math.random() < 0.5 ? -1 : 1;
          e.vx = Math.cos(angleToPlayer + (Math.PI / 2) * side) * 0.4;
          e.vy = Math.sin(angleToPlayer + (Math.PI / 2) * side) * 0.4;
          e.strafeT = 0.5 + Math.random() * 0.7;
        }
        if (dist > 0.9) {
          const step = 0.78 * dt;
          const nx = e.x + (dx / dist) * step + e.vx * dt;
          const ny = e.y + (dy / dist) * step + e.vy * dt;
          if (!isWall(nx, ny)) {
            e.x = nx;
            e.y = ny;
          }
        }
        e.fireCd -= dt;
        const los = castRay(angleToPlayer);
        if (e.fireCd <= 0 && los + 0.08 >= dist && dist < 8.5) {
          player.hp -= 8;
          hitFlash = 0.22;
          e.fireCd = 0.55 + Math.random() * 0.55;
        }
      });

      if (shootCd > 0) shootCd -= dt;
      if (hitFlash > 0) hitFlash -= dt;
      if (muzzleFlash > 0) muzzleFlash -= dt;
      spawnCd -= dt;
      if (spawnCd <= 0 && enemies.filter(function (e) { return e.alive; }).length < 4) {
        spawnOneEnemy();
        spawnCd = 2.2;
      }
      if (player.hp <= 0) {
        player.hp = 0;
        running = false;
      }
    }

    function render() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, "#213f63");
      sky.addColorStop(1, "#2d587f");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.5);

      const floor = ctx.createLinearGradient(0, h * 0.5, 0, h);
      floor.addColorStop(0, "#1b3150");
      floor.addColorStop(1, "#0c182d");
      ctx.fillStyle = floor;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      const depthBuf = new Array(w);
      for (let x = 0; x < w; x += 1) {
        const camX = (x / w) - 0.5;
        const rayA = player.a + camX * FOV;
        let dist = castRay(rayA);
        dist *= Math.cos(rayA - player.a);
        depthBuf[x] = dist;
        const wallH = Math.min(h, (h * 0.92) / Math.max(dist, 0.001));
        const y0 = (h - wallH) / 2;
        const shade = Math.max(38, 210 - dist * 18);
        ctx.fillStyle = "rgb(" + shade + "," + (shade + 8) + "," + (shade + 25) + ")";
        ctx.fillRect(x, y0, 1, wallH);
      }

      enemies.forEach(function (e) {
        if (!e.alive) return;
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const dist = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        const rel = normalizeAngle(ang - player.a);
        if (Math.abs(rel) > FOV / 2 + 0.2) return;
        const sx = ((rel / FOV) + 0.5) * w;
        const size = Math.min(h * 0.7, (h * 0.6) / Math.max(dist, 0.001));
        const sy = h * 0.5 - size * 0.5;
        const left = Math.floor(sx - size * 0.3);
        const right = Math.floor(sx + size * 0.3);
        let visible = false;
        for (let x = Math.max(0, left); x < Math.min(w, right); x += 1) {
          if (dist < depthBuf[x] + 0.05) { visible = true; break; }
        }
        if (!visible) return;
        ctx.fillStyle = "rgba(240,115,82,0.95)";
        ctx.fillRect(sx - size * 0.28, sy, size * 0.56, size);
        ctx.fillStyle = "rgba(255,235,210,0.95)";
        ctx.fillRect(sx - size * 0.16, sy + size * 0.12, size * 0.12, size * 0.12);
        ctx.fillRect(sx + size * 0.04, sy + size * 0.12, size * 0.12, size * 0.12);
      });

      ctx.strokeStyle = "rgba(220,238,255,0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 9, h / 2);
      ctx.lineTo(w / 2 + 9, h / 2);
      ctx.moveTo(w / 2, h / 2 - 9);
      ctx.lineTo(w / 2, h / 2 + 9);
      ctx.stroke();

      if (muzzleFlash > 0) {
        ctx.fillStyle = "rgba(255,210,140," + Math.min(0.2, muzzleFlash * 2) + ")";
        ctx.fillRect(w / 2 - 18, h / 2 - 18, 36, 36);
      }

      if (hitFlash > 0) {
        ctx.fillStyle = "rgba(255,40,40," + Math.min(0.25, hitFlash) + ")";
        ctx.fillRect(0, 0, w, h);
      }
    }

    function updateHud() {
      hpEl.textContent = String(Math.max(0, Math.round(player.hp)));
      killsEl.textContent = String(kills);
      streakEl.textContent = String(streak);
      if (!running) {
        if (player.hp <= 0) stateEl.textContent = "已被击倒";
        else stateEl.textContent = "回合结束";
      } else {
        stateEl.textContent = pointerLocked ? "战斗中" : "点击画布进入鼠标视角";
      }
    }

    function loop(ts) {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      update(dt);
      render();
      updateHud();
      requestAnimationFrame(loop);
    }

    function resetShooter() {
      player = { x: 2.5, y: 2.5, a: 0, hp: 100 };
      kills = 0;
      streak = 0;
      running = true;
      shootCd = 0;
      hitFlash = 0;
      muzzleFlash = 0;
      spawnCd = 1.4;
      spawnEnemies();
      setWeapon(currentWeapon);
      stateEl.textContent = pointerLocked ? "战斗中" : "点击画布进入鼠标视角";
    }

    function resizeCanvas() {
      const maxW = Math.min(900, canvas.parentElement.clientWidth - 4);
      canvas.width = Math.max(320, maxW);
      canvas.height = Math.round(canvas.width * 0.48);
    }

    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("keydown", function (e) {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "shift"].includes(k)) keys[k] = true;
      if (e.key === " " || k === "j") {
        e.preventDefault();
        shoot();
      }
      if (k === "1") setWeapon("smg");
      if (k === "2") setWeapon("rifle");
    });
    document.addEventListener("keyup", function (e) {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "shift"].includes(k)) keys[k] = false;
    });
    document.addEventListener("pointerlockchange", function () {
      pointerLocked = (document.pointerLockElement === canvas);
      stateEl.textContent = pointerLocked ? "战斗中" : "点击画布进入鼠标视角";
    });
    document.addEventListener("mousemove", function (e) {
      if (!pointerLocked || !running) return;
      player.a += e.movementX * 0.0026;
    });
    canvas.addEventListener("click", function () {
      if (!pointerLocked) canvas.requestPointerLock();
      else shoot();
    });
    restartBtn.addEventListener("click", resetShooter);

    resizeCanvas();
    setWeapon("smg");
    resetShooter();
    requestAnimationFrame(function (ts) {
      lastTs = ts;
      loop(ts);
    });
  })();
</script>
