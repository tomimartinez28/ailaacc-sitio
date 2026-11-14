import { createBrowserRouter, Navigate } from 'react-router';
import App from './App.jsx';
import ToolsLayout from './layouts/ToolsLayout.jsx';
import ToolsIndexPage from './pages/ToolsIndexPage.jsx';
import ToolPage from './pages/ToolPage.jsx';

// La landing es otro proyecto (ailaacc-landing, en https://ailaaccuep195.com/): acá solo están las herramientas.
// Rutas:
//   /                              redirige a /herramientas
//   /herramientas                  listado de herramientas del personal
//   /herramientas/:slug            una herramienta (ej. control-horas)
//   /control-horas.html            dirección de la versión anterior -> redirige
export const rutas = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/herramientas" replace /> },
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
