import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { crearRouter } from './router.jsx';
import './styles/sitio.css';
import './styles/herramientas.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={crearRouter()} />
  </StrictMode>,
);
