import { buscar } from '../lib/datos';
import { TarjetaComparacion } from './TarjetaComparacion';
import { plural } from './estilos';

export function ResultadosBusqueda({ texto }: { texto: string }) {
  const resultados = buscar(texto);
  const consulta = texto.trim();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Resultados</h1>
      <p className="mt-1 text-suave" aria-live="polite">
        {resultados.length === 0
          ? `No encontramos nada con “${consulta}”.`
          : `${plural(resultados.length, 'comparación', 'comparaciones')} con “${consulta}”`}
      </p>
      {resultados.length === 0 && (
        <p className="mt-4 text-sm text-suave">Prueba con una marca (Samsung), un componente (RAM) o una característica (DDR5).</p>
      )}
      <div className="mt-8 space-y-10">
        {resultados.map((entrada) => (
          <TarjetaComparacion key={entrada.comparacion.id} entrada={entrada} mostrarCategoria />
        ))}
      </div>
    </div>
  );
}
