import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import astroExpressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroExpressiveCode({
      // Replace the default themes with a custom set of bundled themes:
      // "dracula" (a dark theme) and "solarized-light"
      styleOverrides: {
        codeLineHeight: "1",
        codeFontFamily: "Roboto Mono",
      },
      themes: ["poimandres"],
    }),
    starlight({
      title: "Amee",
      social: {
        github: "https://github.com/kayuxx/amee",
      },
      components: {
        Hero: "./src/components/Hero.astro",
      },
      customCss: [
        "./src/styles/custom.css",
        "./src/styles/theme.css",
        "@fontsource/inter/400.css",
        "@fontsource/inter/600.css",
        "@fontsource/roboto-mono/400.css",
      ],
      credits: false,
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            {
              label: "Installation",
              slug: "getting-started/installation",
            },
          ],
        },
        {
          label: "Session Managment",
          autogenerate: { directory: "session-management" },
        },
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
