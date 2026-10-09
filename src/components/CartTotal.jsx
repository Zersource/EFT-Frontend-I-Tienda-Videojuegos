// CartTotal.jsx
// Resumen numerico del carrito: total de unidades y monto a pagar.
// Componente de presentacion puro: solo recibe datos por props.

import { formatearPrecio } from "../utils/precios";

function CartTotal({ cantidadTotal, total }) {
  return (
    <>
      <div className="d-flex justify-content-between small text-muted mb-1">
        <span>Total de videojuegos</span>
        <span>{cantidadTotal}</span>
      </div>
      <div className="d-flex justify-content-between fw-bold mb-3">
        <span>Total a pagar</span>
        <span>{formatearPrecio(total)}</span>
      </div>
    </>
  );
}

export default CartTotal;
