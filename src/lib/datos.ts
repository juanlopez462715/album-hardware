// Carga y valida todos los archivos de src/data/*.json al abrir la página.
// Para agregar una categoría basta con crear un archivo nuevo en esa carpeta.
import { GAMAS, type Categoria, type Comparacion, type Gama, type Grupo } from './esquema';
import { normalizar } from './formato';
import { validarColeccion } from './validacion';

const modulos = import.meta.glob('../data/*.json', { eager: true, import: 'default' });

const archivos = Object.entries(modulos).map(([ruta, contenido]) => ({
  archivo: ruta.slice(ruta.lastIndexOf('/') + 1),
  contenido,
}));

export const { categorias, errores, avisos } = validarColeccion(archivos);

export const NOMBRES_GRUPO: Record<Grupo, string> = {
  interno: 'Componentes internos',
  externo: 'Periféricos externos',
  redes: 'Redes',
  'por-gama': 'Comparación por gamas',
};

export const DESCRIPCIONES_GRUPO: Record<Grupo, string> = {
  interno: 'Lo que va dentro del case: procesamiento, memoria, almacenamiento, energía y enfriamiento.',
  externo: 'Dispositivos de entrada, salida y almacenamiento que se conectan por fuera.',
  redes: 'Equipos que conectan las computadoras entre sí y con Internet.',
  'por-gama': 'Dos productos de gama baja, dos de media y dos de alta, comparados por pares.',
};

export const NOMBRES_GAMA: Record<Gama, string> = {
  baja: 'Gama baja',
  media: 'Gama media',
  alta: 'Gama alta',
};

export interface Entrada {
  comparacion: Comparacion;
  categoria: Categoria;
  /** Número de lámina de la categoría en el álbum (1, 2, 3…). */
  lamina: number;
}

const ordenGama = (c: Comparacion) => (c.gama ? GAMAS.indexOf(c.gama) : -1);

/** Todas las comparaciones en el orden del álbum: grupo → categoría → gama. */
export const entradas: Entrada[] = categorias.flatMap((categoria, i) =>
  [...categoria.comparaciones]
    .sort((a, b) => ordenGama(a) - ordenGama(b))
    .map((comparacion) => ({ comparacion, categoria, lamina: i + 1 })),
);

export const buscarCategoria = (slug: string) => categorias.find((c) => c.categoria === slug);

export const laminaDe = (categoria: Categoria) => categorias.indexOf(categoria) + 1;

export const entradasDe = (categoria: Categoria) => entradas.filter((e) => e.categoria === categoria);

const textoBuscable = new Map(
  entradas.map(({ comparacion, categoria }) => [
    comparacion,
    normalizar(
      [
        categoria.nombre,
        NOMBRES_GRUPO[categoria.grupo],
        comparacion.gama ? NOMBRES_GAMA[comparacion.gama] : '',
        comparacion.titulo,
        comparacion.descripcion ?? '',
        ...comparacion.productos.flatMap((p) => [
          p.marca,
          p.modelo,
          p.tienda,
          ...p.specs.map((s) => `${s.nombre} ${s.valor}`),
        ]),
      ].join(' '),
    ),
  ]),
);

/** Devuelve las comparaciones que contienen todas las palabras buscadas (sin importar tildes ni mayúsculas). */
export function buscar(texto: string): Entrada[] {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];
  return entradas.filter((e) => {
    const contenido = textoBuscable.get(e.comparacion) ?? '';
    return palabras.every((palabra) => contenido.includes(palabra));
  });
}
