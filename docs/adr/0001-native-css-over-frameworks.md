# 0001 - Native Modern Modular CSS over Frameworks (Bootstrap and Tailwind)

## Context
The theme currently relies on Bootstrap 4 embedded inside a monolithic `assets/novstyle.css` (581 KB) and Bootstrap JS plugins in `assets/vendor.js`. We initially evaluated migrating to Tailwind CSS v4, which would require adding a Node.js/npm build pipeline (`@tailwindcss/cli`) to what is currently a pure Liquid Shopify theme repository.

## Decision
We decided to bypass external CSS frameworks (both Bootstrap and Tailwind) and migrate directly to **Native Modern Modular CSS** following the official Shopify Dawn architecture:
- `assets/base.css`: Modern CSS reset, theme design tokens (bound to Shopify Liquid `css-variables.liquid`), global typography, and universal CSS Grid / Flexbox layout primitives.
- `assets/section-*.css` and `assets/component-*.css`: Scoped component stylesheets loaded conditionally at the section level (`{{ 'section-header.css' | asset_url | stylesheet_tag }}`).
- **BEM semantic naming** (`.block__element--modifier`) for class definitions to ensure clear scoping and maintainability.
- **Vanilla JS & Native HTML**: Interactive patterns (modals, drawers, accordions) implemented with native HTML (`<dialog>`, `<details>`) and lightweight Vanilla JS, removing Bootstrap JS and jQuery dependencies.

## Why
1. **Zero build pipeline**: The repository remains 100% native to Shopify. No Node.js dependencies, CLI watchers, or CI/CD build steps required. Changes can be pushed via Shopify CLI or edited directly in the Shopify Admin code editor without breaking.
2. **Superior web performance**: Stylesheets are loaded on-demand per section, eliminating dead CSS and drastically improving Largest Contentful Paint (LCP) and Core Web Vitals compared to monolithic framework bundles.
3. **Modern web standards**: Modern CSS now provides native nesting (`&`), CSS Grid, Flexbox gap, `@container` queries, and CSS Custom Properties natively across all modern browsers, making preprocessors and utility frameworks unnecessary for theme styling.

## Considered Options
- **Bootstrap 4 (Status Quo)**: Rejected due to monolithic bundle size (581 KB), legacy grid calculations with negative margins, and heavy jQuery/Bootstrap JS dependencies.
- **Tailwind CSS v4**: Rejected due to the operational overhead of a build pipeline, class pollution in Liquid templates, and lack of support for direct Shopify Admin editing.

