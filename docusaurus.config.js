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
    // Architecture diagrams are written as Mermaid code blocks (```mermaid) in the docs.
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  clientModules: ['./src/client/d3-transition.js'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Technical documentation (self-hosting first), served under /docs. The website repo
        // is private, so pages carry no "edit this page" link.
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
        },
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
      // Diagrams in the site's palette: cream boxes, leaf outlines, ink text, carrot notes. Only
      // Mermaid's `base` theme accepts these variables.
      mermaid: {
        theme: {light: 'base', dark: 'base'},
        options: {
          themeVariables: {
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            fontSize: '15px',
            background: '#faf7f0',
            primaryColor: '#f1ead9',
            primaryBorderColor: '#3e7a4e',
            primaryTextColor: '#1e2b22',
            secondaryColor: '#e2ecdf',
            tertiaryColor: '#faf7f0',
            lineColor: '#4a5a4e',
            noteBkgColor: '#f7e3cf',
            noteBorderColor: '#e07a2f',
            noteTextColor: '#1e2b22',
            clusterBkg: '#faf7f0',
            clusterBorder: 'rgba(30, 43, 34, 0.25)',
          },
        },
      },
      // The theme navbar only renders on the documentation, where it is the Docs bar under the
      // shared group bar (src/theme/Navbar). The other sites of the group sit in that group bar,
      // so this bar only lists the docs' own sections. The footer is the shared one
      // (src/theme/Footer), so it takes no config here.
      navbar: {
        items: [
          {
            to: '/docs/architecture/overview',
            label: 'Architecture',
            position: 'right',
            activeBaseRegex: '^/docs/architecture',
          },
          {
            to: '/docs/contribute/knowledge-editor',
            label: 'Contribute',
            position: 'right',
            activeBaseRegex: '^/docs/contribute',
          },
          {
            to: '/docs/self-hosting/overview',
            label: 'Self-hosting',
            position: 'right',
            activeBaseRegex: '^/docs/self-hosting',
          },
        ],
      },
    }),
};

export default config;
