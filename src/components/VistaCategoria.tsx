import { buscarCategoria, categorias, entradasDe, laminaDe, NOMBRES_GRUPO } from '../lib/datos';
import { hrefCategoria, hrefPortada } from '../lib/ruta';
import { TarjetaComparacion } from './TarjetaComparacion';
import { dosDigitos } from './estilos';

export function VistaCategoria({ slug }: { slug: string }) {
  const categoria = buscarCategoria(slug);

  if (!categoria) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-3xl font-bold">No encontramos esa lámina</h1>
        <p className="mt-2 text-suave">Puede que el enlace esté mal escrito o que la categoría tenga errores en sus datos.</p>
        <a href={hrefPortada} className="mt-6 inline-block font-medium text-acento hover:underline">
          Volver a la portada
        </a>
      </div>
    );
  }

  const posicion = categorias.indexOf(categoria);
  const entradasCategoria = entradasDe(categoria);
  const primera = entradasCategoria[0]?.comparacion.id;
  const vecinas = [
    { categoria: categorias[posicion - 1], etiqueta: '← Lámina anterior' },
    { categoria: categorias[posicion + 1], etiqueta: 'Lámina siguiente →' },
  ];

  return (
    <div>
      <header id="top" className="mb-8 scroll-mt-24 rounded-2xl border border-borde bg-superficie p-5 shadow-sm sm:p-6">
        <nav aria-label="Ruta" className="text-sm text-suave">
          <a href={hrefPortada} className="hover:text-acento hover:underline">
            Portada
          </a>{' '}
          › {NOMBRES_GRUPO[categoria.grupo]}
        </nav>
        <div className="mt-3 flex items-end gap-4">
          <span className="font-display text-5xl leading-none font-bold text-acento tabular-nums sm:text-6xl">
            {dosDigitos(laminaDe(categoria))}
          </span>
          <div>
            <p className="text-xs tracking-widest text-suave uppercase">Lámina</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{categoria.nombre}</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-suave">{categoria.descripcion}</p>
        {primera && (
          <nav aria-label="Secciones de la lámina" className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {[
              ['Resumen', '#top'],
              ['Productos', `#${primera}-productos`],
              ['Tabla', `#${primera}-tabla`],
              ['Recomendación', `#${primera}-recomendacion`],
            ].map(([etiqueta, href]) => (
              <a
                key={etiqueta}
                href={href}
                className="inline-flex shrink-0 rounded-full border border-borde bg-superficie-2 px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-acento hover:text-acento motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {etiqueta}
              </a>
            ))}
          </nav>
        )}
      </header>

      <div className="space-y-10">
        {entradasCategoria.map((entrada) => (
          <TarjetaComparacion key={entrada.comparacion.id} entrada={entrada} />
        ))}
      </div>

      <nav aria-label="Otras láminas" className="mt-12 grid gap-3 sm:grid-cols-2">
        {vecinas.map(({ categoria: vecina, etiqueta }, i) =>
          vecina ? (
            <a
              key={etiqueta}
              href={hrefCategoria(vecina.categoria)}
              className={`rounded-xl border border-borde bg-superficie p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-acento hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${i === 1 ? 'sm:text-right' : ''}`}
            >
              <span className="block text-xs text-suave">{etiqueta}</span>
              <span className="font-semibold">{vecina.nombre}</span>
            </a>
          ) : (
            <span key={etiqueta} aria-hidden="true" />
          ),
        )}
      </nav>
    </div>
  );
}
