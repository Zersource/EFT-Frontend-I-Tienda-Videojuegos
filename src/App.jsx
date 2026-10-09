// App.jsx
// Componente raiz. Concentra el estado de la aplicacion (catalogo, carrito,
// visibilidad del panel y filtros) y lo distribuye a los componentes
// hijos mediante props, junto con las funciones que lo modifican.
// El catalogo se carga desde public/juegos.json con useEffect + fetch.

import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Filtros from "./components/Filtros";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Contacto from "./components/Contacto";
import AdminJuegos from "./components/AdminJuegos";
import { precioFinal } from "./utils/precios";
import { normalizar } from "./utils/texto";
import "./App.css";

const CLAVE_CARRITO = "superjuegos-carrito-eft";

// juegos.json vive en public/. BASE_URL incluye la ruta del repositorio
// en GitHub Pages, asi la URL funciona tanto en local como en produccion.
const URL_PRODUCTOS = `${import.meta.env.BASE_URL}juegos.json`;

// Lee el carrito guardado (si existe y es valido). Se usa como
// inicializador perezoso de useState, asi solo corre una vez.
function cargarCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    const datos = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function App() {
  // ---- Estado ----
  const [productos, setProductos] = useState([]); // catalogo (llega por fetch)
  const [cargando, setCargando] = useState(true); // true mientras se piden los datos
  const [errorCarga, setErrorCarga] = useState(null); // mensaje si la carga falla
  const [intento, setIntento] = useState(0); // cambia al pulsar "Reintentar"
  const [carrito, setCarrito] = useState(cargarCarritoGuardado); // [{ producto, cantidad }]
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [modoAdmin, setModoAdmin] = useState(false); // muestra el alta y la baja de juegos

  // ---- Efecto: cargar el catalogo desde el JSON ----
  // Se ejecuta al montar App (y de nuevo si cambia "intento"). Al terminar,
  // actualiza el estado con los datos y React vuelve a renderizar la lista.
  // AbortController cancela de verdad la peticion HTTP si el efecto se limpia
  // (por ejemplo, React StrictMode en desarrollo o un "Reintentar" rapido).
  useEffect(() => {
    const controlador = new AbortController();

    async function cargarProductos() {
      try {
        const respuesta = await fetch(URL_PRODUCTOS, { signal: controlador.signal });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        if (!Array.isArray(datos)) throw new Error("Formato de datos invalido");
        setProductos(datos);
      } catch (err) {
        // Una peticion cancelada a proposito no es un error para el usuario
        if (err.name === "AbortError") return;
        setErrorCarga(err.message);
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    cargarProductos();
    return () => controlador.abort(); // limpieza: cancela la peticion en curso
  }, [intento]);

  // ---- Efecto: persistir el carrito cada vez que cambia ----
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch {
      // Si el navegador bloquea el almacenamiento, la app sigue funcionando
    }
  }, [carrito]);

  // ---- Acciones sobre el carrito ----
  function agregarAlCarrito(producto) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id);
      if (existente) {
        // Ya esta en el carrito: solo se incrementa la cantidad
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
    setCarritoAbierto(true);
  }

  function aumentarCantidad(idProducto) {
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto.id === idProducto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }

  function disminuirCantidad(idProducto) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto.id === idProducto
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0) // al llegar a 0 se elimina
    );
  }

  function eliminarDelCarrito(idProducto) {
    setCarrito((prev) =>
      prev.filter((item) => item.producto.id !== idProducto)
    );
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  // ---- Acciones sobre el catalogo (modo administrador) ----
  // Agrega un juego al estado. El id nuevo es el mayor existente + 1. Despues
  // se limpian los filtros para que el juego recien agregado sea visible.
  function agregarJuego(juego) {
    setProductos((prev) => {
      const nuevoId = Math.max(0, ...prev.map((p) => p.id)) + 1;
      return [...prev, { ...juego, id: nuevoId }];
    });
    setBusqueda("");
    setCategoria("Todos");
  }

  // Elimina un juego del catalogo. Tambien se saca del carrito (ya no se vende)
  // y, si era el ultimo de su categoria, se vuelve al filtro "Todos".
  function eliminarJuego(idJuego) {
    const eliminado = productos.find((p) => p.id === idJuego);
    const quedanEnCategoria = productos.some(
      (p) => p.id !== idJuego && p.categoria === eliminado?.categoria
    );
    setProductos((prev) => prev.filter((p) => p.id !== idJuego));
    setCarrito((prev) => prev.filter((item) => item.producto.id !== idJuego));
    if (!quedanEnCategoria && categoria === eliminado?.categoria) setCategoria("Todos");
  }

  // Vuelve a pedir el catalogo despues de un error
  function reintentarCarga() {
    setErrorCarga(null);
    setCargando(true);
    setIntento((n) => n + 1);
  }

  // useCallback mantiene estable la referencia para el useEffect de Cart
  const cerrarCarrito = useCallback(() => setCarritoAbierto(false), []);

  // ---- Valores derivados del estado ----
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalCarrito = carrito.reduce(
    (acc, item) => acc + precioFinal(item.producto) * item.cantidad,
    0
  );

  // Mapa id -> cantidad en el carrito, para que cada tarjeta sepa si su
  // producto ya fue agregado (boton "En el carrito")
  const cantidadPorProducto = Object.fromEntries(
    carrito.map((item) => [item.producto.id, item.cantidad])
  );

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  // La busqueda ignora mayusculas y tildes (utils/texto.js)
  const texto = normalizar(busqueda);
  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = categoria === "Todos" || p.categoria === categoria;
    const coincideTexto =
      texto === "" ||
      [p.nombre, p.estudio, p.descripcion].some((campo) =>
        normalizar(campo).includes(texto)
      );
    return coincideCategoria && coincideTexto;
  });

  return (
    <>
      <Navbar
        cantidadCarrito={cantidadTotal}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <main className="container py-4">
        {/* Seccion de bienvenida: destino del enlace "Inicio" del navbar */}
        <section id="inicio" className="hero rounded-4 text-white p-4 p-md-5 mb-5">
          <h1 className="display-5 fw-bold">Los mejores videojuegos, al mejor precio</h1>
          <p className="lead mb-4">
            Aventura, acción, estrategia y carreras. Elige tu próximo juego y
            súmalo al carrito.
          </p>
          <a href="#catalogo" className="btn btn-warning btn-lg">
            Ver catálogo
          </a>
        </section>

        {/* Catalogo: destino del enlace "Catalogo" del navbar */}
        <section id="catalogo" aria-labelledby="titulo-catalogo">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 id="titulo-catalogo" className="h3 mb-0">
              Catálogo de videojuegos
            </h2>
            {/* Interruptor de modo administrador: activa alta y baja de juegos */}
            <div className="form-check form-switch mb-0">
              <input
                id="modo-admin"
                type="checkbox"
                role="switch"
                className="form-check-input"
                checked={modoAdmin}
                onChange={(e) => setModoAdmin(e.target.checked)}
              />
              <label htmlFor="modo-admin" className="form-check-label">
                Modo administrador
              </label>
            </div>
          </div>

          {/* Renderizado condicional segun el estado de la carga:
              cargando -> spinner, error -> mensaje con reintento, ok -> catalogo */}
          {cargando ? (
            <div className="text-center py-5" role="status">
              <div className="spinner-border text-primary" aria-hidden="true"></div>
              <p className="mt-3 mb-0 text-muted">Cargando videojuegos...</p>
            </div>
          ) : errorCarga ? (
            <div className="alert alert-danger" role="alert">
              <p className="mb-2">
                No se pudo cargar el catálogo de videojuegos ({errorCarga}).
              </p>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={reintentarCarga}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Renderizado condicional: el formulario de alta solo en modo administrador */}
              {modoAdmin && (
                <AdminJuegos
                  categorias={categorias}
                  nombresExistentes={productos.map((p) => p.nombre)}
                  onAgregar={agregarJuego}
                />
              )}
              <Filtros
                busqueda={busqueda}
                categoria={categoria}
                categorias={categorias}
                onBuscar={setBusqueda}
                onCategoria={setCategoria}
              />
              <ProductList
                productos={productosFiltrados}
                cantidadPorProducto={cantidadPorProducto}
                onAgregar={agregarAlCarrito}
                modoAdmin={modoAdmin}
                onEliminar={eliminarJuego}
              />
            </>
          )}
        </section>

        {/* Formulario de contacto: destino del enlace "Contacto" del navbar */}
        <Contacto />
      </main>

      <footer className="container py-3 text-center text-muted small border-top">
        Superjuegos &middot; Evaluación Final Transversal &middot; React + Vite
      </footer>

      {/* El panel del carrito solo se monta cuando carritoAbierto es true */}
      {carritoAbierto && (
        <Cart
          items={carrito}
          cantidadTotal={cantidadTotal}
          total={totalCarrito}
          onAumentar={aumentarCantidad}
          onDisminuir={disminuirCantidad}
          onEliminar={eliminarDelCarrito}
          onVaciar={vaciarCarrito}
          onCerrar={cerrarCarrito}
        />
      )}
    </>
  );
}

export default App;
