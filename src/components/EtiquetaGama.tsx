import { NOMBRES_GAMA } from '../lib/datos';
import type { Gama } from '../lib/esquema';

const COLORES: Record<Gama, string> = {
  baja: 'bg-sky-100 text-sky-900 dark:bg-sky-400/15 dark:text-sky-300',
  media: 'bg-violet-100 text-violet-900 dark:bg-violet-400/15 dark:text-violet-300',
  alta: 'bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-300',
};

export function EtiquetaGama({ gama }: { gama: Gama }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORES[gama]}`}>{NOMBRES_GAMA[gama]}</span>
  );
}
