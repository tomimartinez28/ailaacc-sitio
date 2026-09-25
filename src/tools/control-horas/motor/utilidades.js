// Funciones pequeñas de fechas y horas, sin dependencias.

export const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const pad = (n) => String(n).padStart(2, '0');

// Número de serie de Excel (días desde 1900) -> Date en UTC
export const serialAFecha = (serial) => new Date(Math.round((serial - 25569) * 86400000));

// Date -> "AAAA-MM-DD"
export const fechaIso = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

// "AAAA-MM-DD" -> "DD/MM/AAAA"
export const fechaLegible = (iso) => iso.split('-').reverse().join('/');

// "HH:MM" o "HH:MM:SS" -> minutos desde las 00:00
export const horaAMinutos = (texto) => {
  const [h, m, s = 0] = texto.split(':').map(Number);
  return h * 60 + m + s / 60;
};

// minutos -> "HH:MM:SS"
export const minutosAHora = (min) => {
  const s = Math.round(min * 60);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};

// Extrae todas las horas de una celda. Una marca sola puede llegar como número de Excel.
export const horasDeCelda = (valor) =>
  typeof valor === 'number'
    ? [(valor % 1) * 1440]
    : (String(valor).match(/\d{2}:\d{2}(:\d{2})?/g) || []).map(horaAMinutos);
