// src/utils/simplifyDebts.ts
// Convert per-person nets into a minimal set of settlement transactions.
// All amounts are integer cents.

export type PerPersonTotals = {
  [personId: string]: {
    paid: number
    owed: number
    net: number
  }
}

export type Settlement = {
  from: string
  to: string
  amount: number 
}

export function simplifyDebts(perPerson: PerPersonTotals): Settlement[] {
  
  const creditors: Array<{ id: string; amount: number }> = []
  const debtors: Array<{ id: string; amount: number }> = []

  for (const id of Object.keys(perPerson)) {
    const net = perPerson[id].net
    if (net > 0) creditors.push({ id, amount: net })
    else if (net < 0) debtors.push({ id, amount: net }) 
  }

  
  creditors.sort((a, b) => b.amount - a.amount)
  
  debtors.sort((a, b) => a.amount - b.amount)

  const settlements: Settlement[] = []
  let ci = 0
  let di = 0

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci]
    const debtor = debtors[di]
    const credit = creditor.amount
    const debt = -debtor.amount 

    const pay = Math.min(credit, debt) 

    
    settlements.push({ from: debtor.id, to: creditor.id, amount: pay })

    
    creditor.amount -= pay
    debtor.amount += pay 

    
    if (creditor.amount === 0) ci++
    if (debtor.amount === 0) di++
  }

  return settlements
}
