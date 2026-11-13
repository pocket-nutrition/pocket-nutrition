import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import GroupBar from './GroupBar';
import Wordmark from './Wordmark';
import './site-nav.css';

/** Website pages that have their own entry in the bar. */
type ToolPage = 'calculator' | 'examples';

/** The homepage's sections, reachable from every page of the website. */
const SECTIONS: Array<[label: string, href: string]> = [
  ['Why', '/#why'],
  ['Privacy', '/#privacy'],
  ['Community', '/#community'],
];

/** Side tools: after the sections and quieter, never in the group bar. */
const TOOLS: Array<[label: string, href: string, page: ToolPage]> = [
  ['Calculator', '/calculator', 'calculator'],
  ['Examples', '/examples', 'examples'],
];

function MenuIcon({isOpen}: {isOpen: boolean}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={isOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
    </svg>
  );
}

interface SiteNavProps {
  /** The tool page the visitor is on, if any. */
  active?: ToolPage;
}

/**
 * Header of every website page: the group bar, then the website's own bar. The documentation
 * draws the same group bar above the theme navbar (src/theme/Navbar).
 */
export default function SiteNav({active}: SiteNavProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  return (
    <>
      <GroupBar active="website" />
      <header className="site-nav">
        <div className="site-nav-inner">
          <Wordmark href="/" />
          <button
            type="button"
            className="site-nav-toggle"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="site-nav-links"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}>
            <MenuIcon isOpen={isMenuOpen} />
          </button>
          <nav
            id="site-nav-links"
            className={clsx('site-nav-links', isMenuOpen && 'is-open')}
            aria-label="Website">
            {SECTIONS.map(([label, href]) => (
              <a key={href} className="site-nav-link" href={href} onClick={closeMenu}>
                {label}
              </a>
            ))}
            <span className="site-nav-divider" aria-hidden="true" />
            {TOOLS.map(([label, href, page]) => (
              <a
                key={href}
                className="site-nav-link is-secondary"
                href={href}
                aria-current={page === active ? 'page' : undefined}
                onClick={closeMenu}>
                {label}
              </a>
            ))}
            <a className="site-nav-cta" href="/#apps" onClick={closeMenu}>
              Get the app
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
