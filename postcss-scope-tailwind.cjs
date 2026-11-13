/**
 * Docusaurus bundles every page's CSS into one shared stylesheet (see docusaurus.config.js),
 * so Tailwind's generated `utilities` layer would otherwise apply to the whole site — including
 * names Infima already owns, like `.container` (confirmed colliding with Infima's own
 * `.container` in a local build: Tailwind's `utilities` layer is registered after
 * `docusaurus.infima`, so cascade-layer order would let it silently win and break Infima's
 * layout on every non-tool page, e.g. the 404 page).
 *
 * This plugin re-scopes Tailwind's own layers to a fixed list of root classes — one per
 * Tailwind-based tool page (e.g. `.pn-calculator`, `.pn-examples`) — so utilities never touch
 * the rest of the site, and so each tool's classes work regardless of which one actually
 * pulled in the (shared, single) Tailwind import:
 *  - `theme`: redefines Tailwind's CSS variables (colors, spacing, ...) on every root class
 *    instead of `:root`, since that's exactly where those variables need to be visible.
 *  - `utilities`: prefixes every selector with `:where(root1, root2, ...)` (zero-specificity)
 *    so utility classes only match inside one of the tool roots, without changing which
 *    utility wins when two utility classes conflict on the same element.
 *  - `properties` (Tailwind's `@property` registrations) is left untouched: it has no selectors
 *    to scope and doesn't render anything by itself.
 *
 * @param {string[]} roots - CSS class selectors (e.g. ['.pn-calculator', '.pn-examples']),
 *   one per tool page currently importing Tailwind.
 */
module.exports = (roots) => ({
  postcssPlugin: 'scope-tailwind-to-tools',
  AtRule: {
    layer(atRule) {
      const layerName = atRule.params.trim();

      if (layerName === 'theme') {
        // Tailwind declares its variables on `:root, :host` (not just `:root`), so every rule
        // in this layer is rewritten unconditionally rather than filtered by exact selector.
        atRule.walkRules((rule) => {
          rule.selector = roots.join(', ');
        });
        return;
      }

      if (layerName === 'utilities') {
        const whereRoots = `:where(${roots.join(', ')})`;
        atRule.walkRules((rule) => {
          rule.selector = rule.selectors.map((selector) => `${whereRoots} ${selector}`).join(', ');
        });
      }
    },
  },
});

module.exports.postcss = true;
