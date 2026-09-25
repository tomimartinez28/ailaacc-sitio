import { Icon } from '../ui/Icon.jsx';
import { abrirWhatsApp, MENSAJE_RAPIDO } from '../../lib/whatsapp.js';

export function WhatsAppFloat() {
  return (
    <button type="button" className="wa-float" aria-label="Escribir por WhatsApp" onClick={() => abrirWhatsApp(MENSAJE_RAPIDO)}>
      <Icon name="whatsapp" />
    </button>
  );
}
