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
    `group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition duration-200 motion-reduce:transition-none ${activo ? 'bg-acento font-semibold text-acento-texto shadow-lg shadow-acento/20' : 'hover:translate-x-1 hover:bg-superficie hover:text-acento hover:shadow-sm motion-reduce:hover:translate-x-0'}`;

  return (
    <nav aria-label="Índice del álbum" className="space-y-1">
      <a href={hrefPortada} onClick={onNavegar} className={enlace(slugActual === null)} aria-current={slugActual === null ? 'page' : undefined}>
        <span>Portada</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] tabular-nums opacity-80">Inicio</span>
      </a>
      {GRUPOS.map((grupo) => {
        const lista = categorias.filter((c) => c.grupo === grupo);
        if (lista.length === 0) return null;
        return (
          <div key={grupo} className="pt-5">
            <h2 className="px-3 text-[11px] font-bold tracking-wider text-suave uppercase">{NOMBRES_GRUPO[grupo]}</h2>
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
                      <span className="min-w-0 truncate">{categoria.nombre}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] tabular-nums ${activo ? 'bg-white/20 opacity-90' : 'bg-superficie-2 text-suave group-hover:bg-acento/10 group-hover:text-acento'}`}
                      >
                        {dosDigitos(laminaDe(categoria))}
                      </span>
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
