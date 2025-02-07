/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useEffect } from 'react'

// import react-testing methods
import { fireEvent, render, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

import FlowerNode from '../components/FlowerNode'
import FlowerNavigate from '../components/FlowerNavigate'
import Flower from '../components/Flower'
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import useFlowerForm from '../components/useFlowerForm'

const Text = ({
  text,
  value,
  children
}: {
  text?: string
  value?: string
  children?: any
}) => <h1 data-testid="h1">{text || value || children}</h1>
// const Input = ({ onChange, value = '', name }: any) => {
//   return (
//     <input
//       data-testid={name || 'input'}
//       name={name}
//       value={value}
//       onChange={(evt) => onChange(evt.target.value)}
//     />
//   );
// };

// const ButtonNext = ({ id = '' }) => {
//   const { next } = useFlower();
//   return (
//     <button data-testid={'btn-next' + id} onClick={() => next()}>
//       NEXT
//     </button>
//   );
// };

const InitState = ({ state }: any) => {
  const { next } = useFlower()
  const { setData, getData } = useFlowerForm()
  useEffect(() => {
    setData(state)
    // console.log(getData())
    next()
  }, [next, setData, getData, state])
  return '...'
}

describe('Test Flower component', () => {
  it('Test flow success', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test" initialData={{}}>
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <Text>{'Step 1'}</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('Step 1')
  })
  it('Test flow with initial state and startId', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test" initialState={{ startId: 'customStart' }}>
          <FlowerNode id="start" to={{ form: null }}>
            <div>Original Start</div>
          </FlowerNode>
          <FlowerNode id="customStart">
            <div data-testid="customStart">Custom step start</div>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('customStart')).toHaveTextContent(
      'Custom step start'
    )
  })
  it('Test flow with initial state and history', async () => {
    render(
      <FlowerProvider>
        <Flower
          name="app-test"
          initialState={{
            startId: 'step1',
            current: 'step3',
            history: ['step1', 'step4', 'step3']
          }}
        >
          <FlowerNode id="step1" to={{ step2: null }}>
            <div data-testid="step1">Step 1</div>
          </FlowerNode>
          <FlowerNode id="step2" to={{ step3: null }}>
            <div data-testid="step2">Step 2</div>
          </FlowerNode>
          <FlowerNode id="step3" to={{ step4: null }}>
            <div data-testid="step3">Step 3</div>
            <FlowerNavigate action="back">
              <button data-testid="back-button3">Go back</button>
            </FlowerNavigate>
          </FlowerNode>
          <FlowerNode id="step4">
            <div data-testid="step4">Step 4</div>
            <FlowerNavigate action="back">
              <button data-testid="back-button4">Go back</button>
            </FlowerNavigate>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('step3')).toHaveTextContent('Step 3')
    fireEvent.click(screen.getByTestId('back-button3'))
    expect(screen.getByTestId('step4')).toHaveTextContent('Step 4')
    fireEvent.click(screen.getByTestId('back-button4'))
    expect(screen.getByTestId('step1')).toHaveTextContent('Step 1')
  })
})
