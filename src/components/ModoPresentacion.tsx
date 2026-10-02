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
import { botonPrimario, dosDigitos } from './estilos';

const COLUMNAS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

const controlPresentacion =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/8 text-white transition-colors hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 disabled:pointer-events-none disabled:opacity-35';

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
    <div className="flex min-h-dvh flex-col bg-[#071312] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#071312]/88 backdrop-blur">
        <div className="flex items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6">
          <p className="min-w-0 flex-1 truncate text-sm">
            <span className="font-semibold text-emerald-200">Lámina {dosDigitos(lamina)}</span>
            <span className="text-white/62">
              {' '}
              · {categoria.nombre}
              {comparacion.gama && ` · ${NOMBRES_GAMA[comparacion.gama]}`}
            </span>
          </p>
          <span className="rounded-full border border-white/10 bg-white/8 px-2 py-1 text-sm text-white/70 tabular-nums" aria-live="polite">
            {indice + 1} / {total}
          </span>
          <button type="button" className={controlPresentacion} onClick={() => irA(indice - 1)} disabled={indice === 0} aria-label="Anterior (flecha izquierda)">
            <IconoAnterior className="size-5" />
          </button>
          <button type="button" className={controlPresentacion} onClick={() => irA(indice + 1)} disabled={indice === total - 1} aria-label="Siguiente (flecha derecha)">
            <IconoSiguiente className="size-5" />
          </button>
          <button type="button" className={`${controlPresentacion} hidden sm:inline-flex`} onClick={alternarPantallaCompleta} aria-label="Pantalla completa (F)">
            <IconoPantallaCompleta className="size-5" />
          </button>
          <button type="button" className={controlPresentacion} onClick={salir} aria-label="Salir de la presentación (Esc)">
            <IconoCerrar className="size-5" />
          </button>
        </div>
        <div className="h-1 bg-white/10" aria-hidden="true">
          <div className="h-full bg-linear-to-r from-emerald-300 via-teal-300 to-amber-300 transition-[width]" style={{ width: `${((indice + 1) / total) * 100}%` }} />
        </div>
      </header>

      <main key={comparacion.id} className="relative flex-1 overflow-hidden motion-safe:animate-aparecer">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(251,191,36,.22),transparent_28rem),radial-gradient(circle_at_88%_18%,rgba(45,212,191,.24),transparent_30rem)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-8 2xl:py-7">
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/25 backdrop-blur sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-emerald-200 uppercase">{categoria.nombre}</p>
                <h1 className="mt-1 font-display text-3xl font-bold text-balance 2xl:text-4xl">{comparacion.titulo}</h1>
                {comparacion.descripcion && <p className="mt-1 max-w-3xl text-white/68 2xl:text-lg">{comparacion.descripcion}</p>}
              </div>
              <span className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 font-display text-3xl font-bold text-emerald-200 tabular-nums">
                {dosDigitos(lamina)}
              </span>
            </div>

            <div className="mt-6 grid gap-6 text-texto lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] 2xl:gap-8">
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
              <div className="rounded-2xl bg-superficie p-3">
                <TablaSpecs productos={productos} filas={filas} grande />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 hidden border-t border-white/10 bg-[#071312]/90 px-4 py-1.5 text-center text-xs text-white/55 backdrop-blur sm:block">
        ← → cambiar de comparación · F pantalla completa · Esc salir
      </footer>
    </div>
  );
}
