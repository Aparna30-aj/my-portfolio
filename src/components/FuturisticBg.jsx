import { useEffect, useRef } from "react";
import "./FuturisticBg.css";

export default function FuturisticBg({ theme = "dark" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    let running = true;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const isLightTheme = theme === "light";
    const colors = {
      bg: isLightTheme ? "#edf3fb" : "#050816",
      neon: "#38bdf8", // cyan
      neon2: "#a78bfa", // purple
      mint: "#34d399",
      white: "rgba(255,255,255,0.9)",
    };

    const mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      inside: false,
    };

    const field = {
      mx: 0,
      my: 0,
      // magnetic strength scales with proximity and click pulses
      strength: 1,
    };

    const resize = () => {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      w = nextW;
      h = nextH;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Reset transform (avoid compounding scale on repeated resizes)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize mouse position to center on first resize
      if (!mouse.inside) {
        mouse.x = w / 2;
        mouse.y = h / 2;
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }

      field.mx = mouse.x;
      field.my = mouse.y;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const reduceMotion = window.matchMedia("(max-width: 640px)").matches;

    // --- Layers ---
    // Depth: 0 (far) -> 2 (near)
    const layers = [
      { z: 0, speedMul: 0.35, nodeCount: 70, partCount: 180, lineDist: 110 },
      { z: 1, speedMul: 0.6, nodeCount: 95, partCount: 260, lineDist: 140 },
      { z: 2, speedMul: 0.95, nodeCount: 120, partCount: 340, lineDist: 170 },
    ];

    // --- Grid points (matrix-like) ---
    // We avoid static decorations by animating point intensity/offset.
    const grid = {
      cell: 36,
      jitter: 0.35,
      points: [],
      lastSeed: 0,
    };

    const hex = {
      cell: 64,
      opacity: 0.22,
    };

    const TWO_PI = Math.PI * 2;

    const rand = (a, b) => a + Math.random() * (b - a);

    const buildGrid = () => {
      grid.points = [];
      const step = grid.cell;
      const cols = Math.ceil(w / step) + 3;
      const rows = Math.ceil(h / step) + 3;
      const ox = -step;
      const oy = -step;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * step;
          const y = oy + r * step;
          grid.points.push({
            x,
            y,
            phase: Math.random() * TWO_PI,
            tw: Math.random() * 1 + 0.25,
          });
        }
      }
      grid.lastSeed = performance.now();
    };

    buildGrid();

    let resizeRaf = 0;
    const handleResizeDebounced = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        buildGrid();
      });
    };
    window.addEventListener("resize", handleResizeDebounced, { passive: true });

    // --- Neural nodes ---
    class Node {
      constructor(layerZ) {
        this.layerZ = layerZ;
        this.reset(true);
      }

      reset(soft = false) {
        const margin = 60;
        this.x = rand(-margin, w + margin);
        this.y = rand(-margin, h + margin);
        this.vx = rand(-0.35, 0.35);
        this.vy = rand(-0.35, 0.35);
        this.base = { x: this.x, y: this.y };
        this.radius = rand(0.9, this.layerZ === 2 ? 2.2 : 1.8);
        this.mass = rand(0.7, 1.8);
        this.colorPick = Math.random();
        this.orbit = rand(0.6, 1.5);
        this.angle = rand(0, TWO_PI);
        this.orbitR = rand(10, 45);
        this.wander = rand(0.35, 1.1);
        this.trail = [];
        this.soft = soft;
      }

      update(dt, mx, my, clickers) {
        // dt in seconds
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.hypot(dx, dy) + 0.0001;

        // magnetic field attraction + tangential orbit flow
        const attractRange = 240 - this.layerZ * 45;
        const flowRange = 320 - this.layerZ * 55;

        let ax = 0;
        let ay = 0;

        if (dist < flowRange) {
          const t = 1 - dist / flowRange;
          // orbit component: rotate force 90 degrees
          const tangX = -dy / dist;
          const tangY = dx / dist;
          const ring = 1 / (1 + dist * 0.01);

          // Attraction stronger closer
          if (dist < attractRange) {
            const k = 0.65 * t * t;
            ax += (-dx / dist) * k;
            ay += (-dy / dist) * k;
          }

          // Tangential flow to get orbit/flow around cursor
          const k2 = 0.85 * t * ring;
          ax += tangX * k2;
          ay += tangY * k2;

          // Subtle depth parallax
          ax += (mx - field.mx) * 0.00012 * (this.layerZ + 1);
          ay += (my - field.my) * 0.00012 * (this.layerZ + 1);
        }

        // Click pulses (scatter/shockwave)
        for (let i = 0; i < clickers.length; i++) {
          const p = clickers[i];
          const cdx = this.x - p.x;
          const cdy = this.y - p.y;
          const cd = Math.hypot(cdx, cdy) + 0.0001;
          const ageT = p.age;
          const shock = p.radius - cd;
          const inside = cd < p.radius;

          // outward deflection within pulse radius band
          if (inside && shock > -18 && shock < 18) {
            const band = 1 - Math.abs(shock) / 18;
            const outX = cdx / cd;
            const outY = cdy / cd;
            const strength = p.strength * band * (0.6 + this.layerZ * 0.25);
            ax += outX * strength;
            ay += outY * strength;
          }

          // add a faint ring drift around the wavefront
          if (Math.abs(shock) < 8 && ageT > 0.05) {
            const tangX = -cdy / cd;
            const tangY = cdx / cd;
            const band = 1 - Math.abs(shock) / 8;
            ax += tangX * p.ring * band;
            ay += tangY * p.ring * band;
          }
        }

        // Spring back toward base motion center
        const sx = this.base.x - this.x;
        const sy = this.base.y - this.y;
        ax += sx * 0.0009;
        ay += sy * 0.0009;

        // procedural drift
        this.angle += this.orbit * dt * (0.8 + this.layerZ * 0.2);
        const targetBx = this.base.x + Math.cos(this.angle) * this.orbitR * (0.25 + this.layerZ * 0.1);
        const targetBy = this.base.y + Math.sin(this.angle) * this.orbitR * (0.25 + this.layerZ * 0.1);
        const bdx = targetBx - this.x;
        const bdy = targetBy - this.y;
        ax += bdx * 0.0008 * this.wander;
        ay += bdy * 0.0008 * this.wander;

        // velocity damping and integration
        this.vx = (this.vx + ax * dt) * 0.88;
        this.vy = (this.vy + ay * dt) * 0.88;

        // depth speed scaling
        const sp = layerSpeed(this.layerZ);
        this.x += this.vx * dt * 60 * sp;
        this.y += this.vy * dt * 60 * sp;

        // Wrap-around
        if (this.x < -80) this.x = w + 80;
        if (this.x > w + 80) this.x = -80;
        if (this.y < -80) this.y = h + 80;
        if (this.y > h + 80) this.y = -80;

        // maintain soft wandering base
        if (Math.random() < 0.02) {
          this.base.x += rand(-0.6, 0.6) * (1 + this.layerZ * 0.25) * this.wander;
          this.base.y += rand(-0.6, 0.6) * (1 + this.layerZ * 0.25) * this.wander;
        }

        // trail (short)
        this.trail.unshift({ x: this.x, y: this.y });
        const maxTrail = reduceMotion ? 6 : 10;
        if (this.trail.length > maxTrail) this.trail.pop();
      }

      draw(ctx, brightness) {
        // brightness: 0..1
        // Draw lines are handled elsewhere; this draws node + short trail
        if (this.trail.length > 1) {
          for (let i = 1; i < this.trail.length; i++) {
            const t = i / this.trail.length;
            const a = (1 - t) * 0.18 * brightness;
            ctx.fillStyle = `rgba(56,189,248,${a})`;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, Math.max(0.6, this.radius * (1 - t * 0.7)), 0, TWO_PI);
            ctx.fill();
          }
        }

        let c;
        if (this.colorPick < 0.45) c = colors.neon;
        else if (this.colorPick < 0.75) c = colors.neon2;
        else c = colors.mint;

        // core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.12 * brightness})`;
        ctx.arc(this.x, this.y, this.radius * 1.15, 0, TWO_PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `${hexToRgba(c, 0.85 * brightness)}`;
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fill();
      }
    }

    const hexToRgba = (hexStr, a) => {
      // expects #rrggbb
      const h = hexStr.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    };

    const layerSpeed = (z) => (z === 0 ? 0.35 : z === 1 ? 0.6 : 0.95);

    // --- Tiny particles (digital dust) ---
    class Dust {
      constructor(layerZ) {
        this.layerZ = layerZ;
        this.reset();
      }

      reset() {
        const margin = 80;
        this.x = rand(-margin, w + margin);
        this.y = rand(-margin, h + margin);
        this.vx = rand(-1, 1) * 0.2;
        this.vy = rand(-1, 1) * 0.2;
        this.size = rand(0.6, 1.4) * (1 + this.layerZ * 0.25);
        this.phase = rand(0, TWO_PI);
        this.tw = rand(0.6, 1.4);
        this.trail = [];
        this.huePick = Math.random();
      }

      update(dt, mx, my, clickers) {
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.hypot(dx, dy) + 0.0001;

        let ax = 0;
        let ay = 0;

        const range = 200 - this.layerZ * 20;
        if (dist < range) {
          const t = 1 - dist / range;
          // attraction
          ax += (-dx / dist) * t * t * (0.9 - this.layerZ * 0.15);
          ay += (-dy / dist) * t * t * (0.9 - this.layerZ * 0.15);
          // orbit
          ax += (-dy / dist) * t * 0.55;
          ay += (dx / dist) * t * 0.55;
        }

        // click scattering
        for (let i = 0; i < clickers.length; i++) {
          const p = clickers[i];
          const cdx = this.x - p.x;
          const cdy = this.y - p.y;
          const cd = Math.hypot(cdx, cdy) + 0.0001;
          const shock = p.radius - cd;
          if (cd < p.radius && shock > -14 && shock < 14) {
            const band = 1 - Math.abs(shock) / 14;
            const outX = cdx / cd;
            const outY = cdy / cd;
            const strength = p.strength * band * (0.7 + this.layerZ * 0.15);
            ax += outX * strength * 0.9;
            ay += outY * strength * 0.9;
          }
        }

        // procedural drift
        this.phase += dt * (0.2 + this.layerZ * 0.08) * this.tw;
        const driftX = Math.cos(this.phase) * 0.02;
        const driftY = Math.sin(this.phase) * 0.02;

        this.vx = (this.vx + (ax + driftX) * dt) * 0.92;
        this.vy = (this.vy + (ay + driftY) * dt) * 0.92;

        this.x += this.vx * dt * 60 * layerSpeed(this.layerZ);
        this.y += this.vy * dt * 60 * layerSpeed(this.layerZ);

        // wrap
        if (this.x < -100) this.x = w + 100;
        if (this.x > w + 100) this.x = -100;
        if (this.y < -100) this.y = h + 100;
        if (this.y > h + 100) this.y = -100;

        this.trail.unshift({ x: this.x, y: this.y });
        const maxTrail = reduceMotion ? 4 : 7;
        if (this.trail.length > maxTrail) this.trail.pop();
      }

      draw(ctx, brightness) {
        // trails
        if (this.trail.length > 1) {
          for (let i = 1; i < this.trail.length; i++) {
            const t = i / this.trail.length;
            const a = (1 - t) * 0.10 * brightness;
            ctx.fillStyle = `rgba(56,189,248,${a})`;
            ctx.fillRect(this.trail[i].x, this.trail[i].y, this.size * (1 - t * 0.6), this.size * (1 - t * 0.6));
          }
        }

        let c;
        if (this.huePick < 0.5) c = colors.neon;
        else if (this.huePick < 0.78) c = colors.neon2;
        else c = colors.mint;

        ctx.fillStyle = hexToRgba(c, 0.75 * brightness);
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    // --- Code symbols (floating) ---
    const symbols = ["0", "1", "∎", "⟡", "⌁", "#", "@", "∇", "/", "\\", "∴", "∞", "⨁", "⟂"]; 
    class CodeGlyph {
      constructor(layerZ) {
        this.layerZ = layerZ;
        this.reset();
      }

      reset() {
        const margin = 120;
        this.x = rand(-margin, w + margin);
        this.y = rand(-margin, h + margin);
        this.speed = rand(0.3, 1.2) * (0.35 + this.layerZ * 0.35);
        this.rot = rand(-0.2, 0.2);
        this.tw = rand(0.15, 0.65);
        this.phase = rand(0, TWO_PI);
        this.scale = rand(10, 18) * (0.8 + this.layerZ * 0.25);
        this.char = symbols[(Math.random() * symbols.length) | 0];
        this.alpha = rand(0.25, 0.7);
      }

      update(dt, mx, my, clickers) {
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.hypot(dx, dy) + 0.0001;

        let ax = 0;
        let ay = 0;

        const range = 260 - this.layerZ * 40;
        if (dist < range) {
          const t = 1 - dist / range;
          // attraction
          ax += (-dx / dist) * t * t * 0.5;
          ay += (-dy / dist) * t * t * 0.5;
          // orbit
          ax += (-dy / dist) * t * 0.25;
          ay += (dx / dist) * t * 0.25;
        }

        for (let i = 0; i < clickers.length; i++) {
          const p = clickers[i];
          const cdx = this.x - p.x;
          const cdy = this.y - p.y;
          const cd = Math.hypot(cdx, cdy) + 0.0001;
          const shock = p.radius - cd;
          if (cd < p.radius && Math.abs(shock) < 18) {
            const band = 1 - Math.abs(shock) / 18;
            const outX = cdx / cd;
            const outY = cdy / cd;
            const strength = p.strength * band * 0.9;
            ax += outX * strength;
            ay += outY * strength;
          }
        }

        this.phase += dt * (0.2 + this.layerZ * 0.08);
        this.x += (Math.cos(this.phase) * 0.15 + ax) * dt * 60 * this.speed;
        this.y += (Math.sin(this.phase) * 0.15 + ay) * dt * 60 * this.speed;
        this.rot += dt * (0.06 + this.layerZ * 0.02);

        // opacity flicker
        this.alpha += (Math.random() - 0.5) * 0.02;
        this.alpha = clamp(this.alpha, 0.15, 0.85);

        // wrap respawn
        if (this.x < -140 || this.x > w + 140 || this.y < -140 || this.y > h + 140) {
          this.reset();
        }
      }

      draw(ctx, brightness) {
        const c = this.layerZ === 0 ? colors.neon : this.layerZ === 1 ? colors.neon2 : colors.neon;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        const a = this.alpha * brightness;
        ctx.font = `${Math.max(10, this.scale)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
        ctx.fillStyle = hexToRgba(c, 0.55 * a);
        ctx.fillText(this.char, -this.scale * 0.18, this.scale * 0.28);

        // crisp highlight
        ctx.fillStyle = `rgba(255,255,255,${0.10 * a})`;
        ctx.fillText(this.char, -this.scale * 0.18 + 0.3, this.scale * 0.28 - 0.2);
        ctx.restore();
      }
    }

    // --- Click pulses ---
    const pulses = [];
    class Pulse {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = Math.max(w, h) * 0.55;
        this.alpha = 1;
        this.strength = reduceMotion ? 0.9 : 1.15;
        this.ring = 0.28;
        this.age = 0;
        this.alive = true;
      }

      update(dt) {
        this.age += dt;
        const speed = 520; // px/s
        this.radius += speed * dt * (0.8 + Math.random() * 0.07);
        this.alpha = Math.max(0, 1 - this.radius / this.maxRadius);
        if (this.radius > this.maxRadius || this.alpha <= 0.001) this.alive = false;
      }

      draw(ctx) {
        if (!this.alive) return;
        const a = this.alpha;
        // ripple ring (thin)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.strokeStyle = `rgba(56,189,248,${0.35 * a})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // shockwave ring offset
        if (this.age > 0.02) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius - 10, 0, TWO_PI);
          ctx.strokeStyle = `rgba(167,139,250,${0.20 * a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    const makeIdlePulse = () => {
      const x = rand(w * 0.15, w * 0.85);
      const y = rand(h * 0.15, h * 0.85);
      pulses.push(new Pulse(x, y));
    };

    let idleTimer = 0;

    const clickAt = (x, y) => {
      pulses.push(new Pulse(x, y));
      // micro cluster effect: briefly spawn extra dust
      for (let li = 0; li < layers.length; li++) {
        const L = layers[li];
        const burstCount = reduceMotion ? 20 : 28;
        for (let i = 0; i < burstCount; i++) {
          const d = L.dustPool[(Math.random() * L.dustPool.length) | 0];
          d.x = x + rand(-14, 14);
          d.y = y + rand(-14, 14);
          const ang = rand(0, TWO_PI);
          const spd = rand(35, 90) * (1 + li * 0.12);
          d.vx = Math.cos(ang) * spd * 0.001;
          d.vy = Math.sin(ang) * spd * 0.001;
        }
      }
    };

    // --- Create pools ---
    const layerState = layers.map((L) => {
      const nodes = Array.from({ length: reduceMotion ? Math.floor(L.nodeCount * 0.7) : L.nodeCount }, () => new Node(L.z));
      const dustPool = Array.from({ length: reduceMotion ? Math.floor(L.partCount * 0.65) : L.partCount }, () => new Dust(L.z));
      const glyphs = Array.from({ length: reduceMotion ? 16 : 22 }, () => new CodeGlyph(L.z));
      return { ...L, nodes, dustPool, glyphs };
    });

    // --- Mouse events ---
    const onMove = (e) => {
      mouse.inside = true;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.vx = mouse.x - mouse.px;
      mouse.vy = mouse.y - mouse.py;

      // smooth field point to create laggy parallax
      field.mx += (mouse.x - field.mx) * 0.12;
      field.my += (mouse.y - field.my) * 0.12;
    };

    const onLeave = () => {
      mouse.inside = false;
    };

    const onClick = (e) => {
      clickAt(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    // --- Connections (proximity) ---
    // For performance: we do connections per layer using a capped neighborhood scan.
    // We also slightly bias connection range near cursor.
    const connectLines = (ctx, items, distLimit, mx, my, brightness) => {
      const n = items.length;
      // Very small cap to reduce O(n^2) worst cases
      const maxItems = reduceMotion ? 55 : 72;
      const step = Math.max(1, Math.ceil(n / maxItems));

      for (let i = 0; i < n; i += step) {
        const a = items[i];
        for (let j = i + step; j < n; j += step) {
          const b = items[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < distLimit) {
            const alpha = (1 - d / distLimit) * 0.28 * brightness;
            if (alpha <= 0.001) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            // brighter near cursor
            const cd = Math.hypot(((a.x + b.x) * 0.5) - mx, ((a.y + b.y) * 0.5) - my);
            const cursorBoost = cd < 160 ? (1 - cd / 160) * 0.9 : 0;
            ctx.strokeStyle = `rgba(56,189,248,${alpha * (1 + cursorBoost)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const drawHexWire = (ctx, t) => {
      // Hexagon tiling with subtle animation (no blobs / radial gradients)
      const size = hex.cell;
      const wCount = Math.ceil(w / size) + 3;
      const hCount = Math.ceil(h / (size * 0.86)) + 3;
      const dx = size;
      const dy = size * 0.86;
      const skew = t * 0.0002;

      ctx.lineWidth = 0.6;
      for (let r = 0; r < hCount; r++) {
        for (let c = 0; c < wCount; c++) {
          const x = -size + c * dx + (r % 2 ? dx * 0.5 : 0);
          const y = -size + r * dy;
          const px = x + Math.sin(skew + r * 0.7 + c * 0.4) * 1.4 * (0.2 + (r % 3) * 0.15);
          const py = y + Math.cos(skew + r * 0.3 + c * 0.8) * 1.0;

          const bx = px - mouse.x;
          const by = py - mouse.y;
          const bd = Math.hypot(bx, by);
          const cursorBoost = bd < 220 ? (1 - bd / 220) * 0.8 : 0;
          const a = hex.opacity * (0.25 + cursorBoost);

          // Keep minimal: only outlines with cyan/purple alternation
          ctx.strokeStyle = `rgba(56,189,248,${a})`;
          if ((r + c) % 5 === 0) ctx.strokeStyle = `rgba(167,139,250,${a * 0.9})`;

          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const ang = (Math.PI / 3) * k + Math.PI / 6;
            const hx = px + Math.cos(ang) * (size * 0.33);
            const hy = py + Math.sin(ang) * (size * 0.33);
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.stroke();
        }
      }
    };

    const drawGridPoints = (ctx, t) => {
      // animated matrix points; slight parallax with mouse
      const parX = (mouse.x - w / 2) * 0.02;
      const parY = (mouse.y - h / 2) * 0.02;

      const alphaBase = reduceMotion ? 0.22 : 0.26;
      for (let i = 0; i < grid.points.length; i++) {
        const p = grid.points[i];
        const phase = p.phase + t * 0.0012 * p.tw;
        const flick = (Math.sin(phase) * 0.5 + 0.5);

        const xx = p.x + parX;
        const yy = p.y + parY;

        // visibility cull
        if (xx < -2 || xx > w + 2 || yy < -2 || yy > h + 2) continue;

        const md = Math.hypot(xx - mouse.x, yy - mouse.y);
        const cursorBoost = md < 220 ? (1 - md / 220) * 0.9 : 0;
        const a = alphaBase * (0.2 + flick * 0.8) * (1 + cursorBoost);

        if (a < 0.02) continue;

        ctx.fillStyle = `rgba(56,189,248,${a})`;
        ctx.fillRect(xx, yy, 1, 1);

        // occasional white highlight
        if (i % 11 === 0 && flick > 0.75) {
          ctx.fillStyle = `rgba(255,255,255,${0.05 + 0.08 * flick})`;
          ctx.fillRect(xx + 0.5, yy + 0.5, 1, 1);
        }
      }
    };

    let last = performance.now();

    const animate = (now) => {
      if (!running) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      // Idle pulses/clusters
      idleTimer += dt;
      if (idleTimer > (reduceMotion ? 6.5 : 8.5)) {
        idleTimer = 0;
        if (pulses.length < 4) makeIdlePulse();

        // tiny random cluster near center
        if (Math.random() < 0.55) {
          const cx = w * rand(0.3, 0.7);
          const cy = h * rand(0.25, 0.75);
          for (let li = 0; li < layerState.length; li++) {
            const L = layerState[li];
            const burstCount = reduceMotion ? 18 : 22;
            for (let i = 0; i < burstCount; i++) {
              const d = L.dustPool[(Math.random() * L.dustPool.length) | 0];
              d.x = cx + rand(-20, 20);
              d.y = cy + rand(-18, 18);
              d.vx += rand(-0.08, 0.08);
              d.vy += rand(-0.08, 0.08);
            }
          }
        }
      }

      // Background clear
      ctx.clearRect(0, 0, w, h);

      // Base: solid dark canvas
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle scan line texture (no blobs/gradients)
      ctx.globalAlpha = 1;
      const scanA = reduceMotion ? 0.06 : 0.08;
      ctx.fillStyle = `rgba(56,189,248,${scanA})`;
      for (let y = 0; y < h; y += reduceMotion ? 6 : 5) {
        if ((y / (reduceMotion ? 6 : 5)) % 3 === 0) ctx.fillRect(0, y, w, 1);
      }

      // Hex wireframe layer
      drawHexWire(ctx, now);

      // Grid points / matrix layer
      drawGridPoints(ctx, now);

      // Click pulses (rings)
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        p.update(dt);
        p.draw(ctx);
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        if (!pulses[i].alive) pulses.splice(i, 1);
      }

      // Brightness based on cursor movement (for subtle glow intensity)
      const mv = Math.hypot(mouse.vx, mouse.vy);
      const cursorMotionBoost = clamp(mv / 28, 0, 1);

      // Render layers
      for (let li = 0; li < layerState.length; li++) {
        const L = layerState[li];

        // magnetic field smoothing
        field.mx += (mouse.x - field.mx) * 0.02;
        field.my += (mouse.y - field.my) * 0.02;

        const mx = field.mx;
        const my = field.my;

        const brightness = clamp(0.55 + cursorMotionBoost * 0.55 + li * 0.08, 0.4, 1.25);

        // connections between nodes (neural-network like)
        connectLines(
          ctx,
          L.nodes,
          L.lineDist,
          mx,
          my,
          brightness
        );

        // update & draw dust
        for (let i = 0; i < L.dustPool.length; i++) {
          const d = L.dustPool[i];
          d.update(dt, mx, my, pulses);
          d.draw(ctx, brightness);
        }

        // update & draw nodes
        for (let i = 0; i < L.nodes.length; i++) {
          const n = L.nodes[i];
          n.update(dt, mx, my, pulses);
          n.draw(ctx, brightness);
        }

        // draw floating glyphs
        for (let i = 0; i < L.glyphs.length; i++) {
          const g = L.glyphs[i];
          g.update(dt, mx, my, pulses);
          g.draw(ctx, brightness * (0.7 + L.z * 0.15));
        }
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(resizeRaf);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`futuristic-bg-canvas futuristic-bg-canvas--${theme}`} aria-hidden="true" />;
}
