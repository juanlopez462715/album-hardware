import { contarVictorias, type Fila } from '../lib/comparar';
import type { Producto } from '../lib/esquema';
import { IconoCheck } from './Iconos';

interface Props {
  productos: Producto[];
  filas: Fila[];
  grande?: boolean;
}

/** Tabla de características: la celda ganadora de cada fila se resalta en verde. */
export function TablaSpecs({ productos, filas, grande = false }: Props) {
  const celda = grande ? 'px-3 py-2 2xl:px-4 2xl:py-2.5' : 'px-2.5 py-2.5 sm:px-3';
  const { comparables, victorias } = contarVictorias(filas, productos.length);

  return (
    <div>
      {comparables > 0 && (
        <div className="mb-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {productos.map((producto, i) => (
            <div key={producto.modelo} className="rounded-xl border border-borde bg-superficie px-3 py-2 shadow-sm">
              <p className="truncate text-xs font-semibold text-suave uppercase">{producto.marca}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium">{producto.modelo}</span>
                <span className="rounded-full bg-gana-fondo px-2 py-0.5 text-xs font-bold text-gana-texto tabular-nums">
                  {victorias[i]}/{comparables}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-borde shadow-sm">
        <table className={`w-full border-collapse text-left ${grande ? 'text-base 2xl:text-lg' : 'text-[13px] sm:text-sm'}`}>
          <thead className="bg-superficie-2 text-xs tracking-wider text-suave uppercase">
            <tr>
              <th scope="col" className={`${celda} sticky left-0 z-10 bg-superficie-2 font-semibold`}>
                Característica
              </th>
              {productos.map((producto) => (
                <th key={producto.modelo} scope="col" className={`${celda} font-semibold`}>
                  <span className="block">{producto.marca}</span>
                  <span className="hidden font-normal tracking-normal normal-case sm:line-clamp-1">{producto.modelo}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.nombre} className="border-t border-borde hover:bg-superficie-2/45">
                <th scope="row" className={`${celda} sticky left-0 z-10 bg-superficie font-medium shadow-[1px_0_0_var(--borde)]`}>
                  {fila.nombre}
                  {fila.mejor && (
                    <span className="ml-1 text-suave" title={fila.mejor === 'mayor' ? 'Gana el valor más alto' : 'Gana el valor más bajo'}>
                      <span aria-hidden="true">{fila.mejor === 'mayor' ? '↑' : '↓'}</span>
                      <span className="sr-only">{fila.mejor === 'mayor' ? '(gana el valor más alto)' : '(gana el valor más bajo)'}</span>
                    </span>
                  )}
                  {fila.empate && (
                    <span className="ml-2 rounded bg-superficie-2 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-suave uppercase">
                      empate
                    </span>
                  )}
                </th>
                {fila.celdas.map((valor, i) => {
                  const gana = fila.ganadores.includes(i);
                  return (
                    <td
                      key={productos[i].modelo}
                      className={`${celda} tabular-nums ${gana ? 'bg-gana-fondo font-semibold text-gana-texto ring-1 ring-inset ring-emerald-500/20' : ''}`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {valor?.texto ?? '—'}
                        {gana && (
                          <>
                            <IconoCheck className="size-4 shrink-0" />
                            <span className="sr-only">(gana)</span>
                          </>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-suave">
        <span className="font-semibold text-gana-texto">✓</span> gana esa característica · ↑ gana el valor más alto · ↓ gana el más
        bajo · las filas sin flecha solo informan
      </p>
    </div>
  );
}
