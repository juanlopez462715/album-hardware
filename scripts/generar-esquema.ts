// `npm run esquema`: genera esquema/categoria.schema.json a partir de src/lib/esquema.ts.
// VS Code usa ese archivo (ver .vscode/settings.json) para autocompletar y subrayar
// errores mientras editas src/data/*.json.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { esquemaCategoria } from '../src/lib/esquema';

const carpeta = join(import.meta.dirname, '..', 'esquema');
const esquemaJson = {
  title: 'Categoría del Álbum de Hardware',
  ...z.toJSONSchema(esquemaCategoria, { io: 'input', unrepresentable: 'any' }),
};

mkdirSync(carpeta, { recursive: true });
writeFileSync(join(carpeta, 'categoria.schema.json'), `${JSON.stringify(esquemaJson, null, 2)}\n`);
console.log('✔ esquema/categoria.schema.json actualizado');
