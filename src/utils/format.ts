// src/utils/format.ts
// Small helpers for currency and date formatting.
// All monetary inputs/outputs in the app are in integer cents.

export function centsToDollars(cents: number): string {
  
  return (cents / 100).toFixed(2)
}

export function formatCurrency(cents: number): string {
  
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function parseDollarsToCents(value: string): number {
  
  
  const cleaned = value.replace(/,/g, '').trim()
  if (cleaned === '') return 0
  const parsed = Number(cleaned)
  if (Number.isNaN(parsed)) return 0
  
  return Math.round(parsed * 100)
}
