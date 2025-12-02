// src/tests/components/ExpenseForm.test.tsx
// Simulates user adding an expense via the ExpenseForm and verifies it appears in ExpenseList.

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider } from '../../state'
import ExpenseForm from '../../components/ExpenseForm'
import ExpenseList from '../../components/ExpenseList'

describe('ExpenseForm UI', () => {
  beforeEach(() => {
    
    window.localStorage.clear()
  })

  test('adds an expense and it appears in ExpenseList', async () => {
    render(
      <AppProvider>
        <ExpenseForm />
        <ExpenseList />
      </AppProvider>
    )

    
    const desc = screen.getByLabelText(/description/i)
    fireEvent.change(desc, { target: { value: 'Test Dinner' } })

    
    const amount = screen.getByPlaceholderText('0.00')
    fireEvent.change(amount, { target: { value: '12.50' } })

    
    const paidBy = screen.getByLabelText(/paid by/i)
    const firstOption = paidBy.querySelector('option')?.value
    if (firstOption) {
      fireEvent.change(paidBy, { target: { value: firstOption } })
    }

    
    const addBtn = screen.getByRole('button', { name: /add expense/i })
    fireEvent.click(addBtn)

    
    expect(await screen.findByText('Test Dinner')).toBeInTheDocument()

    
    expect(screen.getByText(/\$12\.50/)).toBeInTheDocument()
  })
})
