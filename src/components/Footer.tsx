import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Home, Instagram, Linkedin, Twitter } from 'lucide-react'
import { useAppState } from '../context/AppState'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Homes for sale', to: '/browse' },
      { label: 'Neighborhoods', to: '/neighborhoods' },
      { label: 'New listings', to: '/browse?sort=newest' },
      { label: 'Open houses', to: '/browse?status=Open+house' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Mortgage calculator', to: '/mortgage' },
      { label: 'Affordability guide', to: '/guides' },
      { label: 'Saved homes', to: '/saved' },
      { label: 'Compare homes', to: '/saved?tab=compare' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Meet the team', to: '/about#team' },
      { label: 'Buying guides', to: '/guides' },
      { label: 'Contact', to: '/about#contact' },
    ],
  },
]

export default function Footer() {
  const { notify } = useAppState()
  const [email, setEmail] = useState('')

  return (
    <footer className="mt-24 border-t border-ink-100 bg-white dark:border-white/10 dark:bg-night-900">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-ink-900 text-sand-50 dark:bg-sand-100 dark:text-night-950">
              <Home className="size-5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-xl font-semibold">
              Home<span className="text-clay-600 dark:text-clay-400">Finder</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600 dark:text-sand-300">
            A quieter way to buy a home. Verified listings, honest numbers, and agents who answer the
            phone.
          </p>

          <form
            className="mt-6 flex max-w-sm gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (!email.trim()) return
              notify('You are on the list — new listings every Thursday')
              setEmail('')
            }}
          >
            <label className="sr-only" htmlFor="newsletter">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              className="field !rounded-full !py-2.5"
            />
            <button type="submit" className="btn-primary shrink-0 !px-4" aria-label="Subscribe">
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-6 flex gap-2">
            {[Instagram, Twitter, Linkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                onClick={(event) => event.preventDefault()}
                className="grid size-9 place-items-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ink-900 hover:text-ink-900 dark:border-white/15 dark:text-sand-300 dark:hover:border-white/40 dark:hover:text-white"
                aria-label="Social link"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase dark:text-ink-300">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-700 transition hover:text-clay-600 dark:text-sand-200 dark:hover:text-clay-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-ink-100 dark:border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between dark:text-ink-300">
          <p>© {new Date().getFullYear()} HomeFinder. A demo project — listings are illustrative.</p>
          <p className="flex gap-4">
            <span className="transition hover:text-ink-800 dark:hover:text-white">Equal Housing Opportunity</span>
            <span className="transition hover:text-ink-800 dark:hover:text-white">Privacy</span>
            <span className="transition hover:text-ink-800 dark:hover:text-white">Terms</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
