// src/services/storage.ts
// Small, defensive localStorage wrapper used by the provider.
// Keeps JSON parsing/stringify and guards against platform limitations.

const NAMESPACE = 'expense_splitter_v1'

export function saveState(key: string, value: unknown): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    const payload = JSON.stringify(value)
    window.localStorage.setItem(`${NAMESPACE}:${key}`, payload)
  } catch (err) {
    
    
  }
}

export function loadState<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(`${NAMESPACE}:${key}`)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch (err) {
    return null
  }
}

export function clearState(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.removeItem(`${NAMESPACE}:${key}`)
  } catch {
    
  }
}
