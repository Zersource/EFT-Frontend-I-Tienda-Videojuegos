# Superjuegos - Tienda de videojuegos online

Evaluación Final Transversal (EFT) - **Desarrollo Frontend I (PFY2201)**, Duoc UC.

Sitio web de una tienda de videojuegos online construido con **HTML 5, CSS 3, JavaScript, Bootstrap 5 y React**.
Muestra un catálogo de videojuegos, permite filtrarlos por categoría, agregarlos a un carrito y contactar al
administrador mediante un formulario con validación. El proyecto reutiliza y mejora el código de las sumativas
anteriores del curso (React + Vite, `useState`, `useEffect` y renderizado condicional de la Semana 8).

- **Alumno:** Sergio Mascareño Luna
- **Demo (GitHub Pages):** https://zersource.github.io/EFT-Frontend-I-Tienda-Videojuegos/
- **Repositorio:** https://github.com/Zersource/EFT-Frontend-I-Tienda-Videojuegos

> Los videojuegos, estudios y carátulas son **ficticios y originales**. No representan productos reales.

## Requerimientos de la EFT y dónde se cumplen

| Requerimiento | Dónde está |
|---|---|
| Página principal con los productos en venta | Sección `#catalogo` (`App.jsx` + `ProductList.jsx`) |
| Tarjetas con imagen, nombre, precio y descripción | `ProductCard.jsx` (tarjetas `card` de Bootstrap) |
| Barra de navegación entre secciones | `Navbar.jsx`: enlaces Inicio, Catálogo y Contacto, más botón del carrito |
| Formulario de contacto (nombre, email, mensaje) con validación | `Contacto.jsx` + `utils/validaciones.js` |
| Proyecto dividido en componentes React | 9 componentes en `src/components/` |
| Etiquetas semánticas | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` |
| Flexbox o CSS Grid | CSS Grid en la grilla del catálogo (`.catalogo-grid`, `App.css`); Flexbox en el panel del carrito y la barra de Bootstrap |
| Bootstrap 5 (navbar, tarjetas, formularios, pie de página) | CDN en `index.html` (Bootstrap 5.3.3) |
| Datos de los videojuegos (nombre, categoría, precio, descripción, imagen) | `public/juegos.json` |
| Generar las tarjetas dinámicamente | `ProductList` recorre el arreglo del estado con `map` |
| Filtrado por categoría | Menú desplegable en `Filtros.jsx` (más búsqueda por texto) |
| Estado para agregar o eliminar videojuegos | `agregarJuego` / `eliminarJuego` en `App.jsx` (modo administrador) |
| Props entre componentes | El estado vive en `App` y se distribuye por props a los hijos |
| Carga desde un archivo | `useEffect` + `fetch` de `juegos.json` |

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Catálogo | 10 videojuegos en 4 categorías (Aventura, Acción, Estrategia, Carreras), con precio normal y de oferta |
| Carga dinámica | `fetch` de `juegos.json` con estados de carga y de error, y botón **Reintentar** |
| Filtro y búsqueda | Por categoría y por texto (título, estudio o descripción). La búsqueda **ignora mayúsculas y tildes** |
| Carrito | Agregar, aumentar/disminuir cantidad, eliminar y vaciar. Total con el precio final (oferta si existe) |
| Persistencia | El carrito se conserva al recargar (`localStorage`) |
| Contacto | Valida nombre (mín. 3 letras), email (formato) y mensaje (10 a 500 caracteres). Muestra errores por campo y un mensaje de éxito |
| Modo administrador | Interruptor sobre el catálogo: permite **agregar** un videojuego (con validación) y **eliminar** cualquiera del catálogo |
| Responsivo | Menú hamburguesa en móvil y grilla que se adapta al ancho (de 1 a 5 columnas) |
| Accesibilidad básica | `aria-label`, `aria-invalid`, `aria-describedby`, `role="dialog"`/`status`/`alert`, cierre del carrito con Escape |

## Conceptos de React aplicados

- **`useState`**: catálogo, carga, error, carrito, búsqueda, categoría, modo administrador (`App.jsx`); campos y errores de los formularios (`Contacto.jsx`, `AdminJuegos.jsx`); menú móvil (`Navbar.jsx`).
- **`useEffect`**: carga del catálogo con `fetch` y `AbortController`, persistencia del carrito, y tecla Escape con limpieza del listener (`Cart.jsx`).
- **`useCallback`**: referencia estable de `cerrarCarrito` para el efecto de `Cart`.
- **Props y estado elevado**: `App` concentra el estado y pasa datos y funciones a los componentes hijos.
- **Inputs controlados**: buscador, selector de categoría y formularios.
- **Renderizado condicional**: cargando / error / catálogo; precio de oferta vs normal; botón "Agregar" vs "En el carrito (n)"; badge del carrito; carrito vacío vs con juegos; formulario y botón de eliminar solo en modo administrador; mensajes de error y de éxito.

## Estructura del proyecto

```
EFT-Frontend-I-Tienda-Videojuegos/
├── index.html                  # Punto de entrada (Bootstrap 5.3.3 por CDN)
├── vite.config.js              # base: ruta del repositorio para GitHub Pages
├── package.json
├── pruebas/
│   └── e2e.mjs                 # Pruebas end-to-end con Playwright
├── public/
│   ├── favicon.svg
│   └── juegos.json             # Catálogo (se carga con fetch)
└── src/
    ├── main.jsx                # Monta <App /> en el DOM
    ├── App.jsx                 # Estado, carga del catálogo, carrito, filtros y modo administrador
    ├── App.css                 # Estilos propios (portada, grilla, panel del carrito)
    ├── index.css               # Reset mínimo
    ├── components/
    │   ├── Navbar.jsx          # <header> + navegación + botón del carrito
    │   ├── Filtros.jsx         # Búsqueda y categoría (inputs controlados)
    │   ├── ProductList.jsx     # Grilla del catálogo / mensaje sin resultados
    │   ├── ProductCard.jsx     # Tarjeta de un videojuego
    │   ├── AdminJuegos.jsx     # Formulario para agregar videojuegos
    │   ├── Contacto.jsx        # Formulario de contacto con validación
    │   ├── Cart.jsx            # Panel del carrito
    │   ├── CartItem.jsx        # Fila del carrito
    │   └── CartTotal.jsx       # Cantidad total y monto a pagar
    ├── utils/
    │   ├── precios.js          # formatearPrecio() y precioFinal()
    │   ├── texto.js            # normalizar(): compara sin mayúsculas ni tildes
    │   ├── validaciones.js     # validarContacto() y validarJuego() (funciones puras)
    │   └── imagenes.js         # Resuelve la URL de cada imagen vía Vite
    └── assets/productos/       # Carátulas de los videojuegos (originales)
```

## Instalación y uso

Requisitos: **Node.js 20.19 o superior** (o 22.12+), exigido por Vite 8, y Git.

```bash
git clone https://github.com/Zersource/EFT-Frontend-I-Tienda-Videojuegos.git
cd EFT-Frontend-I-Tienda-Videojuegos
npm install        # instala las dependencias
npm run dev        # servidor de desarrollo: http://localhost:5173/EFT-Frontend-I-Tienda-Videojuegos/
```

Otros comandos:

```bash
npm run lint       # análisis estático (oxlint)
npm run build      # genera la carpeta dist/ para producción
npm run preview    # sirve el build en http://localhost:4173/EFT-Frontend-I-Tienda-Videojuegos/
npm run deploy     # build + publicación de dist/ en la rama gh-pages
```

### Cómo usar el sitio

1. **Inicio / Catálogo:** recorre los videojuegos, filtra por categoría o busca por texto.
2. **Carrito:** pulsa "Agregar al carrito"; el botón **Carrito** del navbar abre el panel con cantidades y total.
3. **Contacto:** completa nombre, correo y mensaje; si falta algo o está mal escrito, se muestran los errores.
4. **Modo administrador:** activa el interruptor sobre el catálogo para agregar un videojuego (formulario) o eliminar uno (botón en cada tarjeta).

## Despliegue en GitHub Pages

El sitio se publica desde la rama `gh-pages` con el paquete `gh-pages`:

```bash
npm run deploy     # ejecuta el build y publica dist/ en la rama gh-pages
```

`vite.config.js` define `base: '/EFT-Frontend-I-Tienda-Videojuegos/'`; si el repositorio cambia de nombre, ese
valor debe actualizarse. `juegos.json` se pide con `import.meta.env.BASE_URL`, por lo que la ruta se ajusta sola.

## Pruebas

Las comprobaciones automatizadas están en el repositorio (`pruebas/e2e.mjs`) y se ejecutan con Playwright
sobre el build de producción, con el mismo base path de GitHub Pages: 47 comprobaciones sobre carga con `fetch`,
filtro y búsqueda sin tildes, carrito y persistencia, formulario de contacto, navegación y menú móvil, alta y
baja de videojuegos, error de carga con **Reintentar**, y ausencia de scroll horizontal a 390, 768 y 1440 px.

```bash
npm run build
npm run preview          # en una terminal
npm run test:e2e         # en otra (requiere Google Chrome instalado)
```

Si Chrome está en otra ruta, definir `CHROME_PATH` con la ubicación del ejecutable.

Validación adicional realizada: `npm run lint` sin errores ni advertencias, `npm run build` sin errores y
HTML renderizado (catálogo, carrito, modo administrador y formulario de contacto con errores) más `index.html` y
CSS validados con **vnu.jar** (Nu HTML Checker) con 0 errores.

## Decisiones de diseño

- **JSON local en vez de una API externa:** el enunciado permite "un archivo o una API externa". Un archivo propio evita
  depender de terceros (disponibilidad, CORS, claves de API).
- **Bootstrap por CDN y sin su JavaScript:** Bootstrap aporta estilos y componentes visuales; el comportamiento (menú
  móvil, carrito) lo controla React con estado, para que React sea el único que modifica el DOM.
- **CSS Grid para el catálogo:** `repeat(auto-fill, minmax(230px, 1fr))` adapta las columnas al ancho sin media queries.
- **Validación en funciones puras** (`utils/validaciones.js`): se reutilizan en los dos formularios y no dependen del DOM.
- **Errores derivados del estado:** los formularios solo muestran errores tras el primer intento de envío, y se
  recalculan en cada cambio, de modo que desaparecen apenas el usuario corrige.
- **`AbortController`** en la carga del catálogo: cancela de verdad la petición HTTP cuando el efecto se limpia.
- **Carátulas originales:** al ser videojuegos ficticios no se usan imágenes con derechos de autor.

## Limitaciones conocidas

- El envío del formulario de contacto es **simulado** (no hay servidor): muestra un mensaje de confirmación.
- Los juegos agregados o eliminados en modo administrador viven en el estado de la aplicación: al recargar la página
  el catálogo vuelve al contenido de `juegos.json`. El carrito sí se conserva.
- No hay proceso de pago: el carrito calcula cantidades y monto total.
