import { construirFilas, contarVictorias } from '../lib/comparar';
import type { Entrada } from '../lib/datos';
import { entrarPantallaCompleta, hrefCategoria, hrefPresentar } from '../lib/ruta';
import { EtiquetaGama } from './EtiquetaGama';
import { FichaProducto } from './FichaProducto';
import { IconoPresentar } from './Iconos';
import { Recomendacion } from './Recomendacion';
import { TablaSpecs } from './TablaSpecs';
import { botonSecundario } from './estilos';

/** Columnas para los productos según cuántos hay. En móvil siempre van apilados (1 columna). */
export const COLUMNAS_PRODUCTOS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
};

interface Props {
  entrada: Entrada;
  /** En los resultados de búsqueda se muestra a qué categoría pertenece. */
  mostrarCategoria?: boolean;
}

export function TarjetaComparacion({ entrada, mostrarCategoria = false }: Props) {
  const { comparacion, categoria } = entrada;
  const { productos, recomendacion } = comparacion;
  const filas = construirFilas(productos);
  const { comparables, victorias } = contarVictorias(filas, productos.length);
  const ganador = productos.find((p) => p.modelo === recomendacion.productoGanador) ?? productos[0];

  return (
    <article id={comparacion.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-borde bg-superficie shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-borde px-5 py-5 sm:px-6">
        <div className="min-w-0">
          {(mostrarCategoria || comparacion.gama) && (
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              {mostrarCategoria && (
                <a
                  href={hrefCategoria(categoria.categoria, comparacion.id)}
                  className="text-xs font-semibold tracking-wider text-acento uppercase hover:underline"
                >
                  {categoria.nombre}
                </a>
              )}
              {comparacion.gama && <EtiquetaGama gama={comparacion.gama} />}
            </div>
          )}
          <h2 className="font-display text-2xl font-bold text-balance">{comparacion.titulo}</h2>
          {comparacion.descripcion && <p className="mt-1 text-sm text-suave">{comparacion.descripcion}</p>}
        </div>
        <a href={hrefPresentar(comparacion.id)} onClick={entrarPantallaCompleta} className={botonSecundario}>
          <IconoPresentar className="size-4" />
          Presentar
        </a>
      </header>

      <div className={`grid grid-cols-1 gap-4 p-5 pt-7 sm:p-6 sm:pt-7 ${COLUMNAS_PRODUCTOS[productos.length] ?? COLUMNAS_PRODUCTOS[3]}`}>
        {productos.map((producto, i) => (
          <FichaProducto
            key={producto.modelo}
            producto={producto}
            recomendado={producto === ganador}
            victorias={victorias[i]}
            comparables={comparables}
          />
        ))}
      </div>

      <div className="px-3 sm:px-6">
        <TablaSpecs productos={productos} filas={filas} />
      </div>

      <div className="p-5 sm:p-6">
        <Recomendacion producto={ganador} razones={recomendacion.razones} />
      </div>
    </article>
  );
}
