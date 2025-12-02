// src/state/actions.ts
// Action type strings and typed action creators.
// Keep actions minimal and strictly typed.

import type { Expense, Person } from '../utils/calcBalances'


export const INIT_STATE = 'INIT_STATE' as const
export const ADD_PERSON = 'ADD_PERSON' as const
export const REMOVE_PERSON = 'REMOVE_PERSON' as const
export const ADD_EXPENSE = 'ADD_EXPENSE' as const
export const DELETE_EXPENSE = 'DELETE_EXPENSE' as const


export type InitStateAction = {
  type: typeof INIT_STATE
  payload: AppState
}

export type AddPersonAction = {
  type: typeof ADD_PERSON
  payload: Person
}

export type RemovePersonAction = {
  type: typeof REMOVE_PERSON
  payload: { personId: string }
}

export type AddExpenseAction = {
  type: typeof ADD_EXPENSE
  payload: Expense
}

export type DeleteExpenseAction = {
  type: typeof DELETE_EXPENSE
  payload: { expenseId: string }
}

export type AppAction =
  | InitStateAction
  | AddPersonAction
  | RemovePersonAction
  | AddExpenseAction
  | DeleteExpenseAction


export type AppState = {
  people: Person[]
  expenses: Expense[]
}
