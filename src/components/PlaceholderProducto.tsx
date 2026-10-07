import { IconoChip } from './Iconos';

interface Props {
  marca: string;
  modelo: string;
  categoria?: string;
  compacto?: boolean;
}

function iniciales(texto: string) {
  return texto
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function PlaceholderProducto({ marca, modelo, categoria, compacto = false }: Props) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-emerald-500/20 bg-[#f8fbf9] text-acento ${compacto ? 'p-1' : 'p-3'}`}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,.18),transparent_7rem),linear-gradient(135deg,rgba(255,255,255,.92),rgba(236,253,245,.78))]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-acento/70 via-emerald-400/70 to-amber-300/70" />
      <div className={`relative flex min-w-0 flex-col items-center text-center ${compacto ? 'gap-0.5' : 'gap-1'}`}>
        <span className={`flex items-center justify-center rounded-lg bg-acento/10 ${compacto ? 'size-8' : 'size-12'}`}>
          <IconoChip className={compacto ? 'size-5' : 'size-7'} />
        </span>
        <span className={`font-bold tracking-wide text-acento ${compacto ? 'text-[10px]' : 'text-xs'}`}>{iniciales(marca || modelo)}</span>
        {!compacto && <span className="line-clamp-2 text-[11px] leading-tight text-slate-700">{modelo}</span>}
        {categoria && <span className="text-[10px] leading-tight text-slate-500">{categoria}</span>}
      </div>
    </div>
  );
}
