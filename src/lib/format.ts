export const formatPrice = (value: number, compact = false) => {
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`
    if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

export const formatSqft = (value: number) => `${formatNumber(value)} sq ft`

export const pricePerSqft = (price: number, sqft: number) => Math.round(price / sqft)

export const fullAddress = (listing: { address: string; city: string; state: string }) =>
  `${listing.address}, ${listing.city}, ${listing.state}`

export interface LoanInput {
  principal: number
  downPayment: number
  rate: number
  years: number
}

export interface LoanResult {
  loanAmount: number
  monthlyPrincipalInterest: number
  monthlyTax: number
  monthlyInsurance: number
  monthlyHoa: number
  monthlyPmi: number
  monthlyTotal: number
  totalInterest: number
  totalPaid: number
}

/** Standard amortized mortgage math, plus estimated tax/insurance/HOA/PMI. */
export function calculateLoan(input: LoanInput & { hoa?: number }): LoanResult {
  const loanAmount = Math.max(input.principal - input.downPayment, 0)
  const monthlyRate = input.rate / 100 / 12
  const payments = input.years * 12

  const monthlyPrincipalInterest =
    monthlyRate === 0
      ? loanAmount / payments
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments))

  const downPct = input.principal > 0 ? input.downPayment / input.principal : 0
  const monthlyPmi = downPct < 0.2 ? (loanAmount * 0.0055) / 12 : 0
  const monthlyTax = (input.principal * 0.011) / 12
  const monthlyInsurance = (input.principal * 0.0035) / 12
  const monthlyHoa = input.hoa ?? 0

  const monthlyTotal =
    monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyPmi + monthlyHoa

  return {
    loanAmount,
    monthlyPrincipalInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyPmi,
    monthlyTotal,
    totalInterest: monthlyPrincipalInterest * payments - loanAmount,
    totalPaid: monthlyPrincipalInterest * payments,
  }
}

export const clsx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ')

export const timeAgo = (days: number) => {
  if (days === 0) return 'Listed today'
  if (days === 1) return 'Listed yesterday'
  if (days < 7) return `Listed ${days} days ago`
  if (days < 30) return `Listed ${Math.round(days / 7)} weeks ago`
  return `Listed ${Math.round(days / 30)} months ago`
}
