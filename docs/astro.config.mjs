import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import astroExpressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroExpressiveCode({
      styleOverrides: {
        codeLineHeight: "1",
        codeFontFamily: "Roboto Mono",
      },
      themes: ["poimandres", "rose-pine-dawn"],
    }),
    starlight({
      title: "Amee",
      favicon: "/favicon.ico",
      editLink: {
        baseUrl: "https://github.com/kayuxx/amee/tree/main/docs",
      },
      social: {
        github: "https://github.com/kayuxx/amee",
      },
      components: {
        Hero: "./src/components/Hero.astro",
        EditLink: "./src/components/EditLink.astro",
      },
      customCss: [
        "./src/styles/custom.css",
        "./src/styles/theme.css",
        "@fontsource/inter/400.css",
        "@fontsource/inter/600.css",
        "@fontsource/roboto-mono/400.css",
      ],
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
          collapsed: true,
          autogenerate: { directory: "reference", collapsed: true },
        },
      ],
    }),
  ],
});
