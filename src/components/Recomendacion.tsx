import type { Producto } from '../lib/esquema';
import { IconoCheck } from './Iconos';

interface Props {
  producto: Producto;
  razones: string[];
  grande?: boolean;
}

export function Recomendacion({ producto, razones, grande = false }: Props) {
  return (
    <section
      aria-label="Recomendación"
      className="rounded-xl bg-emerald-700 p-5 text-white sm:p-6 dark:bg-emerald-900/60 dark:ring-1 dark:ring-emerald-500/40"
    >
      <p className="text-xs font-semibold tracking-[0.2em] text-emerald-100 uppercase">Nuestra recomendación</p>
      <p className={`mt-1 font-display font-bold text-balance ${grande ? 'text-xl 2xl:text-3xl' : 'text-2xl'}`}>
        Recomendamos: {producto.marca} {producto.modelo}
      </p>
      <ul className={`mt-4 space-y-2 ${grande ? 'text-base 2xl:text-lg' : ''}`}>
        {razones.map((razon) => (
          <li key={razon} className="flex gap-2">
            <IconoCheck className="mt-0.5 size-5 shrink-0 text-emerald-200" />
            <span>{razon}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
