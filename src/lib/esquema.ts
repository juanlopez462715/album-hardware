// Reglas que debe cumplir cada archivo de src/data/*.json.
// De aquí salen los tipos de TypeScript y los mensajes de error del validador.
// Si cambias algo aquí, corre `npm run esquema` para actualizar el autocompletado de VS Code.
import * as z from 'zod';
import { es } from 'zod/locales';

z.config(es());

export const GRUPOS = ['interno', 'externo', 'redes', 'por-gama'] as const;
export const GAMAS = ['baja', 'media', 'alta'] as const;

const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    error: 'usa solo minúsculas sin tildes, números y guiones (ej. "ssd-nvme")',
  });

const textoNoVacio = z.string().regex(/\S/, { error: 'no puede quedar vacío' });
const rutaImagenLocal = z.string().regex(/^img\/[a-z0-9-]+\/[^/\s]+\.(jpe?g|png|webp|avif|svg)$/i, {
  error: 'la ruta debe ser como "img/<categoria>/<archivo>.jpg", sin espacios y sin "/" al inicio',
});
const imagenRemota = z.url({ error: 'debe ser un enlace completo que empiece con https://' }).refine((url) => url.startsWith('https://'), {
  error: 'las imágenes remotas deben usar https://',
});

export const esquemaSpec = z
  .strictObject({
    nombre: textoNoVacio.describe('Nombre de la característica. Ej. "Capacidad"'),
    valor: z
      .union([z.number(), textoNoVacio])
      .describe('Número (sin comillas) si se compara; texto si solo se muestra. Ej. 6000 o "DDR5"'),
    unidad: z.string().optional().describe('Unidad que se muestra junto al número. Ej. "GB", "MHz", "W"'),
    mejor: z
      .enum(['mayor', 'menor'])
      .nullable()
      .describe('"mayor" si gana el número más alto, "menor" si gana el más bajo, null si no se compara'),
  })
  .refine((spec) => spec.mejor === null || typeof spec.valor === 'number', {
    error: 'si "mejor" es "mayor" o "menor", "valor" debe ser un número sin comillas (la unidad va en "unidad")',
    path: ['valor'],
  });

export const esquemaProducto = z
  .strictObject({
    marca: textoNoVacio.describe('Ej. "Kingston"'),
    modelo: textoNoVacio.describe('Nombre comercial completo. Ej. "FURY Beast 32 GB DDR5-6000"'),
    precioGTQ: z.number().positive().describe('Precio en quetzales, sin "Q" ni comas. Ej. 1299.99'),
    tienda: z.string().describe('Tienda donde se consultó el precio. Ej. "Intelaf"'),
    fechaConsulta: z
      .union([z.literal(''), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'usa el formato AAAA-MM-DD' })])
      .describe('Día en que se revisó el precio, formato AAAA-MM-DD. Vacío si aún no se verifica'),
    urlFuente: z
      .union([z.literal(''), z.url({ error: 'debe ser un enlace completo que empiece con https://' })])
      .describe('Enlace a la página del producto en la tienda. Vacío si no se tiene'),
    verificado: z.boolean().describe('true cuando alguien confirmó el precio en la tienda'),
    imagen: z
      .union([
        z.literal(''),
        rutaImagenLocal,
        imagenRemota,
      ])
      .describe('Ruta dentro de public/ o URL https. Ej. "img/ram/kingston.jpg" o "https://...". Vacío para usar el placeholder'),
    specs: z.array(esquemaSpec).min(1, { error: 'agrega al menos una característica' }),
  })
  .superRefine((producto, ctx) => {
    if (!producto.verificado) return;
    if (!producto.tienda.trim()) {
      ctx.addIssue({ code: 'custom', path: ['tienda'], message: 'un precio verificado necesita el nombre de la tienda' });
    }
    if (!producto.fechaConsulta) {
      ctx.addIssue({ code: 'custom', path: ['fechaConsulta'], message: 'un precio verificado necesita la fecha de consulta' });
    }
  });

export const esquemaComparacion = z
  .strictObject({
    id: slug.describe('Identificador único en todo el álbum. Ej. "ram-ddr5-32gb"'),
    gama: z.enum(GAMAS).optional().describe('Solo en categorías del grupo "por-gama"'),
    titulo: textoNoVacio.describe('Ej. "Kits DDR5 de 32 GB a 6000 MT/s"'),
    descripcion: z.string().optional().describe('Contexto breve de la comparación (opcional)'),
    productos: z.array(esquemaProducto).min(2, { error: 'una comparación necesita al menos 2 productos' }),
    recomendacion: z.strictObject({
      productoGanador: textoNoVacio.describe('Copia exacta del "modelo" del producto que recomiendan'),
      razones: z
        .array(textoNoVacio)
        .min(2, { error: 'escribe al menos 2 razones' })
        .max(3, { error: 'máximo 3 razones' })
        .describe('De 2 a 3 razones concretas'),
    }),
  })
  .superRefine((comparacion, ctx) => {
    const modelos = comparacion.productos.map((p) => p.modelo);

    modelos.forEach((modelo, i) => {
      if (modelos.indexOf(modelo) !== i) {
        ctx.addIssue({ code: 'custom', path: ['productos', i, 'modelo'], message: `el modelo "${modelo}" está repetido` });
      }
    });

    if (!modelos.includes(comparacion.recomendacion.productoGanador)) {
      ctx.addIssue({
        code: 'custom',
        path: ['recomendacion', 'productoGanador'],
        message: `debe ser igual al "modelo" de uno de los productos: ${modelos.map((m) => `"${m}"`).join(' o ')}`,
      });
    }

    // Una misma característica debe compararse igual en todos los productos.
    const mejorPorNombre = new Map<string, 'mayor' | 'menor' | null>();
    comparacion.productos.forEach((producto, i) => {
      producto.specs.forEach((spec, j) => {
        const anterior = mejorPorNombre.get(spec.nombre);
        if (anterior === undefined) mejorPorNombre.set(spec.nombre, spec.mejor);
        else if (anterior !== spec.mejor) {
          ctx.addIssue({
            code: 'custom',
            path: ['productos', i, 'specs', j, 'mejor'],
            message: `"${spec.nombre}" tiene "mejor": ${JSON.stringify(anterior)} en otro producto; debe ser igual en todos`,
          });
        }
      });
    });
  });

export const esquemaCategoria = z
  .strictObject({
    categoria: slug.describe('Igual al nombre del archivo sin ".json". Ej. "ram"'),
    nombre: textoNoVacio.describe('Nombre que se muestra en la página. Ej. "Memoria RAM"'),
    grupo: z.enum(GRUPOS).describe('Sección del índice donde aparece la categoría'),
    orden: z.number().int().min(1).describe('Posición dentro de su grupo (1, 2, 3…)'),
    descripcion: textoNoVacio.describe('Una línea que explica qué es el componente'),
    comparaciones: z.array(esquemaComparacion).min(1, { error: 'agrega al menos una comparación' }),
  })
  .superRefine((categoria, ctx) => {
    categoria.comparaciones.forEach((comparacion, i) => {
      if (categoria.grupo === 'por-gama' && !comparacion.gama) {
        ctx.addIssue({ code: 'custom', path: ['comparaciones', i, 'gama'], message: 'en el grupo "por-gama" cada comparación necesita "gama": "baja", "media" o "alta"' });
      }
      if (categoria.grupo !== 'por-gama' && comparacion.gama) {
        ctx.addIssue({ code: 'custom', path: ['comparaciones', i, 'gama'], message: '"gama" solo se usa en el grupo "por-gama"; bórrala o cambia el grupo' });
      }
    });
  });

export type Grupo = (typeof GRUPOS)[number];
export type Gama = (typeof GAMAS)[number];
export type Spec = z.infer<typeof esquemaSpec>;
export type Producto = z.infer<typeof esquemaProducto>;
export type Comparacion = z.infer<typeof esquemaComparacion>;
export type Categoria = z.infer<typeof esquemaCategoria>;
