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
      const href = anchor.getAttribute('href');
      // Si el href ya no es un ancla local (fue cambiado a URL externa), dejar navegar normal
      if (!href || !href.startsWith('#') || href.length <= 1) return;
      e.preventDefault();
      const target = document.querySelector(href);
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
  }

  function renderCart() {
    cartItemsList.innerHTML = '';
    const hasItems = cart.length > 0;
    cartEmpty.style.display = hasItems ? 'none' : 'flex';
    cartItemsList.style.display = hasItems ? 'flex' : 'none';
    cartFooter.style.display = hasItems ? 'block' : 'none';

    const btnContainer = document.getElementById('paypal-button-container');
    if (btnContainer) btnContainer.style.display = hasItems ? 'block' : 'none';

    if (hasItems && !paypalButtonsRendered) {
      renderPayPalButtons();
    }

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
    openCart();
  };

  // Initialize cart UI
  renderCart();

  // PayPal Smart Buttons Implementation
  let paypalButtonsRendered = false;

  function renderPayPalButtons() {
    if (!window.paypal) {
      console.warn('PayPal SDK not loaded yet, retrying in 500ms...');
      setTimeout(renderPayPalButtons, 500);
      return;
    }

    if (paypalButtonsRendered) return;
    
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    container.innerHTML = '';

    paypal.Buttons({
      createOrder: function (data, actions) {
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: "MXN",
              value: total
            },
            description: "Servicios Migratorios CMG"
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then((captureData) => {
            if (captureData.status === "COMPLETED") {
              const orderId = captureData.id || "N/A";
              let payerName = "";
              if (captureData.payer && captureData.payer.name) {
                payerName = (captureData.payer.name.given_name || "") + " " + (captureData.payer.name.surname || "");
                payerName = payerName.trim();
              }
              
              const receiptData = {
                orderId: orderId,
                date: new Date().toLocaleString('es-MX'),
                payer: payerName,
                items: [...cart],
                total: cart.reduce((sum, item) => sum + item.price * item.qty, 0)
              };
              window.lastReceiptData = receiptData;
              
              cart = [];
              updateBadge();
              renderCart();
              closeCart();
              
              const successOverlay = document.getElementById('successOverlay');
              const successOrderId = document.getElementById('successOrderId');
              const successClientName = document.getElementById('successClientName');
              
              if (successOrderId) successOrderId.textContent = orderId;
              if (successClientName && payerName) successClientName.value = payerName;
              if (successOverlay) successOverlay.classList.add('active');
            } else {
              alert("El pago fue rechazado. Intenta con otra tarjeta.");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("Hubo un problema al procesar la tarjeta.");
          });
      },
      onError: function (err) {
        console.error("PayPal Buttons Error:", err);
        alert("Ocurrió un error al cargar el pago. Intenta de nuevo o verifica tu conexión.");
      }
    }).render("#paypal-button-container");
    
    paypalButtonsRendered = true;
  }

  // Success Modal logic
  const successOverlay = document.getElementById('successOverlay');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const successWaBtn = document.getElementById('successWaBtn');
  const successDownloadBtn = document.getElementById('successDownloadBtn');
  const successClientName = document.getElementById('successClientName');
  const successOrderId = document.getElementById('successOrderId');

  const closeSuccessModal = () => {
    if (successOverlay) successOverlay.classList.remove('active');
  };

  if (successCloseBtn) successCloseBtn.addEventListener('click', closeSuccessModal);
  
  if (successDownloadBtn) {
    successDownloadBtn.addEventListener('click', () => {
      const data = window.lastReceiptData;
      if (!data) return;
      
      const clientName = (successClientName && successClientName.value.trim()) ? successClientName.value.trim() : (data.payer || 'Cliente');
      
      let itemsHtml = '';
      data.items.forEach(item => {
        itemsHtml += `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ddd; font-size: 15px;">
            <span style="color: #444;">${item.qty}x ${item.name}</span>
            <span style="font-weight: 600; color: #111;">$${(item.price * item.qty).toLocaleString('es-MX')} MXN</span>
          </div>
        `;
      });

      const printArea = document.getElementById('printReceiptArea');
      if (!printArea) return;

      printArea.innerHTML = `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #060e1f; margin: 0; font-size: 24px;">Corporativo Migratorio Gutiérrez</h1>
            <h2 style="color: #c9a84c; margin: 5px 0 0 0; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">Comprobante de Pago</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 24px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #eee;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Monto Total Pagado</div>
              <div style="font-size: 36px; font-weight: bold; color: #060e1f; margin-top: 5px;">$${data.total.toLocaleString('es-MX')} MXN</div>
              <div style="display: inline-block; background: #e6f8ec; color: #16a34a; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 12px; border: 1px solid #bbf7d0;">
                ✔ PAGO APROBADO
              </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr><td style="padding: 10px 0; color: #666; border-bottom: 1px solid #eee;">Fecha y Hora:</td><td style="padding: 10px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #eee;">${data.date}</td></tr>
              <tr><td style="padding: 10px 0; color: #666; border-bottom: 1px solid #eee;">Folio de Autorización:</td><td style="padding: 10px 0; text-align: right; font-weight: bold; font-family: monospace; font-size: 16px; border-bottom: 1px solid #eee;">${data.orderId}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;">Nombre del Cliente:</td><td style="padding: 10px 0; text-align: right; font-weight: bold;">${clientName}</td></tr>
            </table>
          </div>

          <h3 style="font-size: 16px; color: #060e1f; border-bottom: 2px solid #060e1f; padding-bottom: 10px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Detalle de Servicios</h3>
          ${itemsHtml}
          
          <div style="margin-top: 50px; text-align: center; font-size: 13px; color: #888; line-height: 1.6;">
            <p>Este documento es un comprobante de pago electrónico válido.<br>Por favor guárdelo para cualquier aclaración sobre su trámite migratorio.</p>
            <p style="margin-top: 15px; font-weight: bold; color: #666;">Gracias por su confianza.</p>
          </div>
        </div>
      `;

      // Wait a tiny bit for the DOM to update, then print
      setTimeout(() => {
        window.print();
      }, 100);
    });
  }

  if (successWaBtn) {
    successWaBtn.addEventListener('click', () => {
      const clientName = (successClientName && successClientName.value.trim()) ? successClientName.value.trim() : 'Cliente';
      const orderId = (successOrderId && successOrderId.textContent) ? successOrderId.textContent : 'Desconocida';
      
      const message = `Hola Corporativo Migratorio Gutiérrez, acabo de realizar el pago de mi(s) servicio(s).\n\n*Nombre:* ${clientName}\n*Orden PayPal:* ${orderId}\n\nAdjunto mi comprobante de pago para iniciar mi trámite.`;
      
      const waUrl = `https://wa.me/5217621259045?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      closeSuccessModal();
    });
  }

});

