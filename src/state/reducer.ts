// src/state/reducer.ts
// Reducer implementing core state transitions.
// Pure functions only; no side-effects here.

import {
  ADD_PERSON,
  REMOVE_PERSON,
  ADD_EXPENSE,
  DELETE_EXPENSE,
  INIT_STATE,
  AppAction,
  AppState,
} from './actions'


function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}


 
 
 
export const initialState: AppState = {
  people: [],
  expenses: [],
}

export function appReducer(state: AppState = initialState, action: AppAction) {
  switch (action.type) {
    case INIT_STATE: {
      
      const payload = (action as any).payload as AppState
      return { ...payload }
    }

    case ADD_PERSON: {
      const person = (action as any).payload
      
      const exists = state.people.some(
        (p) => p.name.trim().toLowerCase() === person.name.trim().toLowerCase()
      )
      if (exists) return state
      const newPerson = { ...person, id: person.id ?? generateId('p-') }
      return { ...state, people: [...state.people, newPerson] }
    }

    case REMOVE_PERSON: {
      const { personId } = (action as any).payload
      
      const referenced = state.expenses.some(
        (e) =>
          e.paidBy === personId || (e.splitBetween || []).includes(personId)
      )
      if (referenced) {
        
        return state
      }
      return { ...state, people: state.people.filter((p) => p.id !== personId) }
    }

    case ADD_EXPENSE: {
      const expense = (action as any).payload
      const newExpense = { ...expense, id: expense.id ?? generateId('x-') }
      return { ...state, expenses: [...state.expenses, newExpense] }
    }

    case DELETE_EXPENSE: {
      const { expenseId } = (action as any).payload
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== expenseId),
      }
    }

    default:
      return state
  }
}
