/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'

// import react-testing methods
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

import { FlowerProvider } from '../provider'
import { useFlower, FlowerNode, Flower } from '../components'
import { useFlowerForm, FlowerField } from '@flowerforce/flower-react-form'

const delay = (ms: any) => new Promise((r) => setTimeout(r, ms))

const Text = ({
  text,
  value,
  children,
  id
}: {
  text?: string
  value?: string
  children?: string
  id?: string
}) => <h1 data-testid={id || 'h1'}>{text || value || children}</h1>

const Input = ({ onChange, value = '', name, onBlur }: Record<string, any>) => {
  return (
    <input
      data-testid={name || 'input'}
      name={name}
      value={value}
      onBlur={(evt) => onBlur(evt)}
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

const InitState = ({ state, path }: { state: any; path?: any }) => {
  const { next } = useFlower()
  const { setData, getData } = useFlowerForm()
  useEffect(() => {
    setData(state, path)
    // console.log(getData())
    next()
  }, [next, setData, getData, state, path])
  return '...'
}

const Form = ({ flowName, path }: { flowName?: string; path?: string }) => {
  const { getData } = useFlowerForm(flowName)
  useEffect(() => {
    getData(path)
    // console.log("🚀 ~ Form ~ getData:", getData())
  }, [getData, path])

  return <></> //errors && errors.join(',')
}

const FormReset = forwardRef(({ children, flowName }: any, ref) => {
  const { reset } = useFlowerForm(flowName)

  useImperativeHandle(ref, () => {
    return {
      reset
    }
  }, [reset])

  return children
})

const FormErrors = forwardRef(({ children, flowName }: any, ref) => {
  const { setCustomErrors, customErrors } = useFlowerForm(flowName)

  useImperativeHandle(ref, () => {
    return {
      setCustomErrors
    }
  }, [setCustomErrors])

  return (
    <>
      <div data-testid="errors">{JSON.stringify(customErrors)}</div>
      {children}
    </>
  )
})

describe('Test FlowerField component', () => {
  it('Test flow success', async () => {
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              asyncValidate={(val) => {
                if (val?.indexOf('@') > -1) return
                return [
                  {
                    message: 'is not email'
                  }
                ]
              }}
              validate={[
                {
                  message: 'is equal',
                  rules: { $and: [{ name: { $eq: '@andrea' } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <FlowerField
              id="metadata.age"
              validate={[
                {
                  message: 'is gt 18',
                  rules: { $and: [{ $self: { $gt: 18 } }] }
                }
              ]}
            >
              <Input name="age" />
            </FlowerField>
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

    await user.type(screen.getByTestId('age'), '19')
    expect(screen.getByTestId('age').getAttribute('value')).toBe('19')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test flow success with validate function', async () => {
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              asyncValidate={(val) => {
                if (val?.indexOf('@') > -1) return
                return [
                  {
                    message: 'is not email'
                  }
                ]
              }}
              validate={[
                {
                  message: 'is equal',
                  rules: (val) => {
                    return val['app-test'].name === '@andrea'
                  }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <FlowerField
              id="metadata.age"
              validate={[
                {
                  message: 'is gt 18',
                  rules: (val) => {
                    return val['app-test'].metadata?.age > 18
                  }
                }
              ]}
            >
              <Input name="age" />
            </FlowerField>
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

    await user.type(screen.getByTestId('age'), '19')
    expect(screen.getByTestId('age').getAttribute('value')).toBe('19')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test flow functional children', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState path="^app-test" state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id=".name">
              {(props) => <Input {...props} />}
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Form path="^app-test" />
            <Text text="success" />
          </FlowerNode>
          <FlowerNode id="error">
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name" onUpdate={onUpdateSpy}>
              <Input />
            </FlowerField>
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

    expect(onUpdateSpy).toBeCalledWith('@andrea')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test defaultValue', async () => {
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name" defaultValue={'@andrea'}>
              <Input />
            </FlowerField>
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

    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')
    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test resetForm', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<Record<string, any>>()
    const onResetSpy = jest.fn()
    const onBlurSpy = jest.fn()

    render(
      <FlowerProvider>
        <FormReset ref={ref} flowName="app-test" />
        <Flower name="app-test">
          <FlowerNode id="form">
            <FlowerField id="name">
              <Input onBlur={onBlurSpy} />
            </FlowerField>
            <button
              data-testid="btn-reset"
              onClick={() => {
                onResetSpy(ref.current && ref.current.reset())
              }}
            >
              reset
            </button>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    screen.getByTestId('input').focus()
    await waitFor(() => expect(screen.getByTestId('input')).toHaveFocus())
    await user.type(screen.getByTestId('input'), '@andrea')
    await user.tab() // blur
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')
    expect(onBlurSpy).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByTestId('btn-reset'))
    expect(onResetSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('input').getAttribute('value')).toBe('')
  })

  it('Test onBlur', async () => {
    const user = userEvent.setup()
    const onBlurSpy = jest.fn()

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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name">
              <Input onBlur={onBlurSpy} />
            </FlowerField>
            <FlowerField id="lastname">
              <Input name="lastname" />
            </FlowerField>
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

    screen.getByTestId('input').focus()
    await waitFor(() => expect(screen.getByTestId('input')).toHaveFocus())
    await user.type(screen.getByTestId('input'), '@andrea')
    await user.tab() // blur
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')

    expect(onBlurSpy).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test asyncValidate initial Error', async () => {
    userEvent.setup()
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              }
              // error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } },
            }}
          >
            <FlowerField
              id="name"
              asyncInitialError={'Compila'}
              asyncValidate={(val) => {
                return val !== 'a' ? ['error'] : []
              }}
            >
              {({ errors }) => <Text value={errors?.join()} />}
            </FlowerField>
            <FlowerField id="lastname">
              <Input name="lastname" />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('Compila')
  })

  it('Test asyncValidate whitout asyncInitialError', async () => {
    userEvent.setup()
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              }
              // error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } },
            }}
          >
            <FlowerField
              id="name"
              asyncValidate={(val) => {
                return val !== 'a' ? ['error2'] : []
              }}
            >
              {({ errors }) => <Text value={errors?.join()} />}
            </FlowerField>
            <FlowerField id="lastname">
              <Input name="lastname" />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test asyncValidate type and clear', async () => {
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              }
              // error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } },
            }}
          >
            <FlowerField
              id="name"
              asyncInitialError="Error name"
              asyncValidate={(val) => {
                return val !== '@andrea' ? ['error'] : []
              }}
            >
              {({ errors, onChange, value, onBlur }) => (
                <>
                  <Input onChange={onChange} value={value} onBlur={onBlur} />
                  <Text value={errors?.join()} />
                </>
              )}
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@')
    fireEvent.click(screen.getByTestId('btn-next'))
    await user.clear(screen.getByTestId('input'))
    expect(screen.getByTestId('h1')).toHaveTextContent('Error name')
    await user.type(screen.getByTestId('input'), '@andrea')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test asyncValidate type and clear', async () => {
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              }
              // error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } },
            }}
          >
            <FlowerField
              id="name"
              asyncInitialError="Invalid field"
              asyncValidate={(val) => {
                return val !== '@andrea' ? ['error'] : []
              }}
            >
              {({ errors, onChange, value, onBlur }) => (
                <>
                  <Input onChange={onChange} value={value} onBlur={onBlur} />
                  <Text value={errors?.join()} />
                </>
              )}
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@')
    fireEvent.click(screen.getByTestId('btn-next'))
    await user.clear(screen.getByTestId('input'))
    expect(screen.getByTestId('h1')).toHaveTextContent('Invalid field')
    await user.type(screen.getByTestId('input'), '@andrea')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test asyncValidate asyncWaitingError', async () => {
    const user = userEvent.setup()
    const go = jest.fn()

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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              }
            }}
          >
            <FlowerField
              id="name"
              asyncWaitingError="Attendi"
              asyncValidate={async () => {
                await delay(300)
                await go()
                await delay(100)
                return ['error']
              }}
            >
              {({ errors, onChange, onBlur, value }) => {
                return (
                  <>
                    <Text id="errors" value={errors?.join()} />
                    <Text id="val" value={value} />
                    <Input onChange={onChange} value={value} onBlur={onBlur} />
                  </>
                )
              }}
            </FlowerField>
            <FlowerField id="lastname">
              <input name="lastname" data-testid="input2" />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '@andrea')
    await waitFor(() =>
      expect(screen.getByTestId('val')).toHaveTextContent('@andrea')
    )
    expect(screen.getByTestId('input').getAttribute('value')).toBe('@andrea')
    await user.type(screen.getByTestId('input2'), '@andrea')
    await delay(300)
    expect(screen.getByTestId('errors')).toHaveTextContent('Attendi')
    await delay(150)
    await waitFor(() => expect(go).toHaveBeenCalled())
    await delay(10)
  }, 3000)

  it('Test component', async () => {
    userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerField id="name">
              <div />
              <h1 data-testid="text" className="style">
                ciao
              </h1>
            </FlowerField>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('text')).toHaveTextContent('ciao')
  })

  it('Test component string', async () => {
    userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerField id="name">
              hello
              <h1 data-testid="text" className="style">
                ciao
              </h1>
            </FlowerField>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('text')).toHaveTextContent('ciao')
  })

  it('Test set custom errors', async () => {
    const ref = React.createRef<Record<string, any>>()
    const onErrorsSpy = jest.fn()
    render(
      <FlowerProvider>
        <FormErrors ref={ref} flowName="app-test" />
        <Flower name="app-test">
          <FlowerNode id="form">
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <button
              data-testid="btn-set-errors"
              onClick={() => {
                onErrorsSpy(
                  ref.current &&
                    ref.current.setCustomErrors('name', ['error-name'])
                )
              }}
            >
              reset
            </button>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-set-errors'))
    expect(onErrorsSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('errors')).toHaveTextContent(
      '{"name":["error-name"]}'
    )
  })

  it('Test hidden field', async () => {
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
                rules: { $and: [{ '$data.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$data.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              alwaysDisplay
              rules={{
                name: { $eq: 'wrong' }
              }}
              asyncValidate={(val) => {
                if (val?.indexOf('@') > -1) return
                return [
                  {
                    message: 'is not email'
                  }
                ]
              }}
              validate={[
                {
                  message: 'is equal',
                  rules: { $and: [{ name: { $eq: '@andrea' } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <FlowerField
              id="metadata.age"
              validate={[
                {
                  message: 'is gt 18',
                  rules: { $and: [{ $self: { $gt: 18 } }] }
                }
              ]}
            >
              <Input name="age" />
            </FlowerField>
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

    await user.type(screen.getByTestId('input'), 'an')

    await user.type(screen.getByTestId('age'), '19')
    expect(screen.getByTestId('age').getAttribute('value')).toBe('19')

    fireEvent.click(screen.getByTestId('btn-next'))

    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })
})
