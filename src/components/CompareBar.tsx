import { Link } from 'react-router-dom'
import { Scale, X } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { listings } from '../data/listings'
import { formatPrice } from '../lib/format'

export default function CompareBar() {
  const { compare, toggleCompare, clearCompare } = useAppState()
  if (compare.length === 0) return null

  const selected = listings.filter((listing) => compare.includes(listing.id))

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="container-page">
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-night-900/95 p-3 shadow-lift backdrop-blur-xl">
          <span className="flex items-center gap-2 pl-2 text-sm font-semibold text-sand-100">
            <Scale className="size-4" />
            Compare
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{selected.length}/3</span>
          </span>

          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {selected.map((listing) => (
              <span
                key={listing.id}
                className="flex items-center gap-2 rounded-full bg-white/8 py-1 pr-1 pl-3 text-xs text-sand-100"
              >
                <span className="max-w-[150px] truncate">{listing.title}</span>
                <span className="text-sand-300">{formatPrice(listing.price, true)}</span>
                <button
                  type="button"
                  onClick={() => toggleCompare(listing.id)}
                  aria-label={`Remove ${listing.title} from compare`}
                  className="grid size-5 place-items-center rounded-full bg-white/10 transition hover:bg-white/25"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            {selected.length < 3 && (
              <span className="self-center text-xs text-sand-300">Add up to {3 - selected.length} more</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="rounded-full px-3 py-2 text-xs font-semibold text-sand-300 transition hover:text-white"
            >
              Clear
            </button>
            <Link
              to="/saved?tab=compare"
              className="rounded-full bg-sand-100 px-4 py-2 text-xs font-semibold text-night-950 transition hover:bg-white"
            >
              Compare now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
