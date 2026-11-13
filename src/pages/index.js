import React from 'react';
import Head from '@docusaurus/Head';
import '../css/home.css';
import SiteNav from '../components/site-nav/SiteNav';
import SiteFooter from '../components/site-footer/SiteFooter';
import ParallaxHero from '../components/parallax-hero/ParallaxHero';
import ChoreSection from '../components/chore/ChoreSection';
import SecurityGalaxy from '../components/security-galaxy/SecurityGalaxy';
import CommunitySection from '../components/community/CommunitySection';
import DataSources from '../components/data-sources/DataSources';

export default function Home() {
  return (
    <div className="site-page">
      <Head>
        <title>Pocket Nutrition: truly understand what's on your plate</title>
        <meta
          name="description"
          content="Pocket Nutrition calculates the nutritional profile of your actual meals, from store-bought products to home-cooked dishes, powered by the Food Dataset, an open catalogue of 3,458 ingredients. 100% open source under AGPL-3.0 (platform) and MPL-2.0 (mobile apps)."
        />
        <link rel="canonical" href="https://pocketnutrition.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pocketnutrition.org/" />
        <meta property="og:title" content="Pocket Nutrition: open, verifiable nutrition intelligence" />
        <meta
          property="og:description"
          content="Calculate the nutrition of store-bought products and home-cooked meals alike, powered by an open catalogue of ingredient properties. Built in the open, owned by everyone."
        />
      </Head>

      <SiteNav />

      <main className="pn-home site-page-main">
        <ParallaxHero />
        <ChoreSection />
        <SecurityGalaxy />
        <CommunitySection />
        <DataSources />
      </main>

      <SiteFooter />
    </div>
  );
}
