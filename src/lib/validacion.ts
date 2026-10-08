// Valida todos los archivos de datos juntos. Lo usan la página (src/lib/datos.ts)
// y el comando `npm run validar` (scripts/validar-datos.ts).
import { esquemaCategoria, GRUPOS, type Categoria } from './esquema';

export interface Problema {
  archivo: string;
  ruta: string;
  mensaje: string;
}

export interface ArchivoDatos {
  archivo: string;
  contenido: unknown;
}

export interface ResultadoValidacion {
  categorias: Categoria[];
  errores: Problema[];
  avisos: Problema[];
}

/** Convierte ["comparaciones", 0, "productos", 1, "precioGTQ"] en "comparaciones #1 › productos #2 › precioGTQ". */
export function formatearRuta(ruta: readonly PropertyKey[]): string {
  const partes: string[] = [];
  for (const parte of ruta) {
    if (typeof parte === 'number' && partes.length > 0) partes[partes.length - 1] += ` #${parte + 1}`;
    else partes.push(String(parte));
  }
  return partes.join(' › ') || '(archivo completo)';
}

export function validarColeccion(archivos: ArchivoDatos[]): ResultadoValidacion {
  const categorias: Categoria[] = [];
  const errores: Problema[] = [];
  const avisos: Problema[] = [];
  const archivoPorId = new Map<string, string>();

  for (const { archivo, contenido } of archivos) {
    const resultado = esquemaCategoria.safeParse(contenido);
    if (!resultado.success) {
      for (const issue of resultado.error.issues) {
        errores.push({ archivo, ruta: formatearRuta(issue.path), mensaje: issue.message });
      }
      continue;
    }

    const categoria = resultado.data;
    let valida = true;

    if (archivo !== `${categoria.categoria}.json`) {
      errores.push({ archivo, ruta: 'categoria', mensaje: `debe coincidir con el nombre del archivo: escribe "${archivo.replace(/\.json$/, '')}" o renombra el archivo` });
      valida = false;
    }

    categoria.comparaciones.forEach((comparacion, i) => {
      const donde = `comparaciones #${i + 1}`;
      const otroArchivo = archivoPorId.get(comparacion.id);
      if (otroArchivo) {
        errores.push({ archivo, ruta: `${donde} › id`, mensaje: `el id "${comparacion.id}" ya se usa en ${otroArchivo}; cada comparación necesita uno distinto` });
        valida = false;
      } else {
        archivoPorId.set(comparacion.id, archivo);
      }

      // Avisos: no rompen la página, pero conviene revisarlos.
      const nombres = comparacion.productos.map((p) => p.specs.map((s) => s.nombre).join('|'));
      if (new Set(nombres).size > 1) {
        avisos.push({ archivo, ruta: donde, mensaje: 'los productos no tienen las mismas características (revisa que los nombres estén escritos igual)' });
      }
      comparacion.productos.forEach((producto, j) => {
        const ruta = `${donde} › productos #${j + 1}`;
        if (producto.verificado && !producto.urlFuente) {
          avisos.push({ archivo, ruta: `${ruta} › urlFuente`, mensaje: 'precio verificado sin enlace de fuente (recomendado para la defensa)' });
        }
        if (producto.imagen && !producto.imagen.startsWith('https://') && !producto.imagen.startsWith(`img/${categoria.categoria}/`)) {
          avisos.push({ archivo, ruta: `${ruta} › imagen`, mensaje: `se recomienda guardar la imagen en public/img/${categoria.categoria}/` });
        }
      });
    });

    if (valida) categorias.push(categoria);
  }

  categorias.sort(
    (a, b) =>
      GRUPOS.indexOf(a.grupo) - GRUPOS.indexOf(b.grupo) || a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'),
  );

  return { categorias, errores, avisos };
}
