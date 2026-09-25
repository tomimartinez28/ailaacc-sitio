import { useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { esNumeroPlaceholder } from '../lib/whatsapp.js';
import { ContactoProvider } from '../features/home/contacto/ContactoProvider.jsx';
import { Contact } from '../features/home/contacto/Contact.jsx';
import { Hero } from '../features/home/secciones/Hero.jsx';
import { About } from '../features/home/secciones/About.jsx';
import { Services } from '../features/home/secciones/Services.jsx';
import { WorkWithUs } from '../features/home/secciones/WorkWithUs.jsx';
import { Sedes } from '../features/home/sedes/Sedes.jsx';

export default function HomePage() {
  useDocumentTitle('AILAACC Chaco');

  useEffect(() => {
    if (esNumeroPlaceholder()) {
      console.warn('AILAACC: WHATSAPP_NUMBER sigue siendo un placeholder. Reemplazalo antes de publicar (src/data/sitio.js).');
    }
  }, []);

  return (
    <ContactoProvider>
      <Hero />
      <About />
      <Services />
      <Sedes />
      <WorkWithUs />
      <Contact />
    </ContactoProvider>
  );
}
