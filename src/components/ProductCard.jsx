// ProductCard.jsx
// Componente funcional que representa un unico producto del catalogo.
// Recibe el producto, cuantas unidades hay en el carrito y la funcion
// onAgregar como props. Con renderizado condicional decide:
//  - si muestra precio de oferta o precio normal
//  - si el boton dice "Agregar al carrito" o "En el carrito"

import { resolverImagen } from "../utils/imagenes";
import { formatearPrecio } from "../utils/precios";

function ProductCard({ producto, cantidadEnCarrito, onAgregar }) {
  const tieneOferta = producto.precioOferta !== null;
  const enCarrito = cantidadEnCarrito > 0;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm producto-card">
        <img
          src={resolverImagen(producto.imagen)}
          className="card-img-top"
          alt={producto.nombre}
        />
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary align-self-start mb-2">
            {producto.marca}
          </span>
          <h2 className="card-title h6">{producto.nombre}</h2>
          <p className="card-text text-muted small flex-grow-1">
            {producto.descripcion}
          </p>

          {/* Renderizado condicional del precio: oferta vs normal */}
          <div className="mb-2">
            {tieneOferta ? (
              <>
                <span className="text-decoration-line-through text-muted me-2">
                  {formatearPrecio(producto.precioNormal)}
                </span>
                <span className="fw-bold text-danger">
                  {formatearPrecio(producto.precioOferta)}
                </span>
              </>
            ) : (
              <span className="fw-bold">
                {formatearPrecio(producto.precioNormal)}
              </span>
            )}
          </div>

          {/* Renderizado condicional del boton: cambia texto y estilo si el
              producto ya esta en el carrito (un nuevo clic suma otra unidad) */}
          <button
            type="button"
            className={`btn mt-auto ${enCarrito ? "btn-success" : "btn-primary"}`}
            onClick={() => onAgregar(producto)}
          >
            {enCarrito
              ? `En el carrito (${cantidadEnCarrito})`
              : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
