import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // La página se publica en https://juanlopez462715.github.io/album-hardware/
  base: '/album-hardware/',
  plugins: [react(), tailwindcss()],
  server: {
    // `npm run dev:polling` revisa los archivos cada 300 ms en vez de esperar
    // avisos del sistema. Úsalo solo si Vite no detecta los cambios al guardar.
    watch: mode === 'polling' ? { usePolling: true, interval: 300 } : undefined,
  },
}));
