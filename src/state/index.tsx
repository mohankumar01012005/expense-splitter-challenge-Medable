
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { appReducer } from './reducer'
import type { AppAction, AppState } from './actions'
import { loadState, saveState } from '../services/storage'
import { initialPeople, initialExpenses } from '../initialData' 




function personIdFromIndex(i: number) {
  return `p-${i + 1}`
}

function expenseIdToString(id: unknown) {
  return String(id)
}

const STORAGE_KEY = 'app_state'


const StateContext = createContext<AppState | undefined>(undefined)
const DispatchContext = createContext<React.Dispatch<AppAction> | undefined>(
  undefined
)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  
  const persisted = loadState<AppState>(STORAGE_KEY)

  
  const seededPeople = (initialPeople ?? []).map((name, idx) => ({
    id: personIdFromIndex(idx),
    name,
  }))

  
  
  
  const seededExpenses =
    (initialExpenses ?? []).map((e: any, idx: number) => ({
      id: expenseIdToString(e.id ?? `seed-${idx}`),
      description: e.description ?? '',
      
      
      amount:
        typeof e.amount === 'number'
          ? Math.round(e.amount * 100)
          : 0,
      paidBy:
    
        ((): string => {
          if (typeof e.paidBy === 'string') {
            const match = seededPeople.find(
              (p) => p.name.trim().toLowerCase() === e.paidBy.trim().toLowerCase()
            )
            return match ? match.id : e.paidBy
          }
          return String(e.paidBy)
        })(),
      date: e.date ?? undefined,
      splitBetween:
        
        (e.splitBetween || []).map((name: string) => {
          const match = seededPeople.find(
            (p) => p.name.trim().toLowerCase() === String(name).trim().toLowerCase()
          )
          return match ? match.id : String(name)
        }),
      splitType: (e.splitType === 'custom' ? 'custom' : 'equal') as 'equal' | 'custom',
      customAmounts: e.customAmounts
        ? Object.keys(e.customAmounts).reduce<Record<string, number>>((acc, k) => {
            const match = seededPeople.find(
              (p) => p.name.trim().toLowerCase() === k.trim().toLowerCase()
            )
            const pid = match ? match.id : k
           
            const val = typeof e.customAmounts[k] === 'number' ? Math.round(e.customAmounts[k] * 100) : 0
            acc[pid] = val
            return acc
          }, {})
        : undefined,
    })) ?? []

  
  const seed: AppState = persisted ?? {
    people: seededPeople,
    expenses: seededExpenses,
  }

  const [state, dispatch] = useReducer(appReducer, seed)

  
  useEffect(() => {
    saveState(STORAGE_KEY, state)
  }, [state])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}


export function useAppState(): AppState {
  const ctx = useContext(StateContext)
  if (ctx === undefined) {
    throw new Error('useAppState must be used inside AppProvider')
  }
  return ctx
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const ctx = useContext(DispatchContext)
  if (ctx === undefined) {
    throw new Error('useAppDispatch must be used inside AppProvider')
  }
  return ctx
}
