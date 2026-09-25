import { Outlet } from 'react-router';
import { LandingHeader } from '../components/layout/SiteHeader.jsx';
import { LandingFooter } from '../components/layout/SiteFooter.jsx';
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat.jsx';
import { NAV_SECCIONES, INSTITUCION } from '../data/sitio.js';

export default function SiteLayout() {
  return (
    <>
      <LandingHeader secciones={NAV_SECCIONES} subtitle={`${INSTITUCION.registro} · CHACO`} />
      <main><Outlet /></main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}
