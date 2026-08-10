# Lumin Death — E-commerce Website

A static front-end for a small independent clothing brand. Customers can browse
products, view product details, and manage a shopping cart. Built with plain
HTML, CSS and JavaScript — no frameworks, no build step, no dependencies.

---

## Folder structure

```
MainCode/
├── Pages/
│   ├── index.html        Home — hero, featured products, categories
│   ├── products.html     Product listing — 12 products, category tabs, detail panel
│   ├── cart.html         Shopping cart + checkout form
│   ├── about.html        About the brand
│   └── contact.html      Contact form and details
├── css/
│   ├── resets.css        Browser reset (loaded first)
│   └── style.css         All site styling
├── js/
│   └── script.js         Product data, cart, rendering, form validation
├── media/
│   ├── images/           Product photography and the logo
│   ├── video/            Hero background video
│   ├── fonts/            Self-hosted web fonts
│   └── icons/            Social media icons
└── README.md
```

---

## Running the site

Open `Pages/index.html` in a browser — everything works straight from the file
system.

To serve it over HTTP instead:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173/Pages/index.html`.

---

## Adding or editing products

Every product on the site comes from one array at the top of `js/script.js`.
The home page, the product listing, the detail panel and the cart all read from
it, so **adding a product means adding one object — no HTML to edit.**

```js
{
  id: 'static-tee',            // unique; also used in the cart and in ?product=
  name: 'Static Tee',
  price: 42,                   // number, GBP
  category: 'tees',            // tees | hoodies | outerwear | accessories
  images: [                    // see "Product photography" below
    '../media/images/tees/static-tee/main.webp',
    '../media/images/tees/static-tee/detail01.webp',
    '../media/images/tees/static-tee/detail02.webp',
  ],
  description: 'Short paragraph shown in the detail panel.',
  specs: { Material: '100% cotton', Fit: 'Regular', Care: 'Cold wash' },
},
```

### Product photography

Photos are organised **category folder → product folder → files**, and listed
in the `images` array in the order they should appear:

```
media/images/
└── hoodies/                      ← category
    └── grave-runner-hoodie/      ← product id
        ├── main.webp             ← images[0], the card thumbnail
        ├── detail01.webp
        └── detail02.webp
```

> Two category folders are spelled `outerware` and `accesorries` on disk.
> Match them exactly in your paths, or rename the folders and update every
> path in `js/script.js`.

- **`images[0]`** is the thumbnail — it's what shows on the product card and in
  the cart.
- **The detail panel shows all of them**: the first one large, with the rest as
  thumbnails underneath that swap the large image when clicked.
- **There's no fixed count.** List two, three or ten and the gallery sizes
  itself — the thumbnails share the row evenly. A product with a single image
  gets no thumbnail strip at all.

Paths are relative to the `Pages/` folder, which is why they begin with `../`.

Images are cropped to fill a **4:5 portrait frame** on the card and in the
gallery, so portrait shots work best. On tablet and mobile the large image
switches to 16:10 landscape so the price and Add to Cart stay on screen.

### Products without photography

A product with `images: []` renders a striped **"Image pending"** tile instead
of a photo. All 12 products currently have three photos each, so none are
showing — but the mechanism is there for anything you add before its
photography arrives.

To add photos, create `media/images/<category>/<product-id>/`, drop the files
in, and fill in the array.

### Adding a new category

Add an entry to the `CATEGORIES` array in `js/script.js`, then add a matching
button to the category tabs in `Pages/products.html` and, if you want it on the
home page, a tile in `Pages/index.html`.

---

## How the JavaScript is organised

`js/script.js` is one file split into numbered sections. Each section checks for
its own container before it runs, so every page loads the same script and only
the relevant parts execute.

| Section | What it does |
|---------|--------------|
| 1  | Product catalogue and category list |
| 2  | Small helpers — price formatting, HTML escaping |
| 3  | Cart store, saved to `localStorage` |
| 4  | Cart badge in the header, mobile menu toggle |
| 5  | Builds a product card |
| 5b | Home page video background |
| 6  | Products page — category tabs and grid |
| 7  | Product detail panel |
| 8  | Cart page — quantities, removal, totals |
| 9  | Form validation for the contact and checkout forms |

Each block is started separately at the bottom of the file, inside a
`try`/`catch`. If one fails it names itself in the browser console and the
rest of the page still works — a broken block can't take the whole page down
with it.

### The cart

The cart is stored in `localStorage` under the key `luminDeathCart` as a list of
`{ id, qty }`. Only the id and quantity are saved — prices are always read back
from the catalogue, so changing a price never leaves a stale amount in someone's
cart. Products that no longer exist are dropped when the cart is read.

Cart contents persist across pages and browser sessions. To clear it manually,
run `localStorage.removeItem('luminDeathCart')` in the browser console.

---

## Design notes

**Colours, type and spacing** are all defined as CSS custom properties at the top
of `css/style.css`, under `2. DESIGN TOKENS`. Change a value there and it updates
everywhere.

**Fonts** are self-hosted from `media/fonts/` rather than loaded from Google's
CDN, so no visitor IP addresses are sent to a third party.

- **Anton** — display headings
- **IBM Plex Mono** — everything else

**Responsive breakpoints:**

| Width      | Layout |
|------------|--------|
| Over 1024px | Four products per row, full horizontal navigation |
| Up to 1024px | Two products per row, navigation behind a Menu button |
| Up to 640px  | Single column throughout |

**Interaction:** cards and tiles lift on hover with a deepened shadow and a pink
outline, product photos zoom slowly inside their frame, nav links wipe in an
underline, and buttons lift slightly. All of it is disabled automatically for
visitors who have "reduce motion" turned on in their system settings.

---

## Browser support

Any current version of Chrome, Firefox, Safari or Edge. The layout uses CSS Grid,
Flexbox, custom properties and `aspect-ratio`; the JavaScript uses `localStorage`
and standard DOM APIs.
