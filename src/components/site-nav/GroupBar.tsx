import React from 'react';
import {API_REFERENCE_URL, FOOD_DATASET_URL, STAR_REPO_URL} from './links';
import './site-nav.css';

/** The sites that draw this bar; the API reference is a bare Swagger page without it. */
export type GroupSite = 'website' | 'dataset' | 'docs';

interface GroupLink {
  label: string;
  href: string;
  /** Absent for pages outside the group's shared chrome, which get an arrow. */
  site?: GroupSite;
}

/** The group's sites, always in this order. The calculator and the examples live on the website. */
const GROUP_LINKS: GroupLink[] = [
  {label: 'Website', href: '/', site: 'website'},
  {label: 'Food Dataset', href: FOOD_DATASET_URL, site: 'dataset'},
  {label: 'API', href: API_REFERENCE_URL},
];

function StarIcon() {
  return (
    <svg className="group-bar-star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="group-bar-external" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

interface GroupBarProps {
  /** The site the visitor is on, underlined in the bar. */
  active: GroupSite;
}

/** The dark strip above every site's own bar: the same links, in the same place, everywhere. */
export default function GroupBar({active}: GroupBarProps) {
  return (
    <nav className="group-bar" aria-label="Pocket Nutrition sites">
      <div className="group-bar-inner">
        <ul className="group-bar-sites">
          {GROUP_LINKS.map((link) => (
            <li key={link.label}>
              <a
                className="group-bar-link"
                href={link.href}
                aria-current={link.site === active ? 'true' : undefined}>
                {link.label}
                {!link.site && <ExternalIcon />}
              </a>
            </li>
          ))}
        </ul>
        <a className="group-bar-link" href={STAR_REPO_URL}>
          <StarIcon />
          Star on GitHub
          <ExternalIcon />
        </a>
      </div>
    </nav>
  );
}
