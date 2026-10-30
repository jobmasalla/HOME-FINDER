import { Link } from 'react-router-dom'
import { Bath, BedDouble, Heart, MapPin, Ruler, Scale } from 'lucide-react'
import type { Listing } from '../data/listings'
import { useAppState } from '../context/AppState'
import { clsx, formatNumber, formatPrice, timeAgo } from '../lib/format'

const statusStyles: Record<string, string> = {
  New: 'bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950',
  'Open house': 'bg-clay-500 text-white',
  'Price drop': 'bg-white text-clay-700 ring-1 ring-clay-200 dark:bg-white/10 dark:text-clay-200 dark:ring-white/20',
  'For sale': 'bg-white/90 text-ink-800 ring-1 ring-ink-100 dark:bg-white/10 dark:text-sand-100 dark:ring-white/15',
}

export default function ListingCard({
  listing,
  layout = 'grid',
  className,
}: {
  listing: Listing
  layout?: 'grid' | 'row'
  className?: string
}) {
  const { isFavorite, toggleFavorite, compare, toggleCompare } = useAppState()
  const saved = isFavorite(listing.id)
  const comparing = compare.includes(listing.id)

  return (
    <article
      className={clsx(
        'group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-night-900',
        layout === 'row' && 'sm:flex',
        className,
      )}
    >
      <Link
        to={`/listing/${listing.id}`}
        className={clsx('relative block overflow-hidden', layout === 'row' ? 'sm:w-72 sm:shrink-0' : '')}
      >
        <div className={clsx('overflow-hidden bg-ink-100 dark:bg-white/5', layout === 'row' ? 'h-56 sm:h-full' : 'aspect-[4/3]')}>
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            className="size-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={clsx(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur',
              statusStyles[listing.status],
            )}
          >
            {listing.status}
          </span>
          {listing.daysOnMarket <= 7 && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-800 backdrop-blur dark:bg-night-950/80 dark:text-sand-100">
              {listing.daysOnMarket === 0 ? 'Today' : `${listing.daysOnMarket}d on market`}
            </span>
          )}
        </div>
      </Link>

      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => toggleFavorite(listing.id)}
          aria-label={saved ? 'Remove from saved homes' : 'Save this home'}
          aria-pressed={saved}
          className={clsx(
            'grid size-9 place-items-center rounded-full backdrop-blur transition',
            saved
              ? 'bg-clay-500 text-white'
              : 'bg-white/90 text-ink-700 hover:bg-white hover:text-clay-600 dark:bg-night-950/80 dark:text-sand-100',
          )}
        >
          <Heart className={clsx('size-4', saved && 'fill-current')} />
        </button>
        <button
          type="button"
          onClick={() => toggleCompare(listing.id)}
          aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
          aria-pressed={comparing}
          className={clsx(
            'grid size-9 place-items-center rounded-full backdrop-blur transition',
            comparing
              ? 'bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950'
              : 'bg-white/90 text-ink-700 hover:bg-white dark:bg-night-950/80 dark:text-sand-100',
          )}
        >
          <Scale className="size-4" />
        </button>
      </div>

      <div className={clsx('p-5', layout === 'row' && 'sm:flex sm:flex-1 sm:flex-col sm:justify-center')}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-2xl font-semibold tracking-tight">{formatPrice(listing.price)}</p>
          <span className="text-xs text-ink-500 dark:text-ink-300">
            ${formatNumber(Math.round(listing.price / listing.sqft))}/sqft
          </span>
        </div>

        <h3 className="mt-1 truncate text-[15px] font-semibold text-ink-900 dark:text-sand-50">
          <Link to={`/listing/${listing.id}`} className="hover:text-clay-600 dark:hover:text-clay-400">
            {listing.title}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-ink-600 dark:text-sand-300">
          <MapPin className="size-3.5 shrink-0" />
          {listing.address}, {listing.neighborhood}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ink-100 pt-3 text-sm text-ink-700 dark:border-white/10 dark:text-sand-200">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-ink-400 dark:text-ink-300" />
            {listing.beds} bd
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4 text-ink-400 dark:text-ink-300" />
            {listing.baths} ba
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4 text-ink-400 dark:text-ink-300" />
            {formatNumber(listing.sqft)} sqft
          </span>
          <span className="ml-auto text-xs text-ink-500 dark:text-ink-300">{timeAgo(listing.daysOnMarket)}</span>
        </div>
      </div>
    </article>
  )
}
