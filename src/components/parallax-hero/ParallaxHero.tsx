import React, {useRef} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useParallax from '../parallax/useParallax';
import '../parallax/parallax.css';
import './parallax-hero.css';

type Tool = 'scan' | 'photo' | 'voice';

/** Filled icons on a 24-unit grid, shared by the search field and the labels around the phone. */
const TOOL_ICONS: Record<Tool, string> = {
  scan: 'M3 5h2v14H3zm4 0h1v14H7zm3 0h2v14h-2zm4 0h1v14h-1zm3 0h1v14h-1zm3 0h1v14h-1z',
  photo:
    'M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4H9zm3 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  voice:
    'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z',
};

/** One label per way to log a meal, in the order the scene places them. */
const FEATURES: Array<[tool: Tool, label: string, detail: string]> = [
  ['photo', 'Plate photo', 'the dish is recognised'],
  ['scan', 'Barcode scanner', 'for packaged food'],
  ['voice', 'Voice dictation', 'say what you ate'],
];

function ToolIcon({tool}: {tool: Tool}) {
  return (
    <span className={`parallax-hero-tool is-${tool}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={TOOL_ICONS[tool]} />
      </svg>
    </span>
  );
}

/**
 * Homepage hero: the pitch on the left, a layered phone scene on the right. Each scene layer
 * declares its scroll speed in data-speed (0.5 and 0.8 drift behind, 1.5 and 2 pass in
 * front); the copy column never moves.
 */
export default function ParallaxHero() {
  const heroRef = useRef<HTMLElement>(null);
  const dishAvif = useBaseUrl('/img/hero/plate-dish.avif');
  const dishJpeg = useBaseUrl('/img/hero/plate-dish.jpg');
  useParallax(heroRef);

  return (
    <section className="hero parallax-hero parallax-scene" ref={heroRef} aria-labelledby="hero-heading">
      <div className="wrap parallax-hero-grid">
        <div className="parallax-hero-copy">
          <p className="kicker">iPhone &amp; Android · 100% open source</p>
          <h1 id="hero-heading">
            {/* Non-breaking hyphens keep "store-bought" and "home-cooked" on one line each. */}
            From store&#8209;bought to home&#8209;cooked. Pocket Nutrition <em>does the math.</em>
          </h1>
          <p className="lead">
            Scan a packaged product, photograph your plate or just say what you ate. Pocket Nutrition
            accounts for how you cook, and your meals stay on your phone.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#apps">Get the app</a>
            <a className="btn btn-ghost" href="/calculator">Try it in your browser</a>
          </div>
          <p className="oss-note">
            <span className="dot" /> Open source under <a href="#open-source">AGPL-3.0 &amp; MPL-2.0</a>. No ads, no
            trackers.
          </p>
        </div>

        <div
          className="parallax-hero-scene"
          role="img"
          aria-label="The Pocket Nutrition journal on a phone, in front of a photographed plate of grilled chicken, rice and peppers. Breakfast logged with the barcode scanner and lunch from a plate photo add up to 1,032 kcal today, with 13 vitamins and minerals tracked. Plate photo, barcode scanner and voice dictation are the three ways to log a meal.">
          <div className="parallax-hero-layer" data-speed="0.5">
            <div className="parallax-hero-plate">
              <picture>
                <source srcSet={dishAvif} type="image/avif" />
                <img src={dishJpeg} width="960" height="960" alt="" decoding="async" />
              </picture>
            </div>
          </div>
          <div className="parallax-hero-layer" data-speed="0.8">
            <span className="parallax-hero-leaf is-top" />
            <span className="parallax-hero-leaf is-right" />
            <span className="parallax-hero-leaf is-low" />
          </div>
          <div className="parallax-hero-layer" data-speed="1.5">
            <div className="parallax-hero-phone">
              <div className="parallax-hero-screen">
                <div className="parallax-hero-status">
                  <span>19:42</span>
                  <span>100%</span>
                </div>
                <p className="parallax-hero-title">My journal</p>
                <p className="parallax-hero-day">Tuesday</p>
                <div className="parallax-hero-meal">
                  <span>
                    Breakfast<small>via barcode</small>
                  </span>
                  <b>420 kcal</b>
                </div>
                <div className="parallax-hero-meal">
                  <span>
                    Lunch<small>via photo</small>
                  </span>
                  <b>612 kcal</b>
                </div>
                <div className="parallax-hero-meal is-empty">
                  <span>Dinner</span>
                  <b>·</b>
                </div>
                <div className="parallax-hero-search">
                  <span>Search…</span>
                  <span className="parallax-hero-tools">
                    <ToolIcon tool="scan" />
                    <ToolIcon tool="photo" />
                    <ToolIcon tool="voice" />
                  </span>
                </div>
              </div>
            </div>
            <div className="parallax-hero-card">
              <p className="parallax-hero-card-label">Today</p>
              <p className="parallax-hero-card-value">1,032 kcal</p>
              <div className="parallax-hero-bars">
                <div className="parallax-hero-bar is-protein">
                  <span>Protein</span>
                  <i />
                </div>
                <div className="parallax-hero-bar is-carbs">
                  <span>Carbs</span>
                  <i />
                </div>
                <div className="parallax-hero-bar is-fat">
                  <span>Fat</span>
                  <i />
                </div>
              </div>
              <p className="parallax-hero-card-extra">+ 13 vitamins &amp; minerals</p>
            </div>
          </div>
          <div className="parallax-hero-layer" data-speed="2">
            {FEATURES.map(([tool, label, detail]) => (
              <p className={`parallax-hero-feature is-${tool}`} key={tool}>
                <ToolIcon tool={tool} />
                <span>
                  {label}
                  <small>{detail}</small>
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
