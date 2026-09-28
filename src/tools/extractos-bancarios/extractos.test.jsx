import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { rutas } from '../../router.jsx';
import { ResultList } from '../components/ResultList.jsx';
import { describirExtracto, salidaExtracto } from './resumen.js';

describe('Extractos bancarios (interfaz)', () => {
  it('muestra un extracto procesado con sus ingresos y gastos (formato que espera la interfaz)', () => {
    expect(salidaExtracto('extracto-agosto.xlsx')).toBe('extracto-agosto_resumen.xlsx');
    render(<ResultList describir={describirExtracto} nombreSalida={salidaExtracto} items={[
      { id: 1, nombre: 'agosto.xlsx', estado: 'listo', resultado: {
        banco: 'Banco X', periodo: '01/08/2026 al 31/08/2026', buffer: new ArrayBuffer(1),
        estadisticas: { movimientos: 52, ingresos: { cantidad: 40, total: 1500000.5 }, gastos: { cantidad: 12, total: 35000 }, excluidos: 3, saldos: 'verificados' },
      } },
    ]} />);
    expect(screen.getByText('Banco X · 01/08/2026 al 31/08/2026 · 52 movimientos · saldos verificados')).toHaveClass('meta');
    expect(screen.getByText('3 créditos excluidos (traspasos y otros)')).toHaveClass('chip', 'excluido');
    expect(screen.getByText(/^40 ingresos · \$\s?1\.500\.000,50$/)).toHaveClass('chip', 'ingreso');
    expect(screen.getByText(/^12 gastos bancarios · \$\s?35\.000,00$/)).toHaveClass('chip', 'gasto');
    expect(screen.getByRole('button', { name: 'Descargar Excel' })).toBeInTheDocument();
  });

  it('avisa cuando hay movimientos sin saldo informado', () => {
    render(<ResultList describir={describirExtracto} nombreSalida={salidaExtracto} items={[
      { id: 1, nombre: 'feb.xlsx', estado: 'listo', resultado: {
        banco: 'Santander', periodo: '02/02/2026 al 28/02/2026', buffer: new ArrayBuffer(1),
        estadisticas: { movimientos: 168, ingresos: { cantidad: 1, total: 1 }, gastos: { cantidad: 0, total: 0 }, excluidos: 0, saldos: 'verificados', sinSaldo: 6 },
      } },
    ]} />);
    expect(screen.getByText('Santander · 02/02/2026 al 28/02/2026 · 168 movimientos · saldos verificados (salvo 6 movimientos sin saldo informado)')).toBeInTheDocument();
  });

  it('aparece en el listado como Beta y la página muestra el aviso', async () => {
    const router = createMemoryRouter(rutas, { initialEntries: ['/herramientas'] });
    render(<RouterProvider router={router} />);
    const tarjeta = screen.getByRole('link', { name: /Extractos bancarios/ });
    expect(tarjeta).toHaveAttribute('href', '/herramientas/extractos-bancarios');
    expect(tarjeta.querySelector('.tool-badge')).toHaveTextContent('Beta');
    expect(screen.getByRole('link', { name: /Control de horas/ }).querySelector('.tool-badge')).toBeNull();

    await router.navigate('/herramientas/extractos-bancarios');
    expect(await screen.findByRole('heading', { level: 1, name: 'Procesamiento de extractos bancarios' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Extractos bancarios – AILAACC'));
    expect(screen.getByRole('note', { name: 'Versión beta' })).toHaveTextContent(/^Versión BETA\. .*documentalo con el nombre del archivo/);
    expect(document.getElementById('archivos')).toHaveAttribute('accept', '.xlsx');
  });
});
