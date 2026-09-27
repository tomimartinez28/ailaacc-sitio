import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { rutas } from '../../router.jsx';
import { ResultList } from '../components/ResultList.jsx';
import { describirExtracto, salidaExtracto } from './resumen.js';
import { MENSAJE_EN_DESARROLLO, procesarExtracto } from './motor/index.js';

describe('Extractos bancarios', () => {
  it('el motor todavía no procesa: avisa que está en desarrollo', async () => {
    await expect(procesarExtracto(new ArrayBuffer(0), 'x.pdf')).rejects.toThrow(MENSAJE_EN_DESARROLLO);
  });

  it('muestra un extracto procesado con sus ingresos y gastos (formato que espera la interfaz)', () => {
    expect(salidaExtracto('extracto-agosto.pdf')).toBe('extracto-agosto_resumen.xlsx');
    render(<ResultList describir={describirExtracto} nombreSalida={salidaExtracto} items={[
      { id: 1, nombre: 'agosto.xlsx', estado: 'listo', resultado: {
        banco: 'Banco X', periodo: '01/08/2026 al 31/08/2026', buffer: new ArrayBuffer(1),
        estadisticas: { movimientos: 52, ingresos: { cantidad: 40, total: 1500000.5 }, gastos: { cantidad: 12, total: 35000 } },
      } },
    ]} />);
    expect(screen.getByText('Banco X · 01/08/2026 al 31/08/2026 · 52 movimientos')).toHaveClass('meta');
    expect(screen.getByText(/^40 ingresos · \$\s?1\.500\.000,50$/)).toHaveClass('chip', 'ingreso');
    expect(screen.getByText(/^12 gastos bancarios · \$\s?35\.000,00$/)).toHaveClass('chip', 'gasto');
    expect(screen.getByRole('button', { name: 'Descargar Excel' })).toBeInTheDocument();
  });

  it('aparece en el listado de herramientas marcada "En desarrollo" y abre su página', async () => {
    const router = createMemoryRouter(rutas, { initialEntries: ['/herramientas'] });
    render(<RouterProvider router={router} />);
    const tarjeta = screen.getByRole('link', { name: /Extractos bancarios/ });
    expect(tarjeta).toHaveAttribute('href', '/herramientas/extractos-bancarios');
    expect(tarjeta).toHaveTextContent('En desarrollo');
    expect(screen.getByRole('link', { name: /Control de horas/ })).not.toHaveTextContent('En desarrollo');

    await router.navigate('/herramientas/extractos-bancarios');
    expect(await screen.findByRole('heading', { level: 1, name: 'Procesamiento de extractos bancarios' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Extractos bancarios – AILAACC'));
    expect(screen.getByRole('note')).toHaveTextContent('Herramienta en desarrollo');
    expect(document.getElementById('archivos')).toHaveAttribute('accept', '.xls,.xlsx,.csv,.pdf');
  });
});
