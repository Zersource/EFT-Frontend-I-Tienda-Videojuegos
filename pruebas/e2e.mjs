// pruebas/e2e.mjs
// Pruebas de extremo a extremo con Playwright sobre el build de produccion
// (npm run build + npm run preview), usando la misma ruta base que GitHub Pages.
//
// Uso:  npm run build && npm run preview   (en otra terminal)
//       npm run test:e2e
// Variables opcionales: URL_BASE (por defecto http://localhost:4173/EFT-Frontend-I-Tienda-Videojuegos/)
//                       CHROME_PATH (ruta a un Chrome/Chromium; si falta, se usa el Chrome instalado)
//                       BOOTSTRAP_CSS (ruta a bootstrap.min.css; si se define, se sirve ese archivo en
//                       lugar del CDN, util sin internet. Con internet no hace falta.)

import { chromium } from "playwright-core";
import fs from "node:fs";

const URL_BASE =
  process.env.URL_BASE ?? "http://localhost:4173/EFT-Frontend-I-Tienda-Videojuegos/";
const opciones = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : { channel: "chrome" };

let pasadas = 0;
const fallas = [];
function comprobar(nombre, condicion, detalle = "") {
  if (condicion) {
    pasadas++;
    console.log(`  OK   ${nombre}`);
  } else {
    fallas.push(nombre);
    console.log(`  FALLA ${nombre} ${detalle}`);
  }
}

const navegador = await chromium.launch(opciones);
const erroresConsola = [];

// esperarErrores: true en las pruebas que provocan un error a proposito (404, JSON invalido)
async function nuevaPagina(ancho = 1280, alto = 900, esperarErrores = false) {
  const contexto = await navegador.newContext({ viewport: { width: ancho, height: alto } });
  const pagina = await contexto.newPage();
  if (process.env.BOOTSTRAP_CSS) {
    await pagina.route("**/bootstrap.min.css", (r) =>
      r.fulfill({ contentType: "text/css", body: fs.readFileSync(process.env.BOOTSTRAP_CSS) })
    );
  }
  pagina.on("pageerror", (e) => erroresConsola.push(String(e)));
  if (!esperarErrores) {
    pagina.on("console", (m) => m.type() === "error" && erroresConsola.push(m.text()));
  }
  return pagina;
}
const tarjetas = (p) => p.locator("article.producto-card");

// ---------------------------------------------------------------- Catalogo
console.log("Catalogo y carga con fetch");
{
  const p = await nuevaPagina();
  const peticion = p.waitForResponse((r) => r.url().endsWith("/juegos.json"));
  await p.goto(URL_BASE);
  const resp = await peticion;
  comprobar("fetch a juegos.json bajo el base path responde 200", resp.status() === 200);
  await tarjetas(p).first().waitFor();
  comprobar("se renderizan 10 tarjetas", (await tarjetas(p).count()) === 10);
  comprobar("titulo de la pagina", (await p.title()).includes("Superjuegos"));
  comprobar("estructura semantica: header, nav, main, footer",
    (await p.locator("header nav, main, footer").count()) >= 3 &&
    (await p.locator("body > #root > header").count()) === 1 &&
    (await p.locator("main").count()) === 1);
  comprobar("las tarjetas muestran imagen, nombre, precio y descripcion",
    (await tarjetas(p).first().locator("img").getAttribute("src")).includes("eco-del-abismo") &&
    (await tarjetas(p).first().locator("h3").innerText()) === "Eco del Abismo" &&
    (await tarjetas(p).first().innerText()).includes("$22.990"));

  // Filtro por categoria
  await p.selectOption('select[aria-label="Filtrar por categoría"]', "Acción");
  comprobar("filtro Accion: 3 tarjetas", (await tarjetas(p).count()) === 3);
  await p.selectOption('select[aria-label="Filtrar por categoría"]', "Todos");
  comprobar("filtro Todos: 10 tarjetas", (await tarjetas(p).count()) === 10);

  // Busqueda sin tildes
  const buscar = p.locator('input[aria-label="Buscar videojuegos"]');
  await buscar.fill("pacifico");
  comprobar("buscar 'pacifico' encuentra Drift Pacifico",
    (await tarjetas(p).count()) === 1 && (await tarjetas(p).first().innerText()).includes("Drift Pacífico"));
  await buscar.fill("luciernaga");
  comprobar("buscar 'luciernaga' encuentra por estudio", (await tarjetas(p).count()) === 1);
  await buscar.fill("zzzz");
  comprobar("sin coincidencias muestra mensaje", await p.getByText("No se encontraron videojuegos").isVisible());
  await p.close();
}

// ----------------------------------------------------------------- Carrito
console.log("Carrito");
{
  const p = await nuevaPagina();
  await p.goto(URL_BASE);
  await tarjetas(p).first().waitFor();
  const boton = tarjetas(p).first().getByRole("button", { name: /carrito/i });
  await boton.click();
  comprobar("el boton cambia a 'En el carrito (1)'", (await boton.innerText()) === "En el carrito (1)");
  await p.getByRole("button", { name: /cerrar/i }).first().click().catch(() => {});
  await p.keyboard.press("Escape");
  await boton.click();
  comprobar("segundo clic suma otra unidad (2)", (await boton.innerText()) === "En el carrito (2)");
  comprobar("badge del navbar muestra 2", (await p.locator("nav .badge").innerText()) === "2");
  comprobar("total del carrito = 2 x $22.990", (await p.getByRole("dialog").innerText()).includes("45.980"));
  await p.reload();
  await tarjetas(p).first().waitFor();
  comprobar("el carrito persiste tras recargar", (await p.locator("nav .badge").innerText()) === "2");
  await p.getByRole("button", { name: /^Carrito/ }).click();
  await p.getByRole("button", { name: /vaciar/i }).click();
  comprobar("vaciar deja el carrito vacio", await p.getByText("Tu carrito está vacío").isVisible());
  await p.close();
}

// ---------------------------------------------------------------- Contacto
console.log("Formulario de contacto");
{
  const p = await nuevaPagina();
  await p.goto(URL_BASE);
  await tarjetas(p).first().waitFor();
  const enviar = p.getByRole("button", { name: "Enviar mensaje" });
  await enviar.click();
  comprobar("vacio: 3 errores de campo", (await p.locator("#contacto .invalid-feedback").count()) === 3);
  comprobar("vacio: aviso general visible", await p.getByText("Revisa los campos marcados").isVisible());
  await p.fill("#contacto-nombre", "Se");
  await p.fill("#contacto-email", "correo-malo");
  await p.fill("#contacto-mensaje", "corto");
  comprobar("errores de nombre corto, email invalido y mensaje corto",
    (await p.locator("#error-nombre").innerText()).includes("3 caracteres") &&
    (await p.locator("#error-email").innerText()).includes("correo válido") &&
    (await p.locator("#error-mensaje").innerText()).includes("10 caracteres"));
  await p.fill("#contacto-nombre", "Sergio Mascareño");
  await p.fill("#contacto-email", "sergio@correo.cl");
  await p.fill("#contacto-mensaje", "Hola, quiero consultar por Neon Vanguard.");
  comprobar("al corregir desaparecen los errores", (await p.locator("#contacto .invalid-feedback").count()) === 0);
  await enviar.click();
  comprobar("envio valido muestra mensaje de exito", await p.getByText("¡Gracias, Sergio Mascareño!").isVisible());
  comprobar("el formulario se limpia", (await p.inputValue("#contacto-nombre")) === "");
  await p.close();
}

// ------------------------------------------------------------------ Navbar
console.log("Navegacion");
{
  const p = await nuevaPagina();
  await p.goto(URL_BASE);
  await tarjetas(p).first().waitFor();
  const hrefs = await p.locator("#menu-principal a").evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  comprobar("enlaces Inicio, Catalogo y Contacto", JSON.stringify(hrefs) === '["#inicio","#catalogo","#contacto"]');
  await p.locator('#menu-principal a[href="#contacto"]').click();
  await p.waitForTimeout(900);
  const visible = await p.locator("#contacto").evaluate((e) => {
    const r = e.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  });
  comprobar("el enlace Contacto lleva a la seccion", visible);
  await p.close();

  const m = await nuevaPagina(390, 800);
  await m.goto(URL_BASE);
  await tarjetas(m).first().waitFor();
  comprobar("movil: menu cerrado al inicio", !(await m.locator("#menu-principal").isVisible()));
  await m.getByRole("button", { name: /Mostrar u ocultar/ }).click();
  comprobar("movil: la hamburguesa abre el menu", await m.locator("#menu-principal").isVisible());
  await m.close();
}

// ------------------------------------------------------------- Modo admin
console.log("Agregar y eliminar videojuegos (state)");
{
  const p = await nuevaPagina();
  await p.goto(URL_BASE);
  await tarjetas(p).first().waitFor();
  comprobar("sin modo admin no hay formulario ni botones Eliminar",
    (await p.getByRole("form", { name: /Agregar videojuego/ }).count()) === 0 &&
    (await p.getByRole("button", { name: /Eliminar/ }).count()) === 0);
  await p.getByLabel("Modo administrador").check();
  const alta = p.getByRole("form", { name: /Agregar videojuego/ });
  comprobar("modo admin muestra el formulario y 10 botones Eliminar",
    (await alta.isVisible()) && (await p.getByRole("button", { name: /Eliminar .* del catálogo/ }).count()) === 10);

  await alta.getByRole("button", { name: "Agregar al catálogo" }).click();
  comprobar("alta vacia: errores de validacion", (await alta.locator(".invalid-feedback").count()) >= 5);
  await p.fill("#admin-nombre", "eco del abismo");
  comprobar("titulo repetido (sin importar mayusculas) se rechaza",
    (await p.locator("#admin-error-nombre").innerText()).includes("Ya existe"));
  await p.fill("#admin-nombre", "Pixel Quest");
  await p.fill("#admin-estudio", "Taller Pixel");
  await p.fill("#admin-categoria", "Plataformas");
  await p.fill("#admin-precioNormal", "10000");
  await p.fill("#admin-precioOferta", "12000");
  await p.fill("#admin-descripcion", "Saltos precisos en niveles de pixeles.");
  comprobar("oferta mayor al precio normal se rechaza",
    (await p.locator("#admin-error-precioOferta").innerText()).includes("menor al precio normal"));
  await p.fill("#admin-precioOferta", "8000");
  await alta.getByRole("button", { name: "Agregar al catálogo" }).click();
  comprobar("alta valida: 11 tarjetas", (await tarjetas(p).count()) === 11);
  comprobar("el juego nuevo aparece con su categoria nueva",
    (await p.locator('select[aria-label="Filtrar por categoría"] option[value="Plataformas"]').count()) === 1);
  comprobar("el juego nuevo usa la imagen por defecto",
    (await tarjetas(p).last().locator("img").getAttribute("src")).includes("sin-portada"));

  // Agregar al carrito y luego eliminar: debe salir del carrito
  await tarjetas(p).last().getByRole("button", { name: /Agregar al carrito/ }).click();
  await p.keyboard.press("Escape");
  comprobar("el carrito tiene 1 unidad", (await p.locator("nav .badge").innerText()) === "1");
  await tarjetas(p).last().getByRole("button", { name: /Eliminar/ }).click();
  comprobar("eliminar: vuelve a 10 tarjetas", (await tarjetas(p).count()) === 10);
  comprobar("eliminar tambien lo saca del carrito", (await p.locator("nav .badge").count()) === 0);
  await p.close();
}

// ---------------------------------------------------------- Error de carga
console.log("Error de carga y reintento");
{
  const p = await nuevaPagina(1280, 900, true);
  await p.route("**/juegos.json", (r) => r.fulfill({ status: 404, body: "no" }));
  await p.goto(URL_BASE);
  await p.getByRole("alert").waitFor();
  comprobar("HTTP 404 muestra alerta con Reintentar", await p.getByRole("button", { name: "Reintentar" }).isVisible());
  await p.unroute("**/juegos.json");
  await p.getByRole("button", { name: "Reintentar" }).click();
  await tarjetas(p).first().waitFor();
  comprobar("Reintentar recupera el catalogo", (await tarjetas(p).count()) === 10);

  const q = await nuevaPagina(1280, 900, true);
  await q.route("**/juegos.json", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"no":"arreglo"}' }));
  await q.goto(URL_BASE);
  await q.getByRole("alert").waitFor();
  comprobar("JSON con formato invalido muestra error", (await q.getByRole("alert").innerText()).includes("Formato de datos"));
  await p.close(); await q.close();
}

// ------------------------------------------------------------- Responsivo
console.log("Responsivo (sin scroll horizontal) y columnas de la grilla");
for (const [ancho, columnas] of [[390, 1], [768, 2], [1440, 5]]) {
  const p = await nuevaPagina(ancho, 900);
  await p.goto(URL_BASE);
  await tarjetas(p).first().waitFor();
  const sinScroll = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  const cols = await p.locator(".catalogo-grid").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  comprobar(`${ancho}px: sin scroll horizontal`, sinScroll);
  comprobar(`${ancho}px: grilla de ${columnas} columna(s)`, cols === columnas, `(tiene ${cols})`);
  await p.close();
}

comprobar("sin errores de consola inesperados", erroresConsola.length === 0, JSON.stringify(erroresConsola));
await navegador.close();
console.log(`\n${pasadas} comprobaciones correctas, ${fallas.length} con falla`);
process.exit(fallas.length ? 1 : 0);
