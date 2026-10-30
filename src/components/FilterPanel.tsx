import { Check, RotateCcw, Sparkles } from 'lucide-react'
import PriceRange from './PriceRange'
import { clsx } from '../lib/format'
import {
  PRICE_MAX,
  PRICE_MIN,
  activeFilterCount,
  amenitiesList,
  cities,
  defaultFilters,
  statusOptions,
  types,
  type Filters,
} from '../lib/search'

interface Props {
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
  onReset: () => void
  onSaveSearch: () => void
}

export default function FilterPanel({ filters, onChange, onReset, onSaveSearch }: Props) {
  const count = activeFilterCount(filters)

  const toggleAmenity = (amenity: string) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((item) => item !== amenity)
      : [...filters.amenities, amenity]
    onChange({ amenities: next })
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Filters</h2>
        {count > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-clay-600 transition hover:text-clay-700 dark:text-clay-400"
          >
            <RotateCcw className="size-3" />
            Reset ({count})
          </button>
        )}
      </div>

      <div className="mt-5 space-y-6">
        <div>
          <label className="label" htmlFor="filter-location">
            Location
          </label>
          <select
            id="filter-location"
            className="field"
            value={filters.city}
            onChange={(event) => onChange({ city: event.target.value })}
          >
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="filter-type">
            Property type
          </label>
          <select
            id="filter-type"
            className="field"
            value={filters.type}
            onChange={(event) => onChange({ type: event.target.value })}
          >
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="label">Price range</span>
          <PriceRange
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={([minPrice, maxPrice]) => onChange({ minPrice, maxPrice })}
          />
        </div>

        <div>
          <span className="label">Bedrooms</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3, 4].map((beds) => (
              <button
                key={beds}
                type="button"
                onClick={() => onChange({ beds })}
                className={clsx('chip justify-center', filters.beds === beds && 'chip-active')}
                aria-pressed={filters.beds === beds}
              >
                {beds === 0 ? 'Any' : `${beds}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Bathrooms</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((baths) => (
              <button
                key={baths}
                type="button"
                onClick={() => onChange({ baths })}
                className={clsx('chip justify-center', filters.baths === baths && 'chip-active')}
                aria-pressed={filters.baths === baths}
              >
                {baths === 0 ? 'Any' : `${baths}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="filter-status">
            Listing status
          </label>
          <select
            id="filter-status"
            className="field"
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
          >
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="label">Must-have features</legend>
          <div className="flex flex-wrap gap-1.5">
            {amenitiesList.map((amenity) => {
              const active = filters.amenities.includes(amenity)
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-pressed={active}
                  className={clsx('chip', active && 'chip-active')}
                >
                  {active && <Check className="size-3" />}
                  {amenity}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-ink-50 px-4 py-3 dark:bg-white/5">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-clay-500" />
            Featured homes only
          </span>
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(event) => onChange({ featured: event.target.checked })}
            className="size-4 accent-ink-900 dark:accent-sand-100"
          />
        </label>
      </div>

      <div className="mt-6 space-y-2 border-t border-ink-100 pt-5 dark:border-white/10">
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Show results
        </button>
        <button
          type="button"
          className="btn-ghost w-full"
          onClick={onSaveSearch}
          disabled={count === 0 && filters.sort === defaultFilters.sort}
        >
          Save this search
        </button>
        <p className="pt-1 text-center text-[11px] text-ink-400 dark:text-ink-300">
          Saved searches alert you the day a match lists.
        </p>
      </div>
    </div>
  )
}
