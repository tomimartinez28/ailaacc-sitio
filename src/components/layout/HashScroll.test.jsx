import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { HashScroll } from './HashScroll.jsx';

describe('HashScroll', () => {
  it('ignora una #ancla mal codificada en lugar de romper la página', () => {
    const router = createMemoryRouter([{ path: '/', element: <><HashScroll /><p>contenido</p></> }], { initialEntries: ['/#%E0'] });
    render(<RouterProvider router={router} />);
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
});
