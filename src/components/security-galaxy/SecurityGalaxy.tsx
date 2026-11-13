import React, {useRef} from 'react';
import useParallax from '../parallax/useParallax';
import '../parallax/parallax.css';
import './security-galaxy.css';

interface Service {
  name: string;
  /** The one guarantee shown under the name; the privacy policy carries the details. */
  promise: string;
  /** Position on the wide-screen stage, in percent of its width and height. */
  x: number;
  y: number;
  /** Planet diameter in px, purely decorative. */
  size: number;
  /** Drawn as the moon of the service listed just before it, tethered to that planet. */
  isMoon?: boolean;
}

/**
 * Each promise mirrors the privacy policy (src/pages/privacy.js); keep both in step. The
 * positions keep left-hand services clear of the phone and right-hand ones inside the section
 * from the 960px breakpoint up; below it the services become a plain list. The web viewer
 * (me.pocketnutrition.org) is the vault's own interface, hence a moon right under the vault.
 */
const SERVICES: Service[] = [
  {name: 'Vault', promise: 'End-to-end encrypted', x: 6, y: 28, size: 30},
  {name: 'Vault on the web', promise: 'Decrypted in your browser', x: 6, y: 48, size: 14, isMoon: true},
  {name: 'Nutrition API', promise: 'No account, no ID', x: 69, y: 7, size: 26},
  {name: 'Voice & photo', promise: 'Erased within 48 h', x: 74, y: 42, size: 24},
  {name: 'Food Dataset', promise: 'Public, nothing personal', x: 66, y: 78, size: 22},
];

const JOURNAL: Array<[meal: string, source: string, energy: string]> = [
  ['Breakfast', 'Barcode scan', '420 kcal'],
  ['Lunch', 'Meal photo', '612 kcal'],
  ['Snack', 'Voice note', '180 kcal'],
];

const PLEDGES: Array<[title: string, detail: string]> = [
  ['No ads.', 'Not in the app, not on this site.'],
  ['No tracking.', 'No analytics, no trackers, no advertising ID.'],
  ['No email asked.', 'Search, scan and log without any account.'],
];

interface Star {
  x: number;
  y: number;
  r: number;
  dim: boolean;
}

/* The sky is drawn for the section's usual shape, so stars keep roughly their drawn size. */
const SKY_WIDTH = 1600;
const SKY_HEIGHT = 1400;

/** Deterministic star field, so the server render and the browser agree. */
function starField(count: number, seed: number): Star[] {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  return Array.from({length: count}, () => ({
    x: next() * SKY_WIDTH,
    y: next() * SKY_HEIGHT,
    r: 0.6 + next() * 1.3,
    dim: next() < 0.55,
  }));
}

const STARS = starField(130, 7);
const LOCK_PATH = 'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V7a4 4 0 0 1 8 0v4';
const KEY_PATH = 'M12 15a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM11 12l9-9M16 7l3 3';

function StrokeIcon({path}: {path: string}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/**
 * "Your data is yours. Not ours.": the privacy section under the chores. The phone and its
 * journal sit at the centre of a night sky; the services float around it (x1.5) over the stars
 * (x0.5) and a warm halo (x0.8), each with the one promise it keeps. No orbits: the services are
 * independent, and none is closer to your data than another.
 */
export default function SecurityGalaxy() {
  const sectionRef = useRef<HTMLElement>(null);
  useParallax(sectionRef);

  return (
    <section className="security-galaxy parallax-scene" id="privacy" ref={sectionRef} aria-labelledby="privacy-heading">
      <svg
        className="security-galaxy-stars"
        data-speed="0.5"
        viewBox={`0 0 ${SKY_WIDTH} ${SKY_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true">
        {STARS.map((star, index) => (
          <circle key={index} className={star.dim ? 'is-dim' : undefined} cx={star.x.toFixed(0)} cy={star.y.toFixed(0)} r={star.r.toFixed(1)} />
        ))}
      </svg>

      <div className="wrap">
        <div className="security-galaxy-intro">
          <p className="kicker">Privacy by design</p>
          <h2 id="privacy-heading">
            Your data is yours. <em>Not ours.</em>
          </h2>
          <p className="security-galaxy-lead">
            Everything you log stays on your phone. The services around it are built to help without
            knowing who you are.
          </p>
        </div>

        <div className="security-galaxy-stage">
          <span className="security-galaxy-halo" data-speed="0.8" aria-hidden="true" />
          <div className="security-galaxy-device">
            <div className="security-galaxy-phone" role="img" aria-label="Your phone showing today’s journal, stored on the phone">
              <div className="security-galaxy-screen">
                <p className="security-galaxy-screen-title">
                  My journal <span>Tuesday</span>
                </p>
                {JOURNAL.map(([meal, source, energy]) => (
                  <p className="security-galaxy-meal" key={meal}>
                    <span>
                      {meal}
                      <small>{source}</small>
                    </span>
                    <b>{energy}</b>
                  </p>
                ))}
                <p className="security-galaxy-meal is-empty">Dinner · add a meal</p>
                <p className="security-galaxy-stored">
                  <StrokeIcon path={LOCK_PATH} />
                  Stored on this phone
                </p>
              </div>
            </div>
            <p className="security-galaxy-keys" data-speed="1.5">
              <StrokeIcon path={KEY_PATH} />
              Your keys stay here
            </p>
          </div>
          <ul className="security-galaxy-services" aria-label="Services around your phone">
            {SERVICES.map((service) => (
              <li
                className={service.isMoon ? 'security-galaxy-service is-moon' : 'security-galaxy-service'}
                data-speed="1.5"
                key={service.name}
                style={{left: `${service.x}%`, top: `${service.y}%`}}>
                <span className="security-galaxy-planet" style={{width: service.size, height: service.size}} />
                <span>
                  <b>{service.name}</b>
                  <small>
                    <StrokeIcon path={LOCK_PATH} />
                    {service.promise}
                  </small>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="security-galaxy-pledges">
          {PLEDGES.map(([title, detail]) => (
            <li key={title}>
              <b>{title}</b>
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        <p className="security-galaxy-fineprint">
          Our servers keep IP addresses in their logs, for diagnostics only.{' '}
          <a href="/privacy">How each service handles your data</a>
        </p>
      </div>
    </section>
  );
}
