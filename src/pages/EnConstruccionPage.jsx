import { SimpleHeader } from '../components/layout/SiteHeader.jsx';
import { CompactFooter } from '../components/layout/CompactFooter.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Eyebrow } from '../components/ui/SectionHead.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { useDocumentTitle, useMetaTag } from '../hooks/useDocumentTitle.js';
import { LOGO } from '../lib/asset.js';
import { abrirWhatsApp, MENSAJE_RAPIDO } from '../lib/whatsapp.js';
import { CONTACTO, INSTITUCION, REDES } from '../data/institucion.js';

// Página provisoria mientras la landing no está publicada (VITE_LANDING_PUBLICA=false en .env).
export default function EnConstruccionPage() {
  useDocumentTitle('AILAACC Chaco — Sitio en construcción');
  useMetaTag('robots', 'noindex'); // que los buscadores no guarden esta versión provisoria

  return (
    <div className="tools-shell">
      <SimpleHeader subtitle={`${INSTITUCION.registro} · CHACO`} />

      <main className="hero en-construccion">
        <div className="wrap hero-inner">
          <img className="en-construccion-logo" src={LOGO.src} width={LOGO.width} height={LOGO.height} alt="Logo de A.I.L.A.A.C.C." />
          <Eyebrow>Sitio en construcción</Eyebrow>
          <h1>Estamos preparando <span className="grad">nuestro nuevo sitio.</span></h1>
          <p className="lede">Muy pronto vas a encontrar acá toda la información sobre nuestros servicios y sedes. Mientras tanto, podés comunicarte con nosotros.</p>

          <div className="hero-actions">
            <Button variant="white" onClick={() => abrirWhatsApp(MENSAJE_RAPIDO)}>
              <Icon name="whatsapp" />
              Escribinos por WhatsApp
            </Button>
            <Button variant="ghost" href={CONTACTO.telefono.href}>
              <Icon name="telefono" />
              {CONTACTO.telefono.texto}
            </Button>
          </div>

          <p className="hero-trust en-construccion-redes">
            {REDES.map((r) => (
              <a key={r.red} href={r.url} target="_blank" rel="noopener noreferrer">
                <Icon name={r.icono} />{r.red}
              </a>
            ))}
          </p>
        </div>
      </main>

      <CompactFooter to="/herramientas" texto="Acceso personal · Herramientas →" />
    </div>
  );
}
