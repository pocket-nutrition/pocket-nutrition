import React from 'react';
import './data-sources.css';

interface Thanks {
  /** Marked with its language ("Merci", "Grazie") so screen readers pronounce it right. */
  word: string;
  wordLang?: string;
  source: string;
  reason: string;
  href: string;
}

/**
 * Each source thanked in the language of its home: Anses and Open Food Facts started in France,
 * EFSA sits in Parma.
 */
const THANKS: Thanks[] = [
  {word: 'Merci', wordLang: 'fr', source: 'Anses', reason: 'for Ciqual, France’s nutrition database.', href: 'https://ciqual.anses.fr'},
  {
    word: 'Cheers',
    source: 'McCance & Widdowson',
    reason: 'for the UK’s nutrition tables.',
    href: 'https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid',
  },
  {word: 'Thank you', source: 'USDA', reason: 'for FoodData Central and its cooking data.', href: 'https://fdc.nal.usda.gov'},
  {
    word: 'Merci',
    wordLang: 'fr',
    source: 'Open Food Facts',
    reason: 'for millions of packaged foods to search and scan.',
    href: 'https://world.openfoodfacts.org',
  },
  {
    word: 'Grazie',
    wordLang: 'it',
    source: 'EFSA',
    reason: 'for its recommended daily intakes.',
    href: 'https://multimedia.efsa.europa.eu/drvs/index.htm',
  },
];

/**
 * Thanks to the open food tables Pocket Nutrition is built on, with the credit their licences ask
 * for. The sources are named, not shown as logos: those are trademarks that need written
 * permission (Anses, USDA) or that the data licence excludes (the UK's Open Government Licence).
 */
export default function DataSources() {
  return (
    <section className="data-sources" aria-labelledby="data-sources-heading">
      <svg className="data-sources-heart" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.3 1.8-2.1 3.3-3.3 5.4-3.3 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z" />
      </svg>
      <div className="wrap">
        <p className="kicker">Open data</p>
        <h2 id="data-sources-heading">
          <span lang="fr">Merci.</span> Cheers. <em>Thank you.</em>
        </h2>
        <p className="data-sources-lead">
          Pocket Nutrition is built on their open data: 3,458 ingredients and millions of packaged foods.
        </p>

        <ul className="data-sources-list">
          {THANKS.map((thanks) => (
            <li key={thanks.href}>
              <a href={thanks.href}>
                <span className="data-sources-greeting">
                  <span lang={thanks.wordLang}>{thanks.word}</span>, {thanks.source}
                </span>
                <span className="data-sources-reason">{thanks.reason}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="data-sources-love">
          None of them endorses Pocket Nutrition. We just love their work. <span aria-hidden="true">♥</span>
        </p>
        <p className="data-sources-credits">
          Ciqual: Anses, Ciqual French food composition table. McCance and Widdowson’s Composition of
          Foods Integrated Dataset contains public sector information licensed under the Open
          Government Licence v3.0. FoodData Central: U.S. Department of Agriculture, Agricultural
          Research Service. Open Food Facts data are available under the Open Database License, and
          their product photos under CC BY-SA. Dietary reference values: European Food Safety
          Authority (EFSA), DRV Finder.
        </p>
      </div>
    </section>
  );
}
