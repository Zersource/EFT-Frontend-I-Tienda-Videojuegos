// ProductList.jsx
// Recibe el arreglo de productos y arma el grid, delegando cada tarjeta
// individual al componente ProductCard (reutilizacion de componentes).
// Si no hay productos (filtros sin coincidencias) muestra un mensaje.

import ProductCard from "./ProductCard";

function ProductList({ productos, cantidadPorProducto, onAgregar }) {
  if (productos.length === 0) {
    return (
      <div className="alert alert-warning" role="status">
        No se encontraron videojuegos con los filtros aplicados.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          cantidadEnCarrito={cantidadPorProducto[producto.id] ?? 0}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  );
}

export default ProductList;
