import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import EnConstruccionPage from './EnConstruccionPage.jsx';
import { REDES, WHATSAPP_NUMBER } from '../data/institucion.js';

const renderPagina = () => render(<RouterProvider router={createMemoryRouter([{ path: '/', element: <EnConstruccionPage /> }])} />);

describe('Sitio en construcción', () => {
  it('muestra el aviso, los medios de contacto y el acceso del personal', async () => {
    renderPagina();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Estamos preparando nuestro nuevo sitio.');
    expect(document.title).toBe('AILAACC Chaco — Sitio en construcción');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    for (const r of REDES) expect(screen.getByRole('link', { name: r.red })).toHaveAttribute('href', r.url);
    expect(screen.getByRole('link', { name: /Herramientas/ })).toHaveAttribute('href', '/herramientas');

    const abrir = vi.spyOn(window, 'open').mockImplementation(() => null);
    await userEvent.click(screen.getByRole('button', { name: /Escribinos por WhatsApp/ }));
    expect(abrir.mock.calls[0][0]).toMatch(new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}\\?text=`));
  });
});
