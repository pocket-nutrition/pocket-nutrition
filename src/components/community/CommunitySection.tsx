import React from 'react';
import './community.css';

interface Way {
  label: string;
  title: string;
  body: string;
  links: Array<[text: string, href: string]>;
  /** Anchor for links elsewhere on the page (the hero's licence note points at the code). */
  id?: string;
}

const WAYS_IN: Way[] = [
  {
    label: 'In the app',
    title: 'Report what’s wrong.',
    body: 'Wrong weight, odd portion, missing cooking method: tap Report on any ingredient and it goes straight to the team.',
    links: [],
  },
  {
    label: 'In the Food Dataset',
    title: 'Fix it yourself.',
    body: 'Add a food, link it to its scientific source (Ciqual, USDA…) or write a recipe: each link makes our model and the app better. Then send a pull request; the Knowledge Editor prepares the files for you.',
    links: [
      ['Open the Food Dataset', 'https://community.pocketnutrition.org'],
      ['Install the Knowledge Editor', 'https://github.com/pocket-nutrition/knowledge-editor'],
    ],
  },
  {
    label: 'In the code',
    id: 'open-source',
    title: 'Run it, fork it, improve it.',
    body: 'The platform is under AGPL-3.0, the apps under MPL-2.0: whatever you change stays open for everyone.',
    links: [
      ['Browse the code', 'https://github.com/pocket-nutrition'],
      ['Star us on GitHub', 'https://github.com/pocket-nutrition/pocket-nutrition'],
      ['AGPL-3.0', 'https://www.gnu.org/licenses/agpl-3.0.html'],
      ['MPL-2.0', 'https://www.mozilla.org/MPL/2.0/'],
    ],
  },
];

interface HostedService {
  name: string;
  /** Public repository, or undefined while the code is not published yet. */
  repo?: string;
}

/** Flip a service's repo once its code is published. */
const SERVICES: HostedService[] = [
  {name: 'Nutrition API', repo: 'https://github.com/pocket-nutrition/api'},
  {name: 'Food Dataset', repo: 'https://github.com/pocket-nutrition/knowledge'},
  {name: 'Vault'},
  {name: 'Voice & photo'},
  {name: 'Vault on the web'},
];

/**
 * "It's your platform": how a report becomes a fix for everyone, the three ways to take part, then
 * running your own servers and trying the apps (#apps, where the hero's "Get the app" lands).
 */
export default function CommunitySection() {
  return (
    <section className="community" id="community" aria-labelledby="community-heading">
      <div className="wrap">
        <div className="community-head">
          <div>
            <p className="kicker">Community</p>
            <h2 id="community-heading">
              It’s your platform. <em>Make it better.</em>
            </h2>
          </div>
          <p className="community-lead">
            Pocket Nutrition is built in the open. Every report, every pull request and every line of
            code makes it better for everyone.
          </p>
        </div>

        <ol className="community-loop" aria-label="How a fix reaches everyone">
          <li>
            <span className="community-step">1</span>
            <h3>You log a meal.</h3>
            <p className="community-meal" aria-hidden="true">
              <span>
                Lunch<small>Meal photo</small>
              </span>
              <b>612 kcal</b>
            </p>
          </li>
          <li>
            <span className="community-step">2</span>
            <h3>Something looks off? Report it.</h3>
            <p className="community-report" aria-hidden="true">
              <span className="community-report-button">
                <svg viewBox="0 0 24 24">
                  <path d="M5 21V4h11l-1.5 4L16 12H5" />
                </svg>
                Report an inaccuracy
              </span>
              <small>Weight · portion · cooking method · nutrients</small>
            </p>
          </li>
          <li>
            <span className="community-step">3</span>
            <h3>The data gets fixed.</h3>
            <p className="community-diff" aria-hidden="true">
              <small>ingredients/banana.yaml</small>
              <span className="is-removed">- portion_g: 100.0</span>
              <span className="is-added">+ portion_g: 120.0</span>
            </p>
          </li>
          <li>
            <span className="community-step">4</span>
            <h3>Everyone gets the fix.</h3>
            <p className="community-dataset" aria-hidden="true">
              <span className="community-dataset-chip">
                <svg viewBox="0 0 24 24">
                  <path d="M19 6c0 1.66-3.13 3-7 3S5 7.66 5 6s3.13-3 7-3 7 1.34 7 3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
                </svg>
                3,458 ingredients
              </span>
              <small>In the open Food Dataset, mapped to public reference tables</small>
            </p>
          </li>
        </ol>

        <div className="community-ways">
          {WAYS_IN.map((way) => (
            <div className="community-way" id={way.id} key={way.label}>
              <p className="community-label">{way.label}</p>
              <h3>{way.title}</h3>
              <p>{way.body}</p>
              {way.links.length > 0 && (
                <p className="community-links">
                  {way.links.map(([text, href]) => (
                    <a href={href} key={href}>
                      {text}
                    </a>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="community-foot">
          <div>
            <p className="community-label">Run your own servers</p>
            <p>
              Point the app at your own servers from its settings. Your keys stay on your phone either
              way.
            </p>
            <ul className="community-services" aria-label="Whether each service’s code is public">
              {SERVICES.map((service) => (
                <li key={service.name}>
                  {service.repo ? (
                    <a className="community-status is-public" href={service.repo}>
                      {service.name} · public
                    </a>
                  ) : (
                    <span className="community-status is-pending">{service.name} · not public yet</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div id="apps">
            <p className="community-label">Try the apps</p>
            <p>No store release yet: build the iPhone or Android app from its source.</p>
            <p className="community-apps">
              <a className="btn btn-ghost" href="https://github.com/pocket-nutrition/ios">iPhone source</a>
              <a className="btn btn-ghost" href="https://github.com/pocket-nutrition/android">Android source</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
