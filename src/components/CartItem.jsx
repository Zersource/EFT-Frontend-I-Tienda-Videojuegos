// CartItem.jsx
// Fila del carrito: producto agrupado con su cantidad y subtotal.
// Permite aumentar, disminuir la cantidad o eliminarlo por completo.

import { resolverImagen } from "../utils/imagenes";
import { formatearPrecio, precioFinal } from "../utils/precios";

function CartItem({ item, onAumentar, onDisminuir, onEliminar }) {
  const { producto, cantidad } = item;
  const precioUnitario = precioFinal(producto);
  const subtotal = precioUnitario * cantidad;

  return (
    <li className="list-group-item">
      <div className="d-flex align-items-center gap-2">
        <img
          src={resolverImagen(producto.imagen)}
          alt={producto.nombre}
          className="cart-item-img"
        />
        <div className="flex-grow-1">
          <div className="fw-semibold small">{producto.nombre}</div>
          <div className="text-muted small">
            {formatearPrecio(precioUnitario)} c/u
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onEliminar(producto.id)}
          aria-label={`Eliminar ${producto.nombre} del carrito`}
        >
          &times;
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <div className="btn-group btn-group-sm" role="group" aria-label="Cantidad">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onDisminuir(producto.id)}
            aria-label={`Quitar una unidad de ${producto.nombre}`}
          >
            &minus;
          </button>
          <span className="btn btn-outline-secondary disabled cantidad-valor">
            {cantidad}
          </span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onAumentar(producto.id)}
            aria-label={`Agregar una unidad de ${producto.nombre}`}
          >
            +
          </button>
        </div>
        <div className="fw-bold small">{formatearPrecio(subtotal)}</div>
      </div>
    </li>
  );
}

export default CartItem;
