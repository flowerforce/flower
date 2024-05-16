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

import FlowerNode from '../components/FlowerNode'
import Flower from '../components/Flower'
import FlowerField from '../components/FlowerField'
import FlowerValue from '../components/FlowerValue'
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import useFlowerForm from '../components/useFlowerForm'

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
  const { onNext } = useFlower()
  return (
    <button data-testid={'btn-next' + id} onClick={() => onNext()}>
      NEXT
    </button>
  )
}

const InitState = ({ state }: any) => {
  const { onNext } = useFlower()
  const { setData, getData } = useFlowerForm()
  useEffect(() => {
    setData(state)
    // console.log(getData())
    onNext()
  }, [onNext, setData, getData, state])
  return '...'
}

// const Form = ({ flowName }: any) => {
//   const { errors, getData } = useFlowerForm({ flowName })
//   useEffect(() => {
//     // console.log("🚀 ~ Form ~ getData:", getData())
//   }, [getData])

//   return //errors && errors.join(',')
// }

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
            <div data-testid="log">
              <FlowerValue>
                {({ value }) => {
                  return JSON.stringify(value)
                }}
              </FlowerValue>
            </div>
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
