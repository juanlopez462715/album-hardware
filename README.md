# Álbum de componentes de hardware

Página web tipo álbum que compara productos de hardware de al menos dos marcas: precio en quetzales, características sobresalientes, imagen de cada producto y una **recomendación** con razones para defenderla en clase.

- **Cómo verla:** por ahora se corre en local con `npm run dev` (ver [Cómo correr el proyecto](#cómo-correr-el-proyecto)). La publicación en GitHub Pages está preparada, pero pendiente de activar (ver [Publicación](#publicación)).
- **Curso:** Arquitectura de Computadoras II — Universidad Mariano Gálvez de Guatemala, Campus Huehuetenango
- **Equipo:** Juan Manuel Zacarías López y Pedro Cesar Ramos Pablo

La página es **100 % data-driven**: la interfaz se programó una sola vez y todo el contenido vive en archivos JSON, uno por categoría, dentro de `src/data/`. Para agregar o corregir una comparación **no hace falta tocar código**, solo editar el JSON de esa categoría.

Incluye portada con índice, buscador, modo claro/oscuro y un **modo presentación** a pantalla completa (se navega con las flechas ← →) pensado para la defensa.

> ⚠️ Los precios de ejemplo son estimados y aparecen con la etiqueta **“precio por verificar”** hasta que alguien los confirme en tienda. Las especificaciones también deben revisarse con la página oficial de cada fabricante antes de la defensa.

---

## Cómo correr el proyecto

**Requisitos:** [Node.js](https://nodejs.org/) 22 o más reciente y Git.

```bash
git clone git@github.com:juanlopez462715/album-hardware.git
cd album-hardware
npm install
npm run dev
```

Abre en el navegador la dirección que aparece en la terminal: **http://localhost:5173/album-hardware/**. Cada vez que guardas un archivo, la página se actualiza sola.

> **Si usas WSL (Ubuntu en Windows):** corre los comandos en la terminal de **Ubuntu** (en VS Code: *Terminal → New Terminal* y elige el perfil *Ubuntu (WSL)*). Si Node está instalado con `nvm` y corres `npm` desde fuera de esa terminal, puede usarse por error el `npm` de Windows.

### Comandos disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta la página en modo desarrollo, con recarga automática. |
| `npm run dev:polling` | Igual que el anterior, pero revisa los archivos cada 300 ms. Úsalo solo si la página no se actualiza al guardar. |
| `npm run validar` | Revisa todos los JSON de `src/data/` y explica en español qué hay que corregir. |
| `npm run validar -- --imagenes` | Además lista las imágenes que faltan. |
| `npm run build` | Valida los datos, revisa los tipos de TypeScript y genera la versión final en `dist/`. |
| `npm run preview` | Muestra la versión de `dist/` tal como quedará publicada. |
| `npm run esquema` | Regenera el autocompletado de VS Code (solo si alguien cambia `src/lib/esquema.ts`). |

---

## Cómo agregar una comparación nueva (paso a paso)

Pensado para quien **solo va a editar JSON**. No necesitas saber React ni TypeScript.

> 💡 Abre la carpeta del proyecto en **VS Code**. Mientras editas un archivo de `src/data/`, VS Code autocompleta los nombres de los campos, muestra una explicación al pasar el mouse y subraya en rojo lo que está mal.

### 1. Crea tu rama

Cada categoría se trabaja en su propia rama, que siempre sale de `develop` (ver [Convención de trabajo](#convención-de-trabajo)):

```bash
git switch develop
git pull
git switch -c categoria/celulares
```

### 2. Abre el archivo de la categoría

Por ejemplo `src/data/celulares.json`. Cada archivo tiene esta forma:

```jsonc
{
  "categoria": "celulares",       // igual al nombre del archivo, sin .json
  "nombre": "Celulares",          // lo que se ve en la página
  "grupo": "por-gama",            // interno | externo | redes | por-gama
  "orden": 1,                     // posición dentro de su grupo en el índice
  "descripcion": "…",
  "comparaciones": [
    { …comparación 1… },
    { …comparación 2… }
  ]
}
```

### 3. Copia una comparación que ya exista

Dentro de `"comparaciones": [ … ]`, copia **un bloque completo** `{ … }`, desde su llave de apertura hasta la de cierre. Pégalo después del último bloque y **pon una coma** entre los dos:

```jsonc
"comparaciones": [
  { …la que ya estaba… },   // ← esta coma es obligatoria
  { …la que pegaste… }      // ← después de la última NO va coma
]
```

### 4. Cambia los datos

Una comparación se ve así (versión corta):

```json
{
  "id": "ram-ddr4-16gb",
  "titulo": "Kits DDR4 de 16 GB",
  "descripcion": "Texto opcional con el contexto de la comparación.",
  "productos": [
    {
      "marca": "Kingston",
      "modelo": "FURY Beast 16 GB DDR4-3200",
      "precioGTQ": 499,
      "tienda": "Intelaf",
      "fechaConsulta": "",
      "urlFuente": "",
      "verificado": false,
      "imagen": "img/ram/kingston-fury-beast-ddr4.jpg",
      "specs": [
        { "nombre": "Capacidad", "valor": 16, "unidad": "GB", "mejor": "mayor" },
        { "nombre": "Latencia CAS (CL)", "valor": 16, "mejor": "menor" },
        { "nombre": "Tipo", "valor": "DDR4", "mejor": null }
      ]
    },
    { "…": "segundo producto, con las MISMAS specs" }
  ],
  "recomendacion": {
    "productoGanador": "FURY Beast 16 GB DDR4-3200",
    "razones": ["Primera razón concreta.", "Segunda razón concreta."]
  }
}
```

| Campo | Qué poner |
| --- | --- |
| `id` | Un nombre único en **todo** el álbum, en minúsculas y con guiones. Ej. `ram-ddr4-16gb`. |
| `gama` | Solo en celulares, PCs y microprocesadores: `"baja"`, `"media"` o `"alta"`. En las demás categorías no se escribe. |
| `titulo` | El título de la comparación. |
| `descripcion` | Opcional. Una frase de contexto. |
| `productos` | Mínimo 2. Pueden ser más. |
| `marca`, `modelo` | Nombre comercial. El `modelo` no se puede repetir dentro de la misma comparación. |
| `precioGTQ` | Número **sin comillas**, sin `Q` y sin comas: `1299` o `1299.99`. |
| `tienda` | Intelaf, Click, Max, Spirit, Pacifiko… |
| `fechaConsulta` | `"AAAA-MM-DD"` (ej. `"2026-10-05"`) o `""` si todavía no se verificó. |
| `urlFuente` | Enlace completo a la página del producto (`https://…`) o `""`. |
| `verificado` | `true` si alguien confirmó el precio en tienda; si no, `false`. |
| `imagen` | Ruta dentro de `public/`: `"img/<categoria>/<archivo>.jpg"`. Sin `/` al inicio. |
| `specs` | Lista de características (ver el paso 5). |
| `productoGanador` | **Copia exacta** del `modelo` del producto que recomiendan. |
| `razones` | Entre 2 y 3 razones concretas, con números si se puede. |

### 5. Escribe las características (specs)

Cada característica tiene `nombre`, `valor`, `unidad` (opcional) y `mejor`:

- `"mejor": "mayor"` → gana el número **más alto** (capacidad, velocidad, garantía…).
- `"mejor": "menor"` → gana el número **más bajo** (precio, latencia, consumo, peso…).
- `"mejor": null` → no se compara, solo se muestra (tipo de panel, socket, sí/no…).

Reglas importantes:

1. Si `mejor` es `"mayor"` o `"menor"`, el `valor` debe ser un **número sin comillas** y la unidad va aparte: `"valor": 6000, "unidad": "MT/s"`. ❌ `"valor": "6000 MT/s"`.
2. Escribe **los mismos nombres de specs en todos los productos**, iguales letra por letra, para que queden en la misma fila de la tabla.
3. El precio se compara solo; no hace falta agregarlo como spec.

La página resalta en verde la celda ganadora de cada fila. Si todos empatan, la fila muestra “empate”.

### 6. Agrega las imágenes

1. Descarga la foto del producto, de preferencia con fondo blanco, en `.jpg`, `.png` o `.webp`.
2. Guárdala en `public/img/<categoria>/` **con el mismo nombre** que escribiste en `imagen`.
3. Mientras la imagen no exista, la página muestra un placeholder que dice “Imagen pendiente”.

### 7. Valida y revisa

```bash
npm run validar
```

- ✔ en verde: todo bien.
- ✖ en rojo: te dice **el archivo, dónde está el problema y cómo arreglarlo**. Ej.: `celulares.json › comparaciones #2 › productos #1 › precioGTQ`.

> Es normal que al corregir unos errores aparezcan otros nuevos: el validador revisa por capas. Primero la forma del archivo y después reglas como “el ganador debe existir”.

Luego mira el resultado con `npm run dev`.

### 8. Sube tus cambios y abre un Pull Request

```bash
git add src/data/celulares.json public/img/celulares
git commit -m "celulares: agrega comparación de gama media"
git push -u origin categoria/celulares
```

En GitHub aparecerá el botón **Compare & pull request**. Ábrelo y **revisa que arriba diga `base: develop`** (si dice `base: main`, cámbialo). Describe qué cambiaste y pide a tu compañero que lo revise. Antes de unirlo a `develop`, quien revisa descarga la rama y corre `npm run validar`:

```bash
git fetch
git switch categoria/celulares
npm run validar
```

(Cuando la publicación automática esté activa, GitHub hará esta revisión solo y mostrará ✅ en el PR).

### Errores comunes

| Mensaje o síntoma | Causa y solución |
| --- | --- |
| `el JSON está mal escrito` | Falta o sobra una coma, una comilla o una llave. VS Code marca la línea en rojo. |
| `se esperaba número, recibido texto` | El número está entre comillas: usa `1299`, no `"1299"`. |
| `Llave desconocida: "precioGtq"` | El nombre del campo tiene un error de escritura (mayúsculas incluidas). |
| `debe ser igual al "modelo" de uno de los productos` | `productoGanador` no coincide letra por letra con ningún `modelo`. Cópialo y pégalo. |
| `si "mejor" es "mayor" o "menor", "valor" debe ser un número` | Quita la unidad del `valor` y ponla en `"unidad"`. |
| `el id "…" ya se usa en …` | Cambia el `id` por uno que no exista. |
| Una fila sale partida en dos | El `nombre` de la spec está escrito distinto en cada producto. |

---

## Cómo verificar un precio

Cuando confirmes el precio en la página de la tienda, actualiza estos cinco campos del producto:

```json
"precioGTQ": 2349,
"tienda": "Intelaf",
"fechaConsulta": "2026-10-05",
"urlFuente": "https://www.intelaf.com/…",
"verificado": true
```

Con `verificado: true` desaparece la etiqueta “precio por verificar”. El validador exige `tienda` y `fechaConsulta` cuando un precio está verificado, y avisa si falta la `urlFuente` (conviene tenerla para la defensa).

## Cómo agregar una categoría nueva

1. Crea `src/data/<nombre-de-la-categoria>.json`, por ejemplo copiando otro archivo del mismo grupo.
2. Cambia `categoria` para que coincida con el nombre del archivo, y ajusta `nombre`, `grupo`, `orden` y `descripcion`.
3. Crea la carpeta `public/img/<nombre-de-la-categoria>/` para sus imágenes.

La página la agrega sola al índice.

---

## Convención de trabajo

El repositorio tiene dos ramas fijas:

| Rama | Para qué sirve |
| --- | --- |
| `main` | La versión estable, la que se presenta en clase. |
| `develop` | Donde se juntan los cambios del equipo antes de pasar a `main`. |

Los cambios siguen siempre este camino:

```text
categoria/<archivo>  ──PR──▶  develop  ──PR──▶  main
```

- **Una rama por categoría**, con el nombre `categoria/<archivo>`: `categoria/ram`, `categoria/celulares`, `categoria/routers`… Así cada persona toca archivos distintos y **no hay conflictos de Git**.
- Las ramas de trabajo **salen de `develop`**: antes de crear una, actualízala con `git switch develop && git pull`.
- Cada rama entra por **Pull Request con `base: develop`**. Lo revisa y lo une el dueño del repositorio.
- Cuando `develop` está estable (por ejemplo, antes de la defensa), el dueño abre un **Pull Request de `develop` a `main`** y lo une.
- **Nadie trabaja directo en `develop` ni en `main`.**
- Un PR solo se une cuando `npm run validar` pasa sin errores en esa rama (cuando la publicación automática esté activa, GitHub lo mostrará con ✅ en el PR).
- Mensajes de commit cortos y claros, empezando por la categoría: `ram: verifica precios`, `routers: agrega imagen del AX55`.
- Los cambios de código (carpetas `src/components/` y `src/lib/`) van en ramas aparte, por ejemplo `mejora/buscador`.

## Publicación

> **Estado actual: pendiente de activar.** Por ahora la página se ve corriéndola en local (`npm run dev`). Mientras tanto es normal que la pestaña **Actions** del repositorio muestre los intentos en rojo.

El workflow `.github/workflows/deploy.yml` ya está listo. Cuando se active, cada push a `main`:

1. instalará las dependencias,
2. validará los datos, revisará los tipos y construirá la página,
3. la publicará en https://juanlopez462715.github.io/album-hardware/

Si un JSON tiene errores, el workflow falla y **la página publicada no cambia**. En los Pull Requests se ejecutan los pasos 1 y 2, sin publicar.

**Para activarlo** (lo hace el dueño del repositorio):

1. Confirmar que GitHub Actions esté habilitado en la cuenta.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. En la pestaña **Actions**, abrir el último intento y tocar **Re-run all jobs**.

---

## Estructura del proyecto

```text
album-hardware/
├── src/
│   ├── data/                  ← CONTENIDO: un JSON por categoría (lo que ustedes editan)
│   ├── components/            ← piezas de la interfaz (portada, tarjeta, tabla, presentación…)
│   ├── lib/
│   │   ├── esquema.ts         ← reglas de los JSON y tipos de TypeScript (Zod)
│   │   ├── validacion.ts      ← validación de todos los archivos juntos
│   │   ├── datos.ts           ← carga los JSON y arma el índice y el buscador
│   │   ├── comparar.ts        ← decide qué producto gana en cada fila
│   │   └── …
│   ├── sitio.ts               ← nombres del equipo, curso y universidad
│   └── App.tsx
├── public/img/<categoria>/    ← imágenes de los productos
├── scripts/                   ← comandos `npm run validar` y `npm run esquema`
├── esquema/                   ← autocompletado de VS Code para los JSON (generado)
├── .github/workflows/         ← publicación automática en GitHub Pages
└── vite.config.ts             ← configuración de Vite (base: /album-hardware/)
```

**Tecnologías:** React, Vite, TypeScript, Tailwind CSS y Zod. Sin backend ni base de datos.

## Problemas comunes

| Problema | Solución |
| --- | --- |
| La página no se actualiza al guardar | Detén el servidor (`Ctrl + C`) y usa `npm run dev:polling`. |
| En WSL, `npm` dice `node: not found` o usa rutas de `C:\` | Corre los comandos en la terminal de Ubuntu, donde `nvm` carga Node. |
| La página muestra un recuadro rojo “Hay errores en los archivos de datos” | Corre `npm run validar` y corrige lo que indique. |
| El workflow de GitHub falla | Abre la pestaña **Actions** del repositorio, entra al paso en rojo y lee el mensaje del validador. |
| En Windows, PowerShell dice que **“la ejecución de scripts está deshabilitada”** al correr `npm` | Corre una sola vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` y vuelve a intentar. Otra opción es escribir `npm.cmd` en lugar de `npm`. |
| `npm install` o `npm run dev` fallan con errores raros (por ejemplo `SyntaxError` o `Unsupported engine`) | Revisa tu versión con `node -v`: debe ser **22 o más**. Si es menor, instala la versión LTS desde [nodejs.org](https://nodejs.org/) y vuelve a correr `npm install`. |
| El primer `git push` pide iniciar sesión | Es normal: Git abre el navegador para que entres a GitHub. Si después dice `Permission denied` o `403`, revisa que aceptaste la invitación al repositorio. |
