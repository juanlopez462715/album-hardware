import type { Producto } from '../lib/esquema';
import { formatearFecha, formatearPrecio } from '../lib/formato';
import { IconoEnlace, IconoEstrella } from './Iconos';
import { ImagenProducto } from './ImagenProducto';

interface Props {
  producto: Producto;
  recomendado: boolean;
  victorias: number;
  comparables: number;
  grande?: boolean;
}

export function FichaProducto({ producto, recomendado, victorias, comparables, grande = false }: Props) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-superficie p-4 ${recomendado ? 'border-emerald-600 ring-1 ring-emerald-600 dark:border-emerald-500 dark:ring-emerald-500' : 'border-borde'}`}
    >
      {recomendado && (
        <span className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
          <IconoEstrella className="size-3" />
          Recomendado
        </span>
      )}

      <ImagenProducto key={producto.imagen} src={producto.imagen} alt={`${producto.marca} ${producto.modelo}`} grande={grande} />

      <p className="mt-4 text-xs font-semibold tracking-wider text-suave uppercase">{producto.marca}</p>
      <h3 className={`leading-snug font-semibold text-balance ${grande ? 'text-xl' : 'text-base'}`}>{producto.modelo}</h3>

      <div className="mt-auto pt-3">
        <p className={`font-bold tabular-nums ${grande ? 'text-3xl' : 'text-2xl'}`}>{formatearPrecio(producto.precioGTQ)}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-suave">
          {producto.tienda && <span>{producto.tienda}</span>}
          {producto.fechaConsulta && <span>· {formatearFecha(producto.fechaConsulta)}</span>}
          {!producto.verificado && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900 dark:bg-amber-400/15 dark:text-amber-300">
              Precio por verificar
            </span>
          )}
          {producto.urlFuente && (
            <a
              href={producto.urlFuente}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-acento hover:underline"
            >
              Fuente
              <IconoEnlace className="size-3" />
            </a>
          )}
        </p>
        {comparables > 0 && (
          <p className={`mt-3 text-suave ${grande ? 'text-sm' : 'text-xs'}`}>
            Gana en <strong className="text-texto">{victorias}</strong> de {comparables} características comparables
          </p>
        )}
      </div>
    </div>
  );
}
