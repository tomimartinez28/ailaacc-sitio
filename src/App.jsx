import { Outlet, ScrollRestoration } from 'react-router';
import { HashScroll } from './components/layout/HashScroll.jsx';

// Raíz común a todas las rutas: restaura el scroll al navegar y respeta las #anclas.
export default function App() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
      <HashScroll />
    </>
  );
}
