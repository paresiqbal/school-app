import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Adjust this if your entry file is different
  format: ["esm"], // Use ESM format
  outDir: "dist", // Output directory
  target: "node16", // Target Node.js version
  minify: true, // Minify the output
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean the output directory before bundling
});
