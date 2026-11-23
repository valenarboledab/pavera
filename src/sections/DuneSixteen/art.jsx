/* ---------------------------------------------------------------
   DuneSixteen — orange dune field with a road and a delivery truck.
--------------------------------------------------------------- */

const hash = (i, salt) => {
  const v = Math.sin(i * 91.7 + salt * 41.3) * 9137.71;
  return v - Math.floor(v);
};

const Speckles = ({ count, y0, y1, opacity }) => (
  <g fill="#ffffff">
    {Array.from({ length: count }, (_, i) => (
      <circle
        key={i}
        cx={hash(i, 1) * 1300 - 10}
        cy={y0 + hash(i, 2) * (y1 - y0)}
        r={0.8 + hash(i, 3) * 1.9}
        opacity={opacity * (0.3 + hash(i, 4) * 0.7)}
      />
    ))}
  </g>
);

export const DuneScene = (props) => (
  <svg viewBox="0 0 1280 700" fill="none" preserveAspectRatio="xMidYMax slice" {...props}>
    <defs>
      <linearGradient id="d16Sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fdf1e7" />
        <stop offset="100%" stopColor="#fbd9bd" />
      </linearGradient>
      <linearGradient id="d16Far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbc79b" />
        <stop offset="100%" stopColor="#f8a967" />
      </linearGradient>
      <linearGradient id="d16Mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbb072" />
        <stop offset="100%" stopColor="#f4832a" />
      </linearGradient>
      <linearGradient id="d16Near" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f89a4a" />
        <stop offset="100%" stopColor="#e8690c" />
      </linearGradient>
      <linearGradient id="d16Front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f97b1c" />
        <stop offset="100%" stopColor="#d95c05" />
      </linearGradient>
      <linearGradient id="d16Road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbc9a0" />
        <stop offset="100%" stopColor="#fde7d4" />
      </linearGradient>
    </defs>

    <rect width="1280" height="700" fill="url(#d16Sky)" />

    {/* small distant mounds */}
    <ellipse cx="470" cy="286" rx="46" ry="30" fill="#f8a967" opacity=".85" />
    <ellipse cx="700" cy="272" rx="38" ry="25" fill="#f79a52" opacity=".85" />

    {/* dune layers */}
    <path d="M-20 330 C160 246 340 240 520 292 C700 344 860 342 1040 296 C1160 266 1240 262 1300 268 V700 H-20Z" fill="url(#d16Far)" />
    <path d="M-20 408 C140 320 320 306 500 356 C680 406 840 414 1020 366 C1150 332 1240 326 1300 332 V700 H-20Z" fill="url(#d16Mid)" />
    <path d="M-20 500 C120 410 300 388 470 432 C640 476 820 500 1000 458 C1140 426 1240 416 1300 420 V700 H-20Z" fill="url(#d16Near)" />

    {/* the road ribbon */}
    <path
      d="M436 700 C470 596 588 560 690 528 C776 500 812 464 796 428 C784 400 744 388 706 386"
      stroke="url(#d16Road)"
      strokeWidth="46"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M436 700 C470 596 588 560 690 528 C776 500 812 464 796 428 C784 400 744 388 706 386"
      stroke="#e8690c"
      strokeWidth="1.6"
      strokeDasharray="0"
      fill="none"
      opacity=".45"
    />
    <path
      d="M486 700 C516 606 626 574 724 542 C818 512 856 466 838 424 C822 390 776 376 730 374"
      stroke="#e8690c"
      strokeWidth="1.6"
      fill="none"
      opacity=".4"
    />

    {/* truck */}
    <g transform="translate(676 486) rotate(-14)">
      <rect x="0" y="-34" width="62" height="34" rx="4" fill="#fde7d4" />
      <rect x="62" y="-24" width="30" height="24" rx="4" fill="#fbc9a0" />
      <rect x="70" y="-20" width="16" height="11" rx="2" fill="#f89a4a" opacity=".7" />
      <circle cx="20" cy="3" r="6" fill="#e8690c" />
      <circle cx="76" cy="3" r="6" fill="#e8690c" />
      <path d="M0 -34h62v6H0z" fill="#fbc9a0" opacity=".8" />
    </g>

    {/* front dune, drawn over the road so it reads as receding */}
    <path d="M-20 596 C120 512 280 496 440 546 C520 570 560 620 600 700 H-20Z" fill="url(#d16Front)" />
    <path d="M1300 560 C1160 486 1000 486 860 540 C780 570 730 630 700 700 H1300Z" fill="url(#d16Front)" />

    <Speckles count={120} y0={330} y1={520} opacity={0.45} />
    <Speckles count={190} y0={500} y1={700} opacity={0.7} />
  </svg>
);

export const DrayvoMark = (props) => (
  <svg viewBox="0 0 34 34" fill="none" {...props}>
    <rect width="34" height="34" rx="9" fill="#f97316" />
    <path fillRule="evenodd" d="M15.2 9.5h3.6L24.5 24.5h-3.7l-1.2-3.3h-5.2l-1.2 3.3H9.5L15.2 9.5Zm1.8 4.6-1.6 4.4h3.2L17 14.1Z" fill="#fff" />
  </svg>
);

export const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.2A9.8 9.8 0 0 0 10.5 21.7v-6.9H8v-2.8h2.5v-2.1c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.75-1.6 1.52v1.8h2.7l-.43 2.8h-2.27v6.9A9.8 9.8 0 0 0 12 2.2Z" />
  </svg>
);

export const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm5 7.6v.33c0 3.36-2.56 7.24-7.24 7.24a7.2 7.2 0 0 1-3.9-1.14c.2.02.4.03.6.03a5.1 5.1 0 0 0 3.16-1.09 2.55 2.55 0 0 1-2.38-1.77c.16.03.32.05.49.05.23 0 .46-.03.67-.09a2.55 2.55 0 0 1-2.04-2.5v-.03c.34.19.74.3 1.15.32a2.54 2.54 0 0 1-.79-3.4 7.23 7.23 0 0 0 5.25 2.66 2.55 2.55 0 0 1 4.34-2.32 5.08 5.08 0 0 0 1.62-.62 2.56 2.56 0 0 1-1.12 1.4 5.08 5.08 0 0 0 1.46-.4A5.2 5.2 0 0 1 17 9.8Z" />
  </svg>
);

export const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm4.9 12.1a2.6 2.6 0 0 1-2.6 2.6H9.7a2.6 2.6 0 0 1-2.6-2.6V9.7a2.6 2.6 0 0 1 2.6-2.6h4.6a2.6 2.6 0 0 1 2.6 2.6v4.6Z" />
    <path d="M14.3 8.3H9.7c-.77 0-1.4.63-1.4 1.4v4.6c0 .77.63 1.4 1.4 1.4h4.6c.77 0 1.4-.63 1.4-1.4V9.7c0-.77-.63-1.4-1.4-1.4Zm-2.3 6a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Zm2.5-4.1a.55.55 0 1 1 0-1.1.55.55 0 0 1 0 1.1Z" fill="#fff" />
    <circle cx="12" cy="12" r="1.3" fill="#fff" />
  </svg>
);

export const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6ZM9.6 16.6H7.4v-6.7h2.2v6.7ZM8.5 9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm8.3 7.6h-2.2v-3.4c0-.9-.35-1.5-1.15-1.5-.63 0-.96.42-1.12.83-.06.15-.05.35-.05.55v3.52h-2.2s.03-6.1 0-6.7h2.2v1.05c.13-.43.83-1.05 1.95-1.05 1.4 0 2.57.92 2.57 2.9v3.8Z" />
  </svg>
);
