import type { Spec } from './esquema';

const quetzales = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 0 });
const quetzalesConCentavos = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });
const numero = new Intl.NumberFormat('es-GT', { maximumFractionDigits: 2 });
const fecha = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** 2299 → "Q2,299" · 1299.5 → "Q1,299.50" */
export function formatearPrecio(valor: number): string {
  return Number.isInteger(valor) ? quetzales.format(valor) : quetzalesConCentavos.format(valor);
}

export function formatearNumero(valor: number): string {
  return numero.format(valor);
}

/** "2026-09-30" → "30 sept 2026" */
export function formatearFecha(iso: string): string {
  return fecha.format(new Date(`${iso}T00:00:00Z`));
}

/** Unidades que van pegadas al número, sin espacio: 20000:1, 78°, 27". */
const UNIDAD_PEGADA = /^[:°"″×]/;

export function formatearValor(spec: Pick<Spec, 'valor' | 'unidad'>): string {
  const texto = typeof spec.valor === 'number' ? formatearNumero(spec.valor) : spec.valor;
  if (!spec.unidad) return texto;
  return UNIDAD_PEGADA.test(spec.unidad) ? `${texto}${spec.unidad}` : `${texto} ${spec.unidad}`;
}

/** Quita tildes y mayúsculas para que "graficas" encuentre "Gráficas". */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}
