// src/tests/components/ExpenseList.test.tsx
// Adds an expense via the form, deletes it from the list, and asserts removal.

import '@testing-library/jest-dom'

import { render, screen, fireEvent, within } from '@testing-library/react'
import { AppProvider } from '../../state'
import ExpenseForm from '../../components/ExpenseForm'
import ExpenseList from '../../components/ExpenseList'
import { vi } from 'vitest'

describe('ExpenseList UI', () => {
  beforeEach(() => {
    window.localStorage.clear()
    
    vi.stubGlobal('confirm', () => true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('deletes an expense from the list', async () => {
    render(
      <AppProvider>
        <ExpenseForm />
        <ExpenseList />
      </AppProvider>
    )

    
    const desc = screen.getByLabelText(/description/i)
    fireEvent.change(desc, { target: { value: 'To Delete' } })

    const amount = screen.getByPlaceholderText('0.00')
    fireEvent.change(amount, { target: { value: '5.00' } })

    const addBtn = screen.getByRole('button', { name: /add expense/i })
    fireEvent.click(addBtn)

    
    const item = await screen.findByText('To Delete')
    expect(item).toBeInTheDocument()

    
    let node: HTMLElement | null = item as HTMLElement
    let containerWithDelete: HTMLElement | null = null
    while (node && node.parentElement) {
      
      if (node.parentElement.querySelector('[aria-label]')) {
        const candidate = node.parentElement.querySelector('[aria-label*="Delete"], [aria-label*="delete"]')
        if (candidate) {
          containerWithDelete = node.parentElement
          break
        }
      }
      node = node.parentElement
    }

    
    if (!containerWithDelete) {
      const fallback = (item as HTMLElement).closest('div')
      containerWithDelete = fallback
    }

    
    if (!containerWithDelete) {
      throw new Error('Could not locate expense container for deletion')
    }

    const withinBlock = within(containerWithDelete)
    
    const deleteBtns = withinBlock.queryAllByLabelText(/delete/i)
    if (deleteBtns.length === 0) {
      
      const allDeletes = screen.queryAllByLabelText(/delete/i)
      if (allDeletes.length === 0) {
        throw new Error('Delete button not found in DOM')
      }
      fireEvent.click(allDeletes[0])
    } else {
      fireEvent.click(deleteBtns[0])
    }

    
    expect(screen.queryByText('To Delete')).not.toBeInTheDocument()
  })
})
