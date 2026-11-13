import React from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import GroupBar from '../../components/site-nav/GroupBar';
import SiteNav from '../../components/site-nav/SiteNav';

type Props = WrapperProps<typeof NavbarType>;

/**
 * Pages drawn by the theme layout get the same two bars as every other page: on the
 * documentation, the group bar above the theme navbar (styled as the Docs bar in
 * src/css/custom.css); anywhere else, i.e. the 404 page, the website's header.
 */
export default function NavbarWrapper(props: Props) {
  const {pathname} = useLocation();
  if (pathname !== '/docs' && !pathname.startsWith('/docs/')) {
    return <SiteNav />;
  }
  return (
    <>
      <GroupBar active="docs" />
      <Navbar {...props} />
    </>
  );
}
