// Navbar.jsx
// Barra de navegacion superior. Muestra el nombre de la tienda y un boton
// para abrir el carrito, con un contador que refleja la cantidad total
// de productos agregados (prop recibida desde App).

function Navbar({ cantidadCarrito, onAbrirCarrito }) {
  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <span className="navbar-brand fw-bold">
          TechNova <span className="text-warning">Store</span>
        </span>

        <button
          type="button"
          className="btn btn-outline-light position-relative"
          onClick={onAbrirCarrito}
        >
          Carrito
          {/* Renderizado condicional: el badge solo aparece si hay productos */}
          {cantidadCarrito > 0 && (
            <span className="badge rounded-pill bg-warning text-dark ms-2">
              {cantidadCarrito}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
