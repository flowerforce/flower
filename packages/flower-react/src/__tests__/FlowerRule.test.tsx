/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useEffect } from 'react'

// import react-testing methods
import { render, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

import FlowerNode from '../components/FlowerNode'
import Flower from '../components/Flower'
import FlowerField from '../components/FlowerField'
import FlowerRule from '../components/FlowerRule'
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import useFlowerForm from '../components/useFlowerForm'

const Text = ({ text, value, children, id }: any) => (
  <h1 data-testid={id || 'h1'}>{text || value || children}</h1>
)
const Input = ({ onChange, value = '', name, hidden, ...props }: any) => {
  return (
    <input
      {...props}
      data-testid={name || 'input'}
      disabled={hidden}
      name={name}
      value={value}
      onChange={(evt) => onChange(evt.target.value)}
    />
  )
}

const ButtonNext = ({ id = '' }: any) => {
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

const Form = ({ flowName }: any) => {
  const { getData } = useFlowerForm({ flowName })
  useEffect(() => {
    // console.log("🚀 ~ Form ~ getData:", getData())
  }, [getData])

  return null //errors && errors.join(',')
}

describe('Test FlowerRule component', () => {
  it('Test rule ok', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <FlowerRule
              rules={{
                name: { $eq: '@andrea' }
              }}
            >
              <Text id="age" text="age" />
            </FlowerRule>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    expect(screen.getByTestId('age')).toHaveTextContent('age')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test whitout rule ok', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <FlowerRule>
              <Text id="age" text="age" />
            </FlowerRule>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')
    expect(screen.getByTestId('age')).toHaveTextContent('age')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test rule hidden', async () => {
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
            <FlowerRule
              rules={{
                name: { $eq: 'XXXX' }
              }}
            >
              <Input name="age1" />
            </FlowerRule>
            <FlowerRule
              rules={{
                name: { $eq: 'XXXX' }
              }}
            >
              {(props) => <Input {...props} name="age" />}
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    expect(screen.queryByTestId('age1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('age')).not.toBeInTheDocument()
  })

  it('Test rule disabled', async () => {
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
            <FlowerRule
              alwaysDisplay
              rules={{
                name: { $eq: 'XXXX' }
              }}
            >
              <Input name="age1" />
            </FlowerRule>
            <FlowerRule
              alwaysDisplay
              rules={{
                name: { $eq: 'XXXX' }
              }}
            >
              {(props) => <Input {...props} name="age" />}
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    expect(screen.getByTestId('age1')).toBeDisabled()
    expect(screen.getByTestId('age')).toBeDisabled()
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
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name" onUpdate={onUpdateSpy}>
              <Input />
            </FlowerField>
            <FlowerRule
              id="name"
              rules={{
                name: { $eq: '@andrea' }
              }}
              onUpdate={onUpdateSpy}
            >
              <ButtonNext />
            </FlowerRule>
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    expect(onUpdateSpy).toBeCalledWith('@andrea')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })
})
