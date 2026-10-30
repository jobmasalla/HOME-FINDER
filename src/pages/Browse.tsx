import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bookmark, Grid2x2, List, MapPin, SlidersHorizontal, X } from 'lucide-react'
import FilterPanel from '../components/FilterPanel'
import ListingCard from '../components/ListingCard'
import { useAppState } from '../context/AppState'
import { clsx, formatNumber } from '../lib/format'
import {
  activeFilterCount,
  applyFilters,
  defaultFilters,
  describeFilters,
  parseFilters,
  sortOptions,
  toSearchParams,
  type Filters,
} from '../lib/search'

const PAGE_SIZE = 9

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const { saveSearch } = useAppState()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [drawer, setDrawer] = useState(false)

  const filters = useMemo(() => parseFilters(params), [params])
  const results = useMemo(() => applyFilters(filters), [filters])
  const count = activeFilterCount(filters)

  useEffect(() => setVisible(PAGE_SIZE), [params])

  const update = (patch: Partial<Filters>) => {
    setParams(toSearchParams({ ...filters, ...patch }), { replace: true })
  }

  const reset = () => setParams(new URLSearchParams())

  const chips: Array<{ label: string; onRemove: () => void }> = []
  if (filters.q) chips.push({ label: `“${filters.q}”`, onRemove: () => update({ q: '' }) })
  if (filters.city !== defaultFilters.city)
    chips.push({ label: filters.city, onRemove: () => update({ city: defaultFilters.city }) })
  if (filters.type !== defaultFilters.type)
    chips.push({ label: filters.type, onRemove: () => update({ type: defaultFilters.type }) })
  if (filters.beds) chips.push({ label: `${filters.beds}+ beds`, onRemove: () => update({ beds: 0 }) })
  if (filters.baths) chips.push({ label: `${filters.baths}+ baths`, onRemove: () => update({ baths: 0 }) })
  if (filters.minPrice > 0 || filters.maxPrice < 3_500_000)
    chips.push({
      label: `${filters.minPrice > 0 ? `$${Math.round(filters.minPrice / 1000)}K` : '$0'} – $${
        filters.maxPrice >= 3_500_000 ? '3.5M+' : `${Math.round(filters.maxPrice / 1000)}K`
      }`,
      onRemove: () => update({ minPrice: 0, maxPrice: 3_500_000 }),
    })
  if (filters.status !== defaultFilters.status)
    chips.push({ label: filters.status, onRemove: () => update({ status: defaultFilters.status }) })
  if (filters.featured) chips.push({ label: 'Featured', onRemove: () => update({ featured: false }) })
  filters.amenities.forEach((amenity) =>
    chips.push({
      label: amenity,
      onRemove: () => update({ amenities: filters.amenities.filter((item) => item !== amenity) }),
    }),
  )

  const handleSave = () => {
    const label = describeFilters(filters)
    saveSearch(label === 'All homes' ? 'All homes' : label, params.toString())
  }

  return (
    <div className="container-page pt-10 pb-24">
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300">
          <span>Home</span>
          <span>/</span>
          <span className="font-medium text-ink-800 dark:text-sand-100">Buy</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {filters.city === 'Any city' ? 'Homes for sale' : filters.city}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-600 dark:text-sand-300">
              <span>
                <strong className="font-semibold text-ink-900 dark:text-sand-50">{results.length}</strong>{' '}
                homes match your search
              </span>
              {filters.q && (
                <span className="flex items-center gap-1 rounded-full bg-ink-100 px-2 py-0.5 text-xs dark:bg-white/10">
                  <MapPin className="size-3" />
                  {filters.q}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="btn-ghost !py-2.5"
            >
              <Bookmark className="size-4" />
              Save search
            </button>
            <label className="sr-only" htmlFor="sort">
              Sort results
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value })}
              className="field w-auto !rounded-full !py-2.5 pr-8"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex rounded-full border border-ink-200 p-1 dark:border-white/15">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                aria-label="Grid view"
                aria-pressed={layout === 'grid'}
                className={clsx(
                  'grid size-8 place-items-center rounded-full transition',
                  layout === 'grid'
                    ? 'bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950'
                    : 'text-ink-500 dark:text-sand-300',
                )}
              >
                <Grid2x2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                aria-label="List view"
                aria-pressed={layout === 'list'}
                className={clsx(
                  'grid size-8 place-items-center rounded-full transition',
                  layout === 'list'
                    ? 'bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950'
                    : 'text-ink-500 dark:text-sand-300',
                )}
              >
                <List className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="btn-ghost !py-2.5 lg:hidden"
            >
              <SlidersHorizontal className="size-4" />
              Filters{count ? ` (${count})` : ''}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              onChange={update}
              onReset={reset}
              onSaveSearch={handleSave}
            />
          </div>
        </aside>

        <section id="results">
          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 rounded-full bg-ink-900 py-1.5 pr-2 pl-3 text-xs font-medium text-sand-50 transition hover:bg-ink-700 dark:bg-sand-100 dark:text-night-950 dark:hover:bg-white"
                >
                  {chip.label}
                  <X className="size-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="px-2 text-xs font-semibold text-clay-600 underline-offset-4 hover:underline dark:text-clay-400"
              >
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="card grid place-items-center px-6 py-20 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-ink-50 text-ink-500 dark:bg-white/5 dark:text-sand-300">
                <SlidersHorizontal className="size-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold">No homes match those filters</h2>
              <p className="mt-2 max-w-sm text-sm text-ink-600 dark:text-sand-300">
                Try widening the price range, removing a must-have feature, or searching a nearby
                neighborhood.
              </p>
              <button type="button" onClick={reset} className="btn-primary mt-6">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={clsx(
                  'grid gap-6',
                  layout === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
                )}
              >
                {results.slice(0, visible).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} layout={layout === 'grid' ? 'grid' : 'row'} />
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-ink-500 dark:text-ink-300">
                  Showing {formatNumber(Math.min(visible, results.length))} of {formatNumber(results.length)} homes
                </p>
                {visible < results.length && (
                  <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-primary">
                    Load {Math.min(PAGE_SIZE, results.length - visible)} more homes
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night-950/60 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-sand-50 p-4 dark:bg-night-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Refine your search</h2>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="grid size-9 place-items-center rounded-full bg-ink-100 dark:bg-white/10"
                aria-label="Close filters"
              >
                <X className="size-4" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={update} onReset={reset} onSaveSearch={handleSave} />
            <button type="button" onClick={() => setDrawer(false)} className="btn-primary mt-3 w-full">
              Show {results.length} homes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
