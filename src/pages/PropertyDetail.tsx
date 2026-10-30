import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  GraduationCap,
  Heart,
  Home,
  LandPlot,
  Link2,
  MapPin,
  Ruler,
  Scale,
  Star,
  Trees,
  X,
} from 'lucide-react'
import Gallery from '../components/Gallery'
import ListingCard from '../components/ListingCard'
import MortgageCalculator from '../components/MortgageCalculator'
import { useAppState } from '../context/AppState'
import { getAgent, getListing, listings } from '../data/listings'
import { clsx, formatNumber, formatPrice, fullAddress, timeAgo } from '../lib/format'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const listing = getListing(id)
  const { isFavorite, toggleFavorite, compare, toggleCompare, markViewed, notify, addTour } = useAppState()
  const [tourOpen, setTourOpen] = useState(false)
  const [openHouse, setOpenHouse] = useState(false)

  useEffect(() => {
    if (listing) markViewed(listing.id)
    window.scrollTo({ top: 0 })
  }, [listing, markViewed])

  if (!listing) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-4xl font-semibold">That home is no longer available</h1>
        <p className="mt-3 text-ink-600 dark:text-sand-300">
          It may have sold or been withdrawn. Here are some homes nearby.
        </p>
        <Link to="/browse" className="btn-primary mt-6">
          Browse all homes
        </Link>
      </div>
    )
  }

  const agent = getAgent(listing.agentId)
  const saved = isFavorite(listing.id)
  const comparing = compare.includes(listing.id)
  const similar = listings
    .filter((item) => item.id !== listing.id && (item.city === listing.city || item.type === listing.type))
    .slice(0, 3)

  const facts = [
    { icon: BedDouble, label: 'Bedrooms', value: listing.beds },
    { icon: Bath, label: 'Bathrooms', value: listing.baths },
    { icon: Ruler, label: 'Interior', value: `${formatNumber(listing.sqft)} sqft` },
    { icon: LandPlot, label: 'Lot size', value: listing.lot ? `${listing.lot} acres` : 'N/A' },
    { icon: Home, label: 'Built', value: listing.year },
    { icon: Car, label: 'Garage', value: listing.garage ? `${listing.garage}-car` : 'Street' },
  ]

  const details = [
    ['Property type', listing.type],
    ['Price per sqft', `$${formatNumber(Math.round(listing.price / listing.sqft))}`],
    ['Year built', String(listing.year)],
    ['HOA dues', listing.hoa ? `${formatPrice(listing.hoa)}/mo` : 'None'],
    ['Lot size', listing.lot ? `${listing.lot} acres` : 'N/A'],
    ['Parking', listing.garage ? `${listing.garage}-car attached` : 'On street'],
    ['Days on market', String(listing.daysOnMarket)],
    ['MLS', `HF-${listing.id.split('-')[1]}-${listing.city.slice(0, 2).toUpperCase()}`],
  ]

  return (
    <div className="pb-24">
      <div className="container-page pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition hover:text-ink-900 dark:text-sand-300 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to results
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-sand-50 dark:bg-sand-100 dark:text-night-950">
                {listing.status}
              </span>
              <span className="text-xs text-ink-500 dark:text-ink-300">{timeAgo(listing.daysOnMarket)}</span>
              <span className="text-xs text-ink-500 dark:text-ink-300">·</span>
              <span className="text-xs text-ink-500 dark:text-ink-300">{listing.type}</span>
            </div>
            <h1 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-600 dark:text-sand-300">
              <MapPin className="size-4" />
              {fullAddress(listing)}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {formatPrice(listing.price)}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(listing.id)}
                aria-pressed={saved}
                className={clsx('btn !py-2.5 !px-4 text-sm', saved ? 'bg-clay-500 text-white' : 'btn-ghost')}
              >
                <Heart className={clsx('size-4', saved && 'fill-current')} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(listing.id)}
                aria-pressed={comparing}
                className={clsx('btn !py-2.5 !px-4 text-sm', comparing ? 'bg-ink-900 text-sand-50' : 'btn-ghost')}
              >
                <Scale className="size-4" />
                Compare
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                    notify('Link copied to clipboard')
                  } catch {
                    notify('Copy failed — you can share the URL from the address bar')
                  }
                }}
                className="btn-ghost !px-3 !py-2.5"
                aria-label="Copy link to this listing"
              >
                <Link2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Gallery images={listing.images} title={listing.title} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.65fr_1fr]">
          <div className="space-y-10">
            {/* Key facts */}
            <section className="grid grid-cols-2 gap-4 rounded-3xl border border-ink-100 bg-white p-6 sm:grid-cols-3 lg:grid-cols-6 dark:border-white/10 dark:bg-night-900">
              {facts.map((fact) => {
                const Icon = fact.icon
                return (
                  <div key={fact.label} className="text-center">
                    <Icon className="mx-auto size-5 text-clay-600 dark:text-clay-400" />
                    <p className="mt-2 text-sm font-semibold">{fact.value}</p>
                    <p className="text-[11px] text-ink-500 dark:text-ink-300">{fact.label}</p>
                  </div>
                )
              })}
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">About this home</h2>
              <p className="mt-3 leading-relaxed text-ink-700 dark:text-sand-200">{listing.description}</p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {listing.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 rounded-2xl bg-ink-50 px-4 py-3 text-sm dark:bg-white/5"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-clay-600 dark:text-clay-400" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">Features & amenities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <span key={amenity} className="chip !py-2 !text-[13px]">
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">Property details</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
                {details.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-ink-100 py-3 text-sm dark:border-white/10"
                  >
                    <dt className="text-ink-500 dark:text-ink-300">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">The neighborhood</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <ScoreCard label="Walk score" value={listing.walkScore} note={walkNote(listing.walkScore)} />
                <ScoreCard
                  label="School rating"
                  value={listing.schoolRating}
                  max={10}
                  note="GreatSchools average"
                  icon={<GraduationCap className="size-4" />}
                />
                <ScoreCard
                  label="Green space"
                  value={listing.neighborhood.includes('Ridge') || listing.neighborhood.includes('Woodland') ? 9 : 6}
                  max={10}
                  note="Parks within 1 mile"
                  icon={<Trees className="size-4" />}
                />
              </div>
              <div className="mt-4 rounded-3xl border border-ink-100 p-5 text-sm leading-relaxed text-ink-600 dark:border-white/10 dark:text-sand-300">
                <strong className="font-semibold text-ink-900 dark:text-sand-50">
                  {listing.neighborhood}, {listing.city}.
                </strong>{' '}
                A short drive to groceries and coffee, with the kind of side streets people walk in the
                evening. Ask the agent about noise, parking, and which corner gets the school bus.
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">Price history</h2>
              <ol className="mt-4 space-y-3">
                {[
                  { date: 'Today', label: 'Listed for sale', price: listing.price },
                  {
                    date: `${listing.daysOnMarket} days ago`,
                    label: listing.status === 'Price drop' ? 'Price reduced' : 'Listing published',
                    price: listing.status === 'Price drop' ? Math.round(listing.price * 1.04) : listing.price,
                  },
                  {
                    date: `${listing.year}`,
                    label: 'Last recorded sale',
                    price: Math.round(listing.price * 0.68),
                  },
                ].map((event) => (
                  <li key={event.label} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-xs text-ink-500 dark:text-ink-300">{event.date}</span>
                    <span className="relative flex size-2 shrink-0 rounded-full bg-clay-500" />
                    <span className="flex-1">{event.label}</span>
                    <span className="font-medium tabular-nums">{formatPrice(event.price)}</span>
                  </li>
                ))}
              </ol>
            </section>

            <MortgageCalculator price={listing.price} hoa={listing.hoa} />
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <span className={clsx('grid size-12 place-items-center rounded-2xl text-sm font-semibold', agent.tint)}>
                    {agent.initials}
                  </span>
                  <div>
                    <p className="font-semibold">{agent.name}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-300">{agent.title}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-ink-600 dark:text-sand-300">
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 fill-clay-500 text-clay-500" />
                    {agent.rating}
                  </span>
                  <span>{agent.reviews} reviews</span>
                  <span>{agent.deals} closings</span>
                </div>

                <button type="button" onClick={() => setTourOpen(true)} className="btn-primary mt-5 w-full">
                  <CalendarDays className="size-4" />
                  Schedule a tour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenHouse(true)
                    notify('Inquiry started — the agent replies within the hour')
                  }}
                  className="btn-ghost mt-2 w-full"
                >
                  Ask a question
                </button>
                <p className="mt-3 text-center text-[11px] text-ink-400 dark:text-ink-300">
                  {agent.phone} · typically replies in 20 min
                </p>
              </div>

              <div className="rounded-3xl bg-ink-900 p-6 text-sand-100 dark:bg-night-900">
                <p className="text-xs font-semibold tracking-[0.14em] text-clay-300 uppercase">
                  Estimated payment
                </p>
                <p className="mt-2 font-display text-3xl font-semibold">
                  {formatPrice(
                    Math.round(
                      (listing.price * 0.8 * (0.064 / 12)) / (1 - Math.pow(1 + 0.064 / 12, -360)) +
                        (listing.price * 0.0145) / 12 +
                        listing.hoa,
                    ),
                  )}
                  <span className="text-base font-normal text-sand-300">/mo</span>
                </p>
                <p className="mt-1 text-xs text-sand-300">20% down · 6.4% · 30 years · taxes & insurance</p>
                <Link
                  to="/mortgage"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sand-100 underline-offset-4 hover:underline"
                >
                  Adjust the numbers
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold">Open houses</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {[
                    { day: 'Saturday', time: '11:00 AM – 1:00 PM' },
                    { day: 'Sunday', time: '1:00 PM – 3:30 PM' },
                  ].map((slot) => (
                    <li
                      key={slot.day}
                      className="flex items-center justify-between rounded-2xl bg-ink-50 px-4 py-3 dark:bg-white/5"
                    >
                      <span className="font-medium">{slot.day}</span>
                      <span className="text-xs text-ink-600 dark:text-sand-300">{slot.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Similar homes</h2>
            <Link
              to={`/browse?city=${encodeURIComponent(`${listing.city}, ${listing.state}`)}`}
              className="text-sm font-semibold text-clay-600 hover:underline dark:text-clay-400"
            >
              See all in {listing.city}
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      </div>

      {tourOpen && (
        <TourModal
          listingTitle={listing.title}
          onClose={() => setTourOpen(false)}
          onSubmit={(data) => {
            addTour({ ...data, listingId: listing.id })
            setTourOpen(false)
          }}
        />
      )}

      {openHouse && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-night-950/60 backdrop-blur-sm" onClick={() => setOpenHouse(false)} />
          <div className="card relative w-full max-w-md p-6">
            <button
              type="button"
              onClick={() => setOpenHouse(false)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-ink-100 dark:bg-white/10"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h3 className="font-display text-2xl font-semibold">Ask {agent.name.split(' ')[0]} a question</h3>
            <p className="mt-1 text-sm text-ink-600 dark:text-sand-300">
              About {listing.address} — condition, HOA, offers, whatever is on your mind.
            </p>
            <form
              className="mt-5 space-y-3"
              onSubmit={(event) => {
                event.preventDefault()
                setOpenHouse(false)
                notify('Question sent — expect a reply within the hour')
              }}
            >
              <input required placeholder="Your name" className="field" aria-label="Your name" />
              <input required type="email" placeholder="Email address" className="field" aria-label="Email" />
              <textarea
                required
                rows={3}
                placeholder="What would you like to know?"
                className="field resize-none"
                aria-label="Your question"
              />
              <button type="submit" className="btn-primary w-full">
                Send question
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function walkNote(score: number) {
  if (score >= 90) return 'Daily errands without a car'
  if (score >= 70) return 'Most errands walkable'
  if (score >= 50) return 'Some errands on foot'
  return 'Car recommended'
}

function ScoreCard({
  label,
  value,
  max = 100,
  note,
  icon,
}: {
  label: string
  value: number
  max?: number
  note: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-ink-100 p-4 dark:border-white/10">
      <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-300">
        <span className="flex items-center gap-1.5">
          {icon ?? <MapPin className="size-4" />}
          {label}
        </span>
        <span className="font-semibold text-ink-900 dark:text-sand-50">
          {value}
          <span className="text-ink-400 dark:text-ink-300">/{max}</span>
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-clay-500"
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-ink-500 dark:text-ink-300">{note}</p>
    </div>
  )
}

function TourModal({
  listingTitle,
  onClose,
  onSubmit,
}: {
  listingTitle: string
  onClose: () => void
  onSubmit: (data: { date: string; time: string; name: string; email: string; note: string }) => void
}) {
  const [form, setForm] = useState({ date: '', time: '10:00 AM', name: '', email: '', note: '' })
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-night-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative my-8 w-full max-w-lg p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-ink-100 dark:bg-white/10"
          aria-label="Close tour scheduling"
        >
          <X className="size-4" />
        </button>
        <h3 className="font-display text-2xl font-semibold">Schedule a tour</h3>
        <p className="mt-1 text-sm text-ink-600 dark:text-sand-300">{listingTitle}</p>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(form)
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="tour-date">
                Preferred date
              </label>
              <input
                id="tour-date"
                type="date"
                required
                min={today}
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="tour-time">
                Time window
              </label>
              <select
                id="tour-time"
                className="field"
                value={form.time}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
              >
                {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(
                  (time) => (
                    <option key={time}>{time}</option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="tour-name">
                Your name
              </label>
              <input
                id="tour-name"
                required
                className="field"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Alex Rivera"
              />
            </div>
            <div>
              <label className="label" htmlFor="tour-email">
                Email
              </label>
              <input
                id="tour-email"
                type="email"
                required
                className="field"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@email.com"
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="tour-note">
              Anything we should know?
            </label>
            <textarea
              id="tour-note"
              rows={2}
              className="field resize-none"
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              placeholder="Bringing our toddler, need a 20-minute heads up…"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Request tour
          </button>
          <p className="text-center text-[11px] text-ink-400 dark:text-ink-300">
            No obligation. You can cancel or reschedule anytime.
          </p>
        </form>
      </div>
    </div>
  )
}
