import type { Listing } from '../data/listings'
import { allAmenities, allCities, allTypes, listings } from '../data/listings'

export interface Filters {
  q: string
  city: string
  type: string
  beds: number
  baths: number
  minPrice: number
  maxPrice: number
  amenities: string[]
  status: string
  sort: string
  featured: boolean
}

export const PRICE_MIN = 0
export const PRICE_MAX = 3_500_000

export const defaultFilters: Filters = {
  q: '',
  city: 'Any city',
  type: 'Any type',
  beds: 0,
  baths: 0,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  amenities: [],
  status: 'Any status',
  sort: 'newest',
  featured: false,
}

export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'sqft-desc', label: 'Largest home' },
  { value: 'ppsf-asc', label: 'Best price per sqft' },
]

export const statusOptions = ['Any status', 'For sale', 'New', 'Open house', 'Price drop']

export const amenitiesList = allAmenities
export const cities = ['Any city', ...allCities]
export const types = ['Any type', ...allTypes]

const num = (value: string | null, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && value !== null && value !== '' ? parsed : fallback
}

export function parseFilters(params: URLSearchParams): Filters {
  return {
    q: params.get('q') ?? '',
    city: params.get('city') ?? defaultFilters.city,
    type: params.get('type') ?? defaultFilters.type,
    beds: num(params.get('beds'), 0),
    baths: num(params.get('baths'), 0),
    minPrice: num(params.get('minPrice'), PRICE_MIN),
    maxPrice: num(params.get('maxPrice'), PRICE_MAX),
    amenities: params.get('amenities')?.split(',').filter(Boolean) ?? [],
    status: params.get('status') ?? defaultFilters.status,
    sort: params.get('sort') ?? defaultFilters.sort,
    featured: params.get('featured') === '1',
  }
}

export function toSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set('q', filters.q.trim())
  if (filters.city !== defaultFilters.city) params.set('city', filters.city)
  if (filters.type !== defaultFilters.type) params.set('type', filters.type)
  if (filters.beds > 0) params.set('beds', String(filters.beds))
  if (filters.baths > 0) params.set('baths', String(filters.baths))
  if (filters.minPrice > PRICE_MIN) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice < PRICE_MAX) params.set('maxPrice', String(filters.maxPrice))
  if (filters.amenities.length) params.set('amenities', filters.amenities.join(','))
  if (filters.status !== defaultFilters.status) params.set('status', filters.status)
  if (filters.sort !== defaultFilters.sort) params.set('sort', filters.sort)
  if (filters.featured) params.set('featured', '1')
  return params
}

export function activeFilterCount(filters: Filters) {
  let count = 0
  if (filters.q.trim()) count++
  if (filters.city !== defaultFilters.city) count++
  if (filters.type !== defaultFilters.type) count++
  if (filters.beds > 0) count++
  if (filters.baths > 0) count++
  if (filters.minPrice > PRICE_MIN || filters.maxPrice < PRICE_MAX) count++
  if (filters.amenities.length) count++
  if (filters.status !== defaultFilters.status) count++
  if (filters.featured) count++
  return count
}

export function applyFilters(filters: Filters): Listing[] {
  const query = filters.q.trim().toLowerCase()
  const result = listings.filter((listing) => {
    if (query) {
      const haystack = `${listing.title} ${listing.address} ${listing.city} ${listing.state} ${listing.neighborhood} ${listing.type}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }
    if (filters.city !== defaultFilters.city && `${listing.city}, ${listing.state}` !== filters.city) return false
    if (filters.type !== defaultFilters.type && listing.type !== filters.type) return false
    if (filters.beds > 0 && listing.beds < filters.beds) return false
    if (filters.baths > 0 && listing.baths < filters.baths) return false
    if (listing.price < filters.minPrice || listing.price > filters.maxPrice) return false
    if (filters.status !== defaultFilters.status && listing.status !== filters.status) return false
    if (filters.featured && !listing.featured) return false
    if (filters.amenities.length && !filters.amenities.every((amenity) => listing.amenities.includes(amenity)))
      return false
    return true
  })

  return result.sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'sqft-desc':
        return b.sqft - a.sqft
      case 'ppsf-asc':
        return a.price / a.sqft - b.price / b.sqft
      default:
        return a.daysOnMarket - b.daysOnMarket
    }
  })
}

export function describeFilters(filters: Filters) {
  const parts: string[] = []
  if (filters.city !== defaultFilters.city) parts.push(filters.city)
  if (filters.type !== defaultFilters.type) parts.push(filters.type)
  if (filters.beds) parts.push(`${filters.beds}+ beds`)
  if (filters.baths) parts.push(`${filters.baths}+ baths`)
  if (filters.maxPrice < PRICE_MAX)
    parts.push(`under $${Math.round(filters.maxPrice / 1000)}K`)
  if (filters.amenities.length) parts.push(filters.amenities.slice(0, 2).join(', '))
  return parts.length ? parts.join(' · ') : 'All homes'
}
