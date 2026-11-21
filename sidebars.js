// @ts-check

/**
 * The documentation sidebar (docs/). A doc's id is its path under docs/ without the extension;
 * new guides go under the category they belong to. Categories are never links: a section's
 * overview is its first page, so every clickable entry looks like a page. Top-level categories start
 * open, so a reader sees how much there is; nested ones start collapsed.
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    'intro',
    'how-it-works',
    {
      type: 'category',
      label: 'Install the apps',
      collapsed: false,
      items: ['install/android'],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'architecture/overview',
        'architecture/nutrition-request',
        'architecture/data-sources',
        'architecture/cooking-model',
        'architecture/search-index',
        'architecture/daily-targets',
        'architecture/vault',
        'architecture/recognition',
        'architecture/feedback',
      ],
    },
    {
      type: 'category',
      label: 'Contribute',
      collapsed: false,
      items: ['contribute/food-dataset', 'contribute/knowledge-editor'],
    },
    {
      type: 'category',
      label: 'Self-hosting',
      collapsed: false,
      items: [
        'self-hosting/overview',
        {
          type: 'category',
          label: 'Docker Compose',
          collapsed: true,
          items: [
            'self-hosting/docker-compose',
            'self-hosting/run-the-api',
            'self-hosting/host-the-vault',
            'self-hosting/voice-and-photo',
            'self-hosting/https',
          ],
        },
        'self-hosting/training-bench',
        'self-hosting/packaged-foods',
        'self-hosting/connect-the-apps',
      ],
    },
    'glossary',
  ],
};

export default sidebars;
