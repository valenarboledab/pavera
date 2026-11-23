import {useEffect, useMemo, useState, type FormEvent, type ReactNode} from 'react';
import {Mark} from '../Reyard/Mark';
import {POSTER_SRC, VIDEO_SRC} from '../Reyard/content';
import {useReducedMotion} from '../Reyard/useReducedMotion';
import {services, steps, projects, materials, conditions, stats, nav} from './content';

const display = 'font-reyard-display font-bold leading-[1.05] text-balance';
const wrap = 'mx-auto max-w-[1240px]';
const band = 'px-[max(5vw,16px)] py-[clamp(48px,6vw,96px)]';
const btn =
  'inline-flex min-h-12 items-center justify-center rounded-full px-6 font-medium transition duration-300 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-pavera-sand';

function Title({children, light}: {children: ReactNode; light?: boolean}) {
  return <h2 className={`${display} text-[clamp(30px,3.6vw,46px)] ${light ? 'text-white' : ''}`}>{children}</h2>;
}

/* ---------- Hero: la misma película del desierto, anclada abajo ---------- */
export function Hero() {
  const reduced = useReducedMotion();
  return (
    <header id="inicio" className="relative isolate flex flex-col overflow-hidden bg-linear-to-b from-reyard-sky to-reyard-sky-mid text-white lg:min-h-[min(92vh,820px)]">
      {/* Below lg the film is its own 16:9 block under the text (like the footer); on lg+ it fills the hero. */}
      <div className="reyard-scene relative order-last -mt-[4%] w-full lg:absolute lg:inset-0 lg:-z-10 lg:mt-0">
        <video
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-bottom"
        />
        <div className="absolute inset-x-0 top-0 hidden h-2/3 bg-linear-to-b from-reyard-sky/70 to-transparent lg:block" />
      </div>

      <nav aria-label="Principal" className="flex flex-wrap items-center justify-between gap-4 px-[max(5vw,16px)] py-5">
        <a href="#inicio" className="flex items-center gap-[0.45em] font-reyard-display text-[22px] font-bold">
          <Mark className="size-[2em]" />
          PAVERA
        </a>
        <ul className="hidden gap-7 md:flex">
          {nav.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="reyard-ink-link">{label}</a>
            </li>
          ))}
        </ul>
        <a href="#cotizar" className={`${btn} bg-white/25 backdrop-blur-sm`}>Pedir cotización</a>
      </nav>

      <div className={`${wrap} relative z-10 w-full px-[max(5vw,16px)] pt-[clamp(32px,10vh,120px)]`}>
        <h1 className={`${display} max-w-[14ch] text-[clamp(40px,5.6vw,76px)]`}>Pavimentos que duran más que la obra</h1>
        <p className="mt-5 mb-8 max-w-[44ch] text-[clamp(17px,1.4vw,20px)] text-white/90">
          Asfalto, concreto y adoquín para entradas, parqueaderos, vías privadas y plazas. Diseñamos la estructura, la construimos y la mantenemos.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#cotizar" className={`${btn} bg-white text-reyard-sky`}>Calcular mi proyecto</a>
          <a href="#servicios" className={`${btn} bg-white/25 backdrop-blur-sm`}>Ver servicios</a>
        </div>
      </div>
    </header>
  );
}

export function Stats() {
  return (
    <section aria-label="Cifras" className="bg-pavera-asphalt px-[max(5vw,16px)] py-12 text-white">
      <div className={`${wrap} grid grid-cols-2 gap-6 md:grid-cols-4`}>
        {stats.map(([n, l]) => (
          <div key={l}>
            <b className="block font-reyard-display text-[clamp(30px,3.4vw,44px)] font-bold">{n}</b>
            <span className="text-[#c9ccd6]">{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicios" className={band}>
      <div className={wrap}>
        <Title>Lo que pavimentamos</Title>
        <p className="mt-4 max-w-[62ch] text-[17px] text-slate-600">
          Cada superficie empieza bajo tierra: estudiamos el suelo, la carga y el drenaje antes de elegir el material.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-pavera-soft p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-reyard-sky font-reyard-display text-lg font-bold text-white">{s.short}</span>
              <h3 className="font-reyard-display text-xl font-bold">{s.title}</h3>
              <p className="text-slate-600">{s.text}</p>
              <ul className="list-disc pl-5 text-[15px] text-slate-600">
                {s.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="proceso" className={`${band} bg-reyard-sky text-white`}>
      <div className={wrap}>
        <Title light>Cómo trabajamos</Title>
        <p className="mt-4 max-w-[62ch] text-[17px] text-white/85">
          Un proceso corto y claro, con fechas y precio cerrados antes de mover la primera máquina.
        </p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="border-t-2 border-white/40 pt-5">
              <span className="text-sm text-white/75">Paso {i + 1}</span>
              <h3 className="mt-1 font-reyard-display text-xl font-bold">{t}</h3>
              <p className="mt-2 text-white/85">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="proyectos" className={band}>
      <div className={wrap}>
        <Title>Proyectos tipo</Title>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-pavera-soft">
              <div className="aspect-[16/9] bg-cover bg-bottom sm:aspect-[4/3]" style={{backgroundImage: `url(${POSTER_SRC})`, filter: `hue-rotate(${p.hue}deg)`}} />
              <div className="p-5">
                <h3 className="font-reyard-display text-xl font-bold">{p.title}</h3>
                <p className="mt-1 text-[15px] text-slate-600">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-slate-500">Imágenes de relleno: cámbialas por fotos de tus obras en content.ts.</p>
      </div>
    </section>
  );
}

const money = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');

export function Quote() {
  const [area, setArea] = useState(() => { try { return localStorage.getItem('pv-area') ?? '120'; } catch { return '120'; } });
  const [mat, setMat] = useState(0);
  const [cond, setCond] = useState(0);
  const [sent, setSent] = useState('');

  useEffect(() => {
    try { localStorage.setItem('pv-area', area); } catch { /* sin almacenamiento */ }
  }, [area]);

  const est = useMemo(() => {
    const a = Math.max(0, Number(area) || 0);
    const m2 = materials[mat].price * conditions[cond].factor;
    return a ? {range: `${money(a * m2 * 0.9)} – ${money(a * m2 * 1.15)}`, per: money(m2)} : null;
  }, [area, mat, cond]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') ?? '').trim();
    if (!name || !String(f.get('phone') ?? '').trim()) return setSent('Escribe tu nombre y teléfono para poder contactarte.');
    setSent(`Gracias, ${name}. Te contactamos en menos de 48 horas.`);
    // Conecta aquí tu correo, CRM o webhook (Dapta, n8n, Formspree…).
  };

  const field = 'min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base';

  return (
    <section id="cotizar" className={`${band} bg-pavera-soft`}>
      <div className={`${wrap} grid items-start gap-[clamp(24px,4vw,56px)] lg:grid-cols-2`}>
        <div>
          <Title>Calcula tu proyecto</Title>
          <p className="mt-4 max-w-[52ch] text-[17px] text-slate-600">
            Un estimado rápido para que sepas el orden de magnitud. El precio final sale de la visita técnica.
          </p>
          <div className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 font-medium">Área (m²)
                <input className={field} type="number" min={1} inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} />
              </label>
              <label className="grid gap-1.5 font-medium">Material
                <select className={field} value={mat} onChange={(e) => setMat(+e.target.value)}>
                  {materials.map((m, i) => <option key={m.name} value={i}>{m.name}</option>)}
                </select>
              </label>
            </div>
            <label className="grid gap-1.5 font-medium">Estado actual
              <select className={field} value={cond} onChange={(e) => setCond(+e.target.value)}>
                {conditions.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
              </select>
            </label>
            <div aria-live="polite" className="rounded-2xl bg-reyard-sky p-5 text-white">
              <span className="text-[15px] text-white/85">Estimado referencial</span>
              <b className="block font-reyard-display text-[clamp(24px,2.4vw,36px)] font-bold">{est?.range ?? '—'}</b>
              <span className="text-[15px] text-white/85">{est ? `${est.per} por m² aprox. (COP)` : 'Escribe el área'}</span>
            </div>
            <p className="text-[13px] text-slate-500">Precios de ejemplo: ajústalos en src/sections/Pavera/content.ts.</p>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-7">
          <h3 className="font-reyard-display text-xl font-bold">Pide tu visita técnica</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 font-medium">Nombre<input name="name" className={field} autoComplete="name" /></label>
            <label className="grid gap-1.5 font-medium">Teléfono<input name="phone" type="tel" className={field} autoComplete="tel" /></label>
          </div>
          <label className="grid gap-1.5 font-medium">Correo<input name="email" type="email" className={field} autoComplete="email" /></label>
          <label className="grid gap-1.5 font-medium">Dirección de la obra<input name="address" className={field} /></label>
          <label className="grid gap-1.5 font-medium">Cuéntanos del proyecto
            <textarea name="msg" className={`${field} min-h-28 py-3`} placeholder="Ej.: entrada de garaje de 60 m² en concreto estampado" />
          </label>
          <button type="submit" className={`${btn} bg-reyard-sky text-white`}>Enviar solicitud</button>
          {sent && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-900">{sent}</p>}
        </form>
      </div>
    </section>
  );
}
