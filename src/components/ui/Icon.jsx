// Íconos SVG del sitio. Uso: <Icon name="check" className="..." />
// Cada ícono define su viewBox, trazo y contenido; son decorativos (aria-hidden) salvo que se pase title.

const TRAZO_24 = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const TRAZO_48 = { ...TRAZO_24, viewBox: '0 0 48 48' };

const ICONOS = {
  flecha: { ...TRAZO_24, strokeWidth: 2.4, strokeLinejoin: undefined, d: <path d="M5 12h14M13 6l6 6-6 6" /> },
  volver: { ...TRAZO_24, strokeWidth: 2.4, strokeLinejoin: undefined, d: <path d="M19 12H5M11 6l-6 6 6 6" /> },
  check: { ...TRAZO_24, strokeWidth: 2.6, d: <path d="M5 12.5l4.5 4.5L19 7" /> },
  chevron: { ...TRAZO_24, strokeWidth: 2.4, strokeLinejoin: undefined, d: <path d="M6 9l6 6 6-6" /> },
  menu: { ...TRAZO_24, strokeLinejoin: undefined, d: <path d="M3 6h18M3 12h18M3 18h18" /> },
  cerrar: { ...TRAZO_24, strokeLinejoin: undefined, d: <path d="M6 6l12 12M18 6L6 18" /> },
  ubicacion: { ...TRAZO_24, strokeLinecap: undefined, strokeLinejoin: undefined, d: <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></> },
  telefono: { ...TRAZO_24, strokeLinecap: undefined, strokeLinejoin: undefined, d: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2z" /> },
  reloj: { ...TRAZO_24, strokeLinecap: undefined, strokeLinejoin: undefined, d: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></> },
  mail: { ...TRAZO_24, strokeLinecap: undefined, strokeLinejoin: undefined, d: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></> },
  instagram: { ...TRAZO_24, strokeLinecap: undefined, strokeLinejoin: undefined, d: <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></> },
  facebook: { ...TRAZO_24, d: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M15.5 7.5H14a2.5 2.5 0 0 0-2.5 2.5v11M9 13h6" /></> },
  linkedin: { ...TRAZO_24, d: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 10.5V17M8 7.25v.01M12 17v-6.5M12 13.5a2.5 2.5 0 0 1 5 0V17" /></> },
  subir: { ...TRAZO_24, d: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></> },
  candado: { ...TRAZO_24, d: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></> },
  planilla: { ...TRAZO_24, d: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 9h16M4 15h16M10 3v18" /></> },
  whatsapp: {
    viewBox: '0 0 24 24', fill: 'currentColor',
    d: <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.5.3.7.9 2.2 1 2.4.1.2.1.4 0 .6-.6 1.3-1.3 1.2-.8 2 1 1.7 1.9 2.3 3.4 3 .3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.8.9 2.1 1 .3.2.5.2.6.3.1.2.1.9-.1 1.6z" />,
  },
  // Íconos de servicios (48x48)
  libro: { ...TRAZO_48, d: <><path d="M8 12c6-4 12-4 16 0 4-4 10-4 16 0v24c-6-4-12-4-16 0-4-4-10-4-16 0z" /><path d="M24 12v24" /></> },
  personas: { ...TRAZO_48, d: <><circle cx="17" cy="16" r="6" /><path d="M6 40c0-7 5-12 11-12s11 5 11 12" /><circle cx="34" cy="14" r="4.5" /><path d="M28 40c0-5.5 3.5-9.5 9-9.5" /></> },
  brote: { ...TRAZO_48, d: <><path d="M24 6c3 4 3 8 0 11-3-3-3-7 0-11z" /><path d="M12 44c0-9 5-16 12-16s12 7 12 16" /><path d="M24 28v16" /></> },
  transporte: { ...TRAZO_48, d: <><path d="M6 30V17a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v13" /><path d="M32 22h7l3 6v5H6" /><circle cx="14" cy="34" r="3.5" /><circle cx="35" cy="34" r="3.5" /></> },
  diagnostico: { ...TRAZO_48, d: <><rect x="12" y="7" width="20" height="6" rx="1.5" /><path d="M12 10H9a3 3 0 0 0-3 3v25a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V13a3 3 0 0 0-3-3h-3" /><path d="M15 26l5 5 10-11" /></> },
};

export function Icon({ name, className, strokeWidth, title }) {
  const { d, ...svgProps } = ICONOS[name];
  return (
    <svg
      {...svgProps}
      {...(strokeWidth ? { strokeWidth } : null)}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {d}
    </svg>
  );
}
