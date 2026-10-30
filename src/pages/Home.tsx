import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building,
  Building2,
  Calculator,
  CheckCircle2,
  HeartHandshake,
  Home as HomeIcon,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ListingCard from '../components/ListingCard'
import { guides, listings, marketStats, neighborhoods, testimonials } from '../data/listings'
import { formatNumber, formatPrice } from '../lib/format'

const heroImage =
  'https://images.pexels.com/photos/18214902/pexels-photo-18214902.jpeg?auto=compress&cs=tinysrgb&w=2000'

const typeTiles = [
  { label: 'Houses', type: 'House', icon: HomeIcon, blurb: 'Space, yards, and a door of your own' },
  { label: 'Condos', type: 'Condo', icon: Building2, blurb: 'Low maintenance, high walkability' },
  { label: 'Townhouses', type: 'Townhouse', icon: Building, blurb: 'The middle ground that works' },
  { label: 'Villas', type: 'Villa', icon: Sparkles, blurb: 'Room to spread out and host' },
]

const steps = [
  {
    icon: Search,
    title: 'Search honestly',
    body: 'Every listing is verified against county records. No ghost listings, no bait prices, no “call for price”.',
  },
  {
    icon: HeartHandshake,
    title: 'Tour with a human',
    body: 'Book a tour in two clicks. A licensed local agent confirms within an hour and meets you at the door.',
  },
  {
    icon: KeyRound,
    title: 'Close without surprises',
    body: 'We model taxes, insurance, PMI, and HOA before you fall in love — so the number at closing is the number you saw.',
  },
]

export default function Home() {
  const featured = listings.filter((listing) => listing.featured).slice(0, 6)
  const totalListings = 1284

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[72px] flex min-h-[92vh] items-end overflow-hidden pt-[72px]">
        <img
          src={heroImage}
          alt="A modern home lit up at dusk"
          className="absolute inset-0 size-full animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/92 via-night-950/55 to-night-950/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-night-950/70 to-transparent" />

        <div className="container-page relative z-10 w-full pt-24 pb-12">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-sand-100 backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-clay-400" />
              1,284 verified homes · 6 markets
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find a place that
              <br />
              feels like <span className="text-clay-300 italic">you</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-sand-200 sm:text-lg">
              Real listings, real numbers, and local agents who actually pick up. Search by what matters
              — light, land, commute, or the porch you have been picturing.
            </p>
          </div>

          <div className="mt-9 max-w-4xl animate-fade-up">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-sand-200">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-clay-300" />
              Verified listings
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-clay-300" />
              No buyer fees
            </span>
            <span className="flex items-center gap-2">
              <Star className="size-4 fill-clay-300 text-clay-300" />
              4.9 average agent rating
            </span>
          </div>
        </div>
      </section>

      {/* Market stats */}
      <section className="border-b border-ink-100 bg-white dark:border-white/10 dark:bg-night-900">
        <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {marketStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xs font-medium tracking-wide text-ink-500 uppercase dark:text-ink-300">
                {stat.label}
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold sm:text-3xl">{stat.value}</span>
                <span
                  className={
                    stat.positive
                      ? 'flex items-center gap-0.5 text-xs font-semibold text-ink-600 dark:text-ink-300'
                      : 'text-xs font-semibold text-clay-600'
                  }
                >
                  <TrendingUp className="size-3" />
                  {stat.change}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Handpicked this week</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Featured homes
            </h2>
            <p className="mt-3 max-w-xl text-ink-600 dark:text-sand-300">
              Six listings our agents flagged for something you cannot see in the photos — usually light,
              a view, or a neighbor who bakes.
            </p>
          </div>
          <Link to="/browse" className="btn-ghost">
            Browse all {formatNumber(totalListings)} homes
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Property types */}
      <section className="container-page pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {typeTiles.map((tile) => {
            const count = listings.filter((listing) => listing.type === tile.type).length
            const Icon = tile.icon
            return (
              <Link
                key={tile.label}
                to={`/browse?type=${tile.type}`}
                className="group card flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-ink-50 text-ink-800 transition group-hover:bg-ink-900 group-hover:text-sand-50 dark:bg-white/10 dark:text-sand-100 dark:group-hover:bg-sand-100 dark:group-hover:text-night-950">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{tile.label}</h3>
                  <p className="mt-1 text-sm text-ink-600 dark:text-sand-300">{tile.blurb}</p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-clay-600 dark:text-clay-400">
                  {count} in our demo set
                  <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="bg-ink-900 py-20 text-sand-100 dark:bg-night-900">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow !text-clay-300">Where to look</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Neighborhoods with a point of view
              </h2>
            </div>
            <Link
              to="/neighborhoods"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-sand-100 transition hover:bg-white/10"
            >
              All neighborhoods
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.slice(0, 6).map((area) => (
              <Link
                key={area.name}
                to={`/browse?q=${encodeURIComponent(area.name)}`}
                className="group relative overflow-hidden rounded-3xl"
              >
                <img
                  src={area.image}
                  alt={area.name}
                  loading="lazy"
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-sand-300">{area.city}</p>
                      <h3 className="font-display text-xl font-semibold text-white">{area.name}</h3>
                      <p className="mt-0.5 text-xs text-sand-300">{area.vibe}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold text-white">
                        {formatPrice(area.median, true)}
                      </p>
                      <p className="text-[11px] text-clay-300">
                        {area.listings} homes · +{area.trend}% y/y
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">How HomeFinder works</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Built to remove the guesswork
            </h2>
            <p className="mt-4 max-w-md text-ink-600 dark:text-sand-300">
              Most listing sites are an ad business. We are a search business. That is why the filters
              work, the numbers are real, and agents are salaried rather than bid-driven.
            </p>
            <Link to="/about" className="btn-primary mt-6">
              Why we built it this way
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="card flex gap-5 p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-clay-600 uppercase dark:text-clay-400">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-sand-300">
                      {step.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Calculator promo */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[32px] bg-ink-900 px-6 py-12 text-sand-100 sm:px-12 sm:py-16 dark:bg-night-900">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-clay-500/25 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-ink-500/30 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow !text-clay-300">Do the math first</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Know the payment before the open house
              </h2>
              <p className="mt-4 max-w-lg text-sand-200">
                Our calculator models principal, interest, taxes, insurance, PMI, and HOA, then shows
                the income you would need to qualify. No email gate.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  'Side-by-side term comparison, 10 to 30 years',
                  'Accurate PMI modeling below 20% down',
                  'Total interest over the life of the loan',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-sand-200">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-clay-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/mortgage"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-sand-100 px-6 py-3 text-sm font-semibold text-night-950 transition hover:bg-white"
              >
                <Calculator className="size-4" />
                Open the calculator
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '$750K home', value: '$4,246', note: '20% down · 6.4% · 30 yr' },
                { label: '$1.2M home', value: '$7,105', note: '20% down · 6.4% · 30 yr' },
                { label: '15-year term', value: 'Save 41%', note: 'on total interest' },
                { label: '10% down', value: '+$344/mo', note: 'with PMI included' },
              ].map((tile) => (
                <div key={tile.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] text-sand-300">{tile.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-white">{tile.value}</p>
                  <p className="mt-1 text-[11px] text-sand-300">{tile.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Word of mouth</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              People who stopped refreshing Zillow
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-sand-300">
            <span className="flex">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-4 fill-clay-500 text-clay-500" />
              ))}
            </span>
            4.9 from 610 reviews
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {testimonials.map((review) => (
            <figure key={review.name} className="card flex flex-col p-6">
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="size-3.5 fill-clay-500 text-clay-500" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700 dark:text-sand-200">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4 dark:border-white/10">
                <span className="grid size-10 place-items-center rounded-full bg-ink-900 text-xs font-semibold text-sand-50 dark:bg-sand-100 dark:text-night-950">
                  {review.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{review.name}</span>
                  <span className="block text-xs text-ink-500 dark:text-ink-300">{review.detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Guides */}
      <section className="container-page pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Read before you offer</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Guides worth your evening
            </h2>
          </div>
          <Link to="/guides" className="btn-ghost">
            All guides
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.title}
              to="/guides"
              className="group card flex flex-col gap-2 p-6 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="chip w-fit !text-[11px]">{guide.tag}</span>
              <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-clay-600 dark:group-hover:text-clay-400">
                {guide.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-600 dark:text-sand-300">{guide.excerpt}</p>
              <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-ink-500 dark:text-ink-300">
                {guide.read}
                <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-4">
        <div className="card flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what “home” means to you
            </h2>
            <p className="mt-3 text-ink-600 dark:text-sand-300">
              Fifteen minutes on the phone with a local agent usually saves six weeks of scrolling. No
              pressure, no listing presentation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/about#contact" className="btn-primary">
              Book a call
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/browse" className="btn-ghost">
              <MapPin className="size-4" />
              Start browsing
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
