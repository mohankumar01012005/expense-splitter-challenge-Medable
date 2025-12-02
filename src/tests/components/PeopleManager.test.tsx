

import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider } from '../../state'
import PeopleManager from '../../components/PeopleManager'

describe('PeopleManager UI', () => {
  test('adds a person and displays in list', () => {
    render(
      <AppProvider>
        <PeopleManager />
      </AppProvider>
    )

   
    const input = screen.getByPlaceholderText("Enter person's name")
    fireEvent.change(input, { target: { value: 'TestUser' } })

    
    const addButton = screen.getByRole('button', { name: /add person/i })
    fireEvent.click(addButton)

    
    expect(screen.getByText('TestUser')).toBeInTheDocument()
  })
})
