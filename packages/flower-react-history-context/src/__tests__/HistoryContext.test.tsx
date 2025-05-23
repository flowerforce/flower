/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React from 'react'

// import react-testing methods
import { render, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import { HistoryContextProvider, useHistoryContext } from '../provider'

const AppTest = () => {
  const { index, isActive, setIndex } = useHistoryContext()
  if (!isActive) return <div data-testid="history-sync">History not sync</div>
  return <div data-testid="history-sync">History sync</div>
}

describe('Test Flower component', () => {
  it('Istantiate history context provider', () => {
    render(
      <HistoryContextProvider>
        <AppTest />
      </HistoryContextProvider>
    )

    expect(screen.getByTestId('history-sync')).toHaveTextContent('History sync')
  })
  it('Not Istantiate history context provider', () => {
    render(<AppTest />)

    expect(screen.getByTestId('history-sync')).toHaveTextContent(
      'History not sync'
    )
  })
})
