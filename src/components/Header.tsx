import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Home, Menu, Moon, Scale, Sun, X } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { clsx } from '../lib/format'

const links = [
  { to: '/browse', label: 'Buy' },
  { to: '/neighborhoods', label: 'Neighborhoods' },
  { to: '/mortgage', label: 'Mortgage' },
  { to: '/guides', label: 'Guides' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const { favorites, compare, theme, toggleTheme } = useAppState()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-ink-100/80 bg-sand-50/90 backdrop-blur-xl dark:border-white/10 dark:bg-night-950/85'
          : 'bg-transparent',
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="HomeFinder home">
          <span className="grid size-10 place-items-center rounded-2xl bg-ink-900 text-sand-50 transition group-hover:rotate-3 dark:bg-sand-100 dark:text-night-950">
            <Home className="size-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl leading-none font-semibold tracking-tight">
            Home<span className="text-clay-600 dark:text-clay-400">Finder</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-ink-100 text-ink-900 dark:bg-white/10 dark:text-sand-50'
                    : 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900 dark:text-sand-200 dark:hover:bg-white/5 dark:hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 dark:text-sand-200 dark:hover:bg-white/10"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>

          <Link
            to="/saved"
            className="relative grid size-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 dark:text-sand-200 dark:hover:bg-white/10"
            aria-label={`Saved homes (${favorites.length})`}
          >
            <Heart className="size-[18px]" />
            {favorites.length > 0 && (
              <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-clay-500 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {compare.length > 0 && (
            <Link
              to="/saved?tab=compare"
              className="relative hidden size-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 sm:grid dark:text-sand-200 dark:hover:bg-white/10"
              aria-label={`Compare homes (${compare.length})`}
            >
              <Scale className="size-[18px]" />
              <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-sand-50 dark:bg-sand-100 dark:text-night-950">
                {compare.length}
              </span>
            </Link>
          )}

          <Link to="/about#contact" className="btn-primary ml-1 hidden !px-4 !py-2.5 sm:inline-flex">
            Talk to an agent
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100 lg:hidden dark:text-sand-100 dark:hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-sand-50 lg:hidden dark:border-white/10 dark:bg-night-950">
          <nav className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded-xl px-4 py-3 text-sm font-medium',
                    isActive
                      ? 'bg-ink-100 text-ink-900 dark:bg-white/10 dark:text-white'
                      : 'text-ink-700 dark:text-sand-200',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/about#contact" className="btn-primary mt-2 w-full">
              Talk to an agent
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
