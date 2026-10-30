import { formatPrice } from '../lib/format'

interface Props {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function PriceRange({ min, max, value, onChange }: Props) {
  const [low, high] = value
  const left = ((low - min) / (max - min)) * 100
  const right = ((high - min) / (max - min)) * 100

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold">
        <span>{formatPrice(low, true)}</span>
        <span className="text-ink-400 dark:text-ink-300">to</span>
        <span>
          {high >= max ? `${formatPrice(max, true)}+` : formatPrice(high, true)}
        </span>
      </div>

      <div className="relative h-6">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-ink-100 dark:bg-white/10" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink-900 dark:bg-sand-100"
          style={{ left: `${left}%`, right: `${100 - right}%` }}
        />
        <input
          type="range"
          className="range-thumb absolute top-1/2 left-0 h-6 w-full -translate-y-1/2"
          min={min}
          max={max}
          step={25000}
          value={low}
          aria-label="Minimum price"
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), high - 25000)
            onChange([next, high])
          }}
        />
        <input
          type="range"
          className="range-thumb absolute top-1/2 left-0 h-6 w-full -translate-y-1/2"
          min={min}
          max={max}
          step={25000}
          value={high}
          aria-label="Maximum price"
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), low + 25000)
            onChange([low, next])
          }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[11px] text-ink-400 dark:text-ink-300">
        <span>{formatPrice(min, true)}</span>
        <span>{formatPrice(max, true)}+</span>
      </div>
    </div>
  )
}
