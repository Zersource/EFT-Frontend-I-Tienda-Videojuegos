// validaciones.js
// Funciones puras de validacion de formularios. Reciben los valores y
// devuelven un objeto { campo: "mensaje de error" }. Si el objeto esta vacio,
// el formulario es valido. Al ser puras (sin estado ni DOM) se pueden
// reutilizar y probar de forma aislada.

import { normalizar } from "./texto";

const REGEX_NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MAX_MENSAJE = 500;

// Formulario de contacto: nombre, email y mensaje
export function validarContacto({ nombre, email, mensaje }) {
  const errores = {};

  const n = nombre.trim();
  if (n === "") errores.nombre = "Ingresa tu nombre.";
  else if (n.length < 3) errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  else if (!REGEX_NOMBRE.test(n)) errores.nombre = "El nombre solo puede contener letras y espacios.";

  const e = email.trim();
  if (e === "") errores.email = "Ingresa tu correo electrónico.";
  else if (!REGEX_EMAIL.test(e)) errores.email = "Ingresa un correo válido, por ejemplo nombre@dominio.cl.";

  const m = mensaje.trim();
  if (m === "") errores.mensaje = "Escribe tu mensaje.";
  else if (m.length < 10) errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  else if (m.length > MAX_MENSAJE) errores.mensaje = `El mensaje no puede superar los ${MAX_MENSAJE} caracteres.`;

  return errores;
}

// Formulario para agregar un videojuego al catalogo (modo administrador).
// "nombresExistentes" evita titulos repetidos. Los precios llegan como texto
// (value de un input) y se validan como enteros positivos.
export function validarJuego(
  { nombre, estudio, categoria, precioNormal, precioOferta, descripcion },
  nombresExistentes
) {
  const errores = {};

  const n = nombre.trim();
  if (n === "") errores.nombre = "Ingresa el título del juego.";
  else if (n.length < 2) errores.nombre = "El título debe tener al menos 2 caracteres.";
  else if (nombresExistentes.some((existente) => normalizar(existente) === normalizar(n)))
    errores.nombre = "Ya existe un juego con ese título.";

  if (estudio.trim() === "") errores.estudio = "Ingresa el estudio desarrollador.";
  if (categoria.trim() === "") errores.categoria = "Ingresa o elige una categoría.";

  const normal = Number(precioNormal);
  if (precioNormal.trim() === "" || !Number.isInteger(normal) || normal <= 0)
    errores.precioNormal = "Ingresa un precio entero mayor a 0.";

  // El precio de oferta es opcional, pero si se ingresa debe ser menor al normal
  if (precioOferta.trim() !== "") {
    const oferta = Number(precioOferta);
    if (!Number.isInteger(oferta) || oferta <= 0)
      errores.precioOferta = "La oferta debe ser un entero mayor a 0.";
    else if (!errores.precioNormal && oferta >= normal)
      errores.precioOferta = "La oferta debe ser menor al precio normal.";
  }

  const d = descripcion.trim();
  if (d === "") errores.descripcion = "Ingresa una descripción.";
  else if (d.length < 10) errores.descripcion = "La descripción debe tener al menos 10 caracteres.";

  return errores;
}
