import { Link, useSearchParams } from 'react-router-dom'
import {
  BellRing,
  CalendarClock,
  Heart,
  Scale,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import ListingCard from '../components/ListingCard'
import { useAppState } from '../context/AppState'
import { listings } from '../data/listings'
import { clsx, formatPrice, fullAddress } from '../lib/format'

const tabs = [
  { id: 'homes', label: 'Saved homes', icon: Heart },
  { id: 'compare', label: 'Compare', icon: Scale },
  { id: 'searches', label: 'Saved searches', icon: BellRing },
  { id: 'tours', label: 'Tours', icon: CalendarClock },
]

export default function Saved() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'homes'
  const {
    favorites,
    compare,
    toggleCompare,
    clearCompare,
    savedSearches,
    removeSearch,
    tours,
    cancelTour,
    recent,
  } = useAppState()

  const savedHomes = listings.filter((listing) => favorites.includes(listing.id))
  const compareHomes = listings.filter((listing) => compare.includes(listing.id))
  const recentlyViewed = listings.filter((listing) => recent.includes(listing.id)).slice(0, 4)

  return (
    <div className="container-page pt-10 pb-24">
      <p className="eyebrow">Your shortlist</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Saved & scheduled
      </h1>
      <p className="mt-3 max-w-xl text-ink-600 dark:text-sand-300">
        Everything you have starred, compared, or booked lives here — stored on this device, no account
        needed.
      </p>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-full border border-ink-200 p-1.5 no-scrollbar dark:border-white/15">
        {tabs.map((item) => {
          const Icon = item.icon
          const active = tab === item.id
          const count =
            item.id === 'homes'
              ? favorites.length
              : item.id === 'compare'
                ? compare.length
                : item.id === 'searches'
                  ? savedSearches.length
                  : tours.length
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setParams(item.id === 'homes' ? {} : { tab: item.id }, { replace: true })}
              className={clsx(
                'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition',
                active
                  ? 'bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-sand-300 dark:hover:bg-white/10',
              )}
            >
              <Icon className="size-4" />
              {item.label}
              {count > 0 && (
                <span
                  className={clsx(
                    'grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px]',
                    active ? 'bg-white/20' : 'bg-ink-100 dark:bg-white/10',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tab === 'homes' && (
        <section className="mt-8">
          {savedHomes.length === 0 ? (
            <EmptyState
              icon={<Heart className="size-6" />}
              title="Nothing saved yet"
              body="Tap the heart on any listing to keep it here. Your shortlist stays on this device."
              action={
                <Link to="/browse" className="btn-primary">
                  Browse homes
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-ink-600 dark:text-sand-300">
                  {savedHomes.length} {savedHomes.length === 1 ? 'home' : 'homes'} saved
                </p>
                <Link to="/browse" className="text-sm font-semibold text-clay-600 hover:underline dark:text-clay-400">
                  Keep browsing
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedHomes.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}

          {recentlyViewed.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-semibold">Recently viewed</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {recentlyViewed.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-3 transition hover:border-ink-300 dark:border-white/10 dark:bg-night-900 dark:hover:border-white/25"
                  >
                    <img
                      src={listing.images[0]}
                      alt=""
                      loading="lazy"
                      className="size-16 shrink-0 rounded-xl object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{listing.title}</span>
                      <span className="block truncate text-xs text-ink-500 dark:text-ink-300">
                        {listing.neighborhood}, {listing.city}
                      </span>
                    </span>
                    <span className="text-sm font-semibold">{formatPrice(listing.price, true)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {tab === 'compare' && (
        <section className="mt-8">
          {compareHomes.length === 0 ? (
            <EmptyState
              icon={<Scale className="size-6" />}
              title="No homes to compare"
              body="Add up to three homes from any listing card or detail page and see the numbers side by side."
              action={
                <Link to="/browse" className="btn-primary">
                  Find homes to compare
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-ink-600 dark:text-sand-300">
                  Comparing {compareHomes.length} of 3
                </p>
                <button
                  type="button"
                  onClick={clearCompare}
                  className="flex items-center gap-1 text-sm font-semibold text-clay-600 hover:underline dark:text-clay-400"
                >
                  <Trash2 className="size-3.5" />
                  Clear all
                </button>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-ink-100 bg-white dark:border-white/10 dark:bg-night-900">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr>
                      <th className="w-40 border-b border-ink-100 p-4 text-left text-xs font-semibold tracking-wide text-ink-500 uppercase dark:border-white/10 dark:text-ink-300">
                        Property
                      </th>
                      {compareHomes.map((listing) => (
                        <th
                          key={listing.id}
                          className="border-b border-l border-ink-100 p-4 align-top text-left dark:border-white/10"
                        >
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => toggleCompare(listing.id)}
                              className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-ink-100 text-ink-600 transition hover:bg-clay-500 hover:text-white dark:bg-white/10 dark:text-sand-200"
                              aria-label={`Remove ${listing.title}`}
                            >
                              <X className="size-3" />
                            </button>
                            <img
                              src={listing.images[0]}
                              alt=""
                              className="h-28 w-full rounded-xl object-cover"
                              loading="lazy"
                            />
                            <Link
                              to={`/listing/${listing.id}`}
                              className="mt-2 block font-semibold hover:text-clay-600 dark:hover:text-clay-400"
                            >
                              {listing.title}
                            </Link>
                            <span className="mt-0.5 block text-xs font-normal text-ink-500 dark:text-ink-300">
                              {listing.neighborhood}, {listing.city}
                            </span>
                          </div>
                        </th>
                      ))}
                      {compareHomes.length < 3 && (
                        <th className="border-b border-l border-ink-100 p-4 align-middle dark:border-white/10">
                          <Link
                            to="/browse"
                            className="grid h-28 w-full place-items-center rounded-xl border-2 border-dashed border-ink-200 text-xs font-semibold text-ink-500 transition hover:border-ink-400 hover:text-ink-800 dark:border-white/20 dark:text-sand-300"
                          >
                            + Add another home
                          </Link>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Price', (id: string) => formatPrice(listings.find((l) => l.id === id)!.price)],
                      ['Address', (id: string) => fullAddress(listings.find((l) => l.id === id)!)],
                      ['Type', (id: string) => listings.find((l) => l.id === id)!.type],
                      ['Bedrooms', (id: string) => String(listings.find((l) => l.id === id)!.beds)],
                      ['Bathrooms', (id: string) => String(listings.find((l) => l.id === id)!.baths)],
                      ['Interior', (id: string) => `${listings.find((l) => l.id === id)!.sqft.toLocaleString()} sqft`],
                      ['Lot', (id: string) => {
                        const lot = listings.find((l) => l.id === id)!.lot
                        return lot ? `${lot} acres` : '—'
                      }],
                      ['Price / sqft', (id: string) => {
                        const home = listings.find((l) => l.id === id)!
                        return `$${Math.round(home.price / home.sqft).toLocaleString()}`
                      }],
                      ['Year built', (id: string) => String(listings.find((l) => l.id === id)!.year)],
                      ['HOA', (id: string) => {
                        const hoa = listings.find((l) => l.id === id)!.hoa
                        return hoa ? `${formatPrice(hoa)}/mo` : 'None'
                      }],
                      ['Garage', (id: string) => {
                        const garage = listings.find((l) => l.id === id)!.garage
                        return garage ? `${garage} car` : 'Street'
                      }],
                      ['Walk score', (id: string) => String(listings.find((l) => l.id === id)!.walkScore)],
                      ['Schools', (id: string) => `${listings.find((l) => l.id === id)!.schoolRating}/10`],
                      ['Days on market', (id: string) => String(listings.find((l) => l.id === id)!.daysOnMarket)],
                    ].map(([label, render]) => (
                      <tr key={label as string} className="odd:bg-ink-50/60 dark:odd:bg-white/[0.03]">
                        <th className="border-b border-ink-100 p-4 text-left text-xs font-semibold tracking-wide text-ink-500 uppercase dark:border-white/10 dark:text-ink-300">
                          {label as string}
                        </th>
                        {compareHomes.map((listing) => (
                          <td
                            key={listing.id}
                            className="border-b border-l border-ink-100 p-4 dark:border-white/10"
                          >
                            {(render as (id: string) => string)(listing.id)}
                          </td>
                        ))}
                        {compareHomes.length < 3 && (
                          <td className="border-b border-l border-ink-100 dark:border-white/10" />
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}

      {tab === 'searches' && (
        <section className="mt-8">
          {savedSearches.length === 0 ? (
            <EmptyState
              icon={<Search className="size-6" />}
              title="No saved searches"
              body="Save a filter combination from the browse page and we will let you know when something new matches."
              action={
                <Link to="/browse" className="btn-primary">
                  Build a search
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3">
              {savedSearches.map((search) => {
                const query = new URLSearchParams(search.query)
                const badges = Array.from(query.entries()).filter(([key]) => key !== 'sort')
                return (
                  <div
                    key={search.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 dark:border-white/10 dark:bg-night-900"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-clay-100 text-clay-700 dark:bg-clay-500/15 dark:text-clay-300">
                      <BellRing className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{search.name}</p>
                      <p className="truncate text-xs text-ink-500 dark:text-ink-300">
                        {badges.length
                          ? badges.map(([key, value]) => `${key}: ${value}`).join(' · ')
                          : 'All homes, newest first'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/browse?${search.query}`} className="btn-ghost !py-2 !text-xs">
                        View results
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeSearch(search.id)}
                        className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-clay-600 dark:hover:bg-white/10"
                        aria-label={`Delete saved search ${search.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {tab === 'tours' && (
        <section className="mt-8">
          {tours.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="size-6" />}
              title="No tours booked"
              body="Open any listing and hit “Schedule a tour”. Requests appear here with the details you sent."
              action={
                <Link to="/browse" className="btn-primary">
                  Find a home to tour
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3">
              {tours.map((tour) => {
                const listing = listings.find((item) => item.id === tour.listingId)
                return (
                  <div
                    key={tour.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 dark:border-white/10 dark:bg-night-900"
                  >
                    {listing && (
                      <img
                        src={listing.images[0]}
                        alt=""
                        loading="lazy"
                        className="size-16 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {listing ? listing.title : 'Listing removed'}
                      </p>
                      <p className="text-xs text-ink-500 dark:text-ink-300">
                        {tour.date || 'Date TBD'} at {tour.time} · {tour.name} · {tour.email}
                      </p>
                      {tour.note && (
                        <p className="mt-1 truncate text-xs text-ink-400 dark:text-ink-300">“{tour.note}”</p>
                      )}
                    </div>
                    <span className="rounded-full bg-ink-50 px-3 py-1 text-[11px] font-semibold text-ink-700 dark:bg-white/10 dark:text-sand-200">
                      Awaiting confirmation
                    </span>
                    <button
                      type="button"
                      onClick={() => cancelTour(tour.id)}
                      className="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-ink-100 hover:text-clay-600 dark:hover:bg-white/10"
                      aria-label="Cancel tour"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode
  title: string
  body: string
  action: React.ReactNode
}) {
  return (
    <div className="card grid place-items-center px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-ink-50 text-ink-500 dark:bg-white/5 dark:text-sand-300">
        {icon}
      </span>
      <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-600 dark:text-sand-300">{body}</p>
      <div className="mt-6">{action}</div>
    </div>
  )
}
