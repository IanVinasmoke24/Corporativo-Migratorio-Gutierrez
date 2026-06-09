/* ===================================
   CMG – Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Hamburger menu ────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ── Floating particles ────────────────────────────
  const particleContainer = document.getElementById('particles');
  const createParticle = () => {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: -10px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), 25000);
  };

  // Create initial batch
  for (let i = 0; i < 25; i++) {
    setTimeout(() => createParticle(), i * 300);
  }
  // Keep spawning
  setInterval(createParticle, 1200);

  // ── Smooth scroll for anchor links ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll reveal animation ───────────────────────
  const revealEls = document.querySelectorAll(
    '.service-card, .product-card, .about-content, .about-visual, .process-step, .contact-card, .stat-item, .value-item'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Catalog filter tabs ───────────────────────────
  const catTabs = document.querySelectorAll('.cat-tab');
  const productCards = document.querySelectorAll('.product-card');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      productCards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ── Active nav link on scroll ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--gold-light)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeSectionObserver.observe(s));

  // ── Counter animation for stats ───────────────────
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.textContent;
        const num = parseInt(target.replace(/\D/g, ''));
        const suffix = target.replace(/[\d]/g, '');
        let current = 0;
        const increment = num / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) {
            current = num;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  // ── Lightbox for reference images ─────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBack  = document.getElementById('lightboxBackdrop');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  // Attach click to every reference image wrap
  document.querySelectorAll('.ref-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('.ref-img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBack.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── Navbar scroll-spy effect ──────────────────────
  console.log('%cCMG – Corporativo Migratorio Gutiérrez', 'color: #c9a84c; font-size: 16px; font-weight: bold;');
  console.log('%cDiseño web premium', 'color: #888; font-size: 12px;');

  // ── Shopping Cart ─────────────────────────────────
  let cart = [];

  const cartDrawer      = document.getElementById('cartDrawer');
  const cartOverlay     = document.getElementById('cartOverlay');
  const cartToggleBtn   = document.getElementById('cartToggleBtn');
  const cartCloseBtn    = document.getElementById('cartCloseBtn');
  const cartBadge       = document.getElementById('cartBadge');
  const cartCountLabel  = document.getElementById('cartCountLabel');
  const cartEmpty       = document.getElementById('cartEmpty');
  const cartItemsList   = document.getElementById('cartItemsList');
  const cartFooter      = document.getElementById('cartFooter');
  const cartSubtotal    = document.getElementById('cartSubtotal');
  const cartTotal       = document.getElementById('cartTotal');
  const cartClearBtn    = document.getElementById('cartClearBtn');

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartToggleBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
  });

  function formatPrice(n) {
    return '$' + n.toLocaleString('es-MX') + ' MXN';
  }

  function updateBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty > 0) {
      cartBadge.textContent = totalQty;
      cartBadge.style.display = 'flex';
    } else {
      cartBadge.style.display = 'none';
    }
    cartCountLabel.textContent = totalQty + (totalQty === 1 ? ' servicio' : ' servicios');
  }

  function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartSubtotal.textContent = formatPrice(subtotal);
    cartTotal.textContent = formatPrice(subtotal);
    updateCheckoutLink();
  }

  function updateCheckoutLink() {
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (!checkoutBtn) return;
    if (cart.length === 0) { checkoutBtn.href = '#'; return; }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // PayPal.me con monto automático en la URL (MXN)
    checkoutBtn.href = `https://www.paypal.com/paypalme/consultoriajas/${subtotal}MXN`;
  }

  function renderCart() {
    cartItemsList.innerHTML = '';
    const hasItems = cart.length > 0;
    cartEmpty.style.display = hasItems ? 'none' : 'flex';
    cartItemsList.style.display = hasItems ? 'flex' : 'none';
    cartFooter.style.display = hasItems ? 'block' : 'none';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name" title="${item.name}">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" data-id="${item.id}" data-action="dec">−</button>
          <span class="cart-qty-num">${item.qty}</span>
          <button class="cart-qty-btn" data-id="${item.id}" data-action="inc">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Eliminar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      `;
      cartItemsList.appendChild(li);
    });

    // Qty buttons
    cartItemsList.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const idx = cart.findIndex(i => i.id === id);
        if (idx === -1) return;
        if (action === 'inc') {
          cart[idx].qty++;
        } else {
          cart[idx].qty--;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
        }
        updateBadge();
        updateTotals();
        renderCart();
      });
    });

    // Remove buttons
    cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        cart = cart.filter(i => i.id !== id);
        updateBadge();
        updateTotals();
        renderCart();
      });
    });

    updateTotals();
    updateBadge();
  }

  // Clear cart
  cartClearBtn.addEventListener('click', () => {
    cart = [];
    updateBadge();
    renderCart();
  });

  // Show toast
  let toastTimer;
  function showToast(name) {
    let toast = document.getElementById('cartToastEl');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cartToastEl';
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      ¡${name} agregado al carrito!
    `;
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Global addToCart function (called from onclick in HTML)
  window.addToCart = function(name, price) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    updateBadge();
    renderCart();
    showToast(name);
    // Briefly show cart then close to indicate item was added
    openCart();
  };

  // Initialize cart UI
  renderCart();

});

