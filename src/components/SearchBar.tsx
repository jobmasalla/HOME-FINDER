import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { cities, types } from '../lib/search'

const priceBands = [
  { label: 'Any price', value: '' },
  { label: 'Under $600K', value: '600000' },
  { label: 'Under $800K', value: '800000' },
  { label: 'Under $1.2M', value: '1200000' },
  { label: 'Under $2M', value: '2000000' },
  { label: '$2M and up', value: '2000000-min' },
]

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate()
  const [city, setCity] = useState('Any city')
  const [type, setType] = useState('Any type')
  const [maxPrice, setMaxPrice] = useState('')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (city !== 'Any city') params.set('city', city)
    if (type !== 'Any type') params.set('type', type)
    if (maxPrice) {
      if (maxPrice.endsWith('-min')) params.set('minPrice', maxPrice.replace('-min', ''))
      else params.set('maxPrice', maxPrice)
    }
    navigate(`/browse${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]'
          : 'grid gap-2 rounded-[28px] border border-white/40 bg-white/85 p-2.5 shadow-lift backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_auto] dark:border-white/15 dark:bg-night-900/85'
      }
    >
      <Field label="Location">
        <select
          aria-label="Location"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-ink-900 outline-none dark:text-sand-50"
        >
          {cities.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Property type">
        <select
          aria-label="Property type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-ink-900 outline-none dark:text-sand-50"
        >
          {types.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Price">
        <select
          aria-label="Price"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-ink-900 outline-none dark:text-sand-50"
        >
          {priceBands.map((band) => (
            <option key={band.label} value={band.value}>
              {band.label}
            </option>
          ))}
        </select>
      </Field>
      <button
        type="submit"
        className={
          compact
            ? 'btn-primary h-full'
            : 'btn-primary !rounded-[20px] !px-6 !py-4 max-lg:w-full'
        }
      >
        <Search className="size-4" />
        Search homes
      </button>
      {!compact && (
        <p className="col-span-full flex items-center gap-1.5 px-3 pb-1 text-xs text-ink-500 sm:col-span-2 lg:col-span-4 dark:text-ink-300">
          <SlidersHorizontal className="size-3.5" />
          1,284 verified listings across 6 markets · updated hourly
        </p>
      )}
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] px-4 py-2.5 transition hover:bg-ink-50/80 dark:hover:bg-white/5">
      <span className="mb-0.5 block text-[10px] font-semibold tracking-[0.14em] text-ink-500 uppercase dark:text-ink-300">
        {label}
      </span>
      {children}
    </div>
  )
}
