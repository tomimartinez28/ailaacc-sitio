// Contenido de la landing: sedes, servicios, textos. Los datos de contacto están en institucion.js.

export * from './institucion.js';

// Navegación de la landing (anclas a secciones de la página de inicio)
export const NAV_SECCIONES = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Sobre nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'sedes', label: 'Sedes' },
  { id: 'contacto', label: 'Contacto' },
];

// tone: orange | green | yellow — enHero: aparece como tarjeta destacada en el hero
export const SERVICIOS = [
  {
    id: 'cet', tone: 'orange', icon: 'libro', tag: '01 · CET',
    titulo: 'Centro Educativo Terapéutico',
    texto: 'Propuesta pedagógica y terapéutica integrada, con currícula adaptada a las posibilidades de cada estudiante.',
    hero: { titulo: 'Centro Educativo Terapéutico', texto: 'Propuesta pedagógica y terapéutica integrada.' },
  },
  {
    id: 'saie', tone: 'green', icon: 'personas', tag: '02 · SAIE',
    titulo: 'Apoyo a la Integración Escolar',
    texto: 'Acompañamiento del alumno integrado en la escuela común, en articulación con docentes y equipo directivo.',
    hero: { titulo: 'Integración Escolar', texto: 'Acompañamiento del alumno en la escuela común.' },
  },
  {
    id: 'temprana', tone: 'yellow', icon: 'brote', tag: '03 · Temprana',
    titulo: 'Estimulación Temprana',
    texto: 'Detección y abordaje oportuno del desarrollo en la primera infancia, previo al ingreso escolar.',
    hero: { titulo: 'Estimulación Temprana', texto: 'Abordaje oportuno en la primera infancia.' },
  },
  {
    id: 'transporte', tone: 'orange', icon: 'transporte', tag: '04 · Transporte',
    titulo: 'Servicio de Transporte',
    texto: 'Traslado adaptado desde y hacia cada sede, facilitando el acceso cotidiano a los servicios.',
  },
  {
    id: 'diagnostico', tone: 'green', icon: 'diagnostico', tag: '05 · Diagnóstico',
    titulo: 'Departamento de Diagnóstico',
    texto: 'Evaluación interdisciplinaria que orienta el diagnóstico y define el plan de abordaje más adecuado.',
  },
];

export const VALORES = [
  { tone: 'orange', titulo: 'Trabajo interdisciplinario', texto: 'Cada persona es acompañada por un equipo que combina distintas miradas profesionales, no un abordaje aislado.' },
  { tone: 'green', titulo: 'Cercanía territorial', texto: 'Presencia en seis localidades del Chaco para que las familias no tengan que trasladarse largas distancias.' },
  { tone: 'yellow', titulo: 'Acompañamiento a las familias', texto: 'Informamos y sostenemos a la familia en cada etapa del proceso, como parte activa del abordaje.' },
];

// Cifras del hero: [texto destacado, resto]
export const CIFRAS = [
  ['6 sedes', 'en la provincia del Chaco'],
  ['+370 alumnos', ''],
  ['+160 colaboradores', ''],
  ['+10 años', 'de experiencia'],
];

export const FICHA = [
  ['Denominación', 'A.I.L.A.A.C.C.'],
  ['Registro', 'U.E.G.P. N° 195'],
  ['Jurisdicción', 'Provincia del Chaco'],
  ['Sede central', 'Sáenz Peña'],
  ['Sedes en Chaco', '6 localidades'],
];

// Coordenadas del mapa: proyección de lat/lon reales -> x = 30+(lon+61.55)*160, y = 30+(-lat-26.1)*160
// label: posición del texto y alineación. opcion: valor en el <select> del formulario.
// direccion: calle y número; se muestra como "<direccion>, <localidad>, Chaco".
export const SEDES = [
  {
    id: 'saenz-pena', nombre: 'Sáenz Peña', central: true, opcion: 'Sáenz Peña (casa central)',
    direccion: 'Mariano Moreno 551', localidad: 'Presidencia Roque Sáenz Peña', telefono: '(3644) 359654',
    mapa: { x: 207.6, y: 140.4, lx: 195, ly: 136, anchor: 'end' },
  },
  {
    id: 'villa-angela', nombre: 'Villa Ángela', opcion: 'Villa Ángela',
    direccion: 'Presidente Perón 547', localidad: 'Villa Ángela', telefono: '(3644) 309692',
    mapa: { x: 164.4, y: 265.2, lx: 176, ly: 269, anchor: 'start' },
  },
  {
    id: 'quitilipi', nombre: 'Quitilipi', opcion: 'Quitilipi',
    direccion: 'La Pampa 320', localidad: 'Quitilipi', telefono: '(3644) 275436',
    mapa: { x: 242.8, y: 153.2, lx: 254, ly: 157, anchor: 'start' },
  },
  {
    id: 'tres-isletas', nombre: 'Tres Isletas', opcion: 'Tres Isletas',
    direccion: 'Alberdi 274', localidad: 'Tres Isletas', telefono: '(3644) 232512',
    mapa: { x: 209.2, y: 68.4, lx: 221, ly: 72, anchor: 'start' },
  },
  {
    id: 'las-brenas', nombre: 'Las Breñas', opcion: 'Las Breñas',
    direccion: 'Mercante 956', localidad: 'Las Breñas', telefono: '(3644) 277718',
    mapa: { x: 105.2, y: 188.4, lx: 117, ly: 186, anchor: 'start' },
  },
  {
    id: 'charata', nombre: 'Charata', opcion: 'Charata',
    direccion: 'Almirante Brown 195', localidad: 'Charata', telefono: '(3644) 559386',
    mapa: { x: 87.6, y: 207.6, lx: 76, ly: 212, anchor: 'end' },
  },
];


export const OPCIONES_SEDE = [...SEDES.map((s) => s.opcion), 'No sé / me orientan'];

export const MOTIVO_TRABAJO = 'Quiero trabajar en AILAACC (envío de CV)';
export const MOTIVO_OTRA = 'Otra consulta';

// value = lo que se envía por WhatsApp · label = lo que se ve en el formulario
export const OPCIONES_MOTIVO = [
  ...SERVICIOS.map((s) => ({ value: s.titulo, label: s.titulo })),
  { value: MOTIVO_TRABAJO, label: 'Quiero trabajar en AILAACC' },
  { value: MOTIVO_OTRA, label: 'Otra consulta' },
];

export const SEDE_CENTRAL = SEDES.find((s) => s.central);

export const direccionCompleta = (sede) => `${sede.direccion}, ${sede.localidad}, Chaco`;
