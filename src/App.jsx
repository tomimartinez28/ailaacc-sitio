import { Outlet, ScrollRestoration } from 'react-router';

// Raíz común a todas las rutas: restaura el scroll al navegar.
export default function App() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
