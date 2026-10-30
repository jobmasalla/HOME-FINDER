import { useMemo, useState } from 'react'
import { Calculator, Info } from 'lucide-react'
import { calculateLoan, formatPrice, clsx } from '../lib/format'

interface Props {
  price?: number
  hoa?: number
  variant?: 'card' | 'full'
  className?: string
}

const breakdownColors = ['#123c33', '#4a7263', '#d2794c', '#d3b892', '#9db6ab']

export default function MortgageCalculator({ price = 750000, hoa = 0, variant = 'card', className }: Props) {
  const [homePrice, setHomePrice] = useState(price)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.4)
  const [years, setYears] = useState(30)

  const result = useMemo(
    () =>
      calculateLoan({
        principal: homePrice,
        downPayment: (homePrice * downPct) / 100,
        rate,
        years,
        hoa,
      }),
    [homePrice, downPct, rate, years, hoa],
  )

  const parts = [
    { label: 'Principal & interest', value: result.monthlyPrincipalInterest },
    { label: 'Property tax', value: result.monthlyTax },
    { label: 'Home insurance', value: result.monthlyInsurance },
    { label: 'PMI', value: result.monthlyPmi },
    { label: 'HOA', value: result.monthlyHoa },
  ].filter((part) => part.value > 0)

  const total = result.monthlyTotal
  let offset = 0
  const circumference = 2 * Math.PI * 54

  return (
    <div className={clsx('card overflow-hidden', className)}>
      <div className="flex items-center gap-2.5 border-b border-ink-100 px-6 py-4 dark:border-white/10">
        <span className="grid size-9 place-items-center rounded-xl bg-ink-100 text-ink-800 dark:bg-white/10 dark:text-sand-100">
          <Calculator className="size-4" />
        </span>
        <div>
          <h3 className="font-display text-lg leading-tight font-semibold">Payment calculator</h3>
          <p className="text-xs text-ink-500 dark:text-ink-300">Estimated, updated as you type</p>
        </div>
      </div>

      <div className={clsx('grid gap-8 p-6', variant === 'full' && 'lg:grid-cols-2 lg:gap-12')}>
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-sm font-medium" htmlFor="calc-price">
                Home price
              </label>
              <span className="font-display text-lg font-semibold">{formatPrice(homePrice)}</span>
            </div>
            <input
              id="calc-price"
              type="range"
              min={150000}
              max={4000000}
              step={25000}
              value={homePrice}
              onChange={(event) => setHomePrice(Number(event.target.value))}
              className="range-thumb h-6 w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="calc-down">
                Down payment · {downPct}%
              </label>
              <input
                id="calc-down"
                type="range"
                min={0}
                max={50}
                step={1}
                value={downPct}
                onChange={(event) => setDownPct(Number(event.target.value))}
                className="range-thumb h-6 w-full"
              />
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">
                {formatPrice((homePrice * downPct) / 100)}
              </p>
            </div>
            <div>
              <label className="label" htmlFor="calc-term">
                Loan term
              </label>
              <select
                id="calc-term"
                className="field !py-2.5"
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
              >
                {[10, 15, 20, 25, 30].map((term) => (
                  <option key={term} value={term}>
                    {term} years
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-sm font-medium" htmlFor="calc-rate">
                Interest rate
              </label>
              <span className="font-display text-lg font-semibold">{rate.toFixed(2)}%</span>
            </div>
            <input
              id="calc-rate"
              type="range"
              min={2}
              max={12}
              step={0.05}
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
              className="range-thumb h-6 w-full"
            />
            <div className="mt-1 flex justify-between text-[11px] text-ink-400 dark:text-ink-300">
              <span>2%</span>
              <span>12%</span>
            </div>
          </div>

          {downPct < 20 && (
            <p className="flex gap-2 rounded-2xl bg-clay-100 px-4 py-3 text-xs leading-relaxed text-clay-700 dark:bg-clay-500/10 dark:text-clay-200">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              Below 20% down, lenders typically add private mortgage insurance — about{' '}
              {formatPrice(result.monthlyPmi)}/month here.
            </p>
          )}
        </div>

        <div>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative grid size-36 shrink-0 place-items-center">
              <svg viewBox="0 0 128 128" className="size-36 -rotate-90">
                <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="14" className="text-ink-100 dark:text-white/10" />
                {parts.map((part, index) => {
                  const length = (part.value / total) * circumference
                  const circle = (
                    <circle
                      key={part.label}
                      cx="64"
                      cy="64"
                      r="54"
                      fill="none"
                      stroke={breakdownColors[index % breakdownColors.length]}
                      strokeWidth="14"
                      strokeDasharray={`${length} ${circumference - length}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="butt"
                    />
                  )
                  offset += length
                  return circle
                })}
              </svg>
              <div className="absolute text-center">
                <p className="font-display text-2xl leading-none font-semibold">{formatPrice(total)}</p>
                <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-300">per month</p>
              </div>
            </div>

            <ul className="w-full space-y-1.5 text-sm">
              {parts.map((part, index) => (
                <li key={part.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-ink-600 dark:text-sand-300">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: breakdownColors[index % breakdownColors.length] }}
                    />
                    {part.label}
                  </span>
                  <span className="font-medium tabular-nums">{formatPrice(part.value)}</span>
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-ink-100 pt-5 text-sm dark:border-white/10">
            <div>
              <dt className="text-xs text-ink-500 dark:text-ink-300">Loan amount</dt>
              <dd className="mt-0.5 font-semibold">{formatPrice(result.loanAmount)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500 dark:text-ink-300">Total interest</dt>
              <dd className="mt-0.5 font-semibold">{formatPrice(result.totalInterest)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500 dark:text-ink-300">Total paid over term</dt>
              <dd className="mt-0.5 font-semibold">{formatPrice(result.totalPaid)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500 dark:text-ink-300">Income to qualify*</dt>
              <dd className="mt-0.5 font-semibold">{formatPrice(Math.round((total * 12) / 0.36))}/yr</dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-400 dark:text-ink-300">
            *Estimate using the 36% debt-to-income guideline. Taxes and insurance are modeled at 1.1% and
            0.35% of price annually. Not a lending offer.
          </p>
        </div>
      </div>
    </div>
  )
}
