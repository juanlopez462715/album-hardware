import { useState } from 'react';

const BASE = import.meta.env.BASE_URL;

interface Props {
  /** Ruta dentro de public/, ej. "img/ram/kingston.jpg". Vacía = placeholder. */
  src: string;
  alt: string;
  grande?: boolean;
}

/** Muestra la foto del producto; si no existe todavía, muestra el placeholder local. */
export function ImagenProducto({ src, alt, grande = false }: Props) {
  const [fallo, setFallo] = useState(false);
  const pendiente = !src || fallo;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-white ${grande ? 'h-[20vh] min-h-32' : 'aspect-[16/10]'}`}
    >
      <img
        src={pendiente ? `${BASE}img/placeholder.svg` : `${BASE}${src}`}
        alt={pendiente ? '' : alt}
        loading="lazy"
        onError={() => setFallo(true)}
        className="max-h-full max-w-full object-contain p-3"
      />
      {pendiente && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/65 px-2 py-0.5 text-[11px] whitespace-nowrap text-white">
          Imagen pendiente
        </span>
      )}
    </div>
  );
}
