import React, {useRef, type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useParallax from '../parallax/useParallax';
import '../parallax/parallax.css';
import './chore.css';

interface Feature {
  name: string;
  body: string;
  /** Stroke icon path data on a 24-unit grid. */
  icon: string;
  /** A small, decorative piece of the app's interface. */
  sample?: ReactNode;
  link?: [text: string, href: string];
}

interface Tier {
  step: string;
  title: string;
  subtitle: string;
  /** Sets the icon size, so the tiers read from most to least prominent. */
  rank: 'is-first' | 'is-second' | 'is-third';
  features: Feature[];
}

/** The hero's dish photo, already downloaded by then. */
function DishThumb() {
  const avif = useBaseUrl('/img/hero/plate-dish.avif');
  const jpeg = useBaseUrl('/img/hero/plate-dish.jpg');
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <img src={jpeg} width="28" height="28" alt="" loading="lazy" decoding="async" />
    </picture>
  );
}

const ARROW = <span className="chore-sample-arrow">→</span>;

/**
 * Every feature exists in both apps' main branches: search, voice, photo, barcode, slot-aware
 * recents, "Same as yesterday", dishes with a portion stepper, the portion ladder, the cooking
 * factors of the Food Dataset and the API's 24 nutrients (13 of them vitamins and minerals).
 */
const TIERS: Tier[] = [
  {
    step: '01',
    title: 'A new meal?',
    subtitle: 'Pick the fastest way.',
    rank: 'is-first',
    features: [
      {
        name: 'Smart search',
        body: 'Ingredients, products and recipes.',
        icon: 'M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0zM20 20l-3.5-3.5',
        sample: (
          <>
            <span className="chore-sample-muted">chi</span>
            {ARROW}Chicken breast
          </>
        ),
      },
      {
        name: 'Voice dictation',
        body: 'Say the whole meal. We find each food.',
        icon: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
        sample: <em>“chicken with rice”</em>,
      },
      {
        name: 'Plate photo',
        body: 'Take a photo. The dish is recognised.',
        icon: 'M4 8h3l2-3h6l2 3h3v11H4zM15.5 13a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z',
        sample: (
          <>
            <DishThumb />
            {ARROW}chicken, rice
          </>
        ),
      },
      {
        name: 'Barcode scanner',
        body: 'Product in hand? Skip the typing.',
        icon: 'M4 6v12M7 6v12M11 6v12M14 6v12M17 6v12M20 6v12',
        sample: (
          <>
            <span className="chore-sample-barcode" />
            {ARROW}Plain yogurt
          </>
        ),
      },
    ],
  },
  {
    step: '02',
    title: 'Had it before?',
    subtitle: 'Your habits, one tap away.',
    rank: 'is-second',
    features: [
      {
        name: 'Recent meals',
        body: 'Your usual foods for this time of day.',
        icon: 'M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 7v5l3 2',
        sample: (
          <>
            <span>
              <span className="chore-sample-accent">★</span> Chicken &amp; rice
            </span>
            <span className="chore-sample-plus">+</span>
          </>
        ),
      },
      {
        name: 'Same as yesterday',
        body: 'Repeat a whole meal.',
        icon: 'M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3',
        sample: (
          <>
            <span className="chore-sample-accent">↺</span> Repeat yesterday’s lunch
          </>
        ),
      },
      {
        name: 'My dishes',
        body: 'Save a meal once. Cooked for 4? Log 1 portion.',
        icon: 'M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h20M9 6.5c0-1 .8-1.5.8-2.5M14 6.5c0-1 .8-1.5.8-2.5',
        sample: (
          <>
            Couscous
            <span className="chore-segment">
              <span>½</span>
              <span className="is-on">1</span>
              <span>1½</span>
              <span>2</span>
            </span>
          </>
        ),
      },
    ],
  },
  {
    step: '03',
    title: 'Already done for you.',
    subtitle: 'Nothing to weigh, nothing to work out.',
    rank: 'is-third',
    features: [
      {
        name: 'Usual portions',
        body: 'Half, one portion, double. No scale.',
        icon: 'M3 11h18a9 9 0 0 1-18 0zM8 7.5c0-1.4 1-1.8 1-3.2M12 7.5c0-1.4 1-1.8 1-3.2M16 7.5c0-1.4 1-1.8 1-3.2',
        sample: (
          <span className="chore-segment">
            <span>Half</span>
            <span className="is-on">1 portion</span>
            <span>Double</span>
          </span>
        ),
      },
      {
        name: 'Cooking counted',
        body: '3,458 ingredients know how they cook: water and vitamins included.',
        icon: 'M3 12h13a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM16 12h5M8 8.5c0-1.2.8-1.6.8-2.8M11.5 8.5c0-1.2.8-1.6.8-2.8',
        link: ['See how ↓', '#cooking'],
      },
      {
        name: 'Every nutrient',
        body: '24 nutrients, including 13 vitamins and minerals.',
        icon: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9',
        sample: <>Iron · Vitamin C · B12 · …</>,
      },
    ],
  },
];

interface CookingFigure {
  before?: string;
  after: string;
  caption: string;
}

/**
 * Real factors from pocket-nutrition-knowledge/cooking_relationships: chicken breast boiled
 * (USDA yield 0.77, vitamin B6 retention 0.6) and cooked rice (Ciqual pair, yield 2.23). Captions
 * use the app's own cooking method names (raw, boiled, steamed, grilled, roasted, fried).
 */
const COOKING_FIGURES: CookingFigure[] = [
  {before: '100 g', after: '77 g', caption: 'chicken breast, boiled'},
  {before: '100 g', after: '223 g', caption: 'rice, cooked'},
  {after: '60%', caption: 'of the chicken’s vitamin B6 survives'},
];

function StrokeIcon({path}: {path: string}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/**
 * "Why Pocket Nutrition": the shortcuts that make logging fast, grouped by situation (a new
 * meal, a meal you had before, what is already done for you), then the cooking math. Only the
 * cooking panel's decoration (x0.5) and its figures (x1.5) drift.
 */
export default function ChoreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  return (
    <section className="chore parallax-scene" id="why" ref={sectionRef} aria-labelledby="why-heading">
      <div className="wrap">
        <div className="chore-head">
          <div>
            <p className="kicker">Why Pocket Nutrition</p>
            <h2 id="why-heading">
              Nobody enjoys logging meals. <em>So we made it fast.</em>
            </h2>
          </div>
          <p className="chore-lead">
            Search for every food, weigh everything, guess the oil… and after a few days, you give up.{' '}
            <strong>Pocket Nutrition does the boring part for you.</strong>
          </p>
        </div>

        <div className="chore-tiers">
          {TIERS.map((tier) => (
            <div className={`chore-tier ${tier.rank}`} key={tier.step}>
              <div className="chore-tier-head">
                <p className="chore-step">{tier.step}</p>
                <h3>{tier.title}</h3>
                <p>{tier.subtitle}</p>
              </div>
              <ul className="chore-features">
                {tier.features.map((feature) => (
                  <li className="chore-feature" key={feature.name}>
                    <span className="chore-feature-icon">
                      <StrokeIcon path={feature.icon} />
                    </span>
                    <h4>{feature.name}</h4>
                    <p>{feature.body}</p>
                    {feature.sample && (
                      <span className="chore-sample" aria-hidden="true">
                        {feature.sample}
                      </span>
                    )}
                    {feature.link && (
                      <a className="chore-feature-link" href={feature.link[1]}>
                        {feature.link[0]}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="chore-cooking" id="cooking">
          <svg className="chore-cooking-steam" data-speed="0.5" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M30 120h120a40 40 0 0 1-40 40H70a40 40 0 0 1-40-40zM150 120h40M75 95c0-14 10-18 10-32s-10-18-10-32M105 95c0-14 10-18 10-32s-10-18-10-32M135 95c0-14 10-18 10-32" />
          </svg>
          <div className="chore-cooking-grid">
            <div>
              <h3>
                Cooking changes the numbers. <em>We do the math.</em>
              </h3>
              <p>
                Meat loses water, rice soaks it up, and heat destroys some vitamins. Use the numbers of
                dry rice for cooked rice and you count more than twice the calories.
              </p>
            </div>
            <div>
              <ul className="chore-figures" data-speed="1.5">
                {COOKING_FIGURES.map((figure) => (
                  <li key={figure.caption}>
                    <b>
                      {figure.before && (
                        <>
                          {figure.before} <span className="chore-arrow">→</span>{' '}
                        </>
                      )}
                      {figure.after}
                    </b>
                    <span className="chore-figure-caption">{figure.caption}</span>
                  </li>
                ))}
              </ul>
              <p className="chore-source">Factors from the USDA and Ciqual reference tables.</p>
            </div>
          </div>
          <div className="chore-cooking-foot">
            <p className="chore-punchline">
              Complicated? Yes. <em>Your problem? No.</em>
            </p>
            <p>
              566 cooking factors, all public.{' '}
              <a href="https://github.com/pocket-nutrition/knowledge/tree/main/cooking_relationships">See them</a>
            </p>
          </div>
        </div>

        <div className="chore-bridge">
          <p>
            <StrokeIcon path="M5 21V4h11l-1.5 4L16 12H5" />
            <span>
              Something wrong or missing? Tap <strong>Report</strong> on any ingredient: every fix
              improves the data for everyone.
            </span>
          </p>
          <a className="btn btn-ghost" href="#community">It’s your platform</a>
        </div>
      </div>
    </section>
  );
}
