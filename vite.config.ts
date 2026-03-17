import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import tailwindcss from "@tailwindcss/vite";
import sri from "vite-plugin-sri-gen";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools(),
    tailwindcss(),
    sri({
      algorithm: "sha512",
      crossorigin: "anonymous",
      fetchCache: true,
      fetchTimeoutMs: 5000,
      skipResources: [],
      verboseLogging: false,
    }),
  ],
  devtools: {
    enabled: false,
  },
});
