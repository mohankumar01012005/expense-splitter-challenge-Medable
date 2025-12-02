// tests/utils/calcBalances.test.ts
// Unit tests for calculateTotals. Values are in cents.

import { calculateTotals, Person, Expense } from '../../utils/calcBalances'

describe('calculateTotals', () => {
  const people: Person[] = [
    { id: 'a', name: 'Alice' },
    { id: 'b', name: 'Bob' },
    { id: 'c', name: 'Charlie' },
  ]

  test('equal split - simple case', () => {
    const expenses: Expense[] = [
      {
        id: 'e1',
        description: 'Dinner',
        amount: 3000, 
        paidBy: 'a',
        splitBetween: ['a', 'b', 'c'],
        splitType: 'equal',
      },
    ]

    const { totalGroup, perPerson } = calculateTotals(people, expenses)

    expect(totalGroup).toBe(3000)
    expect(perPerson.a.owed).toBe(1000)
    expect(perPerson.b.owed).toBe(1000)
    expect(perPerson.c.owed).toBe(1000)

    expect(perPerson.a.paid).toBe(3000)
    expect(perPerson.a.net).toBe(2000)
    expect(perPerson.b.net).toBe(-1000)
    expect(perPerson.c.net).toBe(-1000)
  })

  test('equal split - rounding leftover cents', () => {
    const expenses: Expense[] = [
      {
        id: 'e2',
        description: 'Snack',
        amount: 1000, 
        paidBy: 'b',
        splitBetween: ['a', 'b', 'c'],
        splitType: 'equal',
      },
    ]

    const { totalGroup, perPerson } = calculateTotals(people, expenses)

    expect(totalGroup).toBe(1000)
    expect(perPerson.a.owed).toBe(334) 
    expect(perPerson.b.owed).toBe(333)
    expect(perPerson.c.owed).toBe(333)

    expect(perPerson.b.paid).toBe(1000)
    expect(perPerson.b.net).toBe(1000 - 333)
  })

  test('custom split - exact custom amounts', () => {
    const expenses: Expense[] = [
      {
        id: 'e3',
        description: 'Taxi',
        amount: 2500, 
        paidBy: 'c',
        splitBetween: ['a', 'b', 'c'],
        splitType: 'custom',
        customAmounts: {
          a: 1000,
          b: 500,
          c: 1000,
        },
      },
    ]
    const { totalGroup, perPerson } = calculateTotals(people, expenses)
    expect(totalGroup).toBe(2500)
    expect(perPerson.a.owed).toBe(1000)
    expect(perPerson.b.owed).toBe(500)
    expect(perPerson.c.owed).toBe(1000)

    expect(perPerson.c.paid).toBe(2500)
    expect(perPerson.c.net).toBe(1500)
  })
})
