/**
 * Addresses outside this site that the shared header and footer point at. The Food Dataset
 * (pocket-nutrition-community, app/templates/base.html) and the journal viewer
 * (pocket-nutrition-vault-web, public/index.html) draw the same header and footer
 * with the same links in the same order: change all three together.
 */
export const FOOD_DATASET_URL = 'https://community.pocketnutrition.org';
/** Read-only journal viewer, decrypted in the browser (pocket-nutrition-vault-web). */
export const JOURNAL_URL = 'https://me.pocketnutrition.org';
export const API_REFERENCE_URL = 'https://api.pocketnutrition.org/swagger-ui/index.html';
export const GITHUB_URL = 'https://github.com/pocket-nutrition';
/** The one repository visitors are asked to star, so stars add up in one place instead of across every repo. */
export const STAR_REPO_URL = 'https://github.com/pocket-nutrition/pocket-nutrition';
/** Gatus status page, served on its own: a plain link, so neither site needs the other to load. */
export const STATUS_URL = 'https://status.pocketnutrition.org';
