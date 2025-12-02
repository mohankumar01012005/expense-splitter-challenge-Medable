// src/utils/calcBalances.ts
// Core business logic for computing per-person totals and group total.
// All amounts are handled in integer cents to avoid floating-point errors.

export type Person = {
  id: string
  name: string
}

export type Expense = {
  id: string
  description: string
  amount: number 
  paidBy: string 
  date?: string
  splitBetween: string[]
  splitType: 'equal' | 'custom'
  customAmounts?: Record<string, number> 
}

export type PerPersonTotals = {
  [personId: string]: {
    balance: number
    paid: number
    owed: number
    net: number
  }
}

export type TotalsResult = {
  total: number
  totalGroupSpending: number
  totalGroup: number
  perPerson: PerPersonTotals
}


function sum(nums: number[]) {
  return nums.reduce((s, n) => s + n, 0)
}

export function calculateTotals(
  people: Person[],
  expenses: Expense[]
): TotalsResult {
  
  const perPerson: PerPersonTotals = {}
  for (const p of people) {
    perPerson[p.id] = { balance: 0, paid: 0, owed: 0, net: 0 }
  }

  
  const knownIds = new Set(people.map((p) => p.id))

  let totalGroup = 0

  for (const exp of expenses) {
    
    if (!exp || typeof exp.amount !== 'number' || exp.amount <= 0) continue
    if (!exp.splitBetween || exp.splitBetween.length === 0) continue

    
    if (exp.paidBy && !knownIds.has(exp.paidBy)) {
      
      console.warn(
        `[calculateTotals] Expense ${exp.id} paidBy references unknown person id "${exp.paidBy}". Paid amount will not be assigned to any person.`
      )
    }

    
    const unknownSplitIds = exp.splitBetween.filter((pid) => !knownIds.has(pid))
    if (unknownSplitIds.length > 0) {
      
      console.warn(
        `[calculateTotals] Expense ${exp.id} splitBetween references unknown person ids: ${unknownSplitIds.join(
          ', '
        )}. Those shares will be ignored.`
      )
    }

    totalGroup += exp.amount

    
    if (perPerson[exp.paidBy]) {
      perPerson[exp.paidBy].paid += exp.amount
    }

    if (exp.splitType === 'equal') {
      const count = exp.splitBetween.length
      const baseShare = Math.floor(exp.amount / count)
      const remainder = exp.amount - baseShare * count 

      for (let i = 0; i < count; i++) {
        const pid = exp.splitBetween[i]
        const extra = i < remainder ? 1 : 0
        const share = baseShare + extra
        if (perPerson[pid]) perPerson[pid].owed += share
        
      }
    } else if (exp.splitType === 'custom') {
      if (!exp.customAmounts) {
        
        const count = exp.splitBetween.length
        const baseShare = Math.floor(exp.amount / count)
        const remainder = exp.amount - baseShare * count
        for (let i = 0; i < count; i++) {
          const pid = exp.splitBetween[i]
          const extra = i < remainder ? 1 : 0
          if (perPerson[pid]) perPerson[pid].owed += baseShare + extra
        }
      } else {
        
        const customSum = sum(
          exp.splitBetween.map((pid) => exp.customAmounts?.[pid] ?? 0)
        )
        let diff = exp.amount - customSum
        for (let i = 0; i < exp.splitBetween.length; i++) {
          const pid = exp.splitBetween[i]
          const amt = exp.customAmounts?.[pid] ?? 0
          
          const finalAmt = i === 0 && diff !== 0 ? amt + diff : amt
          if (i === 0) diff = 0
          if (perPerson[pid]) perPerson[pid].owed += finalAmt
          
        }
      }
    } else {
      
      const count = exp.splitBetween.length
      const baseShare = Math.floor(exp.amount / count)
      const remainder = exp.amount - baseShare * count
      for (let i = 0; i < count; i++) {
        const pid = exp.splitBetween[i]
        const extra = i < remainder ? 1 : 0
        if (perPerson[pid]) perPerson[pid].owed += baseShare + extra
      }
    }
  }

  
  for (const pid of Object.keys(perPerson)) {
    const p = perPerson[pid]
    p.net = p.paid - p.owed
    p.balance = p.net
  }

  return {
    total: totalGroup,
    totalGroupSpending: totalGroup,
    totalGroup,
    perPerson
  }
}
