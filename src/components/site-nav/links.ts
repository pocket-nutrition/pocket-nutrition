/**
 * Addresses outside this site that the shared header and footer point at. The Food Dataset
 * (pocket-nutrition-community, app/templates/base.html) draws the same header and footer in Jinja,
 * with the same links in the same order: change both together.
 */
export const FOOD_DATASET_URL = 'https://community.pocketnutrition.org';
export const API_REFERENCE_URL = 'https://api.pocketnutrition.org/swagger-ui/index.html';
export const GITHUB_URL = 'https://github.com/pocket-nutrition';
/** The one repository visitors are asked to star, so stars add up in one place instead of across every repo. */
export const STAR_REPO_URL = 'https://github.com/pocket-nutrition/pocket-nutrition';
/** Gatus status page, served on its own: a plain link, so neither site needs the other to load. */
export const STATUS_URL = 'https://status.pocketnutrition.org';
