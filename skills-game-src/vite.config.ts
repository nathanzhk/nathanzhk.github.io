import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "skills-game.css" : "assets/[name][extname]",
        entryFileNames: "skills-game.js",
      },
    },
  },
});
