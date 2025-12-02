// tests/state/reducer.test.ts


import { appReducer } from '../../state/reducer'
import {
  ADD_PERSON,
  ADD_EXPENSE,
  REMOVE_PERSON,
  DELETE_EXPENSE,
  AppState,
} from '../../state/actions'

describe('appReducer', () => {
  test('ADD_PERSON adds a person when not duplicate', () => {
    const state: AppState = { people: [], expenses: [] }
    const action = {
      type: ADD_PERSON,
      payload: { id: 'p1', name: 'Alice' },
    } as any
    const next = appReducer(state, action)
    expect(next.people.length).toBe(1)
    expect(next.people[0].name).toBe('Alice')
  })

  test('ADD_PERSON ignores duplicate names (case-insensitive)', () => {
    const state: AppState = {
      people: [{ id: 'p1', name: 'Alice' }],
      expenses: [],
    }
    const action = { type: ADD_PERSON, payload: { id: 'p2', name: 'alice' } } as any
    const next = appReducer(state, action)
    expect(next.people.length).toBe(1)
  })

  test('ADD_EXPENSE appends an expense', () => {
    const state: AppState = { people: [{ id: 'p1', name: 'A' }], expenses: [] }
    const expense = {
      id: 'e1',
      description: 'Dinner',
      amount: 1000,
      paidBy: 'p1',
      splitBetween: ['p1'],
      splitType: 'equal' as 'equal' | 'custom',
    }
    const next = appReducer(state, { type: ADD_EXPENSE, payload: expense } as any)
    expect(next.expenses.length).toBe(1)
    expect(next.expenses[0].description).toBe('Dinner')
  })

  test('REMOVE_PERSON blocked when referenced by an expense', () => {
    const state: AppState = {
      people: [{ id: 'p1', name: 'A' }],
      expenses: [
        {
          id: 'e1',
          description: 'X',
          amount: 100,
          paidBy: 'p1',
          splitBetween: ['p1'],
          splitType: 'equal' as 'equal' | 'custom',
        },
      ],
    }
    const next = appReducer(state, { type: REMOVE_PERSON, payload: { personId: 'p1' } } as any)
    
    expect(next.people.length).toBe(1)
  })

  test('DELETE_EXPENSE removes the expense', () => {
    const state: AppState = {
      people: [{ id: 'p1', name: 'A' }],
      expenses: [{ id: 'e1', description: 'X', amount: 100, paidBy: 'p1', splitBetween: ['p1'], splitType: 'equal' as 'equal' | 'custom' }],
    }
    const next = appReducer(state, { type: DELETE_EXPENSE, payload: { expenseId: 'e1' } } as any)
    expect(next.expenses.length).toBe(0)
  })
})
