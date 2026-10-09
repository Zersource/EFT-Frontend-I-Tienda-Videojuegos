// validaciones.js
// Funciones puras de validacion de formularios. Reciben los valores y
// devuelven un objeto { campo: "mensaje de error" }. Si el objeto esta vacio,
// el formulario es valido. Al ser puras (sin estado ni DOM) se pueden
// reutilizar y probar de forma aislada.

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
