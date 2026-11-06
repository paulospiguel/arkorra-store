/*
  Arkorra — Product page controller (Vanilla JS, ADR-0001).
  Handles thumbnail switching, bundle/variant selection, quantity stepper,
  live total calculation (Buy Box + CTA + Sticky bar), and sticky triggers.
*/
(() => {
  const formatMoney = (cents) => {
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      const fmt = (window.theme && window.theme.moneyFormat) || window.Shopify.money_format;
      if (fmt) return window.Shopify.formatMoney(cents, fmt);
    }
    return `${(cents / 100).toFixed(2).replace('.', ',')} €`;
  };

  document.querySelectorAll('[data-ark-pdp]').forEach((root) => {
    if (root.dataset.arkReady) return;
    root.dataset.arkReady = 'true';

    const stageImg = root.querySelector('#ArkPdpStageImg');
    const thumbs = root.querySelectorAll('[data-ark-thumb]');
    const form = root.querySelector('form[data-ark-add-form]');
    const variantInput = root.querySelector('[data-ark-variant-id]');
    const bundlePropInput = root.querySelector('[data-ark-bundle-prop]');
    const priceEl = root.querySelector('[data-ark-price]');
    const compareEl = root.querySelector('[data-ark-compare]');
    const savingEl = root.querySelector('[data-ark-saving]');
    const stickyPriceEl = root.querySelector('[data-ark-sticky-price]');
    const submitBtn = root.querySelector('[data-ark-submit]');
    const submitLabel = submitBtn && submitBtn.querySelector('[data-ark-button-label]');
    const qtyDisplay = root.querySelector('[data-ark-qty-display]');
    const qtyInput = root.querySelector('[data-ark-qty-input]');
    const bundleRadios = root.querySelectorAll('[data-ark-bundle]');
    const bundleCards = root.querySelectorAll('[data-ark-bundle-card]');

    let unitPrice = parseInt(root.dataset.basePrice, 10) || 18900;
    let unitCompare = parseInt(root.dataset.baseCompare, 10) || 23500;
    let qty = 1;

    // 1. Thumbnail gallery
    const activateThumb = (btn) => {
      if (!btn || !stageImg) return;
      stageImg.src = btn.dataset.src;
      if (btn.dataset.srcset) stageImg.srcset = btn.dataset.srcset;
      if (btn.dataset.alt) stageImg.alt = btn.dataset.alt;
      thumbs.forEach((t) => t.classList.toggle('is-active', t === btn));
    };

    thumbs.forEach((btn) => {
      btn.addEventListener('click', () => activateThumb(btn));
    });

    // 2. Price & CTA updater
    const renderPrices = () => {
      const total = unitPrice * qty;
      const totalCompare = unitCompare * qty;
      const formatted = formatMoney(total);

      if (priceEl) priceEl.textContent = formatted;
      if (stickyPriceEl) stickyPriceEl.textContent = formatted;

      if (compareEl) {
        if (totalCompare > total) {
          compareEl.textContent = formatMoney(totalCompare);
          compareEl.hidden = false;
        } else {
          compareEl.hidden = true;
        }
      }

      if (savingEl) {
        if (unitCompare > unitPrice) {
          const pct = Math.round(((unitCompare - unitPrice) * 100) / unitCompare);
          const suffix = savingEl.dataset.savingSuffix || 'Poupança';
          savingEl.textContent = `-${pct}% ${suffix}`.trim();
          savingEl.hidden = false;
        } else {
          savingEl.hidden = true;
        }
      }

      if (submitBtn && submitLabel && !submitBtn.classList.contains('is-success')) {
        const prefix = submitBtn.dataset.ctaPrefix || 'GARANTIR AGORA — ADICIONAR';
        submitLabel.textContent = `${prefix} (${formatted})`;
      }
    };

    // 3. Bundle / Tactical configuration selector
    bundleRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        const p = parseInt(radio.dataset.price, 10);
        const c = parseInt(radio.dataset.compare, 10);
        if (!Number.isNaN(p)) unitPrice = p;
        if (!Number.isNaN(c)) unitCompare = c;

        if (radio.dataset.variantId && variantInput) {
          variantInput.value = radio.dataset.variantId;
          const url = new URL(window.location.href);
          url.searchParams.set('variant', radio.dataset.variantId);
          window.history.replaceState({}, '', url.toString());
        }
        if (radio.dataset.title && bundlePropInput) {
          bundlePropInput.value = radio.dataset.title;
        }

        bundleCards.forEach((card) => {
          card.classList.toggle('is-selected', card.contains(radio));
        });

        renderPrices();
      });
    });

    // 4. Quantity stepper
    root.querySelectorAll('[data-ark-qty-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.dataset.arkQtyStep, 10) || 1;
        qty = Math.max(1, Math.min(9, qty + delta));
        if (qtyDisplay) qtyDisplay.textContent = qty;
        if (qtyInput) qtyInput.value = qty;
        renderPrices();
      });
    });

    // 5. Sticky bar & bottom CTA triggers submit the main product form (or demo flash)
    const demoSubmit = root.querySelector('[data-ark-demo-submit]');
    const runDemoFlash = () => {
      if (!submitBtn || !submitLabel) return;
      const original = submitLabel.textContent;
      submitBtn.classList.add('is-success');
      submitLabel.textContent = submitBtn.dataset.successLabel || 'UNIDADE RESERVADA NO LOTE #04 ✓';
      if (window.ArkCart) {
        const badge = document.querySelector('[data-ark-cart-count]');
        const current = parseInt((badge && badge.textContent) || '0', 10) || 0;
        window.ArkCart.updateCount(current + qty);
      }
      window.setTimeout(() => {
        submitBtn.classList.remove('is-success');
        submitLabel.textContent = original;
      }, 2200);
    };

    if (demoSubmit) {
      demoSubmit.addEventListener('click', runDemoFlash);
    }

    root.querySelectorAll('[data-ark-sticky-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (form && typeof form.requestSubmit === 'function') {
          form.requestSubmit(submitBtn || undefined);
        } else if (demoSubmit) {
          runDemoFlash();
        } else if (submitBtn) {
          submitBtn.click();
        }
      });
    });
  });
})();
