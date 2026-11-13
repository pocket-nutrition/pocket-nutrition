import React from 'react';
import Wordmark from '../site-nav/Wordmark';
import {API_REFERENCE_URL, FOOD_DATASET_URL, GITHUB_URL, STATUS_URL} from '../site-nav/links';
import './site-footer.css';

interface FooterColumn {
  title: string;
  links: Array<[label: string, href: string]>;
}

/** One column per site of the group, in the group bar's order. */
const COLUMNS: FooterColumn[] = [
  {
    title: 'Website',
    links: [
      ['Get the app', '/#apps'],
      ['Calculator', '/calculator'],
      ['Examples', '/examples'],
      ['Privacy policy', '/privacy'],
    ],
  },
  {
    title: 'Food Dataset',
    links: [
      ['Ingredients', `${FOOD_DATASET_URL}/ui/ingredients`],
      ['About the dataset', `${FOOD_DATASET_URL}/ui/about`],
      ['Statistics', `${FOOD_DATASET_URL}/ui/stats`],
    ],
  },
  {
    title: 'Developers',
    links: [
      ['Knowledge Editor', 'https://github.com/pocket-nutrition/knowledge-editor'],
      ['API reference', API_REFERENCE_URL],
    ],
  },
];

/**
 * Footer of every page, documentation included (src/theme/Footer). The Food Dataset
 * (pocket-nutrition-community, app/templates/base.html) repeats it: change both together.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div>
            <Wordmark href="/" />
            <p className="site-footer-tagline">
              Open, verifiable nutrition intelligence. Built by a community, owned by everyone.
            </p>
            <p className="site-footer-sources">
              Reference data: <a href="https://ciqual.anses.fr">Ciqual (ANSES)</a>,{' '}
              <a href="https://world.openfoodfacts.org">Open Food Facts</a> and{' '}
              <a href="https://fdc.nal.usda.gov">USDA FoodData Central</a>.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="site-footer-heading">{column.title}</p>
              <ul className="site-footer-links">
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer-bottom">
          <span>© 2026 Pocket Nutrition contributors · AGPL-3.0-or-later &amp; MPL-2.0</span>
          <span className="site-footer-bottom-links">
            <a href={STATUS_URL}>Service status</a>
            <a href={GITHUB_URL}>Source code on GitHub</a>
          </span>
        </div>
        <p className="site-footer-love">
          Made with <span className="site-footer-heart" role="img" aria-label="love">♥</span> from France
        </p>
      </div>
    </footer>
  );
}
