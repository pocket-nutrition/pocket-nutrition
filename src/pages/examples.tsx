import React from 'react';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SiteNav from '../components/site-nav/SiteNav';
import SiteFooter from '../components/site-footer/SiteFooter';

export default function Examples() {
  return (
    <div className="site-page">
      <Head>
        <title>Prediction accuracy examples — Pocket Nutrition</title>
        <meta
          name="description"
          content="How well does Pocket Nutrition predict nutrition? Live API predictions compared against Ciqual reference values, across raw ingredients, cooked dishes, vegetables, drinks and packaged products."
        />
        <link rel="canonical" href="https://pocketnutrition.org/examples" />
        <meta name="robots" content="index,follow" />
      </Head>

      <SiteNav active="examples" />

      {
        // This page's cards each call the live API from the browser to compare live predictions
        // against reference values, so it has nothing meaningful to server-render. The header and
        // footer around it are server-rendered.
      }
      <div className="site-page-main">
        <BrowserOnly>
          {() => {
            const ExamplesApp = require('../examples-app/App').default;
            return <ExamplesApp />;
          }}
        </BrowserOnly>
      </div>

      <SiteFooter />
    </div>
  );
}
