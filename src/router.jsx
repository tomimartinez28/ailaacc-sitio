import { createBrowserRouter, Navigate } from 'react-router';
import App from './App.jsx';
import ToolsLayout from './layouts/ToolsLayout.jsx';
import ToolsIndexPage from './pages/ToolsIndexPage.jsx';
import ToolPage from './pages/ToolPage.jsx';

// Qué se ve en "/" según VITE_INICIO (.env y .env.development):
//   herramientas  -> redirige a /herramientas; la landing y la página provisoria no se incluyen en el build
//   construccion  -> página "Sitio en construcción"
//   landing       -> la landing
// Las condiciones van escritas acá, en línea, para que el build las resuelva y descarte por completo
// el código de las páginas que no se usan (no quedan en los archivos publicados).
const inicio = import.meta.env.VITE_INICIO === 'landing'
  ? {
    lazy: async () => ({ Component: (await import('./layouts/SiteLayout.jsx')).default }),
    children: [{ index: true, lazy: async () => ({ Component: (await import('./pages/HomePage.jsx')).default }) }],
  }
  : import.meta.env.VITE_INICIO === 'construccion'
    ? { index: true, lazy: async () => ({ Component: (await import('./pages/EnConstruccionPage.jsx')).default }) }
    : { index: true, element: <Navigate to="/herramientas" replace /> };

// Rutas:
//   /                              según VITE_INICIO: herramientas (redirige), construccion o landing
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
