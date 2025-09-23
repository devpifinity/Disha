import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./frontend/src"),
    },
  },
  root: "./frontend",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog"],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: "::",
  },
}));
