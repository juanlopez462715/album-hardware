import { SITIO } from '../sitio';
import { categorias, DESCRIPCIONES_GRUPO, entradas, entradasDe, laminaDe, NOMBRES_GRUPO } from '../lib/datos';
import { GRUPOS } from '../lib/esquema';
import { hrefCategoria } from '../lib/ruta';
import { IconoPresentar } from './Iconos';
import { botonPrimario, botonSecundario, dosDigitos, plural } from './estilos';

export function Portada({ onPresentar }: { onPresentar: () => void }) {
  const totalProductos = entradas.reduce((total, e) => total + e.comparacion.productos.length, 0);
  const cifras = [
    { valor: categorias.length, texto: 'categorías' },
    { valor: entradas.length, texto: 'comparaciones' },
    { valor: totalProductos, texto: 'productos' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border border-borde bg-superficie px-6 py-12 sm:px-12 sm:py-16">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-16 font-display text-[12rem] leading-none font-bold text-acento opacity-[0.06] select-none sm:text-[18rem]"
        >
          Nº1
        </span>

        <p className="text-xs font-semibold tracking-[0.2em] text-acento uppercase">
          {SITIO.curso} · {SITIO.campus}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-bold text-balance sm:text-6xl">{SITIO.titulo}</h1>
        <p className="mt-5 max-w-2xl text-lg text-suave">
          Comparamos productos de distintas marcas con su precio en quetzales, las características que los hacen sobresalir y cuál
          recomendamos, con razones para defenderlo.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {cifras.map(({ valor, texto }) => (
            <div key={texto}>
              <dt className="sr-only">{texto}</dt>
              <dd className="font-display text-4xl font-bold tabular-nums">{valor}</dd>
              <dd className="text-sm text-suave" aria-hidden="true">
                {texto}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => document.getElementById('indice')?.scrollIntoView({ behavior: 'smooth' })}
            className={botonPrimario}
          >
            Ver el índice
          </button>
          <button type="button" onClick={onPresentar} className={botonSecundario}>
            <IconoPresentar className="size-4" />
            Modo presentación
          </button>
        </div>
      </section>

      <section id="indice" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-3xl font-bold">Índice</h2>

        {GRUPOS.map((grupo) => {
          const lista = categorias.filter((c) => c.grupo === grupo);
          if (lista.length === 0) return null;
          return (
            <div key={grupo} className="mt-10">
              <div className="flex flex-wrap items-baseline gap-x-3 border-b border-borde pb-2">
                <h3 className="text-xl font-semibold">{NOMBRES_GRUPO[grupo]}</h3>
                <span className="text-sm text-suave">{plural(lista.length, 'categoría', 'categorías')}</span>
              </div>
              <p className="mt-2 text-sm text-suave">{DESCRIPCIONES_GRUPO[grupo]}</p>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {lista.map((categoria) => (
                  <li key={categoria.categoria}>
                    <a
                      href={hrefCategoria(categoria.categoria)}
                      className="group flex h-full gap-4 rounded-xl border border-borde bg-superficie p-4 transition hover:-translate-y-0.5 hover:border-acento hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <span className="font-display text-3xl font-bold text-acento tabular-nums opacity-80">
                        {dosDigitos(laminaDe(categoria))}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold group-hover:text-acento">{categoria.nombre}</span>
                        <span className="mt-1 line-clamp-2 block text-sm text-suave">{categoria.descripcion}</span>
                        <span className="mt-2 block text-xs text-suave">
                          {plural(entradasDe(categoria).length, 'comparación', 'comparaciones')}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
