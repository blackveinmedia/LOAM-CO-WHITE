/* Loam Co. — Theme JavaScript */
(function () {
  'use strict';

  /* ── Cart state ──────────────────────────────────────────────────────────── */
  const cartDrawer  = () => document.getElementById('cart-drawer');
  const cartOverlay = () => document.getElementById('cart-overlay');
  const cartBody    = () => document.getElementById('cart-drawer-body');
  const cartTotal   = () => document.getElementById('cart-total');

  function openCart() {
    cartDrawer()?.classList.add('is-open');
    cartOverlay()?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer()?.classList.remove('is-open');
    cartOverlay()?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function formatMoney(cents) {
    return '£' + (cents / 100).toFixed(2);
  }

  async function fetchCart() {
    const res = await fetch('/cart.js');
    return res.json();
  }

  async function refreshCart() {
    const cart = await fetchCart();

    /* Update all cart count badges */
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });

    const body = cartBody();
    if (!body) return;

    if (cart.items.length === 0) {
      body.innerHTML = '<p class="cart-drawer__empty">Bag\'s empty. Get to it.</p>';
    } else {
      body.innerHTML = cart.items.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item__image">
            ${item.image
              ? `<img src="${item.image}" alt="${item.product_title}" width="70" height="70" loading="lazy">`
              : ''}
          </div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.product_title}</div>
            ${item.variant_title && item.variant_title !== 'Default Title'
              ? `<div class="cart-item__variant">${item.variant_title}</div>` : ''}
            <div class="cart-item__price">${formatMoney(item.line_price)}</div>
            <button class="cart-item__remove" data-line="${idx + 1}">Remove</button>
          </div>
        </div>
      `).join('');
    }

    if (cartTotal()) {
      cartTotal().textContent = formatMoney(cart.total_price);
    }
  }

  /* ── Add to cart ─────────────────────────────────────────────────────────── */
  document.body.addEventListener('click', async (e) => {
    /* Cart toggle buttons */
    if (e.target.closest('[data-action="open-cart"]')) {
      openCart();
      return;
    }

    /* Close cart */
    if (e.target.closest('[data-action="close-cart"]')) {
      closeCart();
      return;
    }

    /* Add to cart */
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
      const variantId = addBtn.dataset.variantId;
      if (!variantId) return;

      const originalText = addBtn.textContent;
      addBtn.disabled = true;
      addBtn.textContent = 'ADDING...';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(variantId), quantity: 1 }),
        });

        if (res.ok) {
          addBtn.textContent = '✓ ADDED';
          addBtn.classList.add('is-added');
          await refreshCart();
          openCart();
          setTimeout(() => {
            addBtn.textContent = originalText;
            addBtn.classList.remove('is-added');
            addBtn.disabled = false;
          }, 2000);
        } else {
          const data = await res.json();
          alert(data.description || 'Could not add to cart.');
          addBtn.textContent = originalText;
          addBtn.disabled = false;
        }
      } catch {
        addBtn.textContent = originalText;
        addBtn.disabled = false;
      }
      return;
    }

    /* Remove from cart */
    const removeBtn = e.target.closest('.cart-item__remove');
    if (removeBtn) {
      const line = parseInt(removeBtn.dataset.line);
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line, quantity: 0 }),
      });
      await refreshCart();
      return;
    }

    /* Checkout button */
    if (e.target.closest('[data-action="checkout"]')) {
      window.location.href = '/checkout';
    }
  });

  /* ── Cart overlay click to close ─────────────────────────────────────────── */
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  /* ── Variant selector ────────────────────────────────────────────────────── */
  document.querySelectorAll('.variant-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.variant-selector__options');
      group?.querySelectorAll('.variant-option').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      const variantId = btn.dataset.variantId;
      const addBtn = document.querySelector('[data-add-to-cart]');
      if (addBtn && variantId) {
        addBtn.dataset.variantId = variantId;
        const available = btn.dataset.available !== 'false';
        addBtn.disabled = !available;
        addBtn.textContent = available ? 'ADD TO CART' : 'SOLD OUT';
      }

      /* Update price display */
      const price = btn.dataset.price;
      const compare = btn.dataset.comparePrice;
      const priceEl = document.querySelector('.product-page__price');
      const compareEl = document.querySelector('.product-page__compare-price');
      if (priceEl && price) priceEl.textContent = formatMoney(parseInt(price));
      if (compareEl) {
        compareEl.textContent = compare && parseInt(compare) > parseInt(price)
          ? formatMoney(parseInt(compare)) : '';
      }
    });
  });

  /* ── Product gallery thumbnails ──────────────────────────────────────────── */
  document.querySelectorAll('.product-page__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImg = document.querySelector('.product-page__main-image img');
      if (mainImg && thumb.dataset.src) {
        mainImg.src = thumb.dataset.src;
        mainImg.srcset = '';
      }
      document.querySelectorAll('.product-page__thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  /* ── FAQ accordion ───────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      /* Close all */
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      /* Toggle current */
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ── Newsletter form ─────────────────────────────────────────────────────── */
  document.querySelectorAll('.js-newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('[name="contact[email]"]');
      if (!emailInput?.value) return;

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      try {
        const fd = new FormData(form);
        await fetch(form.action || '/contact', { method: 'POST', body: fd });

        const wrapper = form.closest('.js-newsletter-wrapper');
        if (wrapper) {
          wrapper.innerHTML = '<div class="newsletter-form--success">You\'re in. See you on the trails.</div>';
        }
      } catch {
        if (btn) btn.disabled = false;
      }
    });
  });

  /* ── Ambassador apply form ───────────────────────────────────────────────── */
  document.querySelectorAll('.js-apply-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'SENDING...'; }

      try {
        const fd = new FormData(form);
        await fetch('/contact', { method: 'POST', body: fd });

        const wrapper = form.closest('.js-apply-wrapper');
        if (wrapper) {
          const email = fd.get('contact[email]') || 'your inbox';
          wrapper.innerHTML = `
            <div class="form-success">
              <div class="form-success__title">Got it. We'll be in touch.</div>
              <div class="form-success__sub">Confirmation sent to <strong>${email}</strong>. Expect a reply within 7 days.</div>
            </div>`;
        }
      } catch {
        if (btn) { btn.disabled = false; btn.textContent = 'SUBMIT APPLICATION'; }
      }
    });
  });

  /* ── Copy to clipboard (dashboard) ──────────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = 'COPIED';
        btn.classList.add('is-copied');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('is-copied'); }, 1500);
      } catch { /* clipboard unavailable */ }
    });
  });

  /* ── Dashboard tab nav ───────────────────────────────────────────────────── */
  document.querySelectorAll('[data-dash-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.dashNav;
      document.querySelectorAll('[data-dash-nav]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.querySelectorAll('[data-dash-panel]').forEach(p => {
        p.style.display = p.dataset.dashPanel === target ? 'block' : 'none';
      });
    });
  });

  /* ── Init: refresh cart count on page load ───────────────────────────────── */
  fetchCart().then(cart => {
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });
  }).catch(() => {});

})();
