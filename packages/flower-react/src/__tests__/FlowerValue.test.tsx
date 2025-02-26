/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useEffect } from 'react'

// import react-testing methods
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

import { FlowerProvider } from '../provider'
import { Flower, FlowerNode, useFlower } from '../components'
import { FlowerField, useFlowerForm } from '@flowerforce/flower-react-form'
import { FlowerValue } from '@flowerforce/flower-react-shared'

const Text = ({ text, value, children, ...props }: any) => (
  <h1 data-testid="h1" {...props}>
    {text || value || children}
  </h1>
)

// const TextObj = ({ value, ...props }: any) => {
//   return <h1 data-testid="h1" {...props}>{value && JSON.stringify(value)}</h1>
// }

const Input = ({ onChange, value = '', name, ...props }: any) => {
  return (
    <input
      {...props}
      data-testid={name || 'input'}
      name={name}
      value={value}
      onChange={(evt) => onChange(evt.target.value)}
    />
  )
}

const ButtonNext = ({ id = '' }) => {
  const { next } = useFlower()
  return (
    <button data-testid={'btn-next' + id} onClick={() => next()}>
      NEXT
    </button>
  )
}

const InitState = ({ state }: any) => {
  const { next } = useFlower()
  const { setData, getData } = useFlowerForm()
  useEffect(() => {
    setData(state)
    next()
  }, [next, setData, getData, state])
  return '...'
}

describe('Test FlowerValue component', () => {
  it('Test value ok', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <FlowerValue id="name">
              <Text name="val" />
            </FlowerValue>
            <ButtonNext />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    expect(screen.getByTestId('h1')).toHaveTextContent('@andrea')
  })

  it('Test value all data', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerValue>
              {({ value }) => {
                return <div data-testid="log">{JSON.stringify(value)}</div>
              }}
            </FlowerValue>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('log')).toHaveTextContent('{"amount":1}')
  })

  it('Test onUpdate', async () => {
    const user = userEvent.setup()
    const onUpdateSpy = jest.fn()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <FlowerValue id="name" onUpdate={onUpdateSpy}>
              <Text name="val" />
            </FlowerValue>
            <ButtonNext />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')
    expect(onUpdateSpy).toBeCalledWith('@andrea')
  })

  it('Test spread value ok', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ data: { 'data-id': 1, 'data-val': 2 } }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerValue id="data" spreadValue>
              <Text />
            </FlowerValue>
            <ButtonNext />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveAttribute('data-id', '1')
    expect(screen.getByTestId('h1')).toHaveAttribute('data-val', '2')
  })
})
