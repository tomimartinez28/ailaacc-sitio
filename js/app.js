// Interfaz: recibe archivos, los procesa y ofrece la descarga.

import { procesarArchivo } from './motor/index.js';

const lista = document.getElementById('lista');
const input = document.getElementById('archivos');
const zona = document.getElementById('zona');
const MIME_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Crea un elemento HTML con clase y texto
function crear(etiqueta, clase, texto) {
  const e = document.createElement(etiqueta);
  if (clase) e.className = clase;
  if (texto != null) e.textContent = texto;
  return e;
}

// Descarga un archivo generado en memoria
function descargar(nombre, buffer) {
  const url = URL.createObjectURL(new Blob([buffer], { type: MIME_XLSX }));
  const a = crear('a');
  a.href = url;
  a.download = nombre;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

async function procesar(archivo) {
  const item = crear('li', 'item');
  const estado = crear('p', 'meta', 'Procesando…');
  item.append(crear('h2', null, archivo.name), estado);
  lista.prepend(item);

  try {
    const r = await procesarArchivo(await archivo.arrayBuffer(), archivo.name);
    const e = r.estadisticas;
    estado.textContent = `${r.formato} · ${e.personas} personas · ${e.marcas} marcas`;

    const chips = crear('div', 'chips');
    chips.append(
      crear('span', 'chip impar', `${e.diasImpares} días a completar`),
      crear('span', 'chip dup', `${e.marcasDuplicadas} marcas duplicadas`),
    );

    const boton = crear('button', null, 'Descargar Excel');
    boton.type = 'button';
    const nombreSalida = archivo.name.replace(/\.[^.]+$/, '') + '_horas.xlsx';
    boton.addEventListener('click', () => descargar(nombreSalida, r.buffer));

    item.append(chips, boton);
  } catch (err) {
    estado.textContent = err.message || String(err);
    estado.classList.add('err');
  }
}

async function procesarVarios(archivos) {
  for (const a of archivos) await procesar(a);
  input.value = '';
}

// Eventos: selección y arrastrar/soltar
input.addEventListener('change', () => procesarVarios([...input.files]));
['dragenter', 'dragover'].forEach((ev) => zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.add('sobre'); }));
['dragleave', 'drop'].forEach((ev) => zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.remove('sobre'); }));
zona.addEventListener('drop', (e) => procesarVarios([...e.dataTransfer.files]));
