// Contacto.jsx
// Formulario de contacto con nombre, email y mensaje. Los tres campos son
// "inputs controlados": su valor vive en el estado (useState) y cada tecla
// lo actualiza. La validacion corre al enviar (funcion pura de
// utils/validaciones.js); una vez intentado el envio, los errores se
// recalculan en cada cambio, asi desaparecen apenas el usuario corrige.
// Como no hay servidor, el envio se simula mostrando un mensaje de exito.

import { useState } from "react";
import { validarContacto, MAX_MENSAJE } from "../utils/validaciones";

const VALORES_INICIALES = { nombre: "", email: "", mensaje: "" };

function Contacto() {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [intentoEnvio, setIntentoEnvio] = useState(false); // true tras pulsar "Enviar"
  const [remitente, setRemitente] = useState(null); // nombre de quien envio (mensaje de exito)

  // Valor derivado: solo se muestran errores despues del primer intento de envio
  const errores = intentoEnvio ? validarContacto(valores) : {};
  const hayErrores = Object.keys(errores).length > 0;

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setRemitente(null); // si vuelve a escribir, se oculta el mensaje de exito anterior
  }

  function manejarEnvio(evento) {
    evento.preventDefault(); // evita que el navegador recargue la pagina
    setIntentoEnvio(true);
    if (Object.keys(validarContacto(valores)).length > 0) return; // hay errores: no se envia

    setRemitente(valores.nombre.trim());
    setValores(VALORES_INICIALES);
    setIntentoEnvio(false);
  }

  // Atributos de accesibilidad y estilo Bootstrap comunes a cada campo
  function propsCampo(campo) {
    return {
      id: `contacto-${campo}`,
      name: campo,
      value: valores[campo],
      onChange: manejarCambio,
      className: `form-control ${errores[campo] ? "is-invalid" : ""}`,
      "aria-invalid": errores[campo] ? "true" : "false",
      "aria-describedby": errores[campo] ? `error-${campo}` : undefined,
    };
  }

  return (
    <section id="contacto" className="mt-5" aria-labelledby="titulo-contacto">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <h2 id="titulo-contacto" className="h3 mb-1">
            Contacto
          </h2>
          <p className="text-muted">
            ¿Dudas sobre un juego o tu pedido? Escríbele al administrador de la tienda.
          </p>

          {/* Renderizado condicional: mensaje de exito tras un envio valido */}
          {remitente && (
            <div className="alert alert-success" role="status">
              ¡Gracias, {remitente}! Tu mensaje fue enviado. Te responderemos pronto.
            </div>
          )}

          {/* Renderizado condicional: aviso general si el formulario tiene errores */}
          {hayErrores && (
            <div className="alert alert-danger" role="alert">
              Revisa los campos marcados en rojo antes de enviar.
            </div>
          )}

          {/* noValidate: la validacion la hace React, no el navegador */}
          <form onSubmit={manejarEnvio} noValidate className="card card-body shadow-sm">
            <div className="mb-3">
              <label htmlFor="contacto-nombre" className="form-label">
                Nombre
              </label>
              <input type="text" autoComplete="name" {...propsCampo("nombre")} />
              {errores.nombre && (
                <div id="error-nombre" className="invalid-feedback">
                  {errores.nombre}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="contacto-email" className="form-label">
                Correo electrónico
              </label>
              <input type="email" autoComplete="email" {...propsCampo("email")} />
              {errores.email && (
                <div id="error-email" className="invalid-feedback">
                  {errores.email}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="contacto-mensaje" className="form-label">
                Mensaje
              </label>
              <textarea rows={4} maxLength={MAX_MENSAJE} {...propsCampo("mensaje")} />
              {errores.mensaje && (
                <div id="error-mensaje" className="invalid-feedback">
                  {errores.mensaje}
                </div>
              )}
              <div className="form-text text-end">
                {valores.mensaje.length}/{MAX_MENSAJE}
              </div>
            </div>

            <button type="submit" className="btn btn-primary align-self-start">
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contacto;
