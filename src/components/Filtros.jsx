// Filtros.jsx
// Barra de busqueda y filtro por categoria. Ambos son "inputs controlados":
// su valor vive en el estado de App y cada cambio dispara onChange.

function Filtros({ busqueda, categoria, categorias, onBuscar, onCategoria }) {
  return (
    <div className="row g-2 mb-4">
      <div className="col-12 col-md-8">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar por nombre, marca o descripcion..."
          aria-label="Buscar productos"
          value={busqueda}
          onChange={(e) => onBuscar(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-4">
        <select
          className="form-select"
          aria-label="Filtrar por categoria"
          value={categoria}
          onChange={(e) => onCategoria(e.target.value)}
        >
          <option value="Todos">Todas las categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filtros;
