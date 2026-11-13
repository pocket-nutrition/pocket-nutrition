import React from 'react';
import Wordmark from '../../../components/site-nav/Wordmark';

/** The Docs bar's brand: the shared wordmark followed by the site's name, as on the Food Dataset. */
export default function NavbarLogo() {
  return <Wordmark href="/docs" suffix="Docs" className="navbar__brand" />;
}
