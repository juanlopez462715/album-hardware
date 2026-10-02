import { SITIO } from '../sitio';

const BASE = import.meta.env.BASE_URL;

export function PiePagina() {
  return (
    <footer className="mt-14 border-t border-borde bg-superficie/80 text-texto dark:border-emerald-300/10 dark:bg-[#071312] dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-5">
        <div className="relative overflow-hidden rounded-2xl border border-borde bg-superficie p-4 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/20 sm:p-5">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(20,184,166,.11),transparent_16rem),radial-gradient(circle_at_92%_12%,rgba(245,158,11,.10),transparent_16rem)] dark:bg-[radial-gradient(circle_at_12%_20%,rgba(20,184,166,.18),transparent_16rem),radial-gradient(circle_at_92%_12%,rgba(245,158,11,.14),transparent_16rem)]" />
          <div className="relative grid items-center gap-4 md:grid-cols-[1fr_1.25fr_1.35fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-acento uppercase dark:text-emerald-200">Equipo</p>
              <ul className="mt-2 grid gap-1 text-sm text-suave dark:text-white/78">
                {SITIO.equipo.map((integrante) => (
                  <li key={integrante} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-acento dark:bg-emerald-300" aria-hidden="true" />
                    {integrante}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full items-center gap-3 rounded-xl border border-borde bg-superficie-2/55 p-2.5 backdrop-blur dark:border-white/12 dark:bg-white/10">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 shadow-inner">
                <img
                  src={`${BASE}img/universidad-mariano-galvez.jpg`}
                  alt="Logo de la Universidad Mariano Gálvez de Guatemala"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.16em] text-acento uppercase dark:text-emerald-100">Universidad</p>
                <p className="mt-0.5 text-sm leading-snug font-semibold text-texto dark:text-white">{SITIO.universidad}</p>
                <p className="mt-0.5 text-xs text-suave dark:text-white/62">{SITIO.campus}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-sm text-suave md:text-right dark:text-white/72">
              <p className="font-semibold text-texto dark:text-white">{SITIO.curso}</p>
              <p>Álbum comparativo con precios en GTQ, características, imágenes de referencia y recomendación final.</p>
              <p className="text-xs text-suave/80 dark:text-white/52">
                “Precio verificado” enlaza a ficha exacta; “referencia local” enlaza a búsqueda de tienda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
