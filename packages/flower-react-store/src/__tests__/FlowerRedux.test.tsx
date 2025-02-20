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
import { useSelector } from '../provider'
import { ReduxFlowerProvider } from '../index'
import { createCustomReducer } from './utils'
// const flowerReducer = createSlice({
//   name: REDUCER_NAME.FLOWER_FLOW,
//   initialState: {} as Record<string, Flower<Record<string, any>>>,
//   reducers: FlowerCoreBaseReducers
// })

// const { actions: flowerReducerActions } = flowerReducer
// const flowerFlowReducer = flowerReducer.reducer
// const reducerFlower: REDUCERS_TYPES = {
//   [REDUCER_NAME.FLOWER_FLOW]: flowerFlowReducer
// }

const reducerFlower = createCustomReducer({ flowReducer: true })
const customReducer = createCustomReducer({ config: { name: 'CustomReducer' } })

const CONSUMER_TEST_ID = 'redux-test'

const ConsumerComponent = () => {
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
  it('Init Redux with flow reducer', () => {
    render(
      <ReduxFlowerProvider reducer={reducerFlower}>
        <ConsumerComponent />
      </ReduxFlowerProvider>
    )

    expect(screen.getByTestId(CONSUMER_TEST_ID)).toHaveTextContent(
      JSON.stringify({ FlowerData: {}, FlowerFlow: {} })
    )
  })
  it('Init Redux with external reducer', () => {
    render(
      <ReduxFlowerProvider reducer={customReducer}>
        <ConsumerComponent />
      </ReduxFlowerProvider>
    )

    expect(screen.getByTestId(CONSUMER_TEST_ID)).toHaveTextContent(
      JSON.stringify({ FlowerData: {}, CustomReducer: {} })
    )
  })
})
