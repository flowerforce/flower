/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useCallback, useEffect, useState } from 'react'

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
import { TestCmp } from './components'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

type UseFlowerFormFunctions =
  | 'getData -'
  | 'getFormStatus -'
  | 'replaceData -'
  | 'reset'
  | 'setCustomErrors'
  | 'setData -'
  | 'setDataField -'
  | 'unsetData -'

const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>
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

const ConsumerUseFlowerFormGetData = ({ path }: { path?: string }) => {
  const { getData } = useFlowerForm()
  return <div data-testid="get-data">{JSON.stringify(getData(path))}</div>
}

const Form = ({ children }: any) => {
  const [state, setState] = useState(false)
  return (
    <FormProvider>
      <FlowerForm name="form-test">
        {!state ? (
          <>
            <FlowerField id="name">
              <Input name="name" />
            </FlowerField>
            <FlowerField id="surname">
              <Input name="surname" />
            </FlowerField>
            <FlowerField id="age">
              <Input name="age" type="number" />
            </FlowerField>
            <ButtonNext id="form-test" onClick={setState} />
          </>
        ) : (
          children
        )}
      </FlowerForm>
    </FormProvider>
  )
}

describe('Test FlowerForm component', () => {
  const user = userEvent.setup()

  it('Test getValue without path', async () => {
    const data = {
      name: 'andrea',
      surname: 'rossi',
      age: '19'
    }
    render(
      <Form>
        <ConsumerUseFlowerFormGetData />
      </Form>
    )

    await user.type(screen.getByTestId('name'), data.name)
    await user.type(screen.getByTestId('surname'), data.surname)
    await user.type(screen.getByTestId('age'), data.age)
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('get-data')).toHaveTextContent(
      JSON.stringify(data)
    )
  })
  it('Test getValue with specific path', async () => {
    const data = {
      name: 'andrea',
      surname: 'rossi',
      age: '19'
    }
    render(
      <Form>
        <ConsumerUseFlowerFormGetData path="name" />
      </Form>
    )

    await user.type(screen.getByTestId('name'), data.name)
    await user.type(screen.getByTestId('surname'), data.surname)
    await user.type(screen.getByTestId('age'), data.age)
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('get-data')).toHaveTextContent(data.name)
  })
  it('Test setValue setting data from scratch without path', async () => {
    const data = {
      name: 'andrea',
      surname: 'rossi',
      age: 19,
      address: 'via roma'
    }
    render(<TestCmp />)

    fireEvent.click(screen.getByTestId('btn-setState'))
    fireEvent.click(screen.getByTestId('btn-NEXT'))

    await delay(200)
    expect(screen.getByTestId('get-data')).toHaveTextContent(
      JSON.stringify(data)
    )
  })
  it('Test setValue overwriting in a specific path', async () => {
    const data = {
      name: 'andrea',
      surname: 'Rossi',
      age: 19,
      address: 'via roma'
    }
    render(<TestCmp />)

    fireEvent.click(screen.getByTestId('btn-setState'))
    fireEvent.click(screen.getByTestId('btn-REPLACE'))
    await delay(100)
    fireEvent.click(screen.getByTestId('btn-NEXT'))
    await delay(100)
    expect(screen.getByTestId('get-data')).toHaveTextContent(
      JSON.stringify(data)
    )
  })
  it('Test unsetData', async () => {
    const data = {
      name: 'andrea',
      age: 19,
      address: 'via roma'
    }
    render(<TestCmp />)

    fireEvent.click(screen.getByTestId('btn-setState'))
    fireEvent.click(screen.getByTestId('btn-UNSET'))
    await delay(100)
    fireEvent.click(screen.getByTestId('btn-NEXT'))
    await delay(100)
    expect(screen.getByTestId('get-data')).toHaveTextContent(
      JSON.stringify(data)
    )
  })
  it('Test getStatus', async () => {
    const data = {
      errors: {},
      data: { name: 'andrea', surname: 'Rossi', age: 19, address: 'via roma' },
      dirty: { surname: false, name: false, age: false, address: false },
      touches: { name: false, surname: false, age: false, address: false }
    }
    render(<TestCmp />)

    fireEvent.click(screen.getByTestId('btn-setState'))
    await user.clear(screen.getByTestId('surname'))
    await user.type(screen.getByTestId('surname'), 'Rossi')

    fireEvent.click(screen.getByTestId('btn-NEXT'))
    await delay(100)
    expect(screen.getByTestId('get-status')).toHaveTextContent(
      JSON.stringify(data)
    )
  })
  it('Test setDataField', async () => {
    const data = {
      name: 'andrea',
      surname: 'rossi',
      age: 19,
      address: 'via roma',
      phone: '34121212312'
    }
    render(<TestCmp />)

    fireEvent.click(screen.getByTestId('btn-setState'))
    fireEvent.click(screen.getByTestId('btn-SET-FIELD'))
    fireEvent.click(screen.getByTestId('btn-NEXT'))
    await delay(100)
    expect(screen.getByTestId('get-data')).toHaveTextContent(
      JSON.stringify(data)
    )
  })
  it('Test reset', async () => {
    render(<TestCmp />)

    fireEvent.click(screen.getByTestId('btn-setState'))
    fireEvent.click(screen.getByTestId('btn-RESET'))
    fireEvent.click(screen.getByTestId('btn-FORCE-NEXT'))
    await delay(100)
    expect(screen.getByTestId('get-data')).toContainHTML('{}')
  })
})
