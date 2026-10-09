// Cart.jsx
// Panel del carrito de compras. Solo se monta cuando App lo decide
// (renderizado condicional controlado por estado de React, sin depender
// del JS de Bootstrap). Usa useEffect para cerrar con la tecla Escape y
// bloquear el scroll de fondo mientras esta abierto.

import { useEffect } from "react";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";

function Cart({
  items,
  cantidadTotal,
  total,
  onAumentar,
  onDisminuir,
  onEliminar,
  onVaciar,
  onCerrar,
}) {
  useEffect(() => {
    function manejarTecla(e) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", manejarTecla);
    document.body.style.overflow = "hidden";

    // Limpieza: se ejecuta al desmontar el carrito
    return () => {
      document.removeEventListener("keydown", manejarTecla);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  return (
    <div className="carrito-overlay" onClick={onCerrar}>
      <div
        className="carrito-panel shadow"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h2 className="h5 mb-0">Tu carrito</h2>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar carrito"
            onClick={onCerrar}
          ></button>
        </div>

        <div className="carrito-contenido p-3">
          {/* Renderizado condicional: carrito vacio vs con productos */}
          {items.length === 0 ? (
            <p className="text-muted text-center mb-0">
              Tu carrito esta vacio. Agrega productos desde el catalogo.
            </p>
          ) : (
            <ul className="list-group list-group-flush">
              {items.map((item) => (
                <CartItem
                  key={item.producto.id}
                  item={item}
                  onAumentar={onAumentar}
                  onDisminuir={onDisminuir}
                  onEliminar={onEliminar}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-3 border-top">
            <CartTotal cantidadTotal={cantidadTotal} total={total} />
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={onVaciar}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
