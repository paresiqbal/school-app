import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  target: "es2020",
  format: ["cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
