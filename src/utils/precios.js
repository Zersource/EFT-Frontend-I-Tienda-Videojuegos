// precios.js
// Funciones puras reutilizables para el manejo de precios. Se usan en
// ProductCard, CartItem, Cart y App, evitando duplicar logica.

// Formatea un numero como pesos chilenos (ej: $199.990)
export function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

// Precio efectivo de un producto: la oferta si existe, si no el normal
export function precioFinal(producto) {
  return producto.precioOferta ?? producto.precioNormal;
}
