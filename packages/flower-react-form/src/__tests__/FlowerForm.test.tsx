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

import { FlowerValue } from '@flowerforce/flower-react-shared'

import { useFlowerForm, FlowerField, FlowerForm } from '../components'
import { FormProvider } from '../provider'

import userEvent from '@testing-library/user-event'

const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>
const Content = ({ value, id }: any) => (
  <span data-testid={`content-${id}`}>{value}</span>
)

const Error = () => <h1 data-testid="h1">Error</h1>

const Success = () => <h1 data-testid="h1">Success</h1>

const Input = ({
  onChange,
  value = '',
  name,
  onBlur,
  type
}: Record<string, any>) => {
  return (
    <input
      data-testid={name || 'input'}
      name={name}
      type={type}
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

const ButtonNextWithValidation = ({
  id = '',
  onClick
}: {
  id: string
  onClick?: (...args: any) => void
}) => {
  const { isValid } = useFlowerForm(id)

  const _onClick = useCallback(() => {
    isValid ? onClick?.('success') : onClick?.('error')
  }, [onClick, isValid])
  return (
    <button data-testid={'btn-next'} onClick={_onClick}>
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
              <>
                <FlowerValue id="name">
                  <Content id="name" />
                </FlowerValue>
                <FlowerValue id="surname">
                  <Content id="surname" />
                </FlowerValue>
              </>
            ) : (
              <>
                <FlowerField id="name">
                  <Input name="name" />
                </FlowerField>
                <FlowerField id="surname">
                  <Input name="surname" />
                </FlowerField>
                <ButtonNext id="form-test" onClick={setState} />
              </>
            )}
          </FlowerForm>
        </FormProvider>
      )
    }

    render(<Form />)

    await user.type(screen.getByTestId('name'), 'andrea')
    await user.type(screen.getByTestId('surname'), 'rossi')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('content-name')).toHaveTextContent('andrea')
    expect(screen.getByTestId('content-surname')).toHaveTextContent('rossi')
  })
  it('FlowerForm user insert value with truthy rules', async () => {
    const user = userEvent.setup()

    const Form = () => {
      const [state, setState] = useState(false)
      return (
        <FormProvider>
          <FlowerForm name="form-test">
            {state ? (
              <>
                <FlowerValue id="name">
                  <Content id="name" />
                </FlowerValue>
                <FlowerValue id="surname">
                  <Content id="surname" />
                </FlowerValue>
              </>
            ) : (
              <>
                <FlowerField
                  id="name"
                  validate={[
                    {
                      rules: { $and: [{ name: { $eq: 'andrea' } }] }
                    }
                  ]}
                >
                  <Input name="name" />
                </FlowerField>
                <FlowerField
                  id="surname"
                  validate={[
                    {
                      rules: { $and: [{ surname: { $eq: 'rossi' } }] }
                    }
                  ]}
                >
                  <Input name="surname" />
                </FlowerField>
                <ButtonNext id="form-test" onClick={setState} />
              </>
            )}
          </FlowerForm>
        </FormProvider>
      )
    }

    render(<Form />)

    await user.type(screen.getByTestId('name'), 'andrea')
    await user.type(screen.getByTestId('surname'), 'rossi')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('content-name')).toHaveTextContent('andrea')
    expect(screen.getByTestId('content-surname')).toHaveTextContent('rossi')
  })
  it('FlowerForm user insert value with falsy rules', async () => {
    const user = userEvent.setup()

    const Form = () => {
      const [step, setStep] = useState('step-1')

      if (step === 'step-1')
        return (
          <>
            <FlowerField
              id="name"
              validate={[
                {
                  rules: { $and: [{ name: { $eq: 'not' } }] }
                }
              ]}
            >
              <Input name="name" />
            </FlowerField>
            <FlowerField
              id="surname"
              validate={[
                {
                  rules: { $and: [{ surname: { $eq: 'bianch' } }] }
                }
              ]}
            >
              <Input name="surname" />
            </FlowerField>
            <ButtonNextWithValidation id="form-test" onClick={setStep} />
          </>
        )

      if (step === 'error') return <Error />
      return <Success />
    }

    render(
      <FormProvider>
        <FlowerForm name="form-test">
          <Form />
        </FlowerForm>
      </FormProvider>
    )

    await user.type(screen.getByTestId('name'), 'andrea')
    await user.type(screen.getByTestId('surname'), 'rossi')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('Error')
  })
})
