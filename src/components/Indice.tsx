import { categorias, laminaDe, NOMBRES_GRUPO } from '../lib/datos';
import { GRUPOS } from '../lib/esquema';
import { hrefCategoria, hrefPortada } from '../lib/ruta';
import { dosDigitos } from './estilos';

interface Props {
  slugActual: string | null;
  onNavegar?: () => void;
}

/** Lista de categorías agrupadas. Se usa en la barra lateral y en el menú del celular. */
export function Indice({ slugActual, onNavegar }: Props) {
  const enlace = (activo: boolean) =>
    `flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${activo ? 'bg-acento font-medium text-acento-texto' : 'hover:bg-superficie-2'}`;

  return (
    <nav aria-label="Índice del álbum">
      <a href={hrefPortada} onClick={onNavegar} className={enlace(slugActual === null)} aria-current={slugActual === null ? 'page' : undefined}>
        Portada
      </a>
      {GRUPOS.map((grupo) => {
        const lista = categorias.filter((c) => c.grupo === grupo);
        if (lista.length === 0) return null;
        return (
          <div key={grupo} className="mt-6">
            <h2 className="px-3 text-xs font-semibold tracking-wider text-suave uppercase">{NOMBRES_GRUPO[grupo]}</h2>
            <ul className="mt-2 space-y-0.5">
              {lista.map((categoria) => {
                const activo = categoria.categoria === slugActual;
                return (
                  <li key={categoria.categoria}>
                    <a
                      href={hrefCategoria(categoria.categoria)}
                      onClick={onNavegar}
                      aria-current={activo ? 'page' : undefined}
                      className={enlace(activo)}
                    >
                      <span>{categoria.nombre}</span>
                      <span className="text-xs tabular-nums opacity-60">{dosDigitos(laminaDe(categoria))}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
