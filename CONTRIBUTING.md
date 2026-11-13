# Contributing

This repository holds the website and its documentation: a Docusaurus site (React, TypeScript, a
little Tailwind for the two tool pages). See [README.md](README.md) for the layout, and for the
repositories of the apps, the API and the Food Dataset.

## Local preview

```bash
npm ci
npm start                 # http://localhost:3000, hot reload
npm run build             # must succeed: broken internal links fail the build
```

Or with the real server: `docker build -t pn-website . && docker run --rm -p 8080:80 pn-website`.

## Making changes

- Pages live in `src/pages/`; the homepage sections are in `src/components/`.
- The documentation is not in this repository yet: it will be published here once a maintainer has
  reviewed it.
- The header and footer (`src/components/site-nav/`, `src/components/site-footer/`) are shared by every
  Pocket Nutrition site, and the Food Dataset site (pocket-nutrition/community) repeats them. Change
  their links in both repositories, never in one alone.
- Tailwind classes are only available inside the calculator (`.pn-calculator`) and examples
  (`.pn-examples`) pages. Do not import Tailwind's preflight: it would restyle the whole site.
- Keep the privacy policy accurate: it is linked from the App Store and Play Store listings.

## Submitting a pull request

1. Fork the repo and create a branch for your change.
2. Run `npm run build` and look at the result in a browser (`npm run serve`).
3. Open a pull request describing what changed and why.

## Reporting issues

Use the [issue templates](.github/ISSUE_TEMPLATE) to report a bug or request a change.

## CI and releases

- Every pull request runs `.github/workflows/ci.yml`. The `ci-success` check must be green before a pull
  request can be merged, the branch must be up to date with `main`, and pull requests are squash-merged
  so history stays linear.
- If you contribute from a fork, the workflow waits for a maintainer to approve it. It runs with a
  read-only token and no secrets.
- Every commit merged to `main` is released automatically with a CalVer version, `vYYYY.M.N`: the year, the
  month, then a counter that restarts at 1 each month (for example `v2026.11.1`). You never pick a version
  number or edit a changelog; release notes are generated from the merged pull requests.
- A release publishes the container image `ghcr.io/pocket-nutrition/pocket-nutrition`.
