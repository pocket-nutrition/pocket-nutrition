import React from 'react';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SiteNav from '../components/site-nav/SiteNav';
import SiteFooter from '../components/site-footer/SiteFooter';

export default function Calculator() {
  return (
    <div className="site-page">
      <Head>
        <title>Nutrition Calculator — Pocket Nutrition</title>
        <meta
          name="description"
          content="Estimate the nutritional profile of a meal directly from your browser, no app install required. Search ingredients, set portions and cooking methods, and get an instant prediction."
        />
        <link rel="canonical" href="https://pocketnutrition.org/calculator" />
        <meta name="robots" content="index,follow" />
      </Head>

      <SiteNav active="calculator" />

      {
        // The meal-builder tool is a pure client-side app: it calls the API from the browser and
        // has nothing meaningful to server-render, so it only ever mounts after hydration. The
        // header and footer around it are server-rendered.
      }
      <div className="site-page-main">
        <BrowserOnly>
          {() => {
            const CalculatorApp = require('../sandbox-app/App').default;
            return <CalculatorApp />;
          }}
        </BrowserOnly>
      </div>

      <SiteFooter />
    </div>
  );
}
