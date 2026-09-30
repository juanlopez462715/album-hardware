// Arma la tabla de características y decide qué producto gana en cada fila.
import type { Producto, Spec } from './esquema';
import { formatearPrecio, formatearValor } from './formato';

export interface Celda {
  texto: string;
  numero: number | null;
}

export interface Fila {
  nombre: string;
  mejor: Spec['mejor'];
  /** Una celda por producto, en el mismo orden; null si ese producto no tiene la característica. */
  celdas: (Celda | null)[];
  /** Índices de los productos que ganan la fila (vacío si no se compara o hay empate). */
  ganadores: number[];
  empate: boolean;
}

function decidirGanadores(fila: Omit<Fila, 'ganadores' | 'empate'>): Fila {
  const numeros = fila.celdas.map((celda) => celda?.numero ?? null);
  const comparables = numeros.filter((n): n is number => n !== null);
  if (!fila.mejor || comparables.length < 2) return { ...fila, ganadores: [], empate: false };

  const objetivo = fila.mejor === 'mayor' ? Math.max(...comparables) : Math.min(...comparables);
  const ganadores = numeros.flatMap((n, i) => (n === objetivo ? [i] : []));
  const empate = ganadores.length === comparables.length;
  return { ...fila, ganadores: empate ? [] : ganadores, empate };
}

export function construirFilas(productos: Producto[]): Fila[] {
  const precio = decidirGanadores({
    nombre: 'Precio',
    mejor: 'menor',
    celdas: productos.map((p) => ({ texto: formatearPrecio(p.precioGTQ), numero: p.precioGTQ })),
  });

  // Filas en el orden en que aparecen, uniendo las características de todos los productos.
  const nombres: string[] = [];
  for (const producto of productos) {
    for (const spec of producto.specs) if (!nombres.includes(spec.nombre)) nombres.push(spec.nombre);
  }

  const filas = nombres.map((nombre) => {
    const specs = productos.map((p) => p.specs.find((s) => s.nombre === nombre));
    return decidirGanadores({
      nombre,
      mejor: specs.find(Boolean)?.mejor ?? null,
      celdas: specs.map((spec) =>
        spec ? { texto: formatearValor(spec), numero: typeof spec.valor === 'number' ? spec.valor : null } : null,
      ),
    });
  });

  return [precio, ...filas];
}

/** Cuántas filas comparables gana cada producto (cuenta empates como "comparables" pero no como victoria). */
export function contarVictorias(filas: Fila[], cantidadProductos: number) {
  const comparables = filas.filter((f) => f.ganadores.length > 0 || f.empate).length;
  const victorias = Array.from({ length: cantidadProductos }, (_, i) => filas.filter((f) => f.ganadores.includes(i)).length);
  return { comparables, victorias };
}
