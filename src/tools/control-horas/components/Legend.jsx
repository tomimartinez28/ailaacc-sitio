import { Icon } from '../../../components/ui/Icon.jsx';
import { MINUTOS_DUPLICADO } from '../config.js';

export function Legend() {
  return (
    <div className="nota">
      <p className="nota-titulo">Cómo leer el Excel</p>
      <p><span className="muestra muestra-impar"></span>Días con marcas impares: quedan en rosa y dicen COMPLETAR. Al escribir la hora que falta en el Excel, las horas se recalculan y el color desaparece.</p>
      <p><span className="muestra muestra-dup"></span>{`Marcas a menos de ${MINUTOS_DUPLICADO} minutos de la anterior: se muestran en naranja en la columna "Duplicadas (borrar)" y no se suman.`}</p>
      <p className="nota-priv">
        <Icon name="candado" />
        Todo el procesamiento ocurre en este navegador: ningún archivo sale de tu computadora.
      </p>
    </div>
  );
}
