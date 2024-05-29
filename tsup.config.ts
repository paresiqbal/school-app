import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  format: ["esm"],
  target: "node14",
  external: ["express"],
  minify: false,
});
