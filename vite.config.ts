import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  /**
   * Relative so the same build works wherever it is served: the site root on
   * Hostinger, or a subpath like /<repo>/ on GitHub Pages. Public files
   * referenced from code must go through `assetUrl` in src/lib/campus-data.ts
   * for the same reason — Vite only rewrites the ones it can see.
   */
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
