'use client';

import {useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent, type ReactNode, type Ref} from 'react';
import {CONTACT, EMAIL, type ContactLink} from './content';

/** Stagger delay for `.machines-rise` / `.machines-rise-panel` / `.machines-reveal-line` / `.machines-gw-letter` transitions. */
export const delay = (ms: number) => ({'--d': `${ms}ms`}) as CSSProperties;

export const toTop = () => window.scrollTo({top: 0, behavior: 'smooth'});

export function ArrowUpRight({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The studio's clock, ticking in its own time zone. */
function useStudioTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, []);
  return useMemo(() => {
    const parts = new Intl.DateTimeFormat('es-CO', {
      timeZone: CONTACT.brand.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    const hh = get('hour');
    return {hh, mm: get('minute'), day: get('day'), month: get('month').replace('.', '').toUpperCase(), year: get('year'), open: +hh >= 8 && +hh < 18};
  }, [now]);
}

/**
 * Dark pill that leans toward the pointer; an ember fill grows from wherever the pointer entered
 * and drains back out where it leaves, while the arrow swaps out through its corner.
 */
export function MagneticButton({href, children}: {href: string; children: ReactNode}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  const place = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    fill.current!.style.left = `${e.clientX - r.left}px`;
    fill.current!.style.top = `${e.clientY - r.top}px`;
  };
  const onMove = (e: PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--tx', `${((e.clientX - (r.left + r.width / 2)) * 0.2).toFixed(1)}px`);
    el.style.setProperty('--ty', `${((e.clientY - (r.top + r.height / 2)) * 0.32).toFixed(1)}px`);
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerEnter={(e) => {
        place(e);
        ref.current!.dataset.hover = '';
      }}
      onPointerMove={onMove}
      onPointerLeave={(e) => {
        place(e);
        delete ref.current!.dataset.hover;
        ref.current!.style.setProperty('--tx', '0px');
        ref.current!.style.setProperty('--ty', '0px');
      }}
      className="machines-mag group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0b1326] pr-[18px] pl-6 text-[14.5px] font-medium tracking-[-0.01em] whitespace-nowrap text-[#eef4ff] shadow-[0_18px_34px_-18px_rgba(10,22,56,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-machines-ember/60 focus-visible:ring-offset-4 focus-visible:ring-offset-machines-stage"
    >
      <span ref={fill} aria-hidden className="machines-mag-fill pointer-events-none absolute -z-10 aspect-square w-[280%] rounded-full bg-machines-ember" />
      <span className="machines-mag-label">{children}</span>
      <span aria-hidden className="relative grid size-[18px] place-items-center overflow-hidden">
        <ArrowUpRight className="machines-arrow-a absolute size-[15px]" />
        <ArrowUpRight className="machines-arrow-b absolute size-[15px]" />
      </span>
    </a>
  );
}

export function Avatars() {
  return (
    <div className="machines-avatars flex">
      {CONTACT.avatars.map((a, i) => (
        <span
          key={a.initials}
          className="machines-avatar grid size-[30px] place-items-center rounded-full text-[9.5px] font-semibold tracking-[0.04em] text-white/95 ring-2 ring-machines-stage"
          style={{background: `radial-gradient(120% 120% at 30% 20%, ${a.from}, ${a.to})`, zIndex: 3 - i}}
        >
          {a.initials}
        </span>
      ))}
    </div>
  );
}

/** The Arango Lands mark: a road narrowing toward the horizon. */
export function BrandMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[linear-gradient(145deg,#8fd0ff,#2f6bff_55%,#2a2f9e)] shadow-[0_6px_16px_-6px_rgba(47,107,255,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]">
      <svg viewBox="0 0 20 20" aria-hidden className="size-5">
        <path d="M8.4 3.5h3.2L16.5 16.5h-13Z" fill="#f2f7ff" />
        <path d="M10 5.5v2M10 9.5v2.4M10 13.9v2.6" stroke="#2f6bff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Footer index link on the light column. */
export function IndexLink({link}: {link: ContactLink}) {
  return (
    <a
      href={link.href}
      onClick={(e) => {
        if (link.top) toTop();
        else if (link.href === '#') e.preventDefault();
      }}
      className="machines-index-link group inline-flex items-center gap-2 text-machines-ink/80 transition-colors hover:text-machines-ink"
    >
      <span className="machines-link-u">{link.label}</span>
      {link.soon && <span className="rounded-full border border-machines-line px-1.5 py-px text-[9px] tracking-[0.1em] text-machines-mute uppercase">pronto</span>}
    </a>
  );
}

// ---------------------------------------------------------------- the panel

/** Top-left of the panel: who answers, how fast, and the address with a one-tap copy. */
export function WriteToUs() {
  const t = useStudioTime();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };
  return (
    <div className="machines-rise-panel machines-glass-chip flex min-w-0 flex-col gap-2 rounded-[16px] px-4 py-3" style={delay(60)}>
      <p className="font-machines-mono text-[10.5px] tracking-[0.14em] text-white/50 uppercase">( {CONTACT.panel.kicker} )</p>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/80">
        <span className={`machines-live-dot size-1.5 rounded-full ${t.open ? 'bg-[#6fe3a6]' : 'bg-[#f3b36a]'}`} />
        {t.open ? 'Respondemos hoy' : 'Respondemos mañana'}
        {t.open && <span className="text-white/45">· {CONTACT.panel.reply}</span>}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <a href={`mailto:${EMAIL}`} className="machines-email-link font-machines-mono text-[clamp(12px,0.95vw,14px)] text-white/90 transition-colors hover:text-white">
          <span className="machines-link-u">{EMAIL}</span>
        </a>
        <button
          type="button"
          onClick={copy}
          data-copied={copied || undefined}
          className="machines-copy-btn inline-flex h-6 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-2.5 text-[11px] text-white/75 transition-colors hover:border-white/30 hover:text-white"
        >
          <span aria-live="polite">{copied ? 'Copiado' : 'Copiar'}</span>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3">
            {copied ? (
              <path d="M2.5 6.5 5 9l4.5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <rect x="3.5" y="3.5" width="6" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.1" />
                <path d="M2.5 7.5v-4a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

const wave = (x0: number, x1: number, y: number) => {
  let d = `M ${x0} ${y}`;
  for (let x = x0; x < x1; x += 8) d += ' q 2 -2.4 4 0 t 4 0';
  return d;
};

/** A cancellation mark: wavy bars and a dated ring stamped with the studio's live time. */
function Postmark({className}: {className?: string}) {
  const t = useStudioTime();
  return (
    <svg viewBox="0 0 132 80" aria-hidden className={className}>
      <defs>
        <path id="machines-pm-ring" d="M 72.7 40 a 25.3 25.3 0 1 1 50.6 0 a 25.3 25.3 0 1 1 -50.6 0" />
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {[28, 36, 44, 52].map((y) => (
          <path key={y} d={wave(30, 66, y)} strokeWidth="1.1" />
        ))}
        <circle cx="98" cy="40" r="29" strokeWidth="1.2" />
        <circle cx="98" cy="40" r="21" strokeWidth="0.7" />
      </g>
      <text fill="currentColor" fontSize="5.2" letterSpacing="1.15" className="font-machines-mono">
        <textPath href="#machines-pm-ring">{`${CONTACT.brand.city.toUpperCase()} · ${CONTACT.brand.name.toUpperCase()} · `}</textPath>
      </text>
      <text x="98" y="42" textAnchor="middle" fill="currentColor" fontSize="11.5" fontWeight="500" className="font-machines-mono">
        {t.hh}:{t.mm}
      </text>
      <text x="98" y="50.5" textAnchor="middle" fill="currentColor" fontSize="5.4" letterSpacing="0.7" className="font-machines-mono">
        {t.day} {t.month} {t.year}
      </text>
    </svg>
  );
}

/** A perforated stamp carrying the studio mark. */
function Stamp({className}: {className?: string}) {
  const holes: [number, number][] = [];
  for (let x = 2.8; x < 46; x += 5.6) holes.push([x, 0], [x, 56]);
  for (let y = 2.8; y < 56; y += 5.6) holes.push([0, y], [46, y]);
  return (
    <svg viewBox="0 0 46 56" aria-hidden className={className}>
      <defs>
        <mask id="machines-stamp-perf">
          <rect width="46" height="56" fill="#fff" />
          {holes.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fill="#000" />
          ))}
        </mask>
        <linearGradient id="machines-stamp-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fd0ff" />
          <stop offset="0.55" stopColor="#2f6bff" />
          <stop offset="1" stopColor="#24308f" />
        </linearGradient>
      </defs>
      <g mask="url(#machines-stamp-perf)">
        <rect width="46" height="56" fill="#f4f7ff" />
        <rect x="4.5" y="4.5" width="37" height="47" fill="url(#machines-stamp-g)" />
        <path d="M20.5 10h5l7.5 25h-20Z" fill="#f2f7ff" />
        <path d="M23 13v3.5M23 20v4M23 27.5v5" stroke="#2f6bff" strokeWidth="1.5" strokeLinecap="round" />
        <text x="23" y="44.5" textAnchor="middle" fontSize="6.2" fill="#f2f7ff" letterSpacing="0.6" className="font-machines-mono">
          AL
        </text>
      </g>
    </svg>
  );
}

type NlState = 'idle' | 'busy' | 'done' | 'error';

/** Newsletter sign-up as a frosted postcard: stamp, live postmark, and an address line that posts itself. */
export function Postcard({cardRef}: {cardRef: Ref<HTMLDivElement>}) {
  const pc = CONTACT.postcard;
  const [state, setState] = useState<NlState>('idle');
  const [value, setValue] = useState('');
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (state === 'busy' || state === 'done') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
      setState('idle');
      requestAnimationFrame(() => setState('error'));
      return;
    }
    setState('busy');
    timer.current = window.setTimeout(() => setState('done'), 1100);
  };

  return (
    <div
      ref={cardRef}
      data-state={state}
      className="machines-postcard machines-glass-card machines-rise-panel relative rounded-[clamp(14px,1.3vw,20px)] p-[clamp(14px,1.3vw,20px)]"
      style={delay(160)}
    >
      <div className="machines-stamp-wrap pointer-events-none absolute top-[clamp(12px,1.1vw,16px)] right-[clamp(12px,1.1vw,16px)]">
        <Stamp className="machines-stamp relative z-[1] block w-[clamp(36px,3vw,44px)]" />
        <Postmark className="machines-postmark absolute top-[42%] right-[52%] z-[2] w-[clamp(92px,7.4vw,116px)] text-white/45" />
      </div>
      <div className="pr-[clamp(58px,5vw,76px)]">
        <p className="font-machines-display text-[clamp(15px,1.15vw,18px)] font-bold tracking-[-0.02em] text-white">{pc.title}</p>
        <p className="machines-postcard-note mt-1.5 text-[clamp(11.5px,0.85vw,13px)] leading-snug text-white/60">{pc.note}</p>
      </div>

      <form
        onSubmit={submit}
        noValidate
        data-state={state}
        className="machines-nl relative mt-[clamp(12px,1.8vh,18px)] flex h-11 items-center rounded-full border border-white/[0.14] bg-white/[0.07] pr-1 pl-4 transition-[border-color,background-color,box-shadow] duration-300 focus-within:border-[#9cc0ff]/50 focus-within:bg-white/[0.11] focus-within:shadow-[0_0_0_4px_rgba(47,107,255,0.22)]"
      >
        <label htmlFor="machines-nl-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="machines-nl-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={pc.placeholder}
          value={value}
          disabled={state === 'done'}
          aria-invalid={state === 'error'}
          onChange={(e) => {
            setValue(e.target.value);
            if (state === 'error') setState('idle');
          }}
          className="machines-nl-input h-full min-w-0 flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/40 focus:outline-none"
        />
        <span aria-hidden className="machines-nl-done pointer-events-none absolute inset-y-0 right-12 left-4 flex items-center truncate text-[12.5px] text-white/85">
          {pc.done}
        </span>
        <button
          type="submit"
          aria-label="Suscribirme"
          className="machines-nl-btn relative grid size-9 shrink-0 place-items-center rounded-full bg-machines-ember text-white shadow-[0_8px_18px_-8px_rgba(47,107,255,0.8)] transition-transform duration-300 hover:scale-[1.06] active:scale-95"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="machines-nl-ico machines-nl-arrow absolute size-4">
            <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span aria-hidden className="machines-nl-ico machines-nl-spin absolute size-4 rounded-full border-[1.7px] border-white/30 border-t-white" />
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="machines-nl-ico machines-nl-check absolute size-4">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
      <p role="status" className="mt-1.5 h-4 text-[11px] text-[#ff9db0]">
        {state === 'error' ? pc.invalid : ''}
        <span className="sr-only">{state === 'done' ? pc.done : ''}</span>
      </p>
    </div>
  );
}
