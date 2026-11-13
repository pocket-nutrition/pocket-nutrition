// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/**
 * Class roots for every Tailwind-based tool page, kept in one place since both the Tailwind
 * plugin below and each tool's own stylesheet (src/styles/tailwind-tools.css) need the list.
 */
const TAILWIND_TOOL_ROOTS = ['.pn-calculator', '.pn-examples'];

/**
 * Registers @tailwindcss/postcss so Tailwind-based tool pages (/calculator, ported from
 * pocket-nutrition-sandbox; /examples, ported from pocket-nutrition-showcase) can use
 * Tailwind utility classes. Preflight is intentionally not imported anywhere (see
 * src/styles/tailwind-tools.css), so this only ever adds utility classes to the shared CSS
 * bundle — it never resets base elements for the rest of the site.
 * @returns {import('@docusaurus/types').Plugin}
 */
function tailwindPlugin() {
  return {
    name: 'tailwind-postcss',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('@tailwindcss/postcss'));
      postcssOptions.plugins.push(require('./postcss-scope-tailwind.cjs')(TAILWIND_TOOL_ROOTS));
      return postcssOptions;
    },
  };
}

/**
 * Mirrors the calculator's old Vite dev proxy (`/api` → the live API) for `docusaurus start`,
 * so the calculator and examples pages' relative fetch('/api/...') calls also work outside of
 * the nginx-fronted production build.
 * @returns {import('@docusaurus/types').Plugin}
 */
function calculatorDevProxyPlugin() {
  return {
    name: 'calculator-dev-proxy',
    configureWebpack() {
      return {
        devServer: {
          proxy: [
            {
              context: ['/api'],
              target: 'https://api.pocketnutrition.org',
              changeOrigin: true,
              pathRewrite: { '^/api': '' },
              // The API only accepts cross-origin calls from the production website, and browsers
              // send an Origin header on every POST: drop the localhost one so the dev server's
              // calls pass like nginx's do in production.
              /** @param {import('http').ClientRequest} proxyReq */
              onProxyReq(proxyReq) {
                proxyReq.removeHeader('origin');
              },
            },
          ],
        },
      };
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  plugins: [tailwindPlugin, calculatorDevProxyPlugin],

  title: 'Pocket Nutrition',
  tagline: "Simple, open nutrition for everyone",
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://pocketnutrition.org',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'pocket-nutrition',
  projectName: 'website',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // The documentation is not published yet: it joins this repository once reviewed.
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        theme: prismThemes.github,
        additionalLanguages: ['bash'],
      },
      // The theme navbar only renders on documentation pages (src/theme/Navbar), which this
      // repository does not ship. The footer is the shared one (src/theme/Footer).
      navbar: {items: []},
    }),
};

export default config;
