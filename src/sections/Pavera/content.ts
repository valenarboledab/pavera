// Todos los textos y precios de las secciones de Pavera. Cámbialos aquí sin tocar el diseño.

export const nav = [
  ['Servicios', '#servicios'],
  ['Proceso', '#proceso'],
  ['Proyectos', '#proyectos'],
  ['Cotizar', '#cotizar'],
] as const;

export const stats = [
  ['5', 'tipos de pavimento'],
  ['4', 'pasos, de la visita a la entrega'],
  ['48 h', 'para enviar tu cotización'],
  ['1', 'solo equipo de diseño a obra'],
] as const;

export const services = [
  {short: 'As', title: 'Asfalto', text: 'Vías privadas, parqueaderos y accesos de alto tráfico.', items: ['Mezcla en caliente', 'Bacheo y recarpeteo']},
  {short: 'Co', title: 'Concreto rígido', text: 'Losas para patios de maniobra, bodegas y entradas de garaje.', items: ['Juntas cortadas y selladas', 'Acabado escobillado']},
  {short: 'Ad', title: 'Adoquín', text: 'Plazas, andenes y senderos; permeable y fácil de reparar.', items: ['Adoquín de concreto o arcilla', 'Patrones a la medida']},
  {short: 'Es', title: 'Concreto estampado', text: 'Textura de piedra o madera con la resistencia del concreto.', items: ['Color integral', 'Sellado protector']},
  {short: 'Se', title: 'Sellado y demarcación', text: 'Protege la superficie y ordena el tránsito.', items: ['Sello asfáltico', 'Pintura de tráfico']},
  {short: 'Ma', title: 'Mantenimiento', text: 'Planes periódicos para alargar la vida del pavimento.', items: ['Inspección anual', 'Reparación de fisuras']},
];

export const steps = [
  ['Visita y medición', 'Medimos el área, revisamos pendientes, drenaje y el estado del suelo.'],
  ['Diseño y cotización', 'Proponemos la estructura de capas y el material, con presupuesto por partidas.'],
  ['Construcción', 'Excavación, base compactada, pavimento y sellado, con control de calidad por capa.'],
  ['Entrega y garantía', 'Recorrido final, recomendaciones de uso y plan de mantenimiento.'],
] as const;

// `hue` tiñe la imagen de relleno; reemplázala por fotos reales.
export const projects = [
  {title: 'Entrada de garaje', text: 'Concreto estampado · residencial', hue: 0},
  {title: 'Parqueadero comercial', text: 'Asfalto con demarcación', hue: 20},
  {title: 'Plaza peatonal', text: 'Adoquín de arcilla', hue: -15},
];

// Precios de EJEMPLO por m² en COP: pon tus tarifas reales.
export const materials = [
  {name: 'Asfalto', price: 95000},
  {name: 'Concreto rígido', price: 120000},
  {name: 'Adoquín', price: 140000},
  {name: 'Concreto estampado', price: 165000},
  {name: 'Solo sellado', price: 22000},
];

export const conditions = [
  {name: 'Terreno listo', factor: 1},
  {name: 'Hay que demoler o retirar', factor: 1.15},
  {name: 'Suelo blando, requiere mejoramiento', factor: 1.25},
];
