import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base debe coincidir con el nombre del repositorio en GitHub Pages
// (https://<usuario>.github.io/S8-React-Hooks-useEffect/)
export default defineConfig({
  base: '/S8-React-Hooks-useEffect/',
  plugins: [react()],
})
