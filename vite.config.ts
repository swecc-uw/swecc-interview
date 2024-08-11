import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/swecc-client/',
  server: {
    open: true,
    port: 5173,
    host: 'localhost'
  }
})
