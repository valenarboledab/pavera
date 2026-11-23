'use client';

import {useEffect, useRef, useState, type CSSProperties, type RefObject} from 'react';
import {CONTACT, EMAIL} from './content';
import {HelloInspector, type Glyph, type WordLayout} from './inspector';
import {Mist} from './mist';
import {ArrowUpRight, Avatars, BrandMark, IndexLink, MagneticButton, Postcard, WriteToUs, delay, toTop} from './parts';

const FS = 200; // giant word font size in SVG user units; the SVG scales itself into its region
const LEAD = 0.92; // line advance of the giant word, in em

function useInView(ref: RefObject<Element | null>, threshold: number) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      {threshold},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

/**
 * The page's closing section. Landscape: exactly one viewport, a light column (pitch + studio index)
 * beside a dark panel of drifting light holding a postcard sign-up and a giant two-line "Drop a line." that
 * opens up under the pointer. Portrait / narrow: the two stack. Layout lives in small-machines.css (.machines-contact*).
 */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, 0.12);
  const h = CONTACT.headline;

  return (
    <section ref={sectionRef} id="contact" aria-label="Contacto" data-in={inView || undefined} className="machines-contact relative bg-machines-stage">
      <div className="machines-contact-left">
        <div>
          <p
            className="machines-rise inline-flex items-center gap-2 rounded-full border border-machines-line bg-white/45 py-1.5 pr-3.5 pl-2.5 text-[12px] text-machines-ink/75 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]"
            style={delay(0)}
          >
            <span className="machines-pulse-dot size-1.5 rounded-full bg-machines-ember" />
            {CONTACT.tag}
          </p>
          <h2 className="machines-c-headline font-machines-display font-medium text-machines-ink">
            <span className="machines-line-mask">
              <span className="machines-reveal-line" style={delay(80)}>
                {h.first}
              </span>
            </span>
            <span className="machines-line-mask">
              <span className="machines-reveal-line" style={delay(170)}>
                {h.lead}
                <em className="machines-accent font-machines-fell font-normal tracking-[-0.01em] text-machines-rubric italic">{h.accent}</em>
                {h.tail}
              </span>
            </span>
          </h2>
          <p className="machines-c-lede machines-c-space machines-rise text-machines-ink/70" style={delay(240)}>
            {CONTACT.lede}
          </p>
          <div className="machines-c-avatars machines-c-space machines-rise flex items-center gap-3" style={delay(320)}>
            <Avatars />
            <p className="text-[13px] text-machines-ink/60">
              <span className="font-semibold text-machines-ink">{CONTACT.rating.score}</span> {CONTACT.rating.note}
            </p>
          </div>
          <div className="machines-c-cta machines-c-space machines-rise" style={delay(400)}>
            <MagneticButton href={CONTACT.cta.href}>{CONTACT.cta.label}</MagneticButton>
          </div>
        </div>

        <div className="machines-c-bottom machines-rise" style={delay(480)}>
          <div className="flex items-center gap-3">
            <BrandMark />
            <div className="min-w-0">
              <p className="font-machines-display text-[17px] leading-tight font-bold tracking-[-0.02em] text-machines-ink">{CONTACT.brand.name}</p>
              <p className="machines-c-brand-tagline text-[12.5px] text-machines-ink/55">{CONTACT.brand.tagline}</p>
            </div>
          </div>
          <div className="machines-c-index grid grid-cols-3 gap-x-[clamp(12px,1.6vw,28px)]">
            {CONTACT.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="min-w-0">
                <p className="text-machines-tag font-medium text-machines-mute uppercase">{col.title}</p>
                <ul className="mt-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <IndexLink link={l} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <p className="machines-c-copy text-[11.5px] text-machines-mute">{CONTACT.copyright}</p>
        </div>
      </div>

      <HelloPanel />
    </section>
  );
}

function HelloPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const wordWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const measureRefs = useRef<(SVGTextElement | null)[]>([]);
  const hideRef = useRef<SVGCircleElement>(null);
  const showRef = useRef<SVGCircleElement>(null);
  const [layout, setLayout] = useState<WordLayout | null>(null);
  const [unit, setUnit] = useState(1); // CSS px per SVG unit, for screen-constant dots
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const panelIn = useInView(panelRef, 0.35);

  // Measure the word once the display face is in, so every glyph can be placed (and animated) alone.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await document.fonts.load(`700 ${FS}px Satoshi`);
        await document.fonts.ready;
      } catch {
        /* fall back to whatever face resolved */
      }
      if (!alive) return;
      const glyphs: Glyph[] = [];
      let x0 = Infinity;
      let y0 = Infinity;
      let x1 = -Infinity;
      let y1 = -Infinity;
      CONTACT.word.forEach((line, li) => {
        const el = measureRefs.current[li];
        if (!el) return;
        const y = li * LEAD * FS;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === ' ') continue;
          glyphs.push({ch: line[i], i: glyphs.length, line: li, x: el.getStartPositionOfChar(i).x, x1: el.getEndPositionOfChar(i).x, y});
        }
        const b = el.getBBox();
        x0 = Math.min(x0, b.x);
        y0 = Math.min(y0, b.y);
        x1 = Math.max(x1, b.x + b.width);
        y1 = Math.max(y1, b.y + b.height);
      });
      if (!glyphs.length) return;
      const pad = FS * 0.03;
      setLayout({glyphs, box: {x: x0 - pad, y: y0 - pad, w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2}, fontSize: FS});
    })();
    return () => {
      alive = false;
    };
  }, []);

  // The SVG fits ("meet") its region; track the resulting scale so outline dots stay a constant size.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !layout) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(svg.clientWidth / layout.box.w, svg.clientHeight / layout.box.h);
      setUnit(s > 0 ? s : 1);
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => {
    const panel = panelRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mist = new Mist(mistRef.current!, reduced);
    if (mist.ok) panel.dataset.mist = '';
    const inspector = new HelloInspector({
      panel,
      overlay: overlayRef.current!,
      svg: svgRef.current!,
      hideDot: hideRef.current!,
      showDot: showRef.current!,
      chip: chipRef.current!,
      card: cardRef.current!,
      mist,
      layout: () => layoutRef.current,
    });

    // Scroll-linked entrance: the panel opens out to full size and the word rises into place.
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = panel.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      const e = reduced ? 1 : 1 - (1 - p) ** 3;
      const radius = parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 24;
      panel.style.clipPath = `inset(${((1 - e) * 5).toFixed(2)}% ${((1 - e) * 4).toFixed(2)}% 0% ${((1 - e) * 4).toFixed(2)}% round ${radius}px)`;
      wordWrapRef.current!.style.transform = `translate3d(0, ${((1 - e) * 14).toFixed(2)}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      inspector.dispose();
      mist.dispose();
    };
  }, []);

  const box = layout?.box;
  const big = 4000;
  const viewBox = box ? `${box.x} ${box.y} ${box.w} ${box.h}` : `0 ${-FS} ${FS * 2.6} ${FS * 2}`;
  const glyphs = layout?.glyphs ?? [];
  const dot = 1.7 / unit;
  const gap = 5.6 / unit;
  const maskRect = box ? {x: box.x - big, y: box.y - big, width: box.w + big * 2, height: box.h + big * 2} : {x: 0, y: 0, width: 0, height: 0};
  const word = CONTACT.word.join(' ');

  return (
    <div
      ref={panelRef}
      data-in={panelIn || undefined}
      className="machines-hello-panel machines-contact-panel relative isolate flex min-w-0 flex-col overflow-hidden rounded-[clamp(18px,1.8vw,28px)] text-[#eef0ff]"
    >
      {/* Overhangs the panel on every side so its CSS blur never pulls in a dark fringe. */}
      <canvas ref={mistRef} aria-hidden className="machines-mist absolute -z-10 block" />
      <div aria-hidden className="machines-panel-grain pointer-events-none absolute inset-0 -z-10" />
      <canvas ref={overlayRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 block h-full w-full" />

      <div className="machines-panel-top relative z-20">
        <WriteToUs />
        <div className="machines-postcard-slot">
          <Postcard cardRef={cardRef} />
        </div>
      </div>

      {/* Giant word: fits whatever height is left, anchored bottom-left. */}
      <div ref={wordWrapRef} className="machines-word-region relative z-0 will-change-transform">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          preserveAspectRatio="xMinYMax meet"
          data-in={panelIn && layout ? '' : undefined}
          className="machines-gw absolute inset-0 block h-full w-full overflow-visible font-machines-display"
          fontSize={FS}
          fontWeight={700}
        >
          <defs>
            {CONTACT.word.map((_, li) => (
              <linearGradient key={li} id={`machines-gw-fill-${li}`} gradientUnits="userSpaceOnUse" x1="0" y1={li * LEAD * FS - FS * 0.74} x2="0" y2={li * LEAD * FS + FS * 0.24}>
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.97" />
                <stop offset="0.5" stopColor="#fbf6ff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#efe4ff" stopOpacity="0.8" />
              </linearGradient>
            ))}
            <linearGradient id="machines-gw-sheen" gradientUnits="userSpaceOnUse" x1="-260" y1={-FS} x2="0" y2={FS * 0.3}>
              <stop offset="0" stopColor="#8b4cf5" stopOpacity="0" />
              <stop offset="0.5" stopColor="#8b4cf5" stopOpacity="0.26" />
              <stop offset="1" stopColor="#8b4cf5" stopOpacity="0" />
              <animateTransform attributeName="gradientTransform" type="translate" values="-700 0; 1500 0; 1500 0" keyTimes="0; 0.42; 1" dur="7.5s" repeatCount="indefinite" />
            </linearGradient>
            <radialGradient id="machines-gw-k">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.5" stopColor="#000" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="machines-gw-w">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="machines-gw-hide" maskUnits="userSpaceOnUse" {...maskRect}>
              <rect {...maskRect} fill="#fff" />
              <circle ref={hideRef} cx={-9999} cy={-9999} r={0} fill="url(#machines-gw-k)" />
            </mask>
            <mask id="machines-gw-show" maskUnits="userSpaceOnUse" {...maskRect}>
              <circle ref={showRef} cx={-9999} cy={-9999} r={0} fill="url(#machines-gw-w)" />
            </mask>
          </defs>

          {CONTACT.word.map((line, li) => (
            <text
              key={li}
              ref={(el) => {
                measureRefs.current[li] = el;
              }}
              x={0}
              y={li * LEAD * FS}
              letterSpacing="-0.035em"
              visibility="hidden"
            >
              {line}
            </text>
          ))}

          <a href={`mailto:${EMAIL}`} aria-label={`${word} Correo ${EMAIL}`} className="machines-gw-link cursor-crosshair">
            <g mask="url(#machines-gw-hide)">
              {glyphs.map((g) => (
                <text key={`f${g.i}`} x={g.x} y={g.y} className="machines-gw-letter" style={delay(g.i * 55)} fill={`url(#machines-gw-fill-${g.line})`}>
                  {g.ch}
                </text>
              ))}
              {glyphs.map((g) => (
                <text key={`s${g.i}`} x={g.x} y={g.y} className="machines-gw-letter" style={delay(g.i * 55)} fill="url(#machines-gw-sheen)">
                  {g.ch}
                </text>
              ))}
            </g>
            <g mask="url(#machines-gw-show)">
              {glyphs.map((g) => (
                <text
                  key={`o${g.i}`}
                  x={g.x}
                  y={g.y}
                  className="machines-gw-letter machines-gw-ants"
                  style={{...delay(g.i * 55), '--dash': `${gap.toFixed(2)}px`} as CSSProperties}
                  fill="rgba(255, 255, 255, 0.06)"
                  stroke="#e8e4ff"
                  strokeOpacity={0.9}
                  strokeWidth={dot}
                  strokeDasharray={`0 ${gap.toFixed(2)}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {g.ch}
                </text>
              ))}
            </g>
          </a>
        </svg>
      </div>

      <div className="machines-panel-bottom relative z-20 text-white/70">
        <ul className="machines-glass-chip flex flex-wrap gap-x-[clamp(12px,1.4vw,22px)] gap-y-1 rounded-full px-4 py-2" aria-label="Redes">
          {CONTACT.socials.map((s) => (
            <li key={s}>
              <a href="#" onClick={(e) => e.preventDefault()} className="machines-social group inline-flex items-center gap-1 transition-colors hover:text-white">
                <span className="machines-link-u">{s}</span>
                <ArrowUpRight className="size-3 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={toTop}
          className="machines-glass-chip group inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Volver arriba
          <svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5">
            <path d="M6 10V2.5M2.5 5.5 6 2l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div
        ref={chipRef}
        aria-hidden
        className="machines-inspect-chip pointer-events-none absolute top-0 left-0 z-30 rounded-md border border-white/[0.12] bg-[#0d0b24]/70 px-2 py-1 font-machines-mono text-[10.5px] whitespace-pre text-[#ece9ff] opacity-0 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md"
      />
    </div>
  );
}
