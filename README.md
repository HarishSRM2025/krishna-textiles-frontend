# Krishna Textiles — Next.js E-commerce Website

A fully responsive, JSON-data-driven e-commerce storefront built with **Next.js 14 (App Router)** and **Tailwind CSS**, modeled after the Krishna Textiles UI.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm start
```

## Project Structure

```
data/                    → All content lives here as JSON (edit these to update the site)
  categories.json         Shop-by-category list (name, icon, color)
  brands.json              Trusted brands list
  products.json             Full product catalog
  testimonials.json          Customer reviews

app/                     → Pages (Next.js App Router)
  page.js                   Home page
  category/[slug]/page.js   Category listing with brand/price filters + sorting
  product/[id]/page.js      Product detail page (size, qty, add to cart)
  cart/page.js               Shopping cart + checkout summary
  brands/page.js               Brand directory
  brands/[id]/page.js           Products for a single brand
  offers/page.js                 Deal Zone / all discounted products
  wholesale/page.js               Bulk-order enquiry form
  about/page.js                    About Us
  contact/page.js                   Contact form
  search/page.js                     Search results
  wishlist/page.js                    Wishlist placeholder

components/              → Reusable UI building blocks (Header, Footer, ProductCard, etc.)
```

## Editing Content

Everything you see (categories, brands, products, prices, images/colors, testimonials) is driven by the JSON files in `/data`. To add a product, just add a new object to `data/products.json` — no code changes needed.

Product "images" are rendered as colored gradient tiles with an emoji (`color` + `emoji` fields) so the site works without any image assets. Swap in real photos later by adding an `image` field to a product and updating `components/ProductTile.js` to render an `<Image>` when present.

## Features

- Fully responsive layout (mobile, tablet, desktop)
- Sticky header with live search, cart badge, mobile menu
- Category grid, brand strip, best sellers, deal banners
- Category pages with brand + price filtering and sorting
- Product detail pages with size/quantity selection
- Cart with quantity controls, price breakdown, and mock checkout (persisted via localStorage)
- Wholesale/bulk enquiry form, brand pages, offers page, search, about & contact pages

## Tech Stack

- Next.js 14 (App Router, JavaScript)
- Tailwind CSS
- lucide-react icons
