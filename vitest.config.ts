import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [...configDefaults.include, "**/src/test/**/*.test.{js,ts}"],
    exclude: [...configDefaults.exclude, "docs"],
  },
});
