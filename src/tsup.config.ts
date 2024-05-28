import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Your entry file
  splitting: false, // Disable code splitting
  sourcemap: true, // Generate sourcemaps for debugging
  clean: true, // Clean the output directory before bundling
  dts: false, // Generate TypeScript declaration files
  format: ["esm"], // CommonJS format for Node.js
  target: "node14", // Target Node.js version
  external: ["express"], // Exclude express from the bundle
  minify: false, // Minify the output (optional)
});
