/* ==========================================================================
   Lumin Death — script.js
   ==========================================================================
   One script for the whole site. Each page only runs the parts it needs,
   because every block checks for its own container before doing anything.

   Contents
     1.  Product catalogue
     2.  Helpers
     3.  Cart store (localStorage)
     4.  Header: cart badge + mobile nav
     5.  Product card rendering
     6.  Home page: featured products
     7.  Products page: category tabs + grid
     8.  Product detail panel
     9.  Cart page
     10. Form validation (contact + checkout)
   ========================================================================== */


/* ==========================================================================
   1. Product catalogue
   ==========================================================================
   Adding a product = adding one object here. Nothing else needs editing.

     id          unique string, also used in the cart and in ?product=
     name        display name
     price       number, GBP
     category    one of the CATEGORIES ids below
     images      array of paths from Pages/ — see below
     description short paragraph shown in the detail panel
     specs       label → value rows in the detail panel

   IMAGES
   Give each product its own folder under media/images/ and list its photos
   here in the order they should appear:

     images: [
       '../media/images/my-product/front.webp',   // [0] the card thumbnail
       '../media/images/my-product/back.webp',
       '../media/images/my-product/detail.webp',
     ],

   The FIRST image is what shows on the product card and in the cart. The
   detail panel shows all of them: one large, the rest as thumbnails you can
   click to swap. There is no limit — list two, three, or ten and the gallery
   sizes itself. A single image simply renders with no thumbnail strip.

   An empty array means the photography has not arrived yet and the striped
   "Image pending" tile is shown instead.
   ========================================================================== */

const CATEGORIES = [
  { id: 'tees', name: 'Tees' },
  { id: 'hoodies', name: 'Hoodies' },
  { id: 'outerwear', name: 'Outerwear' },
  { id: 'accessories', name: 'Accessories' },
];

const PRODUCTS = [
  /* ---------------------------------------------------------- TEES ------ */
  {
    id: 'ossuary-tee',
    name: 'Ossuary Tee',
    price: 45,
    category: 'tees',
    images: [
      '../media/images/tees/Ossuary Tee/oversized-vintage-t-shirt-aegis-black-m-techwear-storm-978.jpg',
      '../media/images/tees/Ossuary Tee/oversized-vintage-t-shirt-aegis-techwear-storm-294.webp',
      '../media/images/tees/Ossuary Tee/oversized-vintage-t-shirt-aegis-techwear-storm-956.jpg'
    ],
    description:
      'Oversized boxy tee in washed black, screen printed front and back. ' +
      'Heavyweight cotton that keeps its shape through the wash.',
    specs: { Material: '100% cotton, 240gsm', Fit: 'Oversized', Care: 'Cold wash, inside out' },
  },
  {
    id: 'Shuhei',
    name: 'Shuhei',
    price: 55,
    category: 'tees',
    images: [
      '../media/images/tees/Shuhei/mainPhoto.webp',
      '../media/images/tees/Shuhei/detail01.webp',
      '../media/images/tees/Shuhei/detail02.webp'
    ],
    description:
      'Eerie print, soft cotton feel, and oversized fit, this tee brings a bold, mysterious energy to any outfit. ' +
      'Its art you can wearno filter needed.',
    specs: { Material: '100% cotton, 220gsm', Fit: 'Oversized', Care: 'Cold wash, inside out' },
  },
  {
    id: 'kuroro',
    name: 'Kuroro',
    price: 45,
    category: 'tees',
    images: [
      '../media/images/tees/Kuroro/mainPhoto.webp',
      '../media/images/tees/Kuroro/detail01.jpeg',
      '../media/images/tees/Kuroro/detail02.jpeg'
    ],
    description:
      'Short sleeve tee with a halftone chest graphic. Pre-shrunk so the ' +
      'fit stays true after the first wash.',
    specs: { Material: '100% cotton, 240gsm', Fit: 'Oversized', Care: 'Cold wash, inside out' },
  },

  /* ------------------------------------------------------- HOODIES ------ */
  {
    id: 'grave-runner-hoodie',
    name: 'Grave Runner Hoodie',
    price: 145,
    category: 'hoodies',
    images: [
      '../media/images/hoodies/grave-runner-hoodie/masked-hoodie-guruma-gray-s-techwear-storm-754.webp',
      '../media/images/hoodies/grave-runner-hoodie/masked-hoodie-guruma-techwear-storm-137.webp',
      '../media/images/hoodies/grave-runner-hoodie/masked-hoodie-guruma-techwear-storm-452.webp',
    ],
    description:
      'Oversized zip hoodie with exposed seams, a double-zip hood and ' +
      'eyelet detailing. Garment dyed for a worn-in finish.',
    specs: { Material: 'Heavy cotton, 480gsm', Fit: 'Oversized / drop shoulder', Care: 'Cold wash, inside out' },
  },
  {
    id: 'hexseal-zip-hoodie',
    name: 'Hexseal Zip Hoodie',
    price: 160,
    category: 'hoodies',
    images: [
      '../media/images/hoodies/hexseal-zip-hoodie/balaclava-hoodie-chizuru-gray-s-techwear-storm-241.webp',
      '../media/images/hoodies/hexseal-zip-hoodie/balaclava-hoodie-chizuru-techwear-storm-758.webp',
      '../media/images/hoodies/hexseal-zip-hoodie/balaclava-hoodie-chizuru-techwear-storm-850.webp',
    ],
    description:
      'Balaclava hoodie with a sculpted hood and a full face zip. ' +
      'Stone-washed heavyweight fleece.',
    specs: { Material: 'Heavy cotton, 480gsm', Fit: 'Oversized', Care: 'Cold wash, inside out' },
  },
  {
    id: 'necropolis-pullover',
    name: 'Necropolis Pullover',
    price: 130,
    category: 'hoodies',
    images: [
      '../media/images/hoodies/necropolis-pullover/techwear-vest-akashi-black-m-storm-564.jpg',
      '../media/images/hoodies/necropolis-pullover/techwear-vest-akashi-storm-332.webp',
      '../media/images/hoodies/necropolis-pullover/techwear-vest-akashi-storm-244.webp',
    ],
    description:
      'Utility pullover with webbing straps, cargo pockets and adjustable ' +
      'side pulls. Matte technical shell.',
    specs: { Material: 'Nylon shell', Fit: 'Regular', Care: 'Cold wash, hang dry' },
  },

  /* ----------------------------------------------------- OUTERWEAR ------ */
  {
    id: 'mitama',
    name: 'Mitama',
    price: 159,
    category: 'outerwear',
    images: [
      '../media/images/outerware/mitama/main.webp',
      '../media/images/outerware/mitama/detail01.webp',
      '../media/images/outerware/mitama/detail02.webp'
    ],
    description:
      'Made with durable materials and reinforced stitching, ' +
      'Red and black panels, secured with metallic snaps. ',
    specs: { Material: 'PU leather', Fit: 'Cropped', Care: 'Wipe clean' },
  },
  {
    id: 'yasaki',
    name: 'Yasaki',
    price: 229,
    category: 'outerwear',
    images: [
      '../media/images/outerware/yasaki/main.webp',
      '../media/images/outerware/yasaki/detail01.jpg',
      '../media/images/outerware/yasaki/detail02.webp'
    ],
    description:
      'Designed for individuals who live life on the cutting edge, this jacket takes boldness to a whole new level.' +
      'Whether youre exploring the city or making a statement, "Yasaki" is your perfect companion.',
    specs: { Material: 'Polyester / Acrylic', Fit: 'Small fit', Care: 'Wipe clean' },
  },
  {
    id: 'loxi',
    name: 'Loxi',
    price: 199,
    category: 'outerwear',
    images: [
      '../media/images/outerware/loxi/main.webp',
      '../media/images/outerware/loxi/detail01.webp',
      '../media/images/outerware/loxi/detail02.webp'
    ],
    description:
      'This coat is made for those who want to turn heads and stay warm, with a thick, ' +
      'soft faux fur in wild black and white tones that command attention everywhere you go.',
    specs: { Material: 'Faux Fur, Polyester', Fit: 'Longline', Care: 'Cold wash, hang dry' },
  },

  /* --------------------------------------------------- ACCESSORIES ------ */
  {
    id: 'hitsuga',
    name: 'Hitsuga',
    price: 29,
    category: 'accessories',
    images: [
      '../media/images/accesorries/Hitsuga/main.jpg',
      '../media/images/accesorries/Hitsuga/detail01.jpg',
      '../media/images/accesorries/Hitsuga/detail02.jpg'
    ],
    description:
      'Opt for more protection with the Mittens "Hitsuga" Techwear.  ' +
      'Techwear Fingerless Gloves',
    specs: { Material: 'Nylon, microfiber, rubber', Length: '19cm / 7.5in', Care: 'Polish with a dry cloth' },
  },
  {
    id: 'yamaga',
    name: 'Yamaga',
    price: 139,
    category: 'accessories',
    images: [
      '../media/images/accesorries/Yamaga/main.webp',
      '../media/images/accesorries/Yamaga/detail01.webp',
      '../media/images/accesorries/Yamaga/detail02.webp'
    ],
    description:
      'Dressed in sharp geometric patterns and a palette that is black, white, and electric blue,  ' +
      'the "Yamaga" doesn’t just wear its heart on its sleeve—it beams it out. ',
    specs: { Material: 'ABS shell', Size: '55–59cm', Care: 'Wipe lens with a soft cloth' },
  },
  {
    id: 'shibara',
    name: 'Shibara',
    price: 25,
    category: 'accessories',
    images: [
      '../media/images/accesorries/Shibara/main.webp',
      '../media/images/accesorries/Shibara/detail01.webp',
      '../media/images/accesorries/Shibara/detail02.webp'
    ],
    description:
      'The "Shibara" mask features an intricate, irregular pattern crafted from lightweight titanium steel.  ' +
      'Perfect for those sensitive to traditional metals, this mask is nickel-free and lead-free, ensuring no harm to your skin while wearing.',
    specs: { Material: 'Titanium', Size: 'One size', Care: 'Hand wash cold' },
  },
];


/* ==========================================================================
   2. Helpers
   ========================================================================== */

const LOGO_PATH = '../media/images/logo.svg';

function formatPrice(value) {
  return '£' + value.toFixed(2);
}

function categoryName(id) {
  const found = CATEGORIES.find((category) => category.id === id);
  return found ? found.name : id;
}

function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

/* The photos for a product, always an array. Tolerates a missing or
   mistyped `images` field so one bad entry cannot break the whole grid. */
function productImages(product) {
  return Array.isArray(product.images) ? product.images : [];
}

/* The single image used on cards and cart rows: the first one listed.
   Returns null when the product has no photography yet. */
function productThumb(product) {
  return productImages(product)[0] || null;
}

/* The striped tile shown wherever a photo is missing. */
function placeholderHtml() {
  return `<span class="product-card__placeholder">
            <img src="${LOGO_PATH}" alt="">
            Image pending
          </span>`;
}

/* Escapes anything that goes into innerHTML. */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}


/* ==========================================================================
   3. Cart store
   ==========================================================================
   Shape in localStorage: [{ id, qty }, ...] — prices are always read back
   from PRODUCTS so a price change never leaves a stale amount in the cart.
   ========================================================================== */

const CART_KEY = 'luminDeathCart';

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(raw)) return [];
    // Drop anything that no longer exists in the catalogue.
    return raw.filter((line) => findProduct(line.id) && line.qty > 0);
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = readCart();
  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  writeCart(cart);
}

function removeFromCart(id) {
  writeCart(readCart().filter((line) => line.id !== id));
}

function setQuantity(id, qty) {
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  const cart = readCart();
  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty = qty;
    writeCart(cart);
  }
}

function cartCount() {
  return readCart().reduce((total, line) => total + line.qty, 0);
}

function cartSubtotal() {
  return readCart().reduce(
    (total, line) => total + findProduct(line.id).price * line.qty,
    0
  );
}


/* ==========================================================================
   4. Header: cart badge + mobile nav
   ========================================================================== */

/* Written as [00] to match the [↗] on the nav links. The brackets live here
   rather than in the markup because this overwrites the element's text on
   every cart change — without them the count would lose its brackets the
   moment anything was added. */
function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = '[' + String(count).padStart(2, '0') + ']';
  });
}

function initNavToggle() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (!header || !toggle) return;

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '[-]' : '[+]';
  });
}


/* ==========================================================================
   5. Product card rendering
   ========================================================================== */

function productCardHtml(product) {
  const thumb = productThumb(product);
  const media = thumb
    ? `<img src="${thumb}" alt="${escapeHtml(product.name)}" loading="lazy">`
    : placeholderHtml();

  return `
    <article class="product-card" data-product-id="${product.id}">
      <a class="product-card__media" href="products.html?product=${product.id}"
         data-open-detail="${product.id}">
        ${media}
        <span class="product-card__category">${escapeHtml(categoryName(product.category))}</span>
      </a>

      <div class="product-card__body">
        <h3 class="product-card__name">
          <a href="products.html?product=${product.id}" data-open-detail="${product.id}">
            ${escapeHtml(product.name)}
          </a>
        </h3>
        <p class="product-card__price">${formatPrice(product.price)}</p>
      </div>

      <div class="product-card__actions">
        <button class="btn btn--primary" type="button" data-add-to-cart="${product.id}">
          Add to Cart
        </button>
      </div>
    </article>`;
}

/* One delegated listener covers every Add to Cart button on the page. */
function initAddToCartButtons() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;

    addToCart(button.dataset.addToCart, 1);

    const original = button.textContent;
    button.textContent = 'Added ✓';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 1200);
  });
}


/* ==========================================================================
   5b. Home page: video background
   ==========================================================================
   The <video> already carries autoplay/muted/playsinline, which is enough in
   normal browsing. Some setups still refuse to start it — low-power mode, a
   strict autoplay setting, or the tab loading in the background — and a
   blocked video would leave the landing page showing a frozen poster frame.
   This retries on the first interaction so the page recovers on its own.
   ========================================================================== */

function initVideoBackground() {
  const video = document.querySelector('.video-bg__media');
  if (!video) return;

  function attempt() {
    const played = video.play();
    if (played) played.catch(() => { /* still blocked — wait for interaction */ });
  }

  attempt();

  // One-shot listeners: the first click, tap, key or scroll re-tries playback.
  if (video.paused) {
    const retry = () => {
      attempt();
      ['pointerdown', 'keydown', 'touchstart'].forEach((type) =>
        document.removeEventListener(type, retry)
      );
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach((type) =>
      document.addEventListener(type, retry, { once: true })
    );
  }
}


/* ==========================================================================
   6. Home page: featured products
   ========================================================================== */

/* Which products appear on the home page, in this order. Listed by id rather
   than taking the first few, so the shop front can be curated. */
const FEATURED_IDS = [
  'grave-runner-hoodie',
  'hexseal-zip-hoodie',
  'opium-leather-jacket',
  'ossuary-tee',
];

function initFeatured() {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid) return;

  const count = Number(grid.dataset.featuredGrid) || FEATURED_IDS.length;
  const featured = FEATURED_IDS.map(findProduct).filter(Boolean).slice(0, count);

  grid.innerHTML = featured.map(productCardHtml).join('');
}


/* ==========================================================================
   7. Products page: category tabs + grid
   ========================================================================== */

function initProductsPage() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;

  const bar = document.querySelector('[data-filter-bar]');
  const countEl = document.querySelector('[data-result-count]');
  const params = new URLSearchParams(window.location.search);
  let active = params.get('category') || 'all';

  if (!CATEGORIES.some((c) => c.id === active)) active = 'all';

  function render() {
    const list = active === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === active);

    grid.innerHTML = list.map(productCardHtml).join('');

    if (countEl) {
      countEl.textContent =
        `${list.length} product${list.length === 1 ? '' : 's'}` +
        (active === 'all' ? '' : ` in ${categoryName(active)}`);
    }

    if (bar) {
      bar.querySelectorAll('[data-category]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.category === active));
      });
    }
  }

  if (bar) {
    bar.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      active = button.dataset.category;
      render();

      // Keep the URL in step so the view can be shared or reloaded.
      const url = new URL(window.location.href);
      if (active === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', active);
      url.searchParams.delete('product');
      history.replaceState(null, '', url);
    });
  }

  render();
}


/* ==========================================================================
   8. Product detail panel
   ========================================================================== */

function initDetailPanel() {
  const backdrop = document.querySelector('[data-detail]');
  if (!backdrop) return;

  const panel = backdrop.querySelector('.detail');
  let lastFocused = null;

  function close() {
    backdrop.classList.remove('is-open');
    panel.innerHTML = '';
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    history.replaceState(null, '', url);
    if (lastFocused) lastFocused.focus();
  }

  /* Builds the image side of the panel: one large photo plus a thumbnail
     for each of the others. With a single photo the thumbnail strip is left
     out entirely, so one-image products look the same as they always did. */
  function galleryHtml(product) {
    const images = productImages(product);

    if (images.length === 0) {
      return `<div class="gallery"><div class="gallery__main">${placeholderHtml()}</div></div>`;
    }

    const thumbs = images.length < 2 ? '' : `
      <div class="gallery__thumbs" role="group" aria-label="Product images">
        ${images.map((src, i) => `
          <button class="gallery__thumb${i === 0 ? ' is-active' : ''}" type="button"
                  data-gallery-index="${i}" aria-label="View image ${i + 1}"
                  aria-pressed="${i === 0}">
            <img src="${src}" alt="" loading="lazy">
          </button>`).join('')}
      </div>`;

    return `
      <div class="gallery" data-gallery>
        <div class="gallery__main">
          <img data-gallery-main src="${images[0]}"
               alt="${escapeHtml(product.name)}">
        </div>
        ${thumbs}
      </div>`;
  }

  function open(id) {
    const product = findProduct(id);
    if (!product) return;

    lastFocused = document.activeElement;

    const media = galleryHtml(product);

    const specs = Object.entries(product.specs)
      .map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`)
      .join('');

    panel.innerHTML = `
      <button class="detail__close" type="button" data-close-detail aria-label="Close">×</button>

      <div class="detail__media">${media}</div>

      <div class="detail__body">
        <p class="tag">${escapeHtml(categoryName(product.category))}</p>
        <h2 class="detail__name">${escapeHtml(product.name)}</h2>
        <p class="detail__price">${formatPrice(product.price)}</p>
        <p class="detail__text">${escapeHtml(product.description)}</p>
        <dl class="detail__specs">${specs}</dl>
        <button class="btn btn--primary btn--lg btn--block" type="button"
                data-add-to-cart="${product.id}">Add to Cart</button>
        <a class="btn btn--secondary btn--block" href="cart.html">View Cart</a>
      </div>`;

    backdrop.classList.add('is-open');
    panel.querySelector('[data-close-detail]').focus();

    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    history.replaceState(null, '', url);
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-detail]');
    if (trigger) {
      event.preventDefault();
      open(trigger.dataset.openDetail);
      return;
    }

    /* Thumbnail clicked: swap the large image and move the active marker.
       The full-size src is read off the thumbnail itself, so no lookup back
       into PRODUCTS is needed. */
    const thumb = event.target.closest('[data-gallery-index]');
    if (thumb) {
      const gallery = thumb.closest('[data-gallery]');
      gallery.querySelector('[data-gallery-main]').src =
        thumb.querySelector('img').src;

      gallery.querySelectorAll('[data-gallery-index]').forEach((button) => {
        const active = button === thumb;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      return;
    }

    if (event.target.closest('[data-close-detail]') || event.target === backdrop) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) close();
  });

  // Deep link: products.html?product=grave-runner-hoodie
  const requested = new URLSearchParams(window.location.search).get('product');
  if (requested) open(requested);
}


/* ==========================================================================
   9. Cart page
   ========================================================================== */

const SHIPPING_FLAT = 4;

function initCartPage() {
  const root = document.querySelector('[data-cart-page]');
  if (!root) return;

  const listEl = root.querySelector('[data-cart-list]');
  const summaryEl = root.querySelector('[data-cart-summary]');
  const emptyEl = root.querySelector('[data-cart-empty]');

  function cartItemHtml(line) {
    const product = findProduct(line.id);
    const thumb = productThumb(product);
    const media = thumb
      ? `<img src="${thumb}" alt="${escapeHtml(product.name)}">`
      : `<span class="product-card__placeholder"><img src="${LOGO_PATH}" alt=""></span>`;

    return `
      <article class="cart-item" data-line="${product.id}">
        <div class="cart-item__media">${media}</div>

        <div class="cart-item__info">
          <p class="cart-item__category">${escapeHtml(categoryName(product.category))}</p>
          <h2 class="cart-item__name">${escapeHtml(product.name)}</h2>
          <p class="cart-item__unit">${formatPrice(product.price)} each</p>
        </div>

        <div class="cart-item__controls">
          <div class="qty">
            <button class="qty__btn" type="button" data-qty-down="${product.id}"
                    aria-label="Decrease quantity of ${escapeHtml(product.name)}">−</button>
            <span class="qty__value">${line.qty}</span>
            <button class="qty__btn" type="button" data-qty-up="${product.id}"
                    aria-label="Increase quantity of ${escapeHtml(product.name)}">+</button>
          </div>
          <p class="cart-item__line-total">${formatPrice(product.price * line.qty)}</p>
          <button class="btn btn--ghost" type="button" data-remove="${product.id}">Remove</button>
        </div>
      </article>`;
  }

  function render() {
    const cart = readCart();

    if (cart.length === 0) {
      listEl.innerHTML = '';
      summaryEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    summaryEl.hidden = false;
    listEl.innerHTML = cart.map(cartItemHtml).join('');

    const subtotal = cartSubtotal();
    summaryEl.querySelector('[data-subtotal]').textContent = formatPrice(subtotal);
    summaryEl.querySelector('[data-shipping]').textContent = formatPrice(SHIPPING_FLAT);
    summaryEl.querySelector('[data-total]').textContent = formatPrice(subtotal + SHIPPING_FLAT);
    summaryEl.querySelector('[data-item-count]').textContent = String(cartCount());
  }

  root.addEventListener('click', (event) => {
    const up = event.target.closest('[data-qty-up]');
    const down = event.target.closest('[data-qty-down]');
    const remove = event.target.closest('[data-remove]');
    if (!up && !down && !remove) return;

    if (up) {
      const line = readCart().find((item) => item.id === up.dataset.qtyUp);
      setQuantity(up.dataset.qtyUp, line.qty + 1);
    } else if (down) {
      const line = readCart().find((item) => item.id === down.dataset.qtyDown);
      setQuantity(down.dataset.qtyDown, line.qty - 1);
    } else {
      removeFromCart(remove.dataset.remove);
    }

    render();
  });

  render();
}


/* ==========================================================================
   10. Form validation
   ==========================================================================
   Used by the contact form and the checkout form. Rules come from the
   markup: `required`, `type="email"`, and an optional data-minlength.
   ========================================================================== */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(input) {
  const field = input.closest('.field');
  const errorEl = field ? field.querySelector('.field__error') : null;
  const value = input.value.trim();
  let message = '';

  if (input.required && value === '') {
    message = 'This field is required.';
  } else if (value !== '' && input.type === 'email' && !EMAIL_PATTERN.test(value)) {
    message = 'Enter a valid email address.';
  } else if (value !== '' && input.dataset.minlength && value.length < Number(input.dataset.minlength)) {
    message = `Please use at least ${input.dataset.minlength} characters.`;
  }

  if (field) field.classList.toggle('is-invalid', message !== '');
  if (errorEl) errorEl.textContent = message;

  return message === '';
}

function initForms() {
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
    const status = form.querySelector('[data-form-status]');

    // Validate a field once it has been left, then live on every keystroke.
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.field')?.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const results = inputs.map(validateField);
      const firstInvalid = inputs.find((input, i) => !results[i]);

      if (firstInvalid) {
        if (status) status.hidden = true;
        firstInvalid.focus();
        return;
      }

      if (status) {
        status.textContent = form.dataset.successMessage || 'Thanks — your details were received.';
        status.hidden = false;
      }

      form.reset();
      inputs.forEach((input) => input.closest('.field')?.classList.remove('is-invalid'));

      if (form.dataset.clearsCart === 'true') {
        writeCart([]);
        const cartRoot = document.querySelector('[data-cart-page]');
        if (cartRoot) {
          cartRoot.querySelector('[data-cart-list]').innerHTML = '';
          cartRoot.querySelector('[data-cart-summary]').hidden = true;
          cartRoot.querySelector('[data-cart-empty]').hidden = false;
        }
      }
    });
  });
}


/* ==========================================================================
   Boot
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNavToggle();
  initAddToCartButtons();
  initVideoBackground();
  initFeatured();
  initProductsPage();
  initDetailPanel();
  initCartPage();
  initForms();
});
