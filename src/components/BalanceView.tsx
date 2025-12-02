import React from 'react'
import { useAppState } from '../state'
import { getTotals, getSettlements } from '../state/selectors'
import { formatCurrency } from '../utils/format'

const BalanceView: React.FC = () => {
  const state = useAppState()
  const totals = getTotals(state)
  const settlements = getSettlements(state)

  const nameFor = (idOrName?: string) => {
    if (!idOrName) return ''
    const match = state.people.find((p) => p.id === idOrName)
    return match ? match.name : idOrName
  }
   
  const totalFormatted = formatCurrency(totals.totalGroup || 0)

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg transition-all hover:shadow-xl">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        🪙 Balances
      </h2>

      
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <span className="text-sm">Total Group Spending:</span>
          <span data-testid="total-group-amount" className="text-2xl font-semibold">{totalFormatted}</span>
        </div>
      </div>

      
      <div className="mb-6">
        <h3 className="text-gray-600 mb-3 text-lg">Individual Balances</h3>
        <div className="space-y-3">
          {state.people.map((person) => {
            const t = totals.perPerson[person.id] ?? { paid: 0, owed: 0, net: 0 }
            const netCents = t.net 
            const isPositive = netCents > 0
            const isZero = netCents === 0
            const absFormatted = formatCurrency(Math.abs(netCents))
            const sign = isZero ? '' : (isPositive ? '+' : '-')
            return (
              <div
                key={person.id}
                className={`flex justify-between items-center p-3 rounded-md border ${
                  isZero ? 'bg-gray-50 border-gray-200' : isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="font-medium text-gray-800">{person.name}</div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    {isZero ? 'settled up' : isPositive ? 'is owed' : 'owes'}
                  </div>
                  <div className={`${isZero ? 'text-gray-700' : isPositive ? 'text-green-700' : 'text-red-700'} font-semibold`}>
                    {isZero ? formatCurrency(0) : `${sign}${absFormatted}`}
                    
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      
      <div>
        <h3 className="text-gray-600 mb-3 text-lg">💸 Suggested Settlements</h3>
        <p className="text-sm text-gray-500 mb-3">Minimum transactions to settle all debts:</p>

        {settlements.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-md text-center text-gray-700">All settled 👍</div>
        ) : (
          <div className="space-y-3">
            {settlements.map((s, i) => {
              const payer = nameFor(s.from)
              const payee = nameFor(s.to)
              return (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-red-600 font-medium">{payer}</div>
                    <div className="text-sm text-gray-400">→</div>
                    <div className="text-sm text-green-600 font-medium">{payee}</div>
                  </div>
                  <div className="font-semibold text-gray-800">{formatCurrency(s.amount)}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BalanceView
