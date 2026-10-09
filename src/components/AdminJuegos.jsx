// AdminJuegos.jsx
// Formulario para agregar un videojuego al catalogo. Solo se muestra en
// "modo administrador" (App decide con renderizado condicional). Maneja sus
// propios campos con useState y, si la validacion pasa, avisa a App mediante
// la prop onAgregar: App es quien modifica la lista de juegos (estado elevado).

import { useState } from "react";
import { validarJuego } from "../utils/validaciones";

const VALORES_INICIALES = {
  nombre: "",
  estudio: "",
  categoria: "",
  precioNormal: "",
  precioOferta: "",
  descripcion: "",
};

function AdminJuegos({ categorias, nombresExistentes, onAgregar }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [agregado, setAgregado] = useState(null); // titulo del ultimo juego agregado

  const errores = intentoEnvio ? validarJuego(valores, nombresExistentes) : {};

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setAgregado(null);
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    setIntentoEnvio(true);
    if (Object.keys(validarJuego(valores, nombresExistentes)).length > 0) return;

    onAgregar({
      nombre: valores.nombre.trim(),
      estudio: valores.estudio.trim(),
      categoria: valores.categoria.trim(),
      precioNormal: Number(valores.precioNormal),
      precioOferta: valores.precioOferta.trim() === "" ? null : Number(valores.precioOferta),
      descripcion: valores.descripcion.trim(),
      imagen: "sin-portada.png", // imagen por defecto para juegos nuevos
    });
    setAgregado(valores.nombre.trim());
    setValores(VALORES_INICIALES);
    setIntentoEnvio(false);
  }

  function propsCampo(campo) {
    return {
      id: `admin-${campo}`,
      name: campo,
      value: valores[campo],
      onChange: manejarCambio,
      className: `form-control ${errores[campo] ? "is-invalid" : ""}`,
      "aria-invalid": errores[campo] ? "true" : "false",
      "aria-describedby": errores[campo] ? `admin-error-${campo}` : undefined,
    };
  }

  // Mensaje de error de un campo (Bootstrap lo muestra junto al input .is-invalid)
  function error(campo) {
    return (
      errores[campo] && (
        <div id={`admin-error-${campo}`} className="invalid-feedback">
          {errores[campo]}
        </div>
      )
    );
  }

  return (
    <form
      onSubmit={manejarEnvio}
      noValidate
      className="card card-body shadow-sm mb-4"
      aria-label="Agregar videojuego al catálogo"
    >
      <h3 className="h5 mb-3">Agregar videojuego</h3>

      {agregado && (
        <div className="alert alert-success py-2" role="status">
          «{agregado}» se agregó al catálogo.
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="admin-nombre" className="form-label">Título</label>
          <input type="text" {...propsCampo("nombre")} />
          {error("nombre")}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="admin-estudio" className="form-label">Estudio</label>
          <input type="text" {...propsCampo("estudio")} />
          {error("estudio")}
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="admin-categoria" className="form-label">Categoría</label>
          {/* datalist: sugiere las categorias existentes pero permite escribir una nueva */}
          <input type="text" list="lista-categorias" {...propsCampo("categoria")} />
          <datalist id="lista-categorias">
            {categorias.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {error("categoria")}
        </div>
        <div className="col-6 col-md-4">
          <label htmlFor="admin-precioNormal" className="form-label">Precio normal (CLP)</label>
          <input type="number" min="1" step="1" inputMode="numeric" {...propsCampo("precioNormal")} />
          {error("precioNormal")}
        </div>
        <div className="col-6 col-md-4">
          <label htmlFor="admin-precioOferta" className="form-label">Oferta (opcional)</label>
          <input type="number" min="1" step="1" inputMode="numeric" {...propsCampo("precioOferta")} />
          {error("precioOferta")}
        </div>
        <div className="col-12">
          <label htmlFor="admin-descripcion" className="form-label">Descripción</label>
          <textarea rows={2} {...propsCampo("descripcion")} />
          {error("descripcion")}
        </div>
      </div>

      <button type="submit" className="btn btn-primary align-self-start mt-3">
        Agregar al catálogo
      </button>
    </form>
  );
}

export default AdminJuegos;
