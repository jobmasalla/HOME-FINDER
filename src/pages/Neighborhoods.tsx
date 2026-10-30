import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Building2, MapPin, TrendingUp } from 'lucide-react'
import { neighborhoods } from '../data/listings'
import { clsx, formatPrice } from '../lib/format'

const cities = ['All markets', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Portland, OR', 'San Diego, CA', 'Asheville, NC']

export default function Neighborhoods() {
  const [city, setCity] = useState('All markets')
  const visible = useMemo(
    () => (city === 'All markets' ? neighborhoods : neighborhoods.filter((area) => area.city === city)),
    [city],
  )
  const maxMedian = Math.max(...neighborhoods.map((area) => area.median))

  return (
    <div className="pb-24">
      <section className="border-b border-ink-100 bg-white pt-12 pb-14 dark:border-white/10 dark:bg-night-900">
        <div className="container-page">
          <p className="eyebrow">Local knowledge</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Six neighborhoods we know street by street
          </h1>
          <p className="mt-4 max-w-2xl text-ink-600 dark:text-sand-300">
            Median prices, year-over-year movement, and the one-line version of what it actually feels
            like to live there. Data refreshes monthly from public records.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {cities.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCity(option)}
                className={clsx('chip', city === option && 'chip-active')}
                aria-pressed={city === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page mt-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map((area) => (
            <article
              key={area.name}
              className="group card overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={area.image}
                  alt={area.name}
                  loading="lazy"
                  className="size-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 text-white">
                  <p className="flex items-center gap-1 text-xs text-sand-200">
                    <MapPin className="size-3" />
                    {area.city}
                  </p>
                  <h2 className="font-display text-2xl font-semibold">{area.name}</h2>
                </div>
                <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  <TrendingUp className="size-3" />+{area.trend}% y/y
                </span>
              </div>

              <div className="p-5">
                <p className="text-sm text-ink-600 dark:text-sand-300">{area.vibe}</p>
                <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4 text-sm dark:border-white/10">
                  <div>
                    <dt className="text-[11px] text-ink-500 uppercase dark:text-ink-300">Median</dt>
                    <dd className="font-display text-lg font-semibold">{formatPrice(area.median, true)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-ink-500 uppercase dark:text-ink-300">Listings</dt>
                    <dd className="font-display text-lg font-semibold">{area.listings}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-[11px] text-ink-500 uppercase dark:text-ink-300">Trend</dt>
                    <dd className="font-display text-lg font-semibold text-clay-600 dark:text-clay-400">
                      +{area.trend}%
                    </dd>
                  </div>
                </dl>
                <Link
                  to={`/browse?q=${encodeURIComponent(area.name)}`}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold text-clay-600 hover:underline dark:text-clay-400"
                >
                  See homes in {area.name}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="card grid place-items-center px-6 py-16 text-center">
            <Building2 className="size-7 text-ink-400" />
            <p className="mt-3 font-display text-xl font-semibold">No coverage in that market yet</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-sand-300">
              We are expanding to two new metros this year — tell us where you are looking.
            </p>
          </div>
        )}

        <section className="card mt-10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Median list price, side by side</h2>
          <div className="mt-6 space-y-4">
            {neighborhoods.map((area) => (
              <div key={area.name} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate font-medium">{area.name}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-clay-500"
                    style={{ width: `${(area.median / maxMedian) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-right font-semibold tabular-nums">
                  {formatPrice(area.median, true)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-ink-500 dark:text-ink-300">
            Median list price for single-family and condo inventory, last 30 days.
          </p>
        </section>
      </div>
    </div>
  )
}
