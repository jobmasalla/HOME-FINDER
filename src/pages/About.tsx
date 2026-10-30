import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { agents, testimonials } from '../data/listings'
import { useAppState } from '../context/AppState'
import { clsx } from '../lib/format'

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified or it is not listed',
    body: 'Every home is cross-checked against county records before it goes live. If a listing is withdrawn, it disappears within the hour — no stale inventory to make the market look bigger.',
  },
  {
    icon: Clock3,
    title: 'Salaried agents, not commission hunters',
    body: 'Our agents are paid a salary plus a modest team bonus. Nobody is steering you toward the more expensive house because the check is bigger.',
  },
  {
    icon: Award,
    title: 'Numbers in daylight',
    body: 'Taxes, PMI, HOA, and insurance are modeled on every listing. We would rather you hesitate now than be surprised at the closing table.',
  },
]

export default function About() {
  const { notify } = useAppState()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', agent: agents[0].name, message: '' })

  return (
    <div className="pb-24">
      <section className="border-b border-ink-100 bg-white pt-12 pb-16 dark:border-white/10 dark:bg-night-900">
        <div className="container-page grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow">About HomeFinder</p>
            <h1 className="mt-2 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              We got tired of being sold to while buying a house
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-ink-600 dark:text-sand-300">
              HomeFinder started in 2019 with four agents, one spreadsheet, and a rule: no lead forms in
              front of the numbers. Seven years later the spreadsheet is a search engine, the rule has not
              changed, and we still answer the phone ourselves.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">
                Talk to an agent
                <ArrowRight className="size-4" />
              </a>
              <Link to="/browse" className="btn-ghost">
                Browse listings
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '1,284', label: 'Active listings' },
              { value: '3,900+', label: 'Homes closed' },
              { value: '4.9', label: 'Average rating' },
              { value: '26', label: 'Days to close avg.' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-ink-100 p-5 dark:border-white/10">
                <p className="font-display text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="card p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold">{value.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-sand-300">{value.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section id="team" className="container-page pb-16 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The people</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Meet the team
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-600 dark:text-sand-300">
            Licensed in six states. Each agent covers one market, not a national phone line.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => (
            <article key={agent.id} className="card p-6">
              <span className={clsx('grid size-14 place-items-center rounded-2xl text-base font-semibold', agent.tint)}>
                {agent.initials}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{agent.name}</h3>
              <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">{agent.title}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-600 dark:text-sand-300">
                <Star className="size-3.5 fill-clay-500 text-clay-500" />
                <strong className="font-semibold text-ink-900 dark:text-sand-50">{agent.rating}</strong>
                <span>· {agent.reviews} reviews</span>
              </div>
              <div className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-xs dark:border-white/10">
                <a
                  href={`tel:${agent.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-ink-600 transition hover:text-clay-600 dark:text-sand-300 dark:hover:text-clay-400"
                >
                  <Phone className="size-3.5" />
                  {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-2 truncate text-ink-600 transition hover:text-clay-600 dark:text-sand-300 dark:hover:text-clay-400"
                >
                  <Mail className="size-3.5" />
                  {agent.email}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-[32px] bg-ink-900 p-8 text-sand-100 sm:p-12 dark:bg-night-900">
          <Quote className="size-8 text-clay-400" />
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {testimonials.map((review) => (
              <figure key={review.name}>
                <blockquote className="text-sm leading-relaxed text-sand-200">“{review.quote}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-white/10 text-[11px] font-semibold">
                    {review.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{review.name}</span>
                    <span className="block text-[11px] text-sand-300">{review.detail}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="container-page scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Say hello</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what you are looking for
            </h2>
            <p className="mt-4 max-w-md text-ink-600 dark:text-sand-300">
              One conversation, no listing presentation. We will tell you what is realistic in your budget
              — and if the honest answer is “wait six months”, we will say that too.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              {[
                { icon: Clock3, text: 'Replies within one business hour' },
                { icon: Users, text: 'Matched with one local agent, not a call center' },
                { icon: MapPin, text: 'Coverage across six metro markets' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.text} className="flex items-center gap-2.5 text-ink-700 dark:text-sand-200">
                    <Icon className="size-4 text-clay-600 dark:text-clay-400" />
                    {item.text}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="card p-6 sm:p-8">
            {sent ? (
              <div className="grid place-items-center py-12 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950">
                  <CheckCircle2 className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">Message received</h3>
                <p className="mt-2 max-w-sm text-sm text-ink-600 dark:text-sand-300">
                  Thanks {form.name.split(' ')[0] || 'there'} — {form.agent} will reply to {form.email} within
                  one business hour.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setForm({ ...form, message: '' })
                  }}
                  className="btn-ghost mt-6"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  setSent(true)
                  notify('Message sent — an agent will be in touch')
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="contact-name">
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      required
                      className="field"
                      placeholder="Alex Rivera"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      className="field"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-phone">
                      Phone (optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="field"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-agent">
                      Preferred agent
                    </label>
                    <select
                      id="contact-agent"
                      className="field"
                      value={form.agent}
                      onChange={(event) => setForm({ ...form, agent: event.target.value })}
                    >
                      {agents.map((agent) => (
                        <option key={agent.id}>{agent.name}</option>
                      ))}
                      <option>No preference — match me</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="contact-message">
                    What are you looking for?
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    className="field resize-none"
                    placeholder="Three bedrooms near good schools, budget around $750K, hoping to move by spring…"
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send message
                  <ArrowRight className="size-4" />
                </button>
                <p className="text-center text-[11px] text-ink-400 dark:text-ink-300">
                  Demo form — nothing is transmitted or stored on a server.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
