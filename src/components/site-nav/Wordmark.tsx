import React from 'react';
import clsx from 'clsx';
import './site-nav.css';

interface WordmarkProps {
  href: string;
  /** The site's name after the wordmark (Docs, Food Dataset); the website itself has none. */
  suffix?: string;
  className?: string;
}

export default function Wordmark({href, suffix, className}: WordmarkProps) {
  return (
    <a
      className={clsx('pn-wordmark', className)}
      href={href}
      aria-label={suffix ? `Pocket Nutrition ${suffix}` : 'Pocket Nutrition'}>
      pocket<span className="pn-wordmark-mark">·</span>nutrition
      {suffix && <span className="pn-wordmark-suffix">{suffix}</span>}
    </a>
  );
}
