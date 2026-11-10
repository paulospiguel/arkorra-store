/* Arkorra — Motion (ark-motion.js)
   Tags elements for scroll reveal and staggers siblings. No markup changes needed. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  root.classList.add('ark-motion');

  // Hero children stagger on load (CSS animation reads --ark-i)
  function indexChildren(parent, selector) {
    var kids = selector ? parent.querySelectorAll(selector) : parent.children;
    Array.prototype.forEach.call(kids, function (el, i) {
      el.style.setProperty('--ark-i', Math.min(i, 8));
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.ark-hero__content'), function (c) {
      indexChildren(c);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.ark-trust-bar__grid'), function (c) {
      indexChildren(c);
    });

    // Groups whose children reveal one after another
    var groups = [
      '.ark-catalog__grid',
      '.ark-collection__grid',
      '.ark-cards__grid',
      '.ark-testimonials__grid',
      '.ark-steps__list',
      '.ark-trust-bar__grid',
      '.ark-footer__grid',
      '.ark-lead__grid'
    ];

    // Single blocks that reveal on their own (everything below the hero)
    var singles = [
      '.ark-section-head',
      '.ark-cards__head',
      '.ark-protocol__intro',
      '.ark-protocol__stack > *:not(.ark-protocol__intro)',
      '.ark-about__grid > *',
      '.ark-collection__banner',
      '.ark-pdp-section-title',
      '.ark-pdp-section-sub',
      '.ark-pdp-bundle',
      '.ark-notice'
    ];

    var targets = [];

    groups.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (group) {
        Array.prototype.forEach.call(group.children, function (el, i) {
          el.setAttribute('data-ark-reveal', '');
          el.style.setProperty('--ark-i', Math.min(i, 6));
          targets.push(el);
        });
      });
    });

    singles.forEach(function (sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
        if (el.hasAttribute('data-ark-reveal')) return;
        if (el.closest('.ark-hero, .ark-header-section')) return;
        el.setAttribute('data-ark-reveal', '');
        targets.push(el);
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.ark-progress__bar'), function (bar) {
      bar.setAttribute('data-ark-bar', '');
      targets.push(bar);
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });

    // Anchor jumps or fast scrolls can skip elements entirely: reveal anything already above the viewport
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        targets.forEach(function (el) {
          if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom < 0) {
            el.classList.add('is-in');
            io.unobserve(el);
          }
        });
      });
    }, { passive: true });

    // Safety net: never leave content hidden if the observer misbehaves
    window.setTimeout(function () {
      targets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Theme editor: re-run when a section is added or reloaded
  document.addEventListener('shopify:section:load', init);
})();
