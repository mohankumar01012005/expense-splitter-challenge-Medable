// tests/utils/simplifyDebts.test.ts
// Unit tests for simplifyDebts.

import { simplifyDebts, Settlement } from '../../utils/simplifyDebts'

describe('simplifyDebts', () => {
  test('simple two-creditors one-debtor split', () => {
    
    const perPerson = {
      a: { paid: 0, owed: 2000, net: -2000 },
      b: { paid: 1000, owed: 0, net: 1000 },
      c: { paid: 1000, owed: 0, net: 1000 },
    }

    const result = simplifyDebts(perPerson)
    
    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining<Settlement>([
        { from: 'a', to: 'b', amount: 1000 },
        { from: 'a', to: 'c', amount: 1000 },
      ])
    )
  })

  test('chain simplified: A owes B, B owes C => A should pay C', () => {
    
    const perPerson = {
      a: { paid: 0, owed: 2000, net: -2000 },
      b: { paid: 0, owed: 0, net: 0 },
      c: { paid: 2000, owed: 0, net: 2000 },
    }

    const result = simplifyDebts(perPerson)
    
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ from: 'a', to: 'c', amount: 2000 })
  })

  test('multiple small creditors and debtors', () => {
    
    const perPerson = {
      a: { paid: 0, owed: 450, net: -450 },
      b: { paid: 0, owed: 550, net: -550 },
      c: { paid: 500, owed: 0, net: 500 },
      d: { paid: 500, owed: 0, net: 500 },
    }

    const result = simplifyDebts(perPerson)
    
    const total = result.reduce((s, tx) => s + tx.amount, 0)
    expect(total).toBe(1000)

    
    const froms = result.map((r) => r.from)
    const tos = result.map((r) => r.to)
    expect(froms).toEqual(expect.arrayContaining(['a', 'b']))
    expect(tos).toEqual(expect.arrayContaining(['c', 'd']))
  })
})
