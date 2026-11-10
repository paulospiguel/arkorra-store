/*
  Arkorra — cart page quantity controls.

  The legacy cart template ships +/- buttons (.js-qty__adjust) and a quantity
  input (.cart__qty-input) with no script behind them. This wires them to the
  Cart AJAX API (/cart/change.js) and reloads the page with the new totals.
  Remove links keep working without JS (/cart/change?line=N&quantity=0).
*/
(() => {
  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  let busy = false;

  const change = async (line, quantity) => {
    if (busy) return;
    busy = true;
    document.documentElement.classList.add('ark-cart-busy');
    try {
      const res = await fetch(`${root}cart/change.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity }),
      });
      if (!res.ok) throw new Error('change failed');
      window.location.reload();
    } catch (e) {
      busy = false;
      document.documentElement.classList.remove('ark-cart-busy');
      window.location.reload();
    }
  };

  const rowOf = (el) => el.closest('.cart_item');
  const inputOf = (row) => row && row.querySelector('.cart__qty-input');

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('.js-qty__adjust');
    if (!btn) return;
    event.preventDefault();
    const input = inputOf(rowOf(btn));
    if (!input) return;
    const current = parseInt(input.value, 10) || 1;
    const next = btn.classList.contains('plus') ? current + 1 : current - 1;
    const max = parseInt(input.dataset.max, 10);
    if (next < 1) return;
    if (max > 0 && next > max) return;
    input.value = next;
    change(parseInt(input.dataset.line, 10), next);
  });

  document.addEventListener('change', (event) => {
    const input = event.target.closest('.cart__qty-input');
    if (!input) return;
    const value = Math.max(1, parseInt(input.value, 10) || 1);
    input.value = value;
    change(parseInt(input.dataset.line, 10), value);
  });

  // Enter in the quantity field must not submit the checkout form.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.closest('.cart__qty-input')) {
      event.preventDefault();
      event.target.blur();
    }
  });
})();
