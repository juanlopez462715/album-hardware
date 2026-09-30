// Navegación con "#" en la URL (hash routing). Funciona en GitHub Pages sin configurar el servidor.
//   #/                          → portada
//   #/categoria/ram             → página de una categoría
//   #/categoria/ram/<id>        → categoría, bajando hasta esa comparación
//   #/presentar/<id>            → modo presentación en esa comparación
import { useEffect, useState } from 'react';

export type Ruta =
  | { vista: 'portada' }
  | { vista: 'categoria'; slug: string; ancla?: string }
  | { vista: 'presentacion'; id: string };

export function leerRuta(hash: string): Ruta {
  const [seccion, valor, extra] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (seccion === 'categoria' && valor) return { vista: 'categoria', slug: valor, ancla: extra || undefined };
  if (seccion === 'presentar' && valor) return { vista: 'presentacion', id: valor };
  return { vista: 'portada' };
}

export const hrefPortada = '#/';
export const hrefCategoria = (slug: string, ancla?: string) =>
  `#/categoria/${encodeURIComponent(slug)}${ancla ? `/${encodeURIComponent(ancla)}` : ''}`;
export const hrefPresentar = (id: string) => `#/presentar/${encodeURIComponent(id)}`;

export function useRuta(): Ruta {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const alCambiar = () => setHash(window.location.hash);
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  return leerRuta(hash);
}

/** Pone la página en pantalla completa. Solo funciona como respuesta a un clic o una tecla. */
export function entrarPantallaCompleta() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
}

export function salirPantallaCompleta() {
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}

export function alternarPantallaCompleta() {
  if (document.fullscreenElement) salirPantallaCompleta();
  else entrarPantallaCompleta();
}
