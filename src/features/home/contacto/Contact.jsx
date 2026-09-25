import { SectionHead } from '../../../components/ui/SectionHead.jsx';
import { ContactForm } from './ContactForm.jsx';
import { ContactInfo } from './ContactInfo.jsx';

export function Contact() {
  return (
    <section id="contacto">
      <div className="wrap">
        <SectionHead
          eyebrow="Contacto"
          title="Dejanos tus datos y te contactamos."
          lede="Completá el formulario y lo enviamos directo por WhatsApp, o escribinos por los medios de contacto institucionales."
        />
        <div className="contact-grid">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
