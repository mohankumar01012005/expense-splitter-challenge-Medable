// src/state/selectors.ts
// Small selectors that the UI can import to get derived data.
// Keeps UI code focused on rendering rather than business logic.

import { calculateTotals } from '../utils/calcBalances'
import { simplifyDebts } from '../utils/simplifyDebts'
import type { AppState } from './actions'

export function getTotals(state: AppState) {
  // calculateTotals expects people and expenses in specific shapes
  return calculateTotals(state.people, state.expenses)
}

export function getSettlements(state: AppState) {
  const totals = getTotals(state)
  return simplifyDebts(totals.perPerson)
}
