import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { rutas } from '../../../router.jsx';
import { FORMULARIO_INICIAL, reducerContacto } from './contactoEstado.js';
import { mensajeConsulta, urlWhatsApp } from '../../../lib/whatsapp.js';

const renderInicio = () => {
  window.IntersectionObserver = class { observe() {} disconnect() {} };
  window.matchMedia = () => ({ matches: false });
  Element.prototype.scrollIntoView = vi.fn();
  render(<RouterProvider router={createMemoryRouter(rutas, { initialEntries: ['/'] })} />);
};

describe('reducer del formulario', () => {
  it('cambia un campo y devuelve el mismo objeto si el valor no cambia', () => {
    const e = reducerContacto(FORMULARIO_INICIAL, { type: 'campo', name: 'nombre', value: 'Ana' });
    expect(e.nombre).toBe('Ana');
    expect(reducerContacto(e, { type: 'campo', name: 'nombre', value: 'Ana' })).toBe(e);
  });
});

describe('mensaje de WhatsApp', () => {
  it('arma el mismo texto que la versión HTML', () => {
    const t = mensajeConsulta({ nombre: 'Ana', telefono: '123', sede: 'Charata', motivo: 'Otra consulta', mensaje: 'Hola' });
    expect(t).toBe('Hola AILAACC, soy Ana.\nSede de interés: Charata.\nMotivo: Otra consulta.\nMi teléfono de contacto: 123.\nMensaje: Hola');
    expect(urlWhatsApp('a b', '549')).toBe('https://wa.me/549?text=a%20b');
  });
});

describe('landing', () => {
  it('"Consultar por esta sede" y "Enviar CV" preseleccionan el formulario', async () => {
    renderInicio();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /^06\s*Charata/ }));
    const region = screen.getByRole('region', { name: /Charata/ });
    await user.click(within(region).getByRole('link', { name: 'Consultar por esta sede' }));
    expect(screen.getByLabelText('Sede de interés')).toHaveValue('Charata');

    await user.click(screen.getByRole('link', { name: 'Enviar CV / postularme' }));
    expect(screen.getByLabelText('Motivo de la consulta')).toHaveValue('Quiero trabajar en AILAACC (envío de CV)');
  });

  it('el acordeón abre de a una sede y se sincroniza con el mapa', async () => {
    renderInicio();
    const user = userEvent.setup();
    const saenz = screen.getByRole('button', { name: /Sáenz Peña.*Casa central/ });
    expect(saenz).toHaveAttribute('aria-expanded', 'true');
    await user.click(saenz);
    expect(saenz).toHaveAttribute('aria-expanded', 'false');

    const pin = screen.getByRole('button', { name: 'Ver sede Quitilipi' });
    pin.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /^03\s*Quitilipi/ })).toHaveAttribute('aria-expanded', 'true');
    expect(pin).toHaveClass('active');
  });

  it('valida y envía el formulario por WhatsApp', async () => {
    renderInicio();
    const user = userEvent.setup();
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => null);

    await user.type(screen.getByLabelText('Nombre y apellido'), '   ');
    await user.type(screen.getByLabelText('Teléfono / WhatsApp'), '3644 111111');
    await user.click(screen.getByRole('button', { name: /Enviar por WhatsApp/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Completá nombre y teléfono para continuar.');
    expect(screen.getByLabelText('Nombre y apellido')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Nombre y apellido')).toHaveFocus();
    expect(abrir).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText('Nombre y apellido'));
    await user.type(screen.getByLabelText('Nombre y apellido'), 'María Gómez');
    await user.selectOptions(screen.getByLabelText('Sede de interés'), 'Quitilipi');
    await user.click(screen.getByRole('button', { name: /Enviar por WhatsApp/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Abriendo WhatsApp…');
    const texto = 'Hola AILAACC, soy María Gómez.\nSede de interés: Quitilipi.\nMotivo: Centro Educativo Terapéutico.\nMi teléfono de contacto: 3644 111111.';
    expect(abrir).toHaveBeenCalledWith('https://wa.me/5493644000000?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });
});
