import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ChevronDown, Clock } from 'lucide-react'
import { clsx } from '../lib/format'

interface Guide {
  id: string
  title: string
  excerpt: string
  category: 'Buying' | 'Financing' | 'Selling' | 'Guides'
  read: string
  body: string[]
}

const guideList: Guide[] = [
  {
    id: 'checklist',
    title: 'The first-time buyer checklist',
    excerpt: 'Everything to line up before you tour — from pre-approval to the inspection contingency.',
    category: 'Buying',
    read: '9 min read',
    body: [
      'Start with the money, not the listings. Get pre-approved rather than pre-qualified: a pre-approval means a lender has actually reviewed income, assets, and credit. It typically takes one to three days and gives you a letter sellers take seriously.',
      'Before you tour anything, decide on three numbers — the maximum you can put down, the maximum monthly payment you are comfortable with, and the amount you want left in savings after closing. Lenders will often approve you for more than you should spend. Your own maximum is the one that matters.',
      'On every tour, photograph the things that are expensive to fix: the electrical panel, the water heater age tag, the basement corners, under every sink. Ask when the roof, HVAC, and windows were last replaced, and get it in writing. Sellers are not obligated to remember accurately.',
      'Make your offer contingent on inspection and financing unless you can afford to lose the deposit. In a competitive market you may need to shorten inspection windows rather than waive them entirely — a three-day inspection is still an inspection.',
      'Finally, budget for the first ninety days of ownership. There is nearly always something: a lock change, a water heater, a fence panel. Having $5,000 set aside changes how the first month feels.',
    ],
  },
  {
    id: 'afford',
    title: 'How much house can you afford?',
    excerpt: 'A practical walkthrough of the 28/36 rule, and where it stops being useful.',
    category: 'Financing',
    read: '7 min read',
    body: [
      'The 28/36 rule says housing costs should stay under 28% of gross monthly income and total debt under 36%. It is a starting point, not a law. Inexpensive markets it can be too conservative; expensive ones, wildly optimistic.',
      'A more useful version: take your monthly take-home pay, subtract what you already owe and what you want to save, and see what is actually left. Then subtract utilities and maintenance, which are not in the mortgage payment but are absolutely real.',
      'Include the invisible costs. Property taxes vary dramatically between neighboring towns, and insurance in wildfire or flood zones can triple a payment. Ask a local agent what the current owner pays — that number is usually more accurate than any online estimator.',
      'If the number your lender approves is far above the number you calculated, trust your calculation. A mortgage is a ceiling, not a target.',
    ],
  },
  {
    id: 'reading-listings',
    title: 'Reading a listing like an agent',
    excerpt: 'What “cozy”, “motivated seller”, and “as-is” are actually telling you.',
    category: 'Buying',
    read: '6 min read',
    body: [
      '“Cozy” means small. “Charming” means old. “Great potential” means it needs work but nobody wants to say how much. These are not lies; they are the vocabulary of a form that has limited space.',
      '“Motivated seller” usually means a price reduction is possible — but only after the home has sat. Ask how many days on market and how many showings. A seller two weeks in is rarely motivated; a seller at sixty days often is.',
      '“As-is” means the seller will not be making repairs. It does not mean the home is uninhabitable, and it does not stop you from inspecting or asking for a credit. It mostly tells you the seller has priced the condition in.',
      '“Cash only” is a real constraint, not a negotiating tactic. Those homes usually cannot pass a conventional appraisal. If you are financing, skip them and save the emotional energy.',
      'Photos are staged and shot at the most flattering hour. Maps, satellite views, and street-level imagery tell you about the neighbor with four cars and the highway two hundred feet away. Look before you drive.',
    ],
  },
  {
    id: 'offers',
    title: 'How to write an offer that wins without overpaying',
    excerpt: 'Escalation clauses, appraisal gaps, and the terms that actually move sellers.',
    category: 'Buying',
    read: '8 min read',
    body: [
      'Price is the loudest term, not the only one. A clean offer with a short inspection window, a flexible closing date, and a strong earnest money deposit can beat a higher number that is loaded with contingencies.',
      'Appraisal gaps are powerful in rising markets and dangerous in flat ones. If you cover a gap, decide in advance how much you are willing to add in cash if the appraisal comes in low, and put that exact number in writing.',
      'Escalation clauses sound clever and are often mishandled. They work best when you know the competing offer structure, which you usually do not. Ask your agent whether the market actually rewards them before using one.',
      'Do not waive the inspection to win. Shorten it. A two-day inspection with a reputable inspector is far better than a lifetime of surprises.',
      'Write the offer you would be happy to lose. The best negotiating position is genuinely being able to walk away.',
    ],
  },
  {
    id: 'sell-prep',
    title: 'Getting a home ready to sell in three weekends',
    excerpt: 'A realistic prep plan for sellers who do not want a six-month renovation.',
    category: 'Selling',
    read: '7 min read',
    body: [
      'Weekend one is subtraction. Remove about a third of the furniture and most of the personal photos. Buyers need to imagine their own life in the space, and clutter makes that impossible.',
      'Weekend two is the boring expensive stuff: fix the running toilet, the door that sticks, the outlet that does not work, the grout that is discolored. Buyers over-index on small failures as evidence of larger neglect.',
      'Weekend three is light and scent. Replace every bulb with the same warm temperature, wash the windows inside and out, and stop cooking anything aromatic. Bake something neutral the morning of the open house if you must, then open the windows.',
      'Professional photos are not optional. Most buyers will see your home first on a phone, and a dark or crooked photo costs you showings before anyone sets foot inside.',
      'Price is a strategy, not an opinion. Look at what sold in the last sixty days within a mile, not what is currently listed. Your competition is the sold comps.',
    ],
  },
  {
    id: 'closing',
    title: 'Closing costs nobody warns you about',
    excerpt: 'The line items on your closing disclosure, explained without the jargon.',
    category: 'Financing',
    read: '5 min read',
    body: [
      'Lender fees include origination, underwriting, and sometimes a rate lock extension. Ask for a loan estimate from at least two lenders on the same day — fees are negotiable more often than people assume.',
      'Prepaid items are the sneaky ones: homeowners insurance for the first year, property taxes into escrow, and several months of reserves. On a $700,000 home this can quietly add $8,000–$12,000 to the cash you need at the table.',
      'Title insurance protects the lender, and in most states you can shop for it. Owner’s title insurance is separate and worth keeping — it is what protects you if a previous owner’s heir appears in five years.',
      'Recording fees, transfer taxes, and HOA transfer or capital contribution fees vary by state and building. Ask for the full closing disclosure three business days before signing — you are legally entitled to it, and it is your last chance to catch errors.',
    ],
  },
]

const categories = ['All', 'Buying', 'Financing', 'Selling'] as const

export default function Guides() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [open, setOpen] = useState<string | null>('checklist')

  const visible = guideList.filter((guide) => category === 'All' || guide.category === category)

  return (
    <div className="pb-24">
      <section className="border-b border-ink-100 bg-white pt-12 pb-14 dark:border-white/10 dark:bg-night-900">
        <div className="container-page">
          <p className="eyebrow">The reading room</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Plain answers to expensive questions
          </h1>
          <p className="mt-4 max-w-2xl text-ink-600 dark:text-sand-300">
            Written by the agents and analysts on our team, not a content farm. No lead capture, no
            slideshow pagination.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {categories.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={clsx('chip', category === option && 'chip-active')}
                aria-pressed={category === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          {visible.map((guide) => {
            const expanded = open === guide.id
            return (
              <article key={guide.id} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : guide.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-start gap-4 p-6 text-left"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink-50 text-ink-800 dark:bg-white/10 dark:text-sand-100">
                    <BookOpen className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-wide text-clay-600 uppercase dark:text-clay-400">
                      {guide.category}
                      <span className="flex items-center gap-1 font-normal text-ink-500 normal-case dark:text-ink-300">
                        <Clock className="size-3" />
                        {guide.read}
                      </span>
                    </span>
                    <span className="mt-1 block font-display text-xl font-semibold">{guide.title}</span>
                    <span className="mt-1 block text-sm text-ink-600 dark:text-sand-300">{guide.excerpt}</span>
                  </span>
                  <ChevronDown
                    className={clsx('mt-1 size-5 shrink-0 text-ink-400 transition', expanded && 'rotate-180')}
                  />
                </button>

                {expanded && (
                  <div className="space-y-4 border-t border-ink-100 px-6 py-6 text-[15px] leading-relaxed text-ink-700 dark:border-white/10 dark:text-sand-200">
                    {guide.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                    <p className="text-xs text-ink-400 dark:text-ink-300">
                      Last reviewed by the HomeFinder research team. Educational only — not legal or
                      financial advice.
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold">Try it on a real home</h2>
            <p className="mt-2 text-sm text-ink-600 dark:text-sand-300">
              Every listing page includes a payment calculator, price history, and tour scheduling.
            </p>
            <Link to="/browse" className="btn-primary mt-4 w-full !py-2.5">
              Browse homes
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-3xl bg-ink-900 p-6 text-sand-100 dark:bg-night-900">
            <h2 className="font-display text-lg font-semibold text-white">Ask an agent instead</h2>
            <p className="mt-2 text-sm text-sand-300">
              Some questions do not have a general answer. Ours will tell you what they would do in your
              exact situation — including when to wait.
            </p>
            <Link
              to="/about#contact"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2.5 text-sm font-semibold text-night-950 transition hover:bg-white"
            >
              Book 15 minutes
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
