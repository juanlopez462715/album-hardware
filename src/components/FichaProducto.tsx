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
  const estadoPrecio = producto.verificado ? 'Precio verificado' : 'Referencia local';
  const porcentaje = comparables > 0 ? Math.round((victorias / comparables) * 100) : 0;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-superficie p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4 ${recomendado ? 'border-emerald-600 ring-1 ring-emerald-600 dark:border-emerald-500 dark:ring-emerald-500' : 'border-borde hover:border-acento/70'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${recomendado ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-acento/70'}`}
      />
      {recomendado && (
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm sm:left-4">
          <IconoEstrella className="size-3" />
          Recomendado
        </span>
      )}

      <ImagenProducto
        key={producto.imagen}
        src={producto.imagen}
        alt={`${producto.marca} ${producto.modelo}`}
        marca={producto.marca}
        modelo={producto.modelo}
        grande={grande}
      />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-suave uppercase">{producto.marca}</p>
          <h3 className={`leading-snug font-semibold text-balance ${grande ? 'text-xl' : 'text-base'}`}>{producto.modelo}</h3>
        </div>
        {comparables > 0 && (
          <span className="shrink-0 rounded-full border border-borde bg-superficie-2 px-2 py-1 text-xs font-semibold text-suave tabular-nums">
            {porcentaje}%
          </span>
        )}
      </div>

      <div className="mt-auto pt-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className={`font-bold tabular-nums ${grande ? 'text-3xl' : 'text-2xl'}`}>{formatearPrecio(producto.precioGTQ)}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${producto.verificado ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300' : 'bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300'}`}
          >
            {estadoPrecio}
          </span>
        </div>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-suave">
          {producto.tienda && <span>{producto.tienda}</span>}
          {producto.fechaConsulta && <span>· {formatearFecha(producto.fechaConsulta)}</span>}
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
          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-superficie-2">
              <div
                className={`h-full rounded-full ${recomendado ? 'bg-emerald-500' : 'bg-acento/70'}`}
                style={{ width: `${porcentaje}%` }}
                aria-hidden="true"
              />
            </div>
            <p className={`mt-1.5 text-suave ${grande ? 'text-sm' : 'text-xs'}`}>
              Gana en <strong className="text-texto">{victorias}</strong> de {comparables} características comparables
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
