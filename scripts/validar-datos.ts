// `npm run validar`: revisa src/data/*.json y explica en español qué hay que corregir.
// Se corre solo antes de cada build, así que un JSON con errores nunca llega a publicarse.
// Con `npm run validar -- --imagenes` también lista las imágenes que faltan.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { styleText } from 'node:util';
import { validarColeccion, type ArchivoDatos, type Problema } from '../src/lib/validacion';

const raiz = join(import.meta.dirname, '..');
const carpetaDatos = join(raiz, 'src', 'data');
const carpetaPublica = join(raiz, 'public');

const archivos: ArchivoDatos[] = [];
const erroresSintaxis: Problema[] = [];

const nombres = readdirSync(carpetaDatos).filter((nombre) => nombre.endsWith('.json')).sort();
for (const archivo of nombres) {
  const texto = readFileSync(join(carpetaDatos, archivo), 'utf8');
  try {
    archivos.push({ archivo, contenido: JSON.parse(texto) });
  } catch (error) {
    erroresSintaxis.push({
      archivo,
      ruta: '(sintaxis)',
      mensaje: `el JSON está mal escrito: ${(error as Error).message}. Revisa comas, comillas y llaves.`,
    });
  }
}

const resultado = validarColeccion(archivos);
const errores = [...erroresSintaxis, ...resultado.errores];

const imagenesFaltantes = resultado.categorias.flatMap((categoria) =>
  categoria.comparaciones.flatMap((comparacion) =>
    comparacion.productos
      .filter((producto) => producto.imagen && !producto.imagen.startsWith('https://') && !existsSync(join(carpetaPublica, producto.imagen)))
      .map((producto) => `public/${producto.imagen}`),
  ),
);

const imprimir = (problemas: Problema[]) => {
  for (const { archivo, ruta, mensaje } of problemas) {
    console.log(`  ${styleText('bold', archivo)} › ${ruta}\n    ${mensaje}`);
  }
};

console.log(`Revisando ${nombres.length} archivos en src/data…\n`);

if (errores.length > 0) {
  console.log(styleText('red', `✖ ${errores.length} error(es):`));
  imprimir(errores);
  console.log();
}

if (resultado.avisos.length > 0) {
  console.log(styleText('yellow', `⚠ ${resultado.avisos.length} aviso(s):`));
  imprimir(resultado.avisos);
  console.log();
}

if (imagenesFaltantes.length > 0) {
  console.log(styleText('cyan', `🖼  ${imagenesFaltantes.length} imagen(es) pendiente(s): se muestra el placeholder mientras tanto.`));
  if (process.argv.includes('--imagenes')) {
    for (const ruta of imagenesFaltantes) console.log(`  ${ruta}`);
  } else {
    console.log('  Para ver la lista: npm run validar -- --imagenes');
  }
  console.log();
}

if (errores.length > 0) {
  console.log(styleText('red', 'Corrige los errores de arriba y vuelve a correr: npm run validar'));
  process.exitCode = 1;
} else {
  const comparaciones = resultado.categorias.reduce((total, c) => total + c.comparaciones.length, 0);
  const productos = resultado.categorias.reduce(
    (total, c) => total + c.comparaciones.reduce((suma, comp) => suma + comp.productos.length, 0),
    0,
  );
  console.log(
    styleText('green', `✔ Datos válidos: ${resultado.categorias.length} categorías, ${comparaciones} comparaciones, ${productos} productos.`),
  );
}
