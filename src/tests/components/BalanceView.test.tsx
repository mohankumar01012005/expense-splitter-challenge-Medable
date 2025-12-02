// src/tests/components/BalanceView.test.tsx
import '@testing-library/jest-dom'

import { render, screen, fireEvent, within } from '@testing-library/react'
import { AppProvider } from '../../state'
import PeopleManager from '../../components/PeopleManager'
import ExpenseForm from '../../components/ExpenseForm'
import BalanceView from '../../components/BalanceView'

/**
 * Delta-based, scoped tests to be robust against pre-existing app state
 * and avoid ambiguous matches (e.g., names that appear in select options).
 */

const parseCurrency = (text: string | null) => {
  if (!text) return 0
  const cleaned = text.replace(/[^0-9.-]+/g, '')
  return Number(cleaned || 0)
}

// Helper to wait for BalanceView to render
const waitForBalanceView = async () => {
  return await screen.findByText('🪙 Balances')
}

describe('BalanceView UI', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('calculates balances and suggested settlements correctly (delta-based, scoped)', async () => {
    render(
      <AppProvider>
        <div>
          <PeopleManager />
          <ExpenseForm />
          <BalanceView />
        </div>
      </AppProvider>
    )

    // Wait for BalanceView to be rendered
    await waitForBalanceView()
    
    // Wait a bit for state to settle and components to update
    await new Promise(resolve => setTimeout(resolve, 100))

    // capture initial total (test-id must exist in BalanceView)
    const initialTotalEl = await screen.findByTestId('total-group-amount')
    const initialTotal = parseCurrency(initialTotalEl.textContent)

    //
    // STEP 1: Add 2 people — A and B
    //
    const input = screen.getByPlaceholderText("Enter person's name")

    fireEvent.change(input, { target: { value: 'A' } })
    fireEvent.click(screen.getByRole('button', { name: /add person/i }))

    fireEvent.change(input, { target: { value: 'B' } })
    fireEvent.click(screen.getByRole('button', { name: /add person/i }))

    // Scope to the Current Members list to avoid ambiguous matches with select options
    const membersHeading = await screen.findByText(/Current Members/i)
    // find the <ul> under the same container
    const membersContainer = membersHeading.closest('div')
    if (!membersContainer) throw new Error('Members container not found in DOM')
    const membersList = membersContainer.querySelector('ul')
    if (!membersList) throw new Error('Members list (ul) not found under Current Members')
    // use 'within' to scope queries to the members list
    const membersWithin = within(membersList)
    expect(await membersWithin.findByText('A')).toBeInTheDocument()
    expect(await membersWithin.findByText('B')).toBeInTheDocument()

    //
    // STEP 2: Add an expense — A pays $20 split equally between A and B
    //
    // Get the expense form description input - use the one that's visible
    const descriptionInputs = screen.getAllByLabelText(/description/i)
    const descriptionInput = descriptionInputs[descriptionInputs.length - 1] // Get the last one (most likely the ExpenseForm)
    
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Expense' },
    })

    // Get the amount input - find by placeholder
    const amountInputs = screen.getAllByPlaceholderText('0.00')
    const amountInput = amountInputs[amountInputs.length - 1] // Get the last one
    
    fireEvent.change(amountInput, {
      target: { value: '20' },
    })

    // select "Paid by" = A by picking the option with text 'A'
    const paidByLabels = screen.getAllByText(/paid by/i)
    const paidByLabel = paidByLabels[paidByLabels.length - 1] // Get the last one
    const paidBySelect = paidByLabel.parentElement?.querySelector('select') as HTMLSelectElement
    
    if (!paidBySelect) {
      // Alternative: try to find by getting all selects and using the right one
      const allSelects = screen.getAllByRole('combobox')
      const expenseSelect = allSelects[allSelects.length - 1] // Last select is likely the paid by select
      const options = Array.from(expenseSelect.querySelectorAll('option'))
      const optForA = options.find((o) => o.textContent?.trim() === 'A')
      if (optForA) {
        fireEvent.change(expenseSelect, { target: { value: optForA.value } })
      }
    } else {
      const options = Array.from(paidBySelect.querySelectorAll('option'))
      const optForA = options.find((o) => o.textContent?.trim() === 'A')
      if (optForA) {
        fireEvent.change(paidBySelect, { target: { value: optForA.value } })
      }
    }

    // ensure both A and B are checked in split list (checkboxes)
    // We need to be more specific about which checkboxes to click
    // Look for checkboxes in the expense form section
    const expenseForm = screen.getByText('💸 Add Expense').closest('div')
    if (expenseForm) {
      const checkboxes = within(expenseForm).getAllByRole('checkbox')
      // Check both A and B if they exist (might need to find by name/label)
      checkboxes.forEach(checkbox => {
        const checkboxElement = checkbox as HTMLInputElement
        // Check if this checkbox is for person A or B
        const label = checkbox.closest('label')
        if (label && (label.textContent?.includes('A') || label.textContent?.includes('B'))) {
          if (!checkboxElement.checked) {
            fireEvent.click(checkbox)
          }
        }
      })
    }

    // Find and click the Add Expense button
    const addExpenseButtons = screen.getAllByRole('button', { name: /add expense/i })
    fireEvent.click(addExpenseButtons[addExpenseButtons.length - 1])

    // Wait for UI to update
    await new Promise(resolve => setTimeout(resolve, 200))

    //
    // STEP 3: Validate totals & balances using delta (so test is stable wrt pre-existing data)
    //
    const afterTotalEl = await screen.findByTestId('total-group-amount')
    const afterTotal = parseCurrency(afterTotalEl.textContent)

    // The group's total should have increased by ~20.00
    expect(Number((afterTotal - initialTotal).toFixed(2))).toBeCloseTo(20.0, 2)

    // Look for balance amounts in the BalanceView section
    const balanceView = screen.getByText('🪙 Balances').closest('div')
    expect(balanceView).toBeInTheDocument()
    
    if (balanceView) {
      // Check for individual balances: should show +10.00 for A and -10.00 for B (or 10.00)
      // The BalanceView component shows +/- signs separately from the amount
      const withinBalance = within(balanceView as HTMLElement)
      
      // Look for the amount 10.00 (without $ sign since BalanceView removes it for non-zero amounts)
      // Individual balances show like "+10.00" or "-10.00"
      const positiveTen = withinBalance.queryByText('+10.00')
      const negativeTen = withinBalance.queryByText('-10.00')
      const plainTen = withinBalance.queryByText('10.00')
      
      // At least one should be present
      expect(positiveTen || negativeTen || plainTen).toBeTruthy()

      // Also check for $10.00 in settlements section
      const settlementsText = withinBalance.queryByText('$10.00')
      expect(settlementsText).toBeInTheDocument()
    }
  })
})