import { Icon } from '../../components/ui/Icon.jsx';

// Recuadro de ayuda debajo de la herramienta, con la aclaración de privacidad al final
export function Nota({ titulo, children }) {
  return (
    <div className="nota">
      <p className="nota-titulo">{titulo}</p>
      {children}
      <p className="nota-priv">
        <Icon name="candado" />
        Todo el procesamiento ocurre en este navegador: ningún archivo sale de tu computadora.
      </p>
    </div>
  );
}

// Cuadradito de color para las referencias de la leyenda
export const Muestra = ({ clase }) => <span className={`muestra ${clase}`}></span>;
