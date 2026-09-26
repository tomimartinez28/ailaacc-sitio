import { Outlet } from 'react-router';
import { ToolsHeader } from '../components/layout/SiteHeader.jsx';
import { CompactFooter } from '../components/layout/CompactFooter.jsx';
import { useMetaTag } from '../hooks/useDocumentTitle.js';

// Área de uso interno: no se indexa en buscadores.
export default function ToolsLayout() {
  useMetaTag('robots', 'noindex, nofollow');
  return (
    <div className="tools-shell">
      <ToolsHeader subtitle="Herramientas del personal" />
      <Outlet />
      <CompactFooter />
    </div>
  );
}
