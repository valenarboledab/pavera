import type {Mist} from './mist';

/** One placed glyph of the giant word, in SVG user units (kerning and tracking included). */
export type Glyph = {ch: string; i: number; line: number; x: number; x1: number; y: number};

export type WordLayout = {
  glyphs: Glyph[];
  box: {x: number; y: number; w: number; h: number};
  fontSize: number;
};

type Frame = {x: number; y: number; w: number; h: number; born: number; label: string};

const LIFE = 1.5; // seconds a measurement frame lingers
const MAX_FRAMES = 9;
// Where successive frames land around the pointer, in frame sizes; cycling reads as a loose trail.
const OFFSETS: [number, number][] = [
  [-1.1, -1.25],
  [0.35, -0.5],
  [-0.75, 0.35],
  [0.55, 0.6],
  [-0.15, -1.05],
  [0.2, 0.15],
];

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Design-tool "inspect" mode over the contact panel:
 *  - a soft circle follows the pointer inside the giant word's SVG masks, swapping filled glyphs
 *    for crawling dotted outlines,
 *  - measurement frames with panel coordinates trail the pointer and fade,
 *  - faint guides cross at the pointer, a chip names the glyph underneath,
 *  - the postcard's sheen and the mist's warm pool both follow along.
 */
export class HelloInspector {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly frames: Frame[] = [];
  private readonly client = {x: 0, y: 0};
  private readonly local = {x: 0, y: 0};
  private readonly dot = {x: 0, y: 0, r: 0, init: false};
  private lastSpawn = {x: -1e9, y: -1e9};
  private spawnN = 0;
  private inside = false;
  private raf = 0;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private chipText = '';
  private chipShown = false;
  private readonly ro: ResizeObserver;

  constructor(
    private readonly o: {
      panel: HTMLElement;
      overlay: HTMLCanvasElement;
      svg: SVGSVGElement;
      hideDot: SVGCircleElement;
      showDot: SVGCircleElement;
      chip: HTMLElement;
      card: HTMLElement;
      mist: Mist;
      layout: () => WordLayout | null;
    },
  ) {
    this.ctx = o.overlay.getContext('2d')!;
    o.panel.addEventListener('pointerenter', this.onMove);
    o.panel.addEventListener('pointermove', this.onMove);
    o.panel.addEventListener('pointerleave', this.onLeave);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(o.panel);
    this.resize();
  }

  private resize() {
    const r = this.o.panel.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.o.overlay.width = Math.round(this.w * this.dpr);
    this.o.overlay.height = Math.round(this.h * this.dpr);
    this.kick();
  }

  private onMove = (e: PointerEvent) => {
    this.client.x = e.clientX;
    this.client.y = e.clientY;
    this.inside = true;
    this.updateLocal();
    const step = Math.max(38, this.w * 0.034);
    const dx = this.local.x - this.lastSpawn.x;
    const dy = this.local.y - this.lastSpawn.y;
    if (dx * dx + dy * dy > step * step) {
      this.spawn();
      this.lastSpawn = {x: this.local.x, y: this.local.y};
    }
    this.kick();
  };

  private onLeave = () => {
    this.inside = false;
    this.lastSpawn = {x: -1e9, y: -1e9};
    this.kick();
  };

  private updateLocal() {
    const r = this.o.panel.getBoundingClientRect();
    this.local.x = this.client.x - r.left;
    this.local.y = this.client.y - r.top;
  }

  private spawn() {
    const size = clamp(this.w * 0.06, 54, 96);
    const [ox, oy] = OFFSETS[this.spawnN % OFFSETS.length];
    const tall = this.spawnN % 3 === 2;
    this.spawnN++;
    const snap = 8;
    const x = Math.round((this.local.x + ox * size) / snap) * snap;
    const y = Math.round((this.local.y + oy * size) / snap) * snap;
    const label = `${Math.round((x / this.w) * 100)}, ${Math.round((y / this.h) * 100)}`;
    this.frames.push({x, y, w: size, h: tall ? size * 1.25 : size, born: performance.now(), label});
    if (this.frames.length > MAX_FRAMES) this.frames.shift();
  }

  private kick() {
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.raf = 0;
    const o = this.o;
    this.updateLocal(); // the page can scroll under a resting pointer

    // Pointer in the word's SVG user space.
    const L = o.layout();
    let sx = -1e5;
    let sy = -1e5;
    const ctm = o.svg.getScreenCTM();
    if (ctm) {
      const p = new DOMPoint(this.client.x, this.client.y).matrixTransform(ctm.inverse());
      sx = p.x;
      sy = p.y;
    }
    const d = this.dot;
    if (!d.init || d.r < 0.5) {
      d.x = sx;
      d.y = sy;
      d.init = true;
    }
    d.x += (sx - d.x) * 0.32;
    d.y += (sy - d.y) * 0.32;
    d.r += ((this.inside && L ? L.fontSize * 0.56 : 0) - d.r) * 0.14;
    for (const c of [o.hideDot, o.showDot]) {
      c.setAttribute('cx', d.x.toFixed(1));
      c.setAttribute('cy', d.y.toFixed(1));
      c.setAttribute('r', Math.max(0, d.r).toFixed(1));
    }

    this.updateChip(L, sx, sy);

    if (this.inside) {
      const cr = o.card.getBoundingClientRect();
      o.card.style.setProperty('--mx', `${(this.client.x - cr.left).toFixed(0)}px`);
      o.card.style.setProperty('--my', `${(this.client.y - cr.top).toFixed(0)}px`);
    }
    o.mist.setPointer(this.client.x, this.client.y, this.inside);

    const framesAlive = this.draw(now);
    if (this.inside || d.r > 0.5 || framesAlive) this.kick();
  };

  /** Names the glyph under the pointer, like a type specimen inspector. */
  private updateChip(L: WordLayout | null, sx: number, sy: number) {
    const chip = this.o.chip;
    let text = '';
    if (L && this.inside) {
      const fs = L.fontSize;
      const g = L.glyphs.find((gl) => sx >= gl.x && sx < gl.x1 && sy >= gl.y - fs * 0.8 && sy <= gl.y + fs * 0.26);
      if (g) {
        const code = g.ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0');
        text = `${g.ch}  U+${code}  ·  ${Math.round(sx - g.x)}, ${Math.round(g.y - sy)}`;
      }
    }
    if (text && text !== this.chipText) {
      chip.textContent = text;
      this.chipText = text;
    }
    const show = !!text;
    if (show !== this.chipShown) {
      chip.style.opacity = show ? '1' : '0';
      this.chipShown = show;
    }
    if (show) {
      const cw = chip.offsetWidth;
      const x = clamp(this.local.x + 18, 8, this.w - cw - 8);
      const y = clamp(this.local.y + 22, 8, this.h - 34);
      chip.style.transform = `translate3d(${x.toFixed(0)}px, ${y.toFixed(0)}px, 0)`;
    }
  }

  private draw(now: number) {
    const {ctx, w, h} = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    while (this.frames.length && (now - this.frames[0].born) / 1000 > LIFE) this.frames.shift();
    const lx = Math.round(this.local.x) + 0.5;
    const ly = Math.round(this.local.y) + 0.5;

    if (this.inside) {
      // Hairline guides through the pointer, with a short ruler either side.
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(232, 228, 255, 0.07)';
      ctx.beginPath();
      ctx.moveTo(0, ly);
      ctx.lineTo(w, ly);
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, h);
      ctx.stroke();
      for (let k = -8; k <= 8; k++) {
        if (!k) continue;
        const len = k % 4 === 0 ? 5 : 2.5;
        const fade = 1 - Math.abs(k) / 9;
        ctx.strokeStyle = `rgba(232, 228, 255, ${(0.3 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(lx + k * 10, ly - len);
        ctx.lineTo(lx + k * 10, ly + len);
        ctx.moveTo(lx - len, ly + k * 10);
        ctx.lineTo(lx + len, ly + k * 10);
        ctx.stroke();
      }
    }

    ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = 'alphabetic';
    for (const f of this.frames) {
      const age = (now - f.born) / 1000;
      const a = Math.min(1, age / 0.14) * (1 - smoothstep(LIFE - 0.5, LIFE, age));
      if (a <= 0.002) continue;
      const g = 1 - (1 - Math.min(1, age / 0.3)) ** 3; // frames unfold from their top-left corner
      const fw = f.w * g;
      const fh = f.h * g;
      const x = f.x + 0.5;
      const y = f.y + 0.5;

      if (this.inside) {
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = `rgba(232, 228, 255, ${(0.22 * a).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(x + fw / 2, y + fh / 2);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }
      ctx.setLineDash([1, 3]);
      ctx.strokeStyle = `rgba(232, 228, 255, ${(0.14 * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + fw, y + fh);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(232, 228, 255, ${(0.4 * a).toFixed(3)})`;
      ctx.strokeRect(x, y, fw, fh);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(232, 228, 255, ${(0.9 * a).toFixed(3)})`;
      const t = 6;
      ctx.beginPath();
      for (const [cx, cy, sx, sy] of [
        [x, y, 1, 1],
        [x + fw, y, -1, 1],
        [x, y + fh, 1, -1],
        [x + fw, y + fh, -1, -1],
      ]) {
        ctx.moveTo(cx + sx * t, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + sy * t);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = `rgba(232, 228, 255, ${(0.78 * a).toFixed(3)})`;
      ctx.fillText(f.label, x + 5, y + 13);
    }
    return this.frames.length > 0;
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    const p = this.o.panel;
    p.removeEventListener('pointerenter', this.onMove);
    p.removeEventListener('pointermove', this.onMove);
    p.removeEventListener('pointerleave', this.onLeave);
  }
}
