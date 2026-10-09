// imagenes.js
// El catalogo (products.json) guarda solo el nombre de archivo de cada
// imagen (ej: "bose-qc.png"). Como Vite necesita resolver los assets como
// modulos para que funcionen tanto en desarrollo como en el build de
// produccion, este helper construye un mapa nombreArchivo -> URL final
// usando import.meta.glob sobre la carpeta de imagenes de productos.

const modulos = import.meta.glob("../assets/productos/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const mapaImagenes = {};
for (const ruta in modulos) {
  const nombreArchivo = ruta.split("/").pop();
  mapaImagenes[nombreArchivo] = modulos[ruta];
}

export function resolverImagen(nombreArchivo) {
  return mapaImagenes[nombreArchivo] ?? "";
}
