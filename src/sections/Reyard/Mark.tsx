/** Reyard mark: a ring left open at the top-right, trailing dots, with a sun over two dune lines. */
export function Mark({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M41.5 31.5A19 19 0 1 1 36 9.6" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="40.6" cy="15.6" r="1.9" fill="currentColor" />
      <circle cx="42.9" cy="23.4" r="1.6" fill="currentColor" />
      <circle cx="29" cy="18.5" r="4.4" fill="currentColor" />
      <path d="M11 29.5c4.5-4 9.5-4 14 0s9.5 4 13 0" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M15 35.5c3.2-2.6 6.8-2.6 10 0s6.6 2.6 9.6 0" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
