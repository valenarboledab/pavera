/**
 * Soft moving mesh gradient for the contact panel, kept dark: glowing pools of peach and orange up top, a
 * cream glow, violet and lilac below, a near-black navy corner, all over a deep indigo ground. Each colour is a Gaussian pool drifting on
 * a slow Lissajous path; colours blend by weight, so there are no edges anywhere. One low-frequency warp
 * keeps the shapes organic. The pointer brings its own pool of pale light and gently smears the field.
 * The buffer is small and softened with a CSS blur (`.machines-mist` in small-machines.css); runs only while on screen.
 */

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uDrag;
uniform float uHover;
uniform float uIntro;
out vec4 outColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

vec2 toP(vec2 q, float asp) { return (q - 0.5) * vec2(asp, 1.0); }

// One pool of colour: its centre wanders round c (uv, y up) with amplitude a and rates f.
void pool(vec2 p, float asp, float t, vec2 c, vec2 a, vec2 f, float ph, float r, vec3 col, float gain, inout vec3 acc, inout float wsum) {
  vec2 ctr = toP(c + a * vec2(sin(t * f.x + ph), cos(t * f.y + ph * 1.3)), asp);
  vec2 d = p - ctr;
  float w = exp(-dot(d, d) / (r * r)) * gain;
  acc += col * w;
  wsum += w;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = toP(uv, asp);
  vec2 m = toP(uMouse, asp);
  float t = uTime * 0.16;

  // One slow, low-frequency warp, and a gentle smear behind the moving pointer.
  vec2 warp = vec2(noise(p * 0.9 + vec2(t * 0.3, 0.0)), noise(p * 0.9 + vec2(4.3, -t * 0.25))) - 0.5;
  vec2 dm = p - m;
  p += warp * 0.5;
  p -= uDrag * vec2(asp, 1.0) * exp(-dot(dm, dm) * 3.0) * 0.6;

  // Deep indigo ground, then the pools.
  vec3 acc = vec3(0.045, 0.035, 0.10) * 0.9;
  float wsum = 0.9;
  pool(p, asp, t, vec2(0.30, 0.80), vec2(0.10, 0.06), vec2(0.50, 0.70), 0.0, 0.40, vec3(0.78, 0.52, 0.38), 1.0, acc, wsum); // peach
  pool(p, asp, t, vec2(0.88, 0.82), vec2(0.06, 0.08), vec2(0.60, 0.40), 2.1, 0.30, vec3(0.85, 0.36, 0.16), 1.0, acc, wsum); // orange
  pool(p, asp, t, vec2(0.82, 0.22), vec2(0.08, 0.07), vec2(0.45, 0.65), 4.0, 0.32, vec3(0.42, 0.18, 0.88), 1.3, acc, wsum); // violet
  pool(p, asp, t, vec2(0.55, 0.18), vec2(0.12, 0.06), vec2(0.35, 0.50), 1.2, 0.38, vec3(0.45, 0.30, 0.58), 0.6, acc, wsum); // lilac
  pool(p, asp, t, vec2(0.08, 0.10), vec2(0.06, 0.06), vec2(0.40, 0.30), 3.3, 0.40, vec3(0.02, 0.02, 0.08), 2.5, acc, wsum); // navy
  pool(p, asp, t, vec2(0.04, 0.60), vec2(0.03, 0.08), vec2(0.30, 0.40), 5.0, 0.30, vec3(0.30, 0.22, 0.32), 0.5, acc, wsum); // mauve
  pool(p, asp, t, vec2(0.50, 0.50), vec2(0.08, 0.06), vec2(0.55, 0.45), 2.7, 0.33, vec3(0.55, 0.30, 0.42), 0.45, acc, wsum); // rose
  vec3 col = acc / wsum;

  // A cream glow, stretched sideways, drifting a little.
  vec2 hs = toP(vec2(0.72, 0.47) + 0.06 * vec2(sin(t * 0.8), cos(t * 0.6)), asp);
  vec2 dh = (p - hs) * vec2(0.75, 1.5);
  col = mix(col, vec3(0.95, 0.82, 0.72), exp(-dot(dh, dh) / 0.018) * 0.45);
  // The pointer's own pool of pale light.
  vec2 dp = p - m;
  col = mix(col, vec3(0.95, 0.86, 0.82), exp(-dot(dp, dp) / 0.04) * uHover * 0.35);
  // Edges settle further into the dark.
  col *= mix(0.62, 1.0, 1.0 - smoothstep(0.3, 1.05, length((uv - vec2(0.55, 0.5)) * vec2(1.0, 1.2))));

  // Lights come up out of the dark on first view.
  col = mix(vec3(0.02, 0.015, 0.05), col, uIntro);
  // Dither so the long gradients never band (the crisp grain is a CSS layer above the blur).
  col += (hash(gl_FragCoord.xy + floor(uTime * 24.0) * 7.0) - 0.5) * (3.0 / 255.0);
  outColor = vec4(col, 1.0);
}
`;

export class Mist {
  private readonly gl: WebGL2RenderingContext | null;
  private program: WebGLProgram | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private visible = false;
  private started = -1;
  private last = 0;
  private time = Math.random() * 60;
  private readonly mouse = {x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, thover: 0, tracking: false};
  private readonly drag = {x: 0, y: 0, tx: 0, ty: 0};
  private readonly io: IntersectionObserver;
  private readonly ro: ResizeObserver;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly reduced: boolean,
  ) {
    this.gl = canvas.getContext('webgl2', {antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power'});
    if (this.gl) this.setup(this.gl);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible && !this.raf) this.loop();
    });
    this.io.observe(canvas);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
  }

  /** Whether the mist is actually drawing (otherwise the panel's CSS gradient shows). */
  get ok() {
    return !!this.program;
  }

  /** Pointer in client px. The canvas overhangs the panel (for the blur), so map through its own rect. */
  setPointer(clientX: number, clientY: number, inside: boolean) {
    const r = this.canvas.getBoundingClientRect();
    const x = r.width ? (clientX - r.left) / r.width : 0.5;
    const y = r.height ? 1 - (clientY - r.top) / r.height : 0.5;
    const m = this.mouse;
    if (inside && m.tracking) {
      this.drag.tx += (x - m.tx) * 1.6;
      this.drag.ty += (y - m.ty) * 1.6;
      const len = Math.hypot(this.drag.tx, this.drag.ty);
      if (len > 0.25) {
        this.drag.tx *= 0.25 / len;
        this.drag.ty *= 0.25 / len;
      }
    }
    m.tracking = inside;
    m.tx = x;
    m.ty = y;
    m.thover = inside ? 1 : 0;
    if (this.visible && !this.raf) this.loop();
  }

  private setup(gl: WebGL2RenderingContext) {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[mist]', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[mist]', gl.getProgramInfoLog(prog));
      return;
    }
    this.program = prog;
    for (const n of ['uRes', 'uTime', 'uMouse', 'uDrag', 'uHover', 'uIntro']) this.uniforms[n] = gl.getUniformLocation(prog, n);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  private resize() {
    // It is all soft light under a blur: a small buffer is plenty.
    const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.4;
    const w = Math.max(1, Math.round(this.canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * scale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (this.visible && !this.raf) this.loop();
  }

  private loop = () => {
    this.raf = 0;
    if (!this.visible || !this.program) return;
    this.draw();
    const settling = this.mouse.hover > 0.001 || Math.abs(this.drag.x) + Math.abs(this.drag.y) > 1e-4;
    if (!this.reduced || settling || this.intro() < 1) this.raf = requestAnimationFrame(this.loop);
  };

  private intro() {
    if (this.started < 0) return 0;
    const k = Math.min(1, (performance.now() - this.started) / 1800);
    return 1 - (1 - k) ** 3;
  }

  private draw() {
    const gl = this.gl;
    if (!gl || !this.program) return;
    const now = performance.now();
    if (this.started < 0) this.started = now;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    if (!this.reduced) this.time += dt;
    const m = this.mouse;
    const ease = 1 - Math.exp(-dt * 4);
    m.x += (m.tx - m.x) * ease;
    m.y += (m.ty - m.y) * ease;
    m.hover += (m.thover - m.hover) * (1 - Math.exp(-dt * 2.5));
    const g = this.drag;
    const follow = 1 - Math.exp(-dt * 6);
    g.x += (g.tx - g.x) * follow;
    g.y += (g.ty - g.y) * follow;
    const decay = Math.exp(-dt * 1.8);
    g.tx *= decay;
    g.ty *= decay;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.program);
    const u = this.uniforms;
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform2f(u.uMouse, m.x, m.y);
    gl.uniform2f(u.uDrag, g.x, g.y);
    gl.uniform1f(u.uHover, m.hover);
    gl.uniform1f(u.uIntro, this.intro());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.ro.disconnect();
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
