/**
 * Entry point.
 *
 * Everything here is progressive: the site is fully readable and navigable
 * with JavaScript disabled or failing. This file only adds behaviour.
 */
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initSectionIndex, initCategoryPrefill } from './products.js';
import { initContactForm } from './forms.js';

function boot() {
  initNavigation();
  initSectionIndex();
  initCategoryPrefill();
  initContactForm();

  // Motion last: it is the only optional layer, and it must never be able to
  // stop the functional modules above from initialising.
  initAnimations().catch((err) => {
    console.warn('[abce] motion failed to initialise.', err);
    document.documentElement.classList.remove('js-motion');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
