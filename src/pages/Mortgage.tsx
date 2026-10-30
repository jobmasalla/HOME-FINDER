import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calculator, HelpCircle, Wallet } from 'lucide-react'
import MortgageCalculator from '../components/MortgageCalculator'
import { calculateLoan, formatPrice } from '../lib/format'

const faqs = [
  {
    q: 'How much should I put down?',
    a: 'Twenty percent avoids private mortgage insurance and usually earns a better rate, but it is not required. Many first-time buyers put 5–10% down and budget for PMI, which typically runs 0.3–1.1% of the loan annually. Run both numbers before you decide — a larger down payment can mean less cash left for repairs.',
  },
  {
    q: 'What rate should I use in the calculator?',
    a: 'Use the rate on your actual loan estimate, not the advertised average. Rates move daily and depend on credit score, down payment, loan type, and whether you buy points. If you are pre-approved, your lender will give you a rate lock in writing.',
  },
  {
    q: 'What is not included in this estimate?',
    a: 'Closing costs (typically 2–5% of the price), moving costs, utilities, maintenance (budget 1% of the home value per year), and any renovation you want to do immediately. Our number covers principal, interest, taxes, insurance, PMI, and HOA only.',
  },
  {
    q: 'Does a bigger down payment always lower my monthly payment?',
    a: 'Almost always, yes — it shrinks the loan balance and can remove PMI. But it also reduces your cash reserves. Lenders generally want to see that you still have a few months of payments saved after closing.',
  },
]

export default function Mortgage() {
  const [income, setIncome] = useState(120000)
  const [debts, setDebts] = useState(500)
  const [cash, setCash] = useState(80000)
  const [rate, setRate] = useState(6.4)

  const affordability = useMemo(() => {
    const monthlyIncome = income / 12
    const maxHousing = monthlyIncome * 0.36 - debts
    const monthlyRate = rate / 100 / 12
    const payments = 30 * 12
    const loanFromPayment =
      monthlyRate === 0
        ? maxHousing * payments
        : (maxHousing * (1 - Math.pow(1 + monthlyRate, -payments))) / monthlyRate
    // taxes + insurance modelled at ~1.45%/yr of price, PMI ignored for the max-price estimate
    const price = Math.min(loanFromPayment + cash, 3_500_000)
    return {
      maxHousing: Math.max(maxHousing, 0),
      price: Math.max(price * 0.985, 0),
    }
  }, [income, debts, cash, rate])

  const scenarios = [15, 20, 30].map((years) => ({
    years,
    label: `${years}-year fixed`,
    ...calculateLoan({ principal: 800000, downPayment: 160000, rate, years }),
  }))

  return (
    <div className="pb-24">
      <section className="border-b border-ink-100 bg-white pt-12 pb-14 dark:border-white/10 dark:bg-night-900">
        <div className="container-page">
          <p className="eyebrow">Financing tools</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            The math, before the emotion
          </h1>
          <p className="mt-4 max-w-2xl text-ink-600 dark:text-sand-300">
            Adjust the price, down payment, rate, and term to see a real monthly payment — taxes,
            insurance, PMI and HOA included. No email required, nothing saved unless you want it saved.
          </p>
        </div>
      </section>

      <div className="container-page mt-10 space-y-8">
        <MortgageCalculator variant="full" price={800000} hoa={0} />

        {/* Scenario comparison */}
        <section className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">Loan term comparison</h2>
              <p className="mt-1 text-sm text-ink-600 dark:text-sand-300">
                $800,000 home · 20% down · {rate.toFixed(1)}% rate
              </p>
            </div>
            <Link to="/browse" className="text-sm font-semibold text-clay-600 hover:underline dark:text-clay-400">
              Find a home in this range
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs tracking-wide text-ink-500 uppercase dark:border-white/10 dark:text-ink-300">
                  <th className="pb-3 font-semibold">Term</th>
                  <th className="pb-3 font-semibold">Monthly P&amp;I</th>
                  <th className="pb-3 font-semibold">Total interest</th>
                  <th className="pb-3 font-semibold">Total paid</th>
                  <th className="pb-3 font-semibold">Interest vs 30 yr</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario) => {
                  const baseline = scenarios.find((item) => item.years === 30)!
                  const delta = scenario.totalInterest - baseline.totalInterest
                  return (
                    <tr key={scenario.years} className="border-b border-ink-100 last:border-0 dark:border-white/10">
                      <td className="py-3.5 font-semibold">{scenario.label}</td>
                      <td className="py-3.5 tabular-nums">{formatPrice(scenario.monthlyPrincipalInterest)}</td>
                      <td className="py-3.5 tabular-nums">{formatPrice(scenario.totalInterest)}</td>
                      <td className="py-3.5 tabular-nums">{formatPrice(scenario.totalPaid)}</td>
                      <td className="py-3.5">
                        {scenario.years === 30 ? (
                          <span className="text-ink-500 dark:text-ink-300">Baseline</span>
                        ) : (
                          <span className="font-semibold text-ink-700 dark:text-ink-200">
                            {formatPrice(Math.abs(delta))} less
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Affordability */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-ink-100 text-ink-800 dark:bg-white/10 dark:text-sand-100">
                <Wallet className="size-4" />
              </span>
              <h2 className="font-display text-2xl font-semibold">How much house can you afford?</h2>
            </div>
            <p className="mt-3 text-sm text-ink-600 dark:text-sand-300">
              A rough affordability check using the 36% debt-to-income guideline lenders start from.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor="income" className="text-sm font-medium">
                    Gross annual income
                  </label>
                  <span className="font-semibold">{formatPrice(income)}</span>
                </div>
                <input
                  id="income"
                  type="range"
                  min={30000}
                  max={500000}
                  step={5000}
                  value={income}
                  onChange={(event) => setIncome(Number(event.target.value))}
                  className="range-thumb h-6 w-full"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor="debts" className="text-sm font-medium">
                    Monthly debt payments
                  </label>
                  <span className="font-semibold">{formatPrice(debts)}</span>
                </div>
                <input
                  id="debts"
                  type="range"
                  min={0}
                  max={3000}
                  step={50}
                  value={debts}
                  onChange={(event) => setDebts(Number(event.target.value))}
                  className="range-thumb h-6 w-full"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor="cash" className="text-sm font-medium">
                    Cash available for down payment
                  </label>
                  <span className="font-semibold">{formatPrice(cash)}</span>
                </div>
                <input
                  id="cash"
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={cash}
                  onChange={(event) => setCash(Number(event.target.value))}
                  className="range-thumb h-6 w-full"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor="aff-rate" className="text-sm font-medium">
                    Expected interest rate
                  </label>
                  <span className="font-semibold">{rate.toFixed(1)}%</span>
                </div>
                <input
                  id="aff-rate"
                  type="range"
                  min={2}
                  max={12}
                  step={0.1}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="range-thumb h-6 w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-ink-900 p-8 text-sand-100 dark:bg-night-900">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-clay-300 uppercase">
                Estimated budget
              </p>
              <p className="mt-3 font-display text-5xl font-semibold tracking-tight">
                {formatPrice(affordability.price)}
              </p>
              <p className="mt-2 text-sm text-sand-300">
                Based on {formatPrice(affordability.maxHousing)}/month for housing after existing debts.
              </p>
            </div>

            <dl className="mt-8 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-sand-300">Housing budget / month</dt>
                <dd className="font-semibold">{formatPrice(affordability.maxHousing)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sand-300">Down payment</dt>
                <dd className="font-semibold">{formatPrice(cash)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sand-300">Implied mortgage</dt>
                <dd className="font-semibold">{formatPrice(affordability.price - cash)}</dd>
              </div>
            </dl>

            <Link
              to={`/browse?maxPrice=${Math.round(affordability.price)}`}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-sand-100 px-5 py-3 text-sm font-semibold text-night-950 transition hover:bg-white"
            >
              Browse homes in budget
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="card p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <HelpCircle className="size-5 text-clay-600 dark:text-clay-400" />
            Questions people actually ask
          </h2>
          <div className="mt-5 divide-y divide-ink-100 dark:divide-white/10">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                  {faq.q}
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition group-open:rotate-45 dark:border-white/20 dark:text-sand-300">
                    +
                  </span>
                </summary>
                <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-ink-600 dark:text-sand-300">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink-200 bg-sand-100 p-6 dark:border-white/10 dark:bg-white/5">
          <p className="flex items-center gap-3 text-sm text-ink-700 dark:text-sand-200">
            <Calculator className="size-5 text-clay-600 dark:text-clay-400" />
            Want a real pre-approval instead of an estimate?
          </p>
          <Link to="/about#contact" className="btn-primary !py-2.5">
            Talk to a lender matchmaking agent
          </Link>
        </div>
      </div>
    </div>
  )
}
