import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface SavedSearch {
  id: string
  name: string
  query: string
  createdAt: number
}

export interface TourRequest {
  id: string
  listingId: string
  date: string
  time: string
  name: string
  email: string
  note: string
  createdAt: number
}

interface Toast {
  id: number
  message: string
}

interface AppState {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  compare: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void
  savedSearches: SavedSearch[]
  saveSearch: (name: string, query: string) => void
  removeSearch: (id: string) => void
  tours: TourRequest[]
  addTour: (tour: Omit<TourRequest, 'id' | 'createdAt'>) => void
  cancelTour: (id: string) => void
  recent: string[]
  markViewed: (id: string) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
  toasts: Toast[]
  notify: (message: string) => void
}

const AppStateContext = createContext<AppState | null>(null)

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const usePersisted = <T,>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(() => read(key, initial))
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or blocked — keep state in memory */
    }
  }, [key, value])
  return [value, setValue] as const
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = usePersisted<string[]>('hf:favorites', [])
  const [compare, setCompare] = usePersisted<string[]>('hf:compare', [])
  const [savedSearches, setSavedSearches] = usePersisted<SavedSearch[]>('hf:searches', [])
  const [tours, setTours] = usePersisted<TourRequest[]>('hf:tours', [])
  const [recent, setRecent] = usePersisted<string[]>('hf:recent', [])
  const [theme, setTheme] = usePersisted<'light' | 'dark'>('hf:theme', 'light')
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const notify = useCallback((message: string) => {
    const id = ++toastId.current
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((current) => {
        const has = current.includes(id)
        notify(has ? 'Removed from saved homes' : 'Saved to your homes')
        return has ? current.filter((item) => item !== id) : [id, ...current]
      })
    },
    [notify, setFavorites],
  )

  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((current) => {
        if (current.includes(id)) return current.filter((item) => item !== id)
        if (current.length >= 3) {
          notify('Compare holds three homes — remove one first')
          return current
        }
        notify('Added to compare')
        return [...current, id]
      })
    },
    [notify, setCompare],
  )

  const saveSearch = useCallback(
    (name: string, query: string) => {
      setSavedSearches((current) => [
        { id: `s-${Date.now()}`, name, query, createdAt: Date.now() },
        ...current,
      ])
      notify('Search saved — we will alert you on new matches')
    },
    [notify, setSavedSearches],
  )

  const addTour = useCallback(
    (tour: Omit<TourRequest, 'id' | 'createdAt'>) => {
      setTours((current) => [{ ...tour, id: `t-${Date.now()}`, createdAt: Date.now() }, ...current])
      notify('Tour requested — your agent will confirm shortly')
    },
    [notify, setTours],
  )

  const markViewed = useCallback(
    (id: string) => {
      setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 8))
    },
    [setRecent],
  )

  const value = useMemo<AppState>(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite: (id: string) => favorites.includes(id),
      compare,
      toggleCompare,
      clearCompare: () => setCompare([]),
      savedSearches,
      saveSearch,
      removeSearch: (id: string) => setSavedSearches((current) => current.filter((s) => s.id !== id)),
      tours,
      addTour,
      cancelTour: (id: string) => setTours((current) => current.filter((t) => t.id !== id)),
      recent,
      markViewed,
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      toasts,
      notify,
    }),
    [
      favorites,
      toggleFavorite,
      compare,
      toggleCompare,
      setCompare,
      savedSearches,
      saveSearch,
      setSavedSearches,
      tours,
      addTour,
      setTours,
      recent,
      markViewed,
      theme,
      setTheme,
      toasts,
      notify,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used inside AppStateProvider')
  return context
}
