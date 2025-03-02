import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    historyApiFallback: true, // ✅ Asegura que las rutas funcionen en recargas
  },
  build: {
    target: "esnext",
  },
});
