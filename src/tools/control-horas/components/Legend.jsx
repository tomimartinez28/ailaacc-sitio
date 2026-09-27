import { Muestra, Nota } from '../../components/Nota.jsx';
import { MINUTOS_DUPLICADO } from '../config.js';

export function Legend() {
  return (
    <Nota titulo="Cómo leer el Excel">
      <p><Muestra clase="muestra-impar" />Días con marcas impares: quedan en rosa y dicen COMPLETAR. Al escribir la hora que falta en el Excel, las horas se recalculan y el color desaparece.</p>
      <p><Muestra clase="muestra-dup" />{`Marcas a menos de ${MINUTOS_DUPLICADO} minutos de la anterior: se muestran en naranja en la columna "Duplicadas (borrar)" y no se suman.`}</p>
    </Nota>
  );
}
