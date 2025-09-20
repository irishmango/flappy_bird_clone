import React, { useEffect, useRef } from 'react'

// Utility: persistent high score
const HighScore = {
  key: 'flappy_highscore_v1',
  get() {
    const n = Number(localStorage.getItem(this.key) || 0);
    return Number.isFinite(n) ? n : 0;
  },
  set(v) {
    localStorage.setItem(this.key, String(v));
  }
}

export default function GameCanvas({ width = 360, height = 520 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  // init once
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    const W = c.width = width;
    const H = c.height = height;

    // constants
    const birdX = 80;
    const birdR = 11;
    const gravity = 0.22;
    const jump = -6.3;
    const pipeW = 44;
    const gap = 120;
    const speed = 1.8;
    const spawnIntervalFrames = 85;

    const reset = () => (stateRef.current = {
      running: true,
      frame: 0,
      birdY: H / 2, vel: 0,
      pipes: [],
      score: 0,
      high: HighScore.get(),
      // for parallax background
      bg1: 0, bg2: 0, bg3: 0,
      // for sprite animation
      flapFrame: 0
    });

    reset();

    const spawnPipe = () => {
      const margin = 46;
      const gapY = Math.random() * (H - gap - 2 * margin) + margin;
      stateRef.current.pipes.push({ x: W + pipeW, gapY, passed: false });
    };

    const input = () => {
      const s = stateRef.current;
      if (!s.running) {
        reset();
        return;
      }
      s.vel = jump;
    };

    const keyHandler = (e) => {
      if (e.code === 'Space') { e.preventDefault(); input(); }
    };
    const mouseHandler = () => input();
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('mousedown', mouseHandler);
    window.addEventListener('touchstart', mouseHandler, { passive: true });

    let raf;
    const loop = () => {
      const s = stateRef.current;
      s.frame++;

      // physics
      s.vel += gravity;
      s.birdY += s.vel;

      // pipes
      if (s.frame % spawnIntervalFrames === 0) spawnPipe();
      for (const p of s.pipes) p.x -= speed;
      s.pipes = s.pipes.filter(p => p.x + pipeW > -2);

      // collisions & score
      for (const p of s.pipes) {
        const inX = birdX + birdR > p.x && birdX - birdR < p.x + pipeW;
        const hitTop = s.birdY - birdR < p.gapY;
        const hitBot = s.birdY + birdR > p.gapY + gap;
        if (inX && (hitTop || hitBot)) s.running = false;
        if (!p.passed && p.x + pipeW < birdX) { p.passed = true; s.score++; }
      }
      if (s.birdY - birdR < 0 || s.birdY + birdR > H) s.running = false;

      if (!s.running) {
        s.high = Math.max(s.high, s.score);
        HighScore.set(s.high);
      }

      // parallax offsets
      s.bg1 -= 0.5; if (s.bg1 < -W) s.bg1 += W;
      s.bg2 -= 1.0; if (s.bg2 < -W) s.bg2 += W;
      s.bg3 -= 2.0; if (s.bg3 < -W) s.bg3 += W;

      // render
      // sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, W, H);

      // parallax mountains/clouds
      drawLayer(ctx, W, H, s.bg1, 40, 0.25, '#d7f0ff'); // far clouds
      drawLayer(ctx, W, H, s.bg2, 90, 0.4, '#bde0fe'); // mid hills
      drawLayer(ctx, W, H, s.bg3, 140, 0.6, '#9bd1ff'); // near hills

      // ground
      ctx.fillStyle = '#7ac74f';
      ctx.fillRect(0, H - 18, W, 18);

      // pipes
      ctx.fillStyle = '#4caf50';
      for (const p of s.pipes) {
        ctx.fillRect(p.x, 0, pipeW, p.gapY);                        // top
        ctx.fillRect(p.x, p.gapY + gap, pipeW, H - (p.gapY + gap) - 18); // bottom
        // lip
        ctx.fillStyle = '#66bb6a';
        ctx.fillRect(p.x - 2, p.gapY - 8, pipeW + 4, 8);
        ctx.fillRect(p.x - 2, p.gapY + gap, pipeW + 4, 8);
        ctx.fillStyle = '#4caf50';
      }

      // simple sprite animation (3-wing frames)
      s.flapFrame = (s.flapFrame + 1) % 21;
      const wing = Math.floor(s.flapFrame / 7); // 0..2
      drawBird(ctx, birdX, s.birdY, birdR, wing);

      // UI
      ctx.fillStyle = '#111';
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillText(`Score: ${s.score}`, 10, 26);
      ctx.fillText(`High: ${s.high}`, W - 110, 26);

      if (!s.running) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = '24px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', W / 2, H / 2 - 10);
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Press Space / Click / Touch to restart', W / 2, H / 2 + 18);
        ctx.textAlign = 'start';
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('mousedown', mouseHandler);
      window.removeEventListener('touchstart', mouseHandler);
    };
  }, [width, height]);

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: '#eef' }} />
    </div>
  )
}

// draw bird with 3 wing positions
function drawBird(ctx, x, y, r, wing = 0) {
  // body
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // eye
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(x + r * 0.25, y - r * 0.25, r * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // beak
  ctx.fillStyle = '#ff9f1c';
  ctx.beginPath();
  ctx.moveTo(x + r * 0.95, y);
  ctx.lineTo(x + r * 1.5, y - r * 0.2);
  ctx.lineTo(x + r * 0.95, y + r * 0.2);
  ctx.closePath();
  ctx.fill();

  // wing positions
  ctx.fillStyle = '#fcbf49';
  ctx.beginPath();
  if (wing === 0) { // up
    ctx.moveTo(x - r * 0.2, y);
    ctx.lineTo(x - r * 1.1, y - r * 0.9);
    ctx.lineTo(x - r * 0.1, y - r * 0.1);
  } else if (wing === 1) { // mid
    ctx.moveTo(x - r * 0.2, y);
    ctx.lineTo(x - r * 1.0, y);
    ctx.lineTo(x - r * 0.1, y + r * 0.1);
  } else { // down
    ctx.moveTo(x - r * 0.2, y);
    ctx.lineTo(x - r * 1.0, y + r * 0.9);
    ctx.lineTo(x - r * 0.1, y + r * 0.1);
  }
  ctx.closePath();
  ctx.fill();
}

// parallax helper: draw repeating simple shapes
function drawLayer(ctx, W, H, offset, baseY, amp, color) {
  ctx.fillStyle = color;
  const step = 60;
  for (let k = -1; k < Math.ceil(W / step) + 1; k++) {
    const x = k * step + (offset % step);
    const h = 20 + Math.sin((k + offset * 0.02)) * 10 * amp;
    ctx.fillRect(x, baseY - h, step - 2, h);
  }
}