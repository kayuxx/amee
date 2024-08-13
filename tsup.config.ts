import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "providers/index": "./src/oauth/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    treeshake: true,
    sourcemap: true,
  },
]);
