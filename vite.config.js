import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base debe coincidir con el nombre del repositorio en GitHub Pages
// (https://zersource.github.io/EFT-Frontend-I-Tienda-Videojuegos/)
export default defineConfig({
  base: '/EFT-Frontend-I-Tienda-Videojuegos/',
  plugins: [react()],
})
