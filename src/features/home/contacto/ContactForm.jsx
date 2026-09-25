import { useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button.jsx';
import { Icon } from '../../../components/ui/Icon.jsx';
import { OPCIONES_MOTIVO, OPCIONES_SEDE } from '../../../data/sitio.js';
import { abrirWhatsApp, mensajeConsulta } from '../../../lib/whatsapp.js';
import { useAccionesContacto, useFormularioContacto } from './useContacto.js';

function Campo({ id, label, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

export function ContactForm() {
  const valores = useFormularioContacto();
  const { cambiarCampo } = useAccionesContacto();
  const [estado, setEstado] = useState({ texto: '', tipo: '' });
  const [invalidos, setInvalidos] = useState(null); // null = todavía no se intentó enviar
  const refNombre = useRef(null);
  const refTelefono = useRef(null);

  const alCambiar = (e) => cambiarCampo(e.target.name, e.target.value);

  const alEnviar = (e) => {
    e.preventDefault();
    const nombre = valores.nombre.trim();
    const telefono = valores.telefono.trim();
    setInvalidos({ nombre: !nombre, telefono: !telefono });

    if (!nombre || !telefono) {
      setEstado({ texto: 'Completá nombre y teléfono para continuar.', tipo: 'err' });
      (nombre ? refTelefono : refNombre).current.focus();
      return;
    }
    setEstado({ texto: 'Abriendo WhatsApp…', tipo: 'ok' });
    abrirWhatsApp(mensajeConsulta({ ...valores, nombre, telefono, mensaje: valores.mensaje.trim() }));
  };

  const ariaInvalid = (campo) => (invalidos ? String(invalidos[campo]) : undefined);

  return (
    <form className="contact-form" id="contact-form" onSubmit={alEnviar}>
      <div className="field-row">
        <Campo id="nombre" label="Nombre y apellido">
          <input ref={refNombre} id="nombre" name="nombre" type="text" required placeholder="Ej: María Gómez"
            value={valores.nombre} onChange={alCambiar} aria-invalid={ariaInvalid('nombre')} />
        </Campo>
        <Campo id="telefono" label="Teléfono / WhatsApp">
          <input ref={refTelefono} id="telefono" name="telefono" type="tel" required placeholder="Ej: 3644 000000"
            value={valores.telefono} onChange={alCambiar} aria-invalid={ariaInvalid('telefono')} />
        </Campo>
      </div>

      <div className="field-row">
        <Campo id="sede" label="Sede de interés">
          <select id="sede" name="sede" value={valores.sede} onChange={alCambiar}>
            {OPCIONES_SEDE.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
        </Campo>
        <Campo id="motivo" label="Motivo de la consulta">
          <select id="motivo" name="motivo" value={valores.motivo} onChange={alCambiar}>
            {OPCIONES_MOTIVO.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </Campo>
      </div>

      <Campo id="mensaje" label="Mensaje (opcional)">
        <textarea id="mensaje" name="mensaje" rows={3} placeholder="Contanos brevemente la situación o consulta"
          value={valores.mensaje} onChange={alCambiar} />
      </Campo>

      <p className="form-note">Al enviar, se abrirá WhatsApp con tu mensaje ya redactado para confirmar el envío.</p>

      <div className="form-foot">
        <Button variant="wa" type="submit">
          <Icon name="whatsapp" />
          Enviar por WhatsApp
        </Button>
        <span id="form-status" role="status" className={estado.tipo || undefined}>{estado.texto}</span>
      </div>
    </form>
  );
}
