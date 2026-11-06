/*
  Arkorra — lightweight AJAX cart (Vanilla JS, ADR-0001).

  Usage: any <form data-ark-add-form action="/cart/add"> is submitted via
  the Cart AJAX API. Without JS the form still posts normally to /cart/add.

  - Updates every [data-ark-cart-count] element with the new item count.
  - The submit button shows `data-success-label` for a moment.
  - Errors are written to the form's [data-ark-form-error] element.
  - Dispatches `ark:cart:updated` on document with the cart JSON.
*/
(() => {
  if (window.ArkCart) return;

  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  const updateCount = (count) => {
    document.querySelectorAll('[data-ark-cart-count]').forEach((el) => {
      el.textContent = count;
      el.hidden = false;
    });
    // Keep legacy theme counters in sync where they still exist.
    document.querySelectorAll('#CartCount, #CartCountCavas').forEach((el) => {
      el.textContent = count;
    });
  };

  const refresh = async () => {
    const res = await fetch(`${root}cart.js`, { headers: { Accept: 'application/json' } });
    const cart = await res.json();
    updateCount(cart.item_count);
    document.dispatchEvent(new CustomEvent('ark:cart:updated', { detail: { cart } }));
    return cart;
  };

  const flashButton = (button) => {
    if (!button) return;
    const label = button.querySelector('[data-ark-button-label]');
    const icon = button.querySelector('.ark-icon');
    const original = { label: label && label.textContent, icon: icon && icon.textContent };

    button.classList.remove('is-loading');
    button.classList.add('is-success');
    if (label && button.dataset.successLabel) label.textContent = button.dataset.successLabel;
    if (icon) icon.textContent = 'check';

    window.setTimeout(() => {
      button.classList.remove('is-success');
      if (label && original.label) label.textContent = original.label;
      if (icon && original.icon) icon.textContent = original.icon;
    }, 2200);
  };

  const onSubmit = async (event) => {
    const form = event.target.closest('form[data-ark-add-form]');
    if (!form) return;
    event.preventDefault();

    const button = form.querySelector('[type="submit"]');
    const errorEl = form.querySelector('[data-ark-form-error]');
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    if (button) button.classList.add('is-loading');

    try {
      const res = await fetch(`${root}cart/add.js`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.description || data.message || 'Erro ao adicionar ao carrinho.');
      flashButton(button);
      await refresh();
    } catch (error) {
      if (button) button.classList.remove('is-loading');
      if (errorEl) {
        errorEl.textContent = error.message;
        errorEl.hidden = false;
      } else {
        window.alert(error.message);
      }
    }
  };

  document.addEventListener('submit', onSubmit);
  window.ArkCart = { refresh, updateCount };
})();
