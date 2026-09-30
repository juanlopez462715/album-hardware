// Vista a pantalla completa para la defensa: una comparación a la vez, navegable con el teclado.
//   → / Espacio / AvPág   siguiente        ← / Shift+Espacio / RePág   anterior
//   Inicio / Fin          primera / última  F   pantalla completa       Esc   salir
import { useEffect } from 'react';
import { construirFilas, contarVictorias } from '../lib/comparar';
import { entradas, NOMBRES_GAMA } from '../lib/datos';
import { alternarPantallaCompleta, hrefCategoria, hrefPortada, hrefPresentar, salirPantallaCompleta } from '../lib/ruta';
import { FichaProducto } from './FichaProducto';
import { IconoAnterior, IconoCerrar, IconoPantallaCompleta, IconoSiguiente } from './Iconos';
import { Recomendacion } from './Recomendacion';
import { TablaSpecs } from './TablaSpecs';
import { botonIcono, botonPrimario, dosDigitos } from './estilos';

const COLUMNAS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

export function ModoPresentacion({ id }: { id: string }) {
  const indice = entradas.findIndex((e) => e.comparacion.id === id);
  const entrada = entradas[indice];
  const total = entradas.length;

  const irA = (i: number) => {
    const destino = entradas[Math.min(Math.max(i, 0), total - 1)];
    // replace() cambia de lámina sin llenar el historial: "Atrás" en el navegador sale de la presentación.
    if (destino) window.location.replace(hrefPresentar(destino.comparacion.id));
  };

  const salir = () => {
    salirPantallaCompleta();
    window.location.hash = entrada ? hrefCategoria(entrada.categoria.categoria, entrada.comparacion.id) : hrefPortada;
  };

  useEffect(() => {
    function alPresionar(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          irA(indice + 1);
          break;
        case ' ':
          e.preventDefault();
          irA(e.shiftKey ? indice - 1 : indice + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          irA(indice - 1);
          break;
        case 'Home':
          e.preventDefault();
          irA(0);
          break;
        case 'End':
          e.preventDefault();
          irA(total - 1);
          break;
        case 'f':
        case 'F':
          alternarPantallaCompleta();
          break;
        case 'Escape':
          salir();
          break;
      }
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  });

  useEffect(() => {
    if (entrada) document.title = `${entrada.comparacion.titulo} · Presentación`;
  }, [entrada]);

  if (!entrada) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-display text-2xl font-bold">No encontramos esa comparación</p>
        {total > 0 && (
          <button type="button" className={botonPrimario} onClick={() => irA(0)}>
            Empezar desde la primera
          </button>
        )}
        <a href={hrefPortada} className="text-acento hover:underline">
          Volver a la portada
        </a>
      </div>
    );
  }

  const { comparacion, categoria, lamina } = entrada;
  const { productos, recomendacion } = comparacion;
  const filas = construirFilas(productos);
  const { comparables, victorias } = contarVictorias(filas, productos.length);
  const ganador = productos.find((p) => p.modelo === recomendacion.productoGanador) ?? productos[0];

  return (
    <div className="flex min-h-dvh flex-col bg-fondo text-texto">
      <header className="sticky top-0 z-10 bg-fondo">
        <div className="flex items-center gap-2 border-b border-borde px-4 py-2 sm:gap-3 sm:px-6">
          <p className="min-w-0 flex-1 truncate text-sm">
            <span className="font-semibold text-acento">Lámina {dosDigitos(lamina)}</span>
            <span className="text-suave">
              {' '}
              · {categoria.nombre}
              {comparacion.gama && ` · ${NOMBRES_GAMA[comparacion.gama]}`}
            </span>
          </p>
          <span className="text-sm text-suave tabular-nums" aria-live="polite">
            {indice + 1} / {total}
          </span>
          <button type="button" className={botonIcono} onClick={() => irA(indice - 1)} disabled={indice === 0} aria-label="Anterior (flecha izquierda)">
            <IconoAnterior className="size-5" />
          </button>
          <button type="button" className={botonIcono} onClick={() => irA(indice + 1)} disabled={indice === total - 1} aria-label="Siguiente (flecha derecha)">
            <IconoSiguiente className="size-5" />
          </button>
          <button type="button" className={`${botonIcono} hidden sm:inline-flex`} onClick={alternarPantallaCompleta} aria-label="Pantalla completa (F)">
            <IconoPantallaCompleta className="size-5" />
          </button>
          <button type="button" className={botonIcono} onClick={salir} aria-label="Salir de la presentación (Esc)">
            <IconoCerrar className="size-5" />
          </button>
        </div>
        <div className="h-1 bg-superficie-2" aria-hidden="true">
          <div className="h-full bg-acento transition-[width]" style={{ width: `${((indice + 1) / total) * 100}%` }} />
        </div>
      </header>

      <main key={comparacion.id} className="flex-1 motion-safe:animate-aparecer">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-8 2xl:py-7">
          <h1 className="font-display text-3xl font-bold text-balance 2xl:text-4xl">{comparacion.titulo}</h1>
          {comparacion.descripcion && <p className="mt-1 text-suave 2xl:text-lg">{comparacion.descripcion}</p>}

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] 2xl:gap-8">
            <div className="flex flex-col gap-5">
              <div className={`grid grid-cols-1 gap-4 pt-3 ${COLUMNAS[productos.length] ?? 'sm:grid-cols-2'}`}>
                {productos.map((producto, i) => (
                  <FichaProducto
                    key={producto.modelo}
                    producto={producto}
                    recomendado={producto === ganador}
                    victorias={victorias[i]}
                    comparables={comparables}
                    grande
                  />
                ))}
              </div>
              <Recomendacion producto={ganador} razones={recomendacion.razones} grande />
            </div>
            <TablaSpecs productos={productos} filas={filas} grande />
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 hidden border-t border-borde bg-fondo px-4 py-1.5 text-center text-xs text-suave sm:block">
        ← → cambiar de comparación · F pantalla completa · Esc salir
      </footer>
    </div>
  );
}
