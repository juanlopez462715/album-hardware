import { useState } from 'react';
import { PlaceholderProducto } from './PlaceholderProducto';

const BASE = import.meta.env.BASE_URL;

export function urlProxyImagen(src: string) {
  if (!src.startsWith('https://')) return '';
  const sinProtocolo = src.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(sinProtocolo)}&w=700&h=440&fit=contain&output=webp`;
}

interface Props {
  /** Ruta dentro de public/, ej. "img/ram/kingston.jpg". Vacía = placeholder. */
  src: string;
  alt: string;
  marca: string;
  modelo: string;
  categoria?: string;
  grande?: boolean;
}

/** Muestra la foto del producto; si no existe todavía, muestra el placeholder local. */
export function ImagenProducto({ src, alt, marca, modelo, categoria, grande = false }: Props) {
  const [modo, setModo] = useState<'directo' | 'proxy' | 'fallback'>('directo');
  const pendiente = !src || modo === 'fallback';
  const origen = src.startsWith('https://') ? src : `${BASE}${src}`;
  const proxy = urlProxyImagen(src);
  const fuente = modo === 'proxy' && proxy ? proxy : origen;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-borde/70 bg-white shadow-inner ${grande ? 'h-[20vh] min-h-32' : 'aspect-[16/10]'}`}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-white/70 to-transparent" />
      {pendiente ? (
        <PlaceholderProducto marca={marca} modelo={modelo} categoria={categoria} />
      ) : (
        <img
          src={fuente}
          alt={alt}
          loading="lazy"
          onError={() => {
            if (modo === 'directo' && proxy) setModo('proxy');
            else setModo('fallback');
          }}
          className="h-full w-full object-contain p-3 transition duration-300 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
      )}
      {pendiente && (
        <span className="absolute right-2 bottom-2 rounded bg-black/65 px-2 py-0.5 text-[10px] whitespace-nowrap text-white">
          Referencia visual
        </span>
      )}
    </div>
  );
}
