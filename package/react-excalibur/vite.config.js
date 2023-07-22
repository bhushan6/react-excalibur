/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "react-excalibur",
      formats: ["es"],
      fileName: (format) => `react-excalibur.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "excalibur"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          excalibur: "excalibur",
        },
      },
    },
  },
});
