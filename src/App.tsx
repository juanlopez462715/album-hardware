import { useEffect, useState } from 'react';
import { AvisoDatos } from './components/AvisoDatos';
import { Encabezado } from './components/Encabezado';
import { IconoCerrar } from './components/Iconos';
import { Indice } from './components/Indice';
import { ModoPresentacion } from './components/ModoPresentacion';
import { PiePagina } from './components/PiePagina';
import { Portada } from './components/Portada';
import { ResultadosBusqueda } from './components/ResultadosBusqueda';
import { VistaCategoria } from './components/VistaCategoria';
import { botonIcono } from './components/estilos';
import { buscarCategoria, entradas } from './lib/datos';
import { entrarPantallaCompleta, hrefPresentar, useRuta } from './lib/ruta';
import { useTema } from './lib/tema';
import { SITIO } from './sitio';

export default function App() {
  const ruta = useRuta();
  const { oscuro, alternar } = useTema();
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Al cambiar de página se limpia el buscador y se cierra el menú del celular.
  const clave = JSON.stringify(ruta);
  const [claveAnterior, setClaveAnterior] = useState(clave);
  if (clave !== claveAnterior) {
    setClaveAnterior(clave);
    setBusqueda('');
    setMenuAbierto(false);
  }

  // Al cambiar de página: subir al inicio (o bajar a la comparación indicada) y actualizar el título.
  useEffect(() => {
    if (ruta.vista === 'presentacion') return;
    if (ruta.vista === 'categoria' && ruta.ancla) document.getElementById(ruta.ancla)?.scrollIntoView();
    else window.scrollTo(0, 0);
    const categoria = ruta.vista === 'categoria' ? buscarCategoria(ruta.slug) : undefined;
    document.title = categoria ? `${categoria.nombre} · ${SITIO.tituloCorto}` : SITIO.tituloCorto;
    // Solo debe correr cuando cambia la dirección (clave), no en cada render.
  }, [clave]);

  useEffect(() => {
    if (!menuAbierto) return;
    const alPresionar = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAbierto(false);
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [menuAbierto]);

  if (ruta.vista === 'presentacion') return <ModoPresentacion id={ruta.id} />;

  const slugActual = ruta.vista === 'categoria' ? ruta.slug : null;

  // Empieza en la primera comparación de la categoría abierta, o en la primera del álbum.
  const presentar = () => {
    const destino = entradas.find((e) => e.categoria.categoria === slugActual) ?? entradas[0];
    if (!destino) return;
    entrarPantallaCompleta();
    window.location.hash = hrefPresentar(destino.comparacion.id);
  };

  let contenido;
  if (busqueda.trim()) contenido = <ResultadosBusqueda texto={busqueda} />;
  else if (ruta.vista === 'categoria') contenido = <VistaCategoria slug={ruta.slug} />;
  else contenido = <Portada onPresentar={presentar} />;

  return (
    <div className="flex min-h-dvh flex-col">
      <Encabezado
        busqueda={busqueda}
        onBuscar={setBusqueda}
        oscuro={oscuro}
        onAlternarTema={alternar}
        onAbrirMenu={() => setMenuAbierto(true)}
        onPresentar={presentar}
      />
      <AvisoDatos />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 sm:px-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-8 pr-2">
            <Indice slugActual={slugActual} />
          </div>
        </aside>
        <main className="min-w-0 flex-1 py-8">{contenido}</main>
      </div>

      <PiePagina />

      {menuAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Índice">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Cerrar índice" onClick={() => setMenuAbierto(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-fondo p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold">Índice</span>
              <button type="button" className={botonIcono} onClick={() => setMenuAbierto(false)} aria-label="Cerrar índice">
                <IconoCerrar className="size-5" />
              </button>
            </div>
            <Indice slugActual={slugActual} onNavegar={() => setMenuAbierto(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
