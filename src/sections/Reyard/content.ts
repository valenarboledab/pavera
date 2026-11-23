export const brand = {
  name: 'ARANGO LANDS',
  blurb: 'Pavimentos bien hechos desde la base, para vías, patios y espacios que se usan todos los días',
  contact: 'Contáctanos:',
};

// A 17.5 s ping-pong loop of a locked-off shot; the poster is its first frame.
export const VIDEO_SRC = `${import.meta.env.BASE_URL}reyard/desert.mp4`;
export const POSTER_SRC = `${import.meta.env.BASE_URL}reyard/desert-poster.jpg`;

export const socials = [
  {label: 'Facebook', icon: 'facebook'},
  {label: 'Instagram', icon: 'instagram'},
  {label: 'X', icon: 'x'},
  {label: 'LinkedIn', icon: 'linkedin'},
] as const;

export const columns = [
  {
    title: 'Arango Lands',
    links: ['Inicio', 'Nosotros', 'Proyectos', 'Proceso', 'Cotizar', 'Términos', 'Privacidad'],
  },
  {
    title: 'Servicios',
    links: ['Asfalto', 'Concreto rígido', 'Adoquín', 'Concreto estampado', 'Sellado', 'Mantenimiento', 'Ver todos'],
  },
  {
    title: 'Recursos',
    links: ['Soporte', 'Blog', 'Empleo', 'Precios'],
  },
];
