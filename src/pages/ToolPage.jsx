import { Suspense } from 'react';
import { Navigate, useParams } from 'react-router';
import { buscarHerramienta } from '../tools/registro.js';

// Muestra la herramienta indicada en la URL (/herramientas/:slug). Su código se descarga recién acá.
export default function ToolPage() {
  const { slug } = useParams();
  const herramienta = buscarHerramienta(slug);
  if (!herramienta) return <Navigate to="/herramientas" replace />;

  const { Componente } = herramienta;
  return (
    <Suspense fallback={<p className="tool-loading" role="status">Cargando herramienta…</p>}>
      <Componente />
    </Suspense>
  );
}
