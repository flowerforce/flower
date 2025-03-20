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
import { ReduxFlowerProvider } from '../index'
import { createCustomReducer } from './utils'
// const reducerFlower = createCustomReducer({ flowReducer: true })
// const customReducer = createCustomReducer({ config: { name: 'CustomReducer' } })

const CONSUMER_TEST_ID = 'redux-test'

const ConsumerComponent = () => {
  const { useSelector } = ReduxFlowerProvider.getReduxHooks()

  const state = useSelector((state) => state)
  return <div data-testid={CONSUMER_TEST_ID}>{JSON.stringify(state)}</div>
}

describe('Test Flower component', () => {
  it('Init Redux without external reducers', () => {
    render(
      <ReduxFlowerProvider>
        <ConsumerComponent />
      </ReduxFlowerProvider>
    )

    expect(screen.getByTestId(CONSUMER_TEST_ID)).toHaveTextContent(
      JSON.stringify({ FlowerData: {} })
    )
  })
})
