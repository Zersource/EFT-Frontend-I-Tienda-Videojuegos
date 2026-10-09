// Navbar.jsx
// Encabezado del sitio: <header> semantico con la barra de navegacion de
// Bootstrap 5. Tiene enlaces a las secciones (Inicio, Catalogo, Contacto) y
// el boton del carrito con un contador (prop recibida desde App).
// El menu desplegable en pantallas chicas se controla con useState en vez
// del JavaScript de Bootstrap, para que React sea el unico que modifica el DOM.

import { useState } from "react";

function Navbar({ cantidadCarrito, onAbrirCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="sticky-top">
      <nav
        className="navbar navbar-expand-md navbar-dark bg-dark shadow-sm"
        aria-label="Navegación principal"
      >
        <div className="container">
          <a className="navbar-brand fw-bold" href="#inicio" onClick={cerrarMenu}>
            Super<span className="text-warning">juegos</span>
          </a>

          {/* Carrito y boton hamburguesa: siempre visibles, incluso con el menu cerrado */}
          <div className="d-flex align-items-center gap-2 order-md-3">
            <button
              type="button"
              className="btn btn-outline-light position-relative"
              onClick={onAbrirCarrito}
            >
              Carrito
              {/* Renderizado condicional: el badge solo aparece si hay juegos */}
              {cantidadCarrito > 0 && (
                <span className="badge rounded-pill bg-warning text-dark ms-2">
                  {cantidadCarrito}
                </span>
              )}
            </button>
            <button
              type="button"
              className="navbar-toggler"
              aria-controls="menu-principal"
              aria-expanded={menuAbierto}
              aria-label="Mostrar u ocultar el menú"
              onClick={() => setMenuAbierto((abierto) => !abierto)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* La clase "show" depende del estado: menu abierto o cerrado */}
          <div
            id="menu-principal"
            className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}
          >
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className="nav-link" href="#inicio" onClick={cerrarMenu}>
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#catalogo" onClick={cerrarMenu}>
                  Catálogo
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contacto" onClick={cerrarMenu}>
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
