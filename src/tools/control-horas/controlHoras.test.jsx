import { describe, expect, it } from 'vitest';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { rutas } from '../../router.jsx';
import { useProcesarReportes } from './hooks/useProcesarReportes.js';
import { ResultList } from './components/ResultItem.jsx';

const archivo = (nombre) => ({ name: nombre, arrayBuffer: async () => new ArrayBuffer(0) });

describe('useProcesarReportes', () => {
  it('procesa en orden, muestra el más reciente arriba y guarda errores', async () => {
    const vistos = [];
    const falso = async (_, nombre) => {
      vistos.push(nombre);
      if (nombre === 'malo.xls') throw new Error('Formato no reconocido.');
      return { formato: 'F', estadisticas: { personas: 1, marcas: 2, diasImpares: 0, marcasDuplicadas: 0 }, buffer: new ArrayBuffer(1) };
    };
    const { result } = renderHook(() => useProcesarReportes(falso));
    await act(() => result.current.procesar([archivo('a.xlsx'), archivo('malo.xls')]));
    expect(vistos).toEqual(['a.xlsx', 'malo.xls']);
    expect(result.current.items.map((i) => [i.nombre, i.estado])).toEqual([['malo.xls', 'error'], ['a.xlsx', 'listo']]);
    expect(result.current.items[0].error).toBe('Formato no reconocido.');
  });
});

describe('ResultList', () => {
  it('muestra los estados igual que la versión HTML', () => {
    render(<ResultList items={[
      { id: 3, nombre: 'c.xlsx', estado: 'procesando' },
      { id: 2, nombre: 'b.xlsx', estado: 'error', error: 'Falla' },
      { id: 1, nombre: 'a.xlsx', estado: 'listo', resultado: { formato: 'ANVIZ – registros', estadisticas: { personas: 3, marcas: 120, diasImpares: 2, marcasDuplicadas: 1 } } },
    ]} />);
    expect(screen.getByText('Procesando…')).toHaveClass('meta');
    expect(screen.getByText('Falla')).toHaveClass('meta', 'err');
    expect(screen.getByText('ANVIZ – registros · 3 personas · 120 marcas')).toBeInTheDocument();
    expect(screen.getByText('2 días a completar')).toHaveClass('chip', 'impar');
    expect(screen.getByText('1 marcas duplicadas')).toHaveClass('chip', 'dup');
    expect(screen.getByRole('button', { name: 'Descargar Excel' })).toBeInTheDocument();
  });
});

describe('rutas', () => {
  const ir = (url) => {
    const router = createMemoryRouter(rutas, { initialEntries: [url] });
    render(<RouterProvider router={router} />);
    return router;
  };

  it('la dirección vieja /control-horas.html redirige a la herramienta', async () => {
    const router = ir('/control-horas.html');
    await waitFor(() => expect(router.state.location.pathname).toBe('/herramientas/control-horas'));
    expect(await screen.findByRole('heading', { name: 'Control de horas', level: 1 })).toBeInTheDocument();
  });

  it('una herramienta inexistente vuelve al listado', async () => {
    const router = ir('/herramientas/no-existe');
    await waitFor(() => expect(router.state.location.pathname).toBe('/herramientas'));
    expect(screen.getByRole('link', { name: /Control de horas/ })).toHaveAttribute('href', '/herramientas/control-horas');
  });

  it('una ruta desconocida vuelve al inicio', async () => {
    window.IntersectionObserver = class { observe() {} disconnect() {} };
    const router = ir('/cualquier-cosa');
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
  });
});
