import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    historyApiFallback: true, // 🔥 Evita errores 404 en recargas de páginas dentro de React
  },
  build: {
    outDir: "dist",
    target: "esnext",
  },
});
