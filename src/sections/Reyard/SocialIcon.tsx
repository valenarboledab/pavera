type Name = 'facebook' | 'instagram' | 'x' | 'linkedin';

export function SocialIcon({name, className}: {name: Name; className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {name === 'facebook' && (
        <path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1Z" />
      )}
      {name === 'instagram' && (
        <>
          <path d="M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 7.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z" />
          <path d="M16.6 3H7.4A4.4 4.4 0 0 0 3 7.4v9.2A4.4 4.4 0 0 0 7.4 21h9.2a4.4 4.4 0 0 0 4.4-4.4V7.4A4.4 4.4 0 0 0 16.6 3Zm2.8 13.6a2.8 2.8 0 0 1-2.8 2.8H7.4a2.8 2.8 0 0 1-2.8-2.8V7.4a2.8 2.8 0 0 1 2.8-2.8h9.2a2.8 2.8 0 0 1 2.8 2.8v9.2Z" />
          <circle cx="17.1" cy="6.9" r="1.05" />
        </>
      )}
      {name === 'x' && (
        <path d="M17.5 3.5h2.9l-6.3 7.2 7.4 9.8h-5.8l-4.5-5.9-5.2 5.9H3.1l6.7-7.7-7.1-9.3h5.9l4.1 5.4 4.8-5.4Zm-1 15.3h1.6L7.6 5.1H5.9l10.6 13.7Z" />
      )}
      {name === 'linkedin' && (
        <path d="M6.9 20.3H3.6V9.4h3.3v10.9ZM5.2 8a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8Zm15.1 12.3H17v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8v5.4H9.9V9.4H13v1.5c.5-.8 1.5-1.8 3.2-1.8 3.4 0 4.1 2.3 4.1 5.2v6Z" />
      )}
    </svg>
  );
}
