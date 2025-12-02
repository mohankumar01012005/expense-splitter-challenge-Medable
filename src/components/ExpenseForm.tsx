import React, { useState, useEffect } from 'react'
import { useAppState, useAppDispatch } from '../state'
import { ADD_EXPENSE } from '../state/actions'
import { formatCurrency, parseDollarsToCents } from '../utils/format'
import toast from 'react-hot-toast'

function ExpenseForm() {
  const { people } = useAppState()
  const dispatch = useAppDispatch()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('') 
  const [date, setDate] = useState('')
  const [paidBy, setPaidBy] = useState<string>('')
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal')
  const [splitBetween, setSplitBetween] = useState<string[]>([])
  const [customMap, setCustomMap] = useState<Record<string, string>>({})


    useEffect(() => {
    if (people.length && !paidBy) {
      setPaidBy(people[0].id)
    }
    if (people.length && splitBetween.length === 0) {
      setSplitBetween(people.map((p) => p.id))
    }
  }, [people])

  function toggleSplit(pid: string) {
    setSplitBetween((prev) => (prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
   if (!description.trim()) {
      toast.error('Please enter a description.')
      return
    }
    const cents = parseDollarsToCents(amount)
    if (cents <= 0) {
      toast.error('Please enter a valid amount.')
      return
    }
    if (!paidBy) {
      toast.error('Select who paid.')
      return
    }
    if (!splitBetween.length) {
      toast.error('Select at least one person to split between.')
      return
    }

    const expense: any = {
      description: description.trim(),
      amount: cents,
      date: date || new Date().toISOString(),
      
      paidBy,
      splitBetween,
      splitType,
    }

   if (splitType === 'custom') {
  const cm: Record<string, number> = {};
  let customSum = 0;
  for (const pid of splitBetween) {
    const v = parseDollarsToCents(customMap[pid] ?? '0');
    cm[pid] = v;
    customSum += v;
  }
  if (customSum !== cents) {
    const diff = cents - customSum;
    if (!confirm(
      `Custom amounts sum to ${formatCurrency(customSum)} but total is ${formatCurrency(cents)}. Apply difference ${formatCurrency(diff)} to first participant?`
    )){
       toast('Expense creation cancelled')

       return;
    }
    // or you could reject submit instead of applying the diff automatically
  }
  expense.customAmounts = cm;
}


    dispatch({ type: ADD_EXPENSE, payload: expense } as any)
    toast.success('Expense added')

    
    setDescription('')
    setAmount('')
    setDate('')
    setSplitType('equal')
    setCustomMap({})
    setSplitBetween(people.map((p) => p.id))
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 mb-4">
            <label
              htmlFor="amount"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex-1 mb-4">
            <label
              htmlFor="date"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="paidBy"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Paid By
          </label>
          <select
            id="paidBy"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Type
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                name="splitType"
                className="cursor-pointer"
                checked={splitType === 'equal'}
                onChange={() => setSplitType('equal')}
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="custom"
                name="splitType"
                className="cursor-pointer"
                checked={splitType === 'custom'}
                onChange={() => setSplitType('custom')}
              />
              <span>Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Between
          </label>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1"
              >
                <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
                  
                  
                  <input type="checkbox" className="cursor-pointer" 
                   checked={splitBetween.includes(person.id)}
                    onChange={() => toggleSplit(person.id)}
                  />
                  <span>{person.name}</span>
                </label>
                {splitType === 'custom' && splitBetween.includes(person.id) && (
                  <input
                    type="text"
                    placeholder="0.00"
                    value={customMap[person.id] ?? ''}
                    onChange={(e) =>
                      setCustomMap((s) => ({ ...s, [person.id]: e.target.value }))
                    }
                    style={{ width: 90 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px flex items-center justify-center gap-1"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
