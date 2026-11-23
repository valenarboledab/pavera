/** Every word in the section, adapted to Arango Lands. The address and social links are placeholders. */
export const EMAIL = 'hola@arangolands.com';

export const CONTACT = {
  tag: 'Agendando visitas técnicas este mes',
  headline: {first: 'Toda vía empieza', lead: 'con una buena ', accent: 'base', tail: '.'},
  lede: 'Diseñamos, construimos y mantenemos pavimentos en asfalto, concreto y adoquín para entradas, parqueaderos y vías privadas.',
  rating: {score: '48 h', note: 'para enviarte tu cotización'},
  // Initials of the three main pavements, not people.
  avatars: [
    {initials: 'AS', from: '#9aa3b2', to: '#23252b'},
    {initials: 'CO', from: '#e3e8f0', to: '#7b8494'},
    {initials: 'AD', from: '#f8b47a', to: '#c9682a'},
  ],
  cta: {label: 'Pedir visita técnica', href: `mailto:${EMAIL}?subject=Visita%20t%C3%A9cnica`},

  brand: {name: 'Arango Lands', tagline: 'Pavimentos que duran más que la obra.', city: 'Georgia', timeZone: 'America/New_York'},
  columns: [
    {
      title: 'Obras',
      links: [
        {label: 'Servicios', href: '#servicios'},
        {label: 'Proyectos', href: '#proyectos'},
        {label: 'Cotizar', href: '#cotizar'},
      ],
    },
    {
      title: 'Empresa',
      links: [
        {label: 'Inicio', href: '#inicio', top: true},
        {label: 'Cómo trabajamos', href: '#proceso'},
        {label: 'Mantenimiento', href: '#servicios'},
        {label: 'Blog', href: '#', soon: true},
      ],
    },
    {
      title: 'Legal',
      links: [
        {label: 'Privacidad', href: '#'},
        {label: 'Términos', href: '#'},
        {label: 'Garantía', href: '#'},
      ],
    },
  ],
  copyright: '© 2026 Arango Lands · Pavimentos y vías',

  panel: {kicker: 'Escríbele a la obra', reply: 'normalmente en unas horas'},
  postcard: {
    title: 'Notas de obra',
    note: 'Una vez al mes: obras terminadas, consejos de mantenimiento y precios de temporada.',
    placeholder: 'tu@correo.com',
    done: '¡Listo! Te escribimos el próximo mes.',
    invalid: 'Ese correo no parece válido.',
  },
  socials: ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'],

  /** The giant word, one entry per line. */
  word: ['Hablemos', 'de tu vía.'],
};

export type ContactLink = {label: string; href: string; soon?: boolean; top?: boolean};
