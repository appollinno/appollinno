/**
 * Locale-aware content resolution.
 *
 * Both locales expose identical shapes — same ids, same images, same counts —
 * so every renderer works against either without branching. `assertParity()`
 * is exercised by the unit tests, because a structural drift between the two
 * would show up as a broken page rather than as a missing translation.
 */
import * as productsEn from './products.js';
import * as productsPt from './pt/products.js';
import * as servicesEn from './services.js';
import * as servicesPt from './pt/services.js';
import * as standardsEn from './standards.js';
import * as standardsPt from './pt/standards.js';
import * as industriesEn from './industries.js';
import * as industriesPt from './pt/industries.js';
import * as clientsEn from './clients.js';
import * as clientsPt from './pt/clients.js';

const BUNDLES = {
  en: {
    categories: productsEn.categories,
    categoryOptions: productsEn.categoryOptions,
    services: servicesEn.services,
    workflow: servicesEn.workflow,
    families: standardsEn.families,
    industries: industriesEn.industries,
    clients: clientsEn.clients,
  },
  pt: {
    categories: productsPt.categories,
    categoryOptions: productsPt.categoryOptions,
    services: servicesPt.services,
    workflow: servicesPt.workflow,
    families: standardsPt.families,
    industries: industriesPt.industries,
    clients: clientsPt.clients,
  },
};

export function contentFor(locale = 'en') {
  const bundle = BUNDLES[locale];
  if (!bundle) throw new Error(`[content] no bundle for locale "${locale}"`);
  return bundle;
}

/** Returns a list of structural differences between the locales. */
export function assertParity() {
  const problems = [];
  const en = BUNDLES.en;
  const pt = BUNDLES.pt;

  const ids = (arr) => arr.map((x) => x.id).join(',');
  if (ids(en.categories) !== ids(pt.categories)) problems.push('category ids differ');
  if (ids(en.services) !== ids(pt.services)) problems.push('service ids differ');
  if (ids(en.families) !== ids(pt.families)) problems.push('standards family ids differ');
  if (ids(en.industries) !== ids(pt.industries)) problems.push('industry ids differ');

  const items = (cs) => cs.reduce((a, c) => a + c.groups.reduce((x, g) => x + g.items.length, 0), 0);
  if (items(en.categories) !== items(pt.categories)) {
    problems.push(`catalogue size differs: en ${items(en.categories)} vs pt ${items(pt.categories)}`);
  }
  for (const key of ['categories', 'industries', 'families']) {
    const a = en[key].map((x) => x.image).join(',');
    const b = pt[key].map((x) => x.image).join(',');
    if (a !== b) problems.push(`${key} imagery differs between locales`);
  }
  if (en.workflow.length !== pt.workflow.length) problems.push('workflow step count differs');
  if (en.clients.length !== pt.clients.length) problems.push('client count differs');
  if (en.clients.map((c) => c.name).join(',') !== pt.clients.map((c) => c.name).join(',')) {
    problems.push('client names differ — proper names must not be translated');
  }
  return problems;
}
