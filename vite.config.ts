// vite.config.ts
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: {
    port: 3000,
    watch: {
      ignored: ["count.txt"],
    },
  },

  plugins: [
    tsConfigPaths(),
    tanstackStart({
      react: {
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      },
    }),
  ],
});
