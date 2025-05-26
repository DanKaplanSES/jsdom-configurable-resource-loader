import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  outExtension: (ctx)=> {
    return {
        js: ctx.format === "esm" ? ".mjs" : ".cjs",
        dts: ctx.format === "esm" ? ".d.mts" : ".d.cts"
    }
  },
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: "inline",
  clean: true,
  external: ["./xhr-sync-worker.js"],
});