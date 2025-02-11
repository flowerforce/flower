/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useCallback, useState } from 'react'

// import react-testing methods
import { fireEvent, render, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

import FormProvider from '../provider'
import FlowerForm from '../components/FlowerForm'
import FlowerField from '../components/FlowerField'
import FlowerValue from '../components/FlowerValue'

import useFlowerForm from '../components/useFlowerForm'
import userEvent from '@testing-library/user-event'

const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>
const Input = ({ onChange, value = '', name, onBlur }: Record<string, any>) => {
  return (
    <input
      data-testid={'input'}
      name={name}
      value={value}
      onBlur={(evt) => onBlur(evt)}
      onChange={(evt) => onChange(evt.target.value)}
    />
  )
}

const ButtonNext = ({
  id = '',
  onClick
}: {
  id: string
  onClick?: (...args: any) => void
}) => {
  const { isValid } = useFlowerForm(id)

  const _onClick = useCallback(() => {
    onClick?.(isValid)
  }, [onClick, isValid])
  return (
    <button data-testid={'btn-next'} disabled={!isValid} onClick={_onClick}>
      NEXT
    </button>
  )
}

describe('Test FlowerForm component', () => {
  it('FlowerForm init with initial value', async () => {
    // const user = userEvent.setup()

    render(
      <FormProvider>
        <FlowerForm name="form-test" initialState={{ name: 'andrea' }}>
          <FlowerValue id="name">
            <Text />
          </FlowerValue>
        </FlowerForm>
      </FormProvider>
    )

    // await user.type(screen.getByTestId('input'), '@andrea')

    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })
  it('FlowerForm user insert value', async () => {
    const user = userEvent.setup()

    const Form = () => {
      const [state, setState] = useState(false)
      return (
        <FormProvider>
          <FlowerForm name="form-test">
            {state ? (
              <Text value="Success" />
            ) : (
              <>
                <FlowerField id="name">
                  <Input name="name" />
                </FlowerField>
                <ButtonNext id="form-test" onClick={setState} />
              </>
            )}
          </FlowerForm>
        </FormProvider>
      )
    }

    render(<Form />)

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('Success')
  })
  // it('Test flow with initial state and startId', async () => {
  //   render(
  //     <FlowerProvider>
  //       <Flower name="app-test" initialState={{ startId: 'customStart' }}>
  //         <FlowerNode id="start" to={{ form: null }}>
  //           <div>Original Start</div>
  //         </FlowerNode>
  //         <FlowerNode id="customStart">
  //           <div data-testid="customStart">Custom step start</div>
  //         </FlowerNode>
  //       </Flower>
  //     </FlowerProvider>
  //   )

  //   expect(screen.getByTestId('customStart')).toHaveTextContent(
  //     'Custom step start'
  //   )
  // })
  // it('Test flow with initial state and history', async () => {
  //   render(
  //     <FlowerProvider>
  //       <Flower
  //         name="app-test"
  //         initialState={{
  //           startId: 'step1',
  //           current: 'step3',
  //           history: ['step1', 'step4', 'step3']
  //         }}
  //       >
  //         <FlowerNode id="step1" to={{ step2: null }}>
  //           <div data-testid="step1">Step 1</div>
  //         </FlowerNode>
  //         <FlowerNode id="step2" to={{ step3: null }}>
  //           <div data-testid="step2">Step 2</div>
  //         </FlowerNode>
  //         <FlowerNode id="step3" to={{ step4: null }}>
  //           <div data-testid="step3">Step 3</div>
  //           <FlowerNavigate action="back">
  //             <button data-testid="back-button3">Go back</button>
  //           </FlowerNavigate>
  //         </FlowerNode>
  //         <FlowerNode id="step4">
  //           <div data-testid="step4">Step 4</div>
  //           <FlowerNavigate action="back">
  //             <button data-testid="back-button4">Go back</button>
  //           </FlowerNavigate>
  //         </FlowerNode>
  //       </Flower>
  //     </FlowerProvider>
  //   )

  //   expect(screen.getByTestId('step3')).toHaveTextContent('Step 3')
  //   fireEvent.click(screen.getByTestId('back-button3'))
  //   expect(screen.getByTestId('step4')).toHaveTextContent('Step 4')
  //   fireEvent.click(screen.getByTestId('back-button4'))
  //   expect(screen.getByTestId('step1')).toHaveTextContent('Step 1')
  // })
})
