import { Brand } from '../ui/Brand.jsx';

// Header simple: marca que lleva al inicio + una acción opcional a la derecha.
export function SimpleHeader({ subtitle, children }) {
  return (
    <header className="site site-tools">
      <nav className="nav">
        <Brand to="/" subtitle={subtitle} label="AILAACC — inicio" />
        {children}
      </nav>
    </header>
  );
}

// Header de las herramientas
export function ToolsHeader({ subtitle }) {
  return <SimpleHeader subtitle={subtitle} />;
}
