// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'mongodb://localhost:27017/carnes_al_barril_db',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
