/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useContext } from 'react'

// import react-testing methods
import { render, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import { FlowerReactContext, FlowerReactProvider } from '../provider'

const FORM_NAME = 'form-test'
const FLOW_NAME = 'flow-test'

const ConsumerFormComponent = () => {
  const { name, initialData } = useContext(FlowerReactContext)
  return (
    <>
      <div data-testid="form-name">{name}</div>
      {initialData && (
        <div data-testid="form-initialData">{JSON.stringify(initialData)}</div>
      )}
    </>
  )
}
const ConsumerFlowComponent = () => {
  const { name } = useContext(FlowerReactContext)
  return <div data-testid="flow-name">{name}</div>
}

describe('Test Flower component', () => {
  it('Init Form Provider with initialState', () => {
    const initialState = { name: 'andrea', surname: 'rossi' }
    render(
      <FlowerReactProvider
        value={{ name: FORM_NAME, initialData: initialState }}
      >
        <ConsumerFormComponent />
      </FlowerReactProvider>
    )

    expect(screen.getByTestId('form-name')).toHaveTextContent(FORM_NAME)
    expect(screen.getByTestId('form-initialData')).toHaveTextContent(
      JSON.stringify(initialState)
    )
  })
  it('Init Form Provider without initialState', () => {
    render(
      <FlowerReactProvider value={{ name: FORM_NAME }}>
        <ConsumerFormComponent />
      </FlowerReactProvider>
    )

    expect(screen.getByTestId('form-name')).toHaveTextContent(FORM_NAME)
  })
  it('Init Form Provider without initialState', () => {
    render(
      <FlowerReactProvider value={{ name: FLOW_NAME }}>
        <ConsumerFlowComponent />
      </FlowerReactProvider>
    )

    expect(screen.getByTestId('flow-name')).toHaveTextContent(FLOW_NAME)
  })
})
