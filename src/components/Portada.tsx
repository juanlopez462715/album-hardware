import { useState } from 'react';
import { SITIO } from '../sitio';
import { categorias, DESCRIPCIONES_GRUPO, entradas, entradasDe, laminaDe, NOMBRES_GRUPO } from '../lib/datos';
import { GRUPOS, type Grupo } from '../lib/esquema';
import { hrefCategoria } from '../lib/ruta';
import { IconoChip, IconoPresentar } from './Iconos';
import { urlProxyImagen } from './ImagenProducto';
import { PlaceholderProducto } from './PlaceholderProducto';
import { botonPrimario, dosDigitos, plural } from './estilos';

function MiniProducto({ src, alt, marca, modelo, categoria }: { src: string; alt: string; marca: string; modelo: string; categoria: string }) {
  const [modo, setModo] = useState<'directo' | 'proxy' | 'fallback'>('directo');
  const proxy = urlProxyImagen(src);
  const fuente = modo === 'proxy' && proxy ? proxy : src;

  if (modo === 'fallback' || !src) {
    return (
      <div className="size-14 shrink-0 sm:size-16">
        <PlaceholderProducto marca={marca} modelo={modelo} categoria={categoria} compacto />
      </div>
    );
  }

  return (
    <img
      src={fuente}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (modo === 'directo' && proxy) setModo('proxy');
        else setModo('fallback');
      }}
      className="size-14 shrink-0 rounded-lg bg-white object-contain p-1.5 sm:size-16"
    />
  );
}

export function Portada({ onPresentar }: { onPresentar: () => void }) {
  const [grupoActivo, setGrupoActivo] = useState<Grupo | 'todos'>('todos');
  const totalProductos = entradas.reduce((total, e) => total + e.comparacion.productos.length, 0);
  const productosHero = entradas
    .flatMap((entrada) => entrada.comparacion.productos.map((producto) => ({ producto, categoria: entrada.categoria, comparacion: entrada.comparacion })))
    .filter(({ producto }) => producto.imagen.startsWith('https://'))
    .slice(0, 12);
  const cifras = [
    { valor: categorias.length, texto: 'categorías' },
    { valor: entradas.length, texto: 'comparaciones' },
    { valor: totalProductos, texto: 'productos' },
  ];
  const filtros: Array<{ id: Grupo | 'todos'; nombre: string; cantidad: number }> = [
    { id: 'todos', nombre: 'Todo', cantidad: categorias.length },
    ...GRUPOS.map((grupo) => ({
      id: grupo,
      nombre: NOMBRES_GRUPO[grupo],
      cantidad: categorias.filter((categoria) => categoria.grupo === grupo).length,
    })),
  ];

  return (
    <div>
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-borde bg-superficie text-texto shadow-2xl shadow-black/10 dark:border-emerald-300/25 dark:bg-[#071312] dark:text-white dark:shadow-black/20">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(245,158,11,.18),transparent_24rem),radial-gradient(circle_at_86%_16%,rgba(20,184,166,.18),transparent_24rem),linear-gradient(135deg,rgba(255,255,255,.96),rgba(238,244,243,.9)_52%,rgba(255,255,255,.98))] dark:bg-[radial-gradient(circle_at_14%_12%,rgba(251,191,36,.32),transparent_24rem),radial-gradient(circle_at_86%_16%,rgba(45,212,191,.36),transparent_24rem),linear-gradient(135deg,rgba(7,19,18,.97),rgba(8,41,37,.86)_48%,rgba(2,9,16,.97))]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,118,110,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,.055)_1px,transparent_1px)] bg-[size:44px_44px] opacity-55 dark:bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] dark:opacity-25" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-5 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-acento/20 bg-acento/8 px-3 py-1 text-xs font-bold tracking-[0.22em] text-acento uppercase backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-emerald-100">
              <IconoChip className="size-4 text-acento dark:text-emerald-200" />
              {SITIO.curso} · {SITIO.campus}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl leading-none font-bold text-balance sm:text-5xl">{SITIO.titulo}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-suave sm:text-base dark:text-white/78">
              Explora componentes reales, precios en quetzales, fotos de producto y recomendaciones listas para defender en clase.
            </p>

            <dl className="mx-auto mt-5 grid max-w-lg grid-cols-3 gap-2">
              {cifras.map(({ valor, texto }) => (
                <button
                  key={texto}
                  type="button"
                  onClick={() => document.getElementById('indice')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-xl border border-borde bg-white/70 px-3 py-2 text-left backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-acento/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/14 dark:bg-white/10 dark:hover:bg-white/16 dark:hover:shadow-black/20 dark:focus-visible:outline-white/70"
                >
                  <dt className="sr-only">{texto}</dt>
                  <dd className="font-display text-2xl font-bold tabular-nums sm:text-3xl">{valor}</dd>
                  <dd className="text-xs text-suave sm:text-sm dark:text-white/70" aria-hidden="true">
                    {texto}
                  </dd>
                </button>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('indice')?.scrollIntoView({ behavior: 'smooth' })}
                className={`${botonPrimario} shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
              >
                Ver el índice
              </button>
              <button
                type="button"
                onClick={onPresentar}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-borde bg-white/70 px-3.5 py-2 text-sm font-medium text-texto backdrop-blur transition hover:-translate-y-0.5 hover:border-acento/50 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/18 dark:focus-visible:outline-white/70"
              >
                <IconoPresentar className="size-4" />
                Modo presentación
              </button>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 justify-center gap-2.5 overflow-hidden md:grid-cols-3 lg:grid-cols-4">
            {productosHero.map(({ producto, categoria, comparacion }) => (
              <a
                key={`${categoria.categoria}-${producto.modelo}`}
                href={hrefCategoria(categoria.categoria, comparacion.id)}
                className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-borde bg-white/72 p-2 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-acento/60 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/12 dark:bg-white/10 dark:hover:border-emerald-300/70 dark:hover:bg-white/16 dark:hover:shadow-black/20 dark:focus-visible:outline-white/70"
              >
                <MiniProducto
                  src={producto.imagen}
                  alt={`${producto.marca} ${producto.modelo}`}
                  marca={producto.marca}
                  modelo={producto.modelo}
                  categoria={categoria.nombre}
                />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-texto sm:text-sm dark:text-white/86">{producto.marca}</span>
                  <span className="block truncate text-xs text-suave dark:text-white/55">{categoria.nombre}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-acento uppercase">Explora rápido</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Categorías por área</h2>
          </div>
          <p className="max-w-md text-sm text-suave">Elige un bloque del álbum y filtra el índice al instante.</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {GRUPOS.map((grupo) => {
            const cantidad = categorias.filter((categoria) => categoria.grupo === grupo).length;
            return (
              <button
                key={grupo}
                type="button"
                onClick={() => {
                  setGrupoActivo(grupo);
                  document.getElementById('indice')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative overflow-hidden rounded-2xl border border-borde bg-superficie p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-acento hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-acento via-halo to-emerald-400 opacity-80" />
                <span className="flex size-10 items-center justify-center rounded-xl bg-acento/10 text-acento">
                  <IconoChip className="size-5" />
                </span>
                <span className="mt-3 block font-semibold group-hover:text-acento">{NOMBRES_GRUPO[grupo]}</span>
                <span className="mt-1 block text-sm text-suave">{DESCRIPCIONES_GRUPO[grupo]}</span>
                <span className="mt-3 inline-flex rounded-full bg-superficie-2 px-2 py-0.5 text-xs font-semibold text-suave">
                  {plural(cantidad, 'categoría', 'categorías')}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="indice" className="mt-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-acento uppercase">Explorar catálogo</p>
            <h2 className="mt-1 font-display text-4xl font-bold">Índice</h2>
          </div>
          <p className="max-w-md text-sm text-suave">Cada lámina compara productos por precio, especificaciones y recomendación final.</p>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar categorías">
          {filtros.map((filtro) => {
            const activo = grupoActivo === filtro.id;
            return (
              <button
                key={filtro.id}
                type="button"
                onClick={() => setGrupoActivo(filtro.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  activo ? 'border-acento bg-acento text-white shadow-lg shadow-emerald-900/15' : 'border-borde bg-superficie text-texto hover:border-acento/70'
                }`}
              >
                {filtro.nombre}
                <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${activo ? 'bg-white/18 text-white' : 'bg-superficie-2 text-suave'}`}>
                  {filtro.cantidad}
                </span>
              </button>
            );
          })}
        </div>

        {GRUPOS.map((grupo) => {
          if (grupoActivo !== 'todos' && grupoActivo !== grupo) return null;
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
                      className="group relative flex h-full gap-4 overflow-hidden rounded-xl border border-borde bg-superficie p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-acento hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-acento/70 via-halo/70 to-emerald-500/70 opacity-0 transition group-hover:opacity-100" />
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-acento/10 font-display text-2xl font-bold text-acento tabular-nums">
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
