import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CompareBar from './components/CompareBar'
import { useAppState } from './context/AppState'
import Home from './pages/Home'
import Browse from './pages/Browse'
import PropertyDetail from './pages/PropertyDetail'
import Saved from './pages/Saved'
import Mortgage from './pages/Mortgage'
import Neighborhoods from './pages/Neighborhoods'
import Guides from './pages/Guides'
import About from './pages/About'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.replace('#', ''))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function Toasts() {
  const { toasts } = useAppState()
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 sm:bottom-28">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-up rounded-full bg-ink-950 px-4 py-2.5 text-center text-xs font-medium text-sand-50 shadow-lg ring-1 ring-white/10"
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function NotFound() {
  return (
    <div className="container-page grid place-items-center py-32 text-center">
      <p className="font-display text-7xl font-semibold text-ink-300 dark:text-ink-600">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">This page moved out</h1>
      <p className="mt-2 max-w-sm text-ink-600 dark:text-sand-300">
        The link you followed does not exist. The listings, however, are right where you left them.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to HomeFinder
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/listing/:id" element={<PropertyDetail />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/mortgage" element={<Mortgage />} />
          <Route path="/neighborhoods" element={<Neighborhoods />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
      <Toasts />
    </div>
  )
}
