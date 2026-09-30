import { avisos, errores } from '../lib/datos';
import type { Problema } from '../lib/validacion';
import { plural } from './estilos';

function Lista({ problemas }: { problemas: Problema[] }) {
  return (
    <ul className="mt-2 space-y-1">
      {problemas.map((p, i) => (
        <li key={i}>
          <code className="font-semibold">{p.archivo}</code> › {p.ruta}: {p.mensaje}
        </li>
      ))}
    </ul>
  );
}

/** Muestra los errores de los archivos de datos. Los avisos solo aparecen mientras se desarrolla (npm run dev). */
export function AvisoDatos() {
  const mostrarAvisos = import.meta.env.DEV && avisos.length > 0;
  if (errores.length === 0 && !mostrarAvisos) return null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-3 px-4 pt-6 sm:px-6">
      {errores.length > 0 && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/40 dark:bg-red-950/50 dark:text-red-200">
          <p className="font-semibold">
            Hay {plural(errores.length, 'error', 'errores')} en los archivos de datos. Las categorías con errores no se muestran.
          </p>
          <Lista problemas={errores} />
          <p className="mt-2">
            Corre <code>npm run validar</code> en la terminal para ver el detalle.
          </p>
        </div>
      )}
      {mostrarAvisos && (
        <details className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200">
          <summary className="cursor-pointer font-semibold">
            {plural(avisos.length, 'aviso', 'avisos')} en los datos (solo se ve en desarrollo)
          </summary>
          <Lista problemas={avisos} />
        </details>
      )}
    </div>
  );
}
