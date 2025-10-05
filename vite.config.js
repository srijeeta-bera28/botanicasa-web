import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist"
  },
  publicDir: "src"  // ensures _redirects is copied to dist
});
