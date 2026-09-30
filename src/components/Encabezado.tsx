import { SITIO } from '../sitio';
import { hrefPortada } from '../lib/ruta';
import { IconoBuscar, IconoChip, IconoLuna, IconoMenu, IconoPresentar, IconoSol } from './Iconos';
import { botonIcono, botonSecundario } from './estilos';

interface Props {
  busqueda: string;
  onBuscar: (texto: string) => void;
  oscuro: boolean;
  onAlternarTema: () => void;
  onAbrirMenu: () => void;
  onPresentar: () => void;
}

export function Encabezado({ busqueda, onBuscar, oscuro, onAlternarTema, onAbrirMenu, onPresentar }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-borde bg-fondo/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3 sm:gap-x-3 sm:px-6">
        <button type="button" onClick={onAbrirMenu} className={`${botonIcono} lg:hidden`} aria-label="Abrir índice">
          <IconoMenu className="size-5" />
        </button>

        <a href={hrefPortada} className="mr-auto flex items-center gap-2 font-display text-base font-bold sm:text-lg">
          <IconoChip className="size-6 text-acento" />
          {SITIO.tituloCorto}
        </a>

        <label className="relative order-last w-full sm:order-none sm:w-72">
          <span className="sr-only">Buscar</span>
          <IconoBuscar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-suave" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onBuscar('')}
            placeholder="Buscar marca o modelo…"
            className="w-full rounded-lg border border-borde bg-superficie py-2 pr-3 pl-9 text-sm placeholder:text-suave focus:border-acento focus:outline-2 focus:outline-acento/30"
          />
        </label>

        <button type="button" onClick={onPresentar} className={botonSecundario} title="Modo presentación">
          <IconoPresentar className="size-4" />
          <span className="hidden sm:inline">Presentar</span>
          <span className="sr-only sm:hidden">Modo presentación</span>
        </button>

        <button
          type="button"
          onClick={onAlternarTema}
          className={botonIcono}
          aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={oscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {oscuro ? <IconoSol className="size-5" /> : <IconoLuna className="size-5" />}
        </button>
      </div>
    </header>
  );
}
