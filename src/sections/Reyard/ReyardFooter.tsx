'use client';

import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {brand, columns, POSTER_SRC, socials, VIDEO_SRC} from './content';
import {useReducedMotion} from './useReducedMotion';
import {Mark} from './Mark';
import {SocialIcon} from './SocialIcon';

const delay = (s: number) => ({'--d': `${s}s`}) as CSSProperties;

/**
 * Footer over a locked-off desert film: brand, blurb and socials top-left,
 * three link columns top-right, the marble ruins along the bottom.
 * On lg+ the video fills the footer at 16:9; below lg the links stack on
 * open sky and the scene sits underneath, fading up into it.
 */
export function ReyardFooter() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setEntered(true);
      },
      {threshold: 0.1},
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  // Play only while on screen; reduced motion keeps the poster frame.
  useEffect(() => {
    const v = video.current!;
    v.muted = true;
    if (inView && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced]);

  return (
    <footer
      ref={ref}
      data-in={entered || undefined}
      className="reyard-footer relative isolate flex flex-col overflow-hidden bg-linear-to-b from-reyard-sky to-reyard-sky-mid text-white lg:block lg:aspect-video lg:min-h-[42rem] lg:min-w-0 lg:bg-reyard-sky"
    >
      {/* Scene */}
      <div className="reyard-scene relative order-last -mt-[6%] w-full lg:absolute lg:inset-0 lg:mt-0">
        <video
          ref={video}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-bottom"
        />
        {/* Softens the clouds behind the text on lg+. */}
        <div className="absolute inset-x-0 top-0 hidden h-1/2 bg-linear-to-b from-reyard-sky/45 to-transparent lg:block" />
      </div>

      {/* Brand */}
      <div className="relative z-10 px-6 pt-14 sm:px-10 lg:absolute lg:top-[7.8%] lg:left-[4.45%] lg:p-0">
        <a href="#" className="reyard-rise flex items-center gap-[0.45em] font-reyard-display text-reyard-mark font-bold" style={delay(0.1)}>
          <Mark className="size-[2em]" />
          {brand.name}
        </a>
        <p className="reyard-rise mt-[1.5em] max-w-[23em] text-reyard-blurb text-white/95" style={delay(0.2)}>
          {brand.blurb}
        </p>
        <div className="reyard-rise mt-[1.6rem] flex items-center gap-[clamp(1.25rem,1.7vw,2.2rem)] lg:mt-[2.1vw]" style={delay(0.3)}>
          <span className="font-reyard-display text-reyard-note font-bold">{brand.contact}</span>
          <ul className="flex gap-[clamp(0.6rem,0.65vw,0.9rem)]">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={s.label}
                  className="grid size-[clamp(2.4rem,2.2vw,3rem)] place-items-center rounded-full bg-white/30 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-reyard-sky focus-visible:bg-white focus-visible:text-reyard-sky focus-visible:outline-none"
                >
                  <SocialIcon name={s.icon} className="size-[42%]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Links */}
      <div className="relative z-10 mt-12 mb-4 grid grid-cols-2 gap-x-8 gap-y-10 px-6 sm:flex sm:gap-[clamp(3rem,5vw,6.5rem)] sm:px-10 lg:absolute lg:top-[8.6%] lg:right-[4.5%] lg:mt-0 lg:mb-0 lg:p-0">
        {columns.map((col, c) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="reyard-rise mb-[1.6em] font-reyard-display text-reyard-head font-bold" style={delay(0.2 + c * 0.08)}>
              {col.title}
            </h2>
            <ul className="flex flex-col gap-[1.25em] text-reyard-link">
              {col.links.map((link, i) => (
                <li key={link} className="reyard-rise" style={delay(0.26 + c * 0.08 + i * 0.045)}>
                  <a href="#" className="reyard-ink-link sm:whitespace-nowrap">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
