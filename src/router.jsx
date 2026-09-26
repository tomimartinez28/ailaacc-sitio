import { createBrowserRouter, Navigate } from 'react-router';
import App from './App.jsx';
import ToolsLayout from './layouts/ToolsLayout.jsx';
import ToolsIndexPage from './pages/ToolsIndexPage.jsx';
import ToolPage from './pages/ToolPage.jsx';

// Página de inicio: la landing, o "Sitio en construcción" mientras no esté publicada.
// VITE_LANDING_PUBLICA se define en .env (publicado: false) y .env.development (dev: true).
// La condición va escrita acá, en línea, para que el build la resuelva y descarte por completo
// el código de la página que no se usa (con false, la landing no queda en los archivos publicados).
const inicio = import.meta.env.VITE_LANDING_PUBLICA === 'true'
  ? {
    lazy: async () => ({ Component: (await import('./layouts/SiteLayout.jsx')).default }),
    children: [{ index: true, lazy: async () => ({ Component: (await import('./pages/HomePage.jsx')).default }) }],
  }
  : { index: true, lazy: async () => ({ Component: (await import('./pages/EnConstruccionPage.jsx')).default }) };

// Rutas:
//   /                              landing (o "Sitio en construcción" si VITE_LANDING_PUBLICA=false)
//   /herramientas                  listado de herramientas del personal
//   /herramientas/:slug            una herramienta (ej. control-horas)
//   /control-horas.html            dirección de la versión anterior -> redirige
export const rutas = [
  {
    path: '/',
    element: <App />,
    children: [
      inicio,
      {
        path: 'herramientas',
        element: <ToolsLayout />,
        children: [
          { index: true, element: <ToolsIndexPage /> },
          { path: ':slug', element: <ToolPage /> },
        ],
      },
      { path: 'control-horas.html', element: <Navigate to="/herramientas/control-horas" replace /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];

export const crearRouter = () => createBrowserRouter(rutas, { basename: import.meta.env.BASE_URL });
