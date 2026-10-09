// texto.js
// Utilidades de texto reutilizables.

// Normaliza un texto para compararlo sin que importen mayusculas ni tildes:
// "NFD" separa cada letra de su tilde (o de la diéresis o la eñe) y luego se
// eliminan esas marcas. Asi, "accion" encuentra "Acción" y "pacifico"
// encuentra "Pacífico".
export function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
