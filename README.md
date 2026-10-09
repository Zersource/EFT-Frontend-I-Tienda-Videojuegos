# TechNova Store - Funcionalidades clave con React (useState, useEffect y renderizado condicional)

Actividad sumativa **Semana 8** - Desarrollo Frontend I (PFY2201), Duoc UC.
Continuación del eCommerce TechNova Store de la semana 7: el catálogo ahora **se carga dinámicamente**
desde un archivo JSON con `useEffect` + `fetch`, se guarda en el estado con `useState` y la interfaz
reacciona a cada estado (cargando, error, producto ya agregado, carrito vacío).

- **Alumno:** Sergio Mascareño
- **Demo (GitHub Pages):** https://zersource.github.io/S8-React-Hooks-useEffect/
- **Repositorio:** https://github.com/Zersource/S8-React-Hooks-useEffect

## Qué se agregó o cambió respecto de la semana 7

| Cambio | Detalle |
|---|---|
| Catálogo como estado | El catálogo ya no es un `import` estático: vive en `useState` y se llena al terminar la carga |
| Carga con `useEffect` + `fetch` | `App.jsx` pide `products.json` al montar, valida `response.ok` y el formato, y actualiza el estado |
| Estados de carga y error | Spinner mientras carga; alerta con botón **Reintentar** si falla (HTTP o formato inválido) |
| Botón con estado | "Agregar al carrito" cambia a **"En el carrito (n)"** (verde) cuando el producto ya fue agregado |
| `products.json` en `public/` | Se sirve como archivo estático y se consulta con `import.meta.env.BASE_URL`, para que funcione en GitHub Pages |

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Listado de productos | 8 productos cargados dinámicamente, con nombre, marca, precio normal, precio oferta, descripción e imagen |
| Carrito de compras | Agregar, aumentar/disminuir cantidad, eliminar y vaciar |
| Contador y total | Badge en la barra de navegación y total calculado con el precio final (oferta si existe) |
| Filtros | Búsqueda por texto y filtro por categoría |
| Persistencia | El carrito se conserva al recargar (`localStorage`) |
| Accesibilidad básica | `aria-label`, `role="dialog"` en el carrito, `role="status"`/`role="alert"` en carga y error, cierre con Escape |

## Conceptos de React aplicados

- **`useState`** (`App.jsx`): catálogo (`productos`), estado de carga (`cargando`, `errorCarga`, `intento`), carrito, visibilidad del panel, búsqueda y categoría.
- **`useEffect`**
  - Carga del catálogo con `fetch` al montar `App`, con bandera de cancelación para no actualizar el estado tras una limpieza (`App.jsx`).
  - Persistencia del carrito en `localStorage` cada vez que cambia (`App.jsx`).
  - Tecla Escape y bloqueo de scroll con limpieza del listener (`Cart.jsx`).
- **`useCallback`**: referencia estable de `cerrarCarrito` para el efecto de `Cart`.
- **Renderizado condicional**
  - cargando / error / catálogo (`App`)
  - botón "Agregar al carrito" vs "En el carrito (n)" (`ProductCard`)
  - precio de oferta tachado vs precio normal (`ProductCard`)
  - badge del carrito solo si hay productos (`Navbar`)
  - carrito vacío vs carrito con productos y totales (`Cart`)
  - panel del carrito montado solo cuando está abierto (`App`)
  - mensaje cuando los filtros no encuentran productos (`ProductList`)
- **Props y estado elevado:** el estado vive en `App` y se distribuye a los componentes hijos.

## Estructura del proyecto

```
S8-React-Hooks-useEffect/
├── index.html                 # Punto de entrada (Bootstrap 5.3.3 por CDN)
├── vite.config.js             # base: ruta del repositorio para GitHub Pages
├── package.json
├── capturas/                  # Evidencias de funcionamiento
├── public/
│   ├── favicon.svg
│   └── products.json          # Catálogo (se carga con fetch)
└── src/
    ├── main.jsx               # Monta <App /> en el DOM
    ├── App.jsx                # Estado, carga del catálogo, acciones del carrito y filtros
    ├── App.css                # Estilos propios (panel del carrito, cards)
    ├── index.css              # Reset mínimo
    ├── components/
    │   ├── Navbar.jsx         # Barra superior + botón/contador del carrito
    │   ├── Filtros.jsx        # Búsqueda y categoría (inputs controlados)
    │   ├── ProductList.jsx    # Grid de productos / mensaje sin resultados
    │   ├── ProductCard.jsx    # Tarjeta de un producto + botón condicional
    │   ├── Cart.jsx           # Panel del carrito
    │   ├── CartItem.jsx       # Fila del carrito (cantidad, subtotal, eliminar)
    │   └── CartTotal.jsx      # Total de productos y monto a pagar
    ├── utils/
    │   ├── precios.js         # formatearPrecio() y precioFinal()
    │   └── imagenes.js        # Resuelve la URL de cada imagen vía Vite
    └── assets/productos/      # Imágenes de los productos
```

## Cómo ejecutarlo

Requisitos: Node.js 20.19 o superior (o 22.12+), exigido por Vite 8.

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173/S8-React-Hooks-useEffect/)
npm run lint       # análisis estático (oxlint)
npm run build      # genera la carpeta dist/ para producción
npm run preview    # sirve el build localmente
```

## Despliegue en GitHub Pages

El sitio se publica desde la rama `gh-pages`:

```bash
npm run deploy     # ejecuta el build y publica dist/ en la rama gh-pages
```

`vite.config.js` define `base: '/S8-React-Hooks-useEffect/'`; si el repositorio cambia de nombre,
ese valor debe actualizarse. `products.json` se pide con `import.meta.env.BASE_URL`, por lo que la
ruta se ajusta sola a ese valor.

## Decisiones de diseño

- **JSON local en vez de una API externa:** la actividad permite ambas. Se eligió un archivo propio para no
  depender de terceros (disponibilidad, CORS) ni exponer una API key en un repositorio público.
- **Bandera `cancelado` en el efecto:** si el componente se desmonta mientras el `fetch` está en curso,
  no se intenta actualizar el estado (React StrictMode monta y desmonta los efectos en desarrollo).
- **Reintento mediante estado:** el botón "Reintentar" incrementa `intento`, que está en las dependencias del
  efecto, y así React vuelve a ejecutar la carga sin recargar la página.
- **Panel del carrito controlado por React** (heredado de la semana 7), usando Bootstrap solo para estilos.
- **Precio final centralizado** en `utils/precios.js` para no duplicar la regla oferta/normal.

## Validación realizada

- `npm run lint` (oxlint): 0 errores, 0 advertencias.
- `npm run build`: compila sin errores.
- HTML renderizado por React (catálogo y carrito con productos) validado con **vnu.jar** (Nu HTML Checker): 0 errores.
- 25 comprobaciones automatizadas con Playwright sobre el build de producción, con el mismo base path de GitHub Pages:
  estado de carga visible, 8 tarjetas tras el `fetch`, URL del JSON bajo el base path, cambio del botón a
  "En el carrito (n)", contador, carrito vacío, filtros, persistencia tras recargar, error HTTP 404 con
  **Reintentar**, JSON con formato inválido, ausencia de scroll horizontal a 390, 768 y 1440 px y ausencia de
  errores de consola inesperados.
