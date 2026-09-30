// Íconos SVG simples. Toman el color del texto (currentColor); el tamaño se da con className, ej. "size-5".
import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

function Base(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export const IconoMenu = (p: Props) => (
  <Base {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Base>
);

export const IconoBuscar = (p: Props) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Base>
);

export const IconoSol = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Base>
);

export const IconoLuna = (p: Props) => (
  <Base {...p}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Base>
);

export const IconoPresentar = (p: Props) => (
  <Base {...p}>
    <path d="M3 4h18M5 4v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4M12 16v4M8 20h8" />
  </Base>
);

export const IconoAnterior = (p: Props) => (
  <Base {...p}>
    <path d="m15 18-6-6 6-6" />
  </Base>
);

export const IconoSiguiente = (p: Props) => (
  <Base {...p}>
    <path d="m9 18 6-6-6-6" />
  </Base>
);

export const IconoCerrar = (p: Props) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
);

export const IconoCheck = (p: Props) => (
  <Base {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Base>
);

export const IconoPantallaCompleta = (p: Props) => (
  <Base {...p}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
  </Base>
);

export const IconoEnlace = (p: Props) => (
  <Base {...p}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Base>
);

export const IconoEstrella = (p: Props) => (
  <Base fill="currentColor" stroke="none" {...p}>
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  </Base>
);

export const IconoChip = (p: Props) => (
  <Base {...p}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </Base>
);
