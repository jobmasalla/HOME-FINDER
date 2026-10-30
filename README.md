# HomeFinder

A real-estate discovery site: verified-style listings, honest monthly-payment math, neighborhood
insight, and a saved shortlist that lives in your browser.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4**. No backend, no API keys — all
listings, agents, and market data live in `src/data/listings.ts`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # typecheck + production bundle into dist/
npm run preview  # serve the production build
```

## Features

**Search & browse**
- Hero search by market, property type, and price band
- `/browse` with location, type, dual-handle price range, beds/baths, status, and 25 must-have amenity filters
- Five sort orders (newest, price both ways, largest, best price/sqft), grid and list layouts, load-more paging
- All filter state lives in the URL, so any view is shareable and survives refresh
- Active-filter chips, empty state, and a mobile filter drawer

**Listings**
- 24 listings across 6 markets with real photo galleries
- `/listing/:id` detail page: gallery + keyboard lightbox, key facts, highlights, amenities, property table,
  neighborhood scores, price history, mortgage calculator, open-house times, similar homes
- Tour scheduling and "ask a question" forms (stored locally, confirmed in-app)
- Save / compare / copy link actions on every card and detail page

**Tools**
- Mortgage calculator with principal, interest, taxes, insurance, PMI, HOA, live donut breakdown, total
  interest, and 36%-DTI qualification estimate
- `/mortgage`: 15 vs 20 vs 30-year term comparison, affordability-by-income slider, FAQ
- Compare up to three homes side by side across 14 attributes

**Shortlist (local persistence)**
- Saved homes, compare set, saved searches, booked tours, recently viewed, and theme — all in `localStorage`
- `/saved` with four tabs and per-device empty states

**Content & polish**
- Neighborhood directory with median prices and a comparison bar chart
- Six expandable buyer/seller guides
- About page with team, values, and a contact form with success state
- Dark mode, responsive layouts from 320px up, reduced-motion support, focus-visible rings, ARIA labels
- Toast notifications, 404 page, scroll restoration, hash anchors

## Structure

```
src/
  components/   Header, Footer, ListingCard, Gallery, SearchBar, FilterPanel,
                PriceRange, MortgageCalculator, CompareBar
  context/      AppState — favorites, compare, searches, tours, theme, toasts
  data/         Listings, agents, neighborhoods, testimonials, guides
  lib/          format/loan math, search filter + URL helpers
  pages/        Home, Browse, PropertyDetail, Saved, Mortgage, Neighborhoods, Guides, About
```

## Notes

Listings, agents, reviews, and market figures are illustrative demo content, and forms do not send
anything to a server. Photos are loaded from the Pexels CDN.
