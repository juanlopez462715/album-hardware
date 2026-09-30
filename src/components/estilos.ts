// Clases de Tailwind que se repiten en varios componentes.
const baseBoton =
  'inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento disabled:pointer-events-none disabled:opacity-40';

export const botonPrimario = `${baseBoton} bg-acento text-acento-texto hover:opacity-90`;

export const botonSecundario = `${baseBoton} border border-borde bg-superficie hover:bg-superficie-2`;

export const botonIcono =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-borde bg-superficie transition-colors hover:bg-superficie-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento disabled:pointer-events-none disabled:opacity-40';

export const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

export const dosDigitos = (n: number) => n.toString().padStart(2, '0');
