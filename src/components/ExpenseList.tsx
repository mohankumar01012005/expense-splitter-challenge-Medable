import { useState } from 'react'
import { useAppState, useAppDispatch } from '../state'
import { DELETE_EXPENSE } from '../state/actions'
import { formatCurrency } from '../utils/format'
import toast from 'react-hot-toast'

function ExpenseList() {
  const { expenses, people } = useAppState()
  const dispatch = useAppDispatch()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function equalSplitShares(amount: number, splitBetween: string[]) {
    const count = splitBetween.length;
    if (count === 0) return [];
    const base = Math.floor(amount / count);
    const remainder = amount - base * count; // 0..count-1
    return splitBetween.map((_, i) => base + (i < remainder ? 1 : 0));
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const nameFor = (idOrName?: string) => {
    if (!idOrName) return ''
    const match = people.find((p) => p.id === idOrName)
    return match ? match.name : idOrName
  }

  function onDelete(id: string) {
    if (!confirm('Delete this expense?')) return
    dispatch({ type: DELETE_EXPENSE, payload: { expenseId: id } } as any)
    toast.success('Expense deleted')
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-lg transition-all hover:shadow-xl">
      <h2 className="text-gray-700 mb-4 text-xl sm:text-2xl border-b-2 border-gray-200 pb-2">📝 Expense History</h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">No expenses added yet. Add your first expense to get started!</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => {
            const isOpen = expandedId === expense.id
            const customMap = (expense.customAmounts ?? {}) as Record<string, number>

            return (
              <div key={expense.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex-1 ">
                    <h4 className="text-gray-800 mb-1 text-base sm:text-lg">{expense.description}</h4>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-gray-600 text-xs sm:text-sm">
                      <span>{formatDate(expense.date)}</span>
                      <span>Paid by {nameFor(expense.paidBy)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center sm:gap-4">
                    <div className="text-lg sm:text-xl font-semibold text-gray-700">{formatCurrency(expense.amount)}</div>

                    <div className="flex items-center gap-2">
                     <button
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                    onClick={() => toggleExpand(expense.id)}
                    className="flex items-center justify-center text-gray-700 hover:text-gray-900 transition-transform "
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      viewBox="0 0 10 10"
                      fill="currentColor"
                    >
                      <polygon points="3,1 9,5 3,9" />
                    </svg>
                  </button>

                {/*  "Delete" is present in DOM for tests */}
                     <button
                        aria-label="Delete"
                        onClick={() => onDelete(expense.id)}
                        className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-red-700 transition-colors "
                      >
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden ">🗑</span>
                      </button>

                    </div>
                  </div>
                </div>

                
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
                    
                    <div className="mb-3">
                      <div className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Split Details {expense.splitType === 'custom' ? '(custom)' : '(equal)'}</div>

                      <div className="space-y-2">
                        {(() => {
                          
                          const shares = equalSplitShares(expense.amount, expense.splitBetween);

                          return expense.splitBetween.map((pid: string, idx: number) => {
                            const personName = nameFor(pid)
                            const amountNumber =
                              expense.splitType === 'custom'
                                ? (customMap[pid] ?? 0)
                                : (shares[idx] ?? 0)
                            
                            const display = typeof amountNumber === 'number' ? formatCurrency(amountNumber) : formatCurrency(Number(amountNumber))
                            return (
                              <div key={pid} className="flex justify-between items-center bg-gray-50 p-3 rounded text-sm sm:text-base">
                                <div className="text-gray-800">{personName}</div>
                                <div className="text-red-600 font-semibold">owes {display}</div>
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>

                    
                    <div className="pt-3 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        🗑 Delete Expense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-700 mt-6 text-sm sm:text-base">
        <p>
          Total Expenses: <strong>{expenses.length}</strong>
        </p>
      </div>
    </div>
  )
}

export default ExpenseList
