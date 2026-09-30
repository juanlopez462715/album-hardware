import { SITIO } from '../sitio';

export function PiePagina() {
  return (
    <footer className="mt-16 border-t border-borde bg-superficie">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm sm:grid-cols-2 sm:px-6">
        <div>
          <p className="font-semibold">Equipo</p>
          <ul className="mt-1 text-suave">
            {SITIO.equipo.map((integrante) => (
              <li key={integrante}>{integrante}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-1 text-suave sm:text-right">
          <p className="font-semibold text-texto">{SITIO.curso}</p>
          <p>
            {SITIO.universidad}, {SITIO.campus}
          </p>
          <p>Imágenes propiedad de sus respectivos fabricantes.</p>
          <p>Precios de referencia en quetzales (GTQ); los marcados “precio por verificar” aún no se han confirmado en tienda.</p>
        </div>
      </div>
    </footer>
  );
}
