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
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import useFlowerForm from '../components/useFlowerForm'
import FlowerField from '../components/FlowerField'
import FlowerValue from '../components/FlowerValue'

const delay = (ms: any) => new Promise((r) => setTimeout(r, ms))

const Text = ({ text, value }: any) => <h1 data-testid="h1">{text || value}</h1>
const Input = ({ onChange, value = '', name }: any) => {
  return (
    <input
      data-testid={name || 'input'}
      name={name}
      value={value}
      onChange={(evt) => onChange(evt.target.value)}
    />
  )
}

const ButtonNext = ({ id = '' }: any) => {
  const { next } = useFlower()
  return (
    <button data-testid={'btn-next' + id} onClick={() => next()}>
      NEXT
    </button>
  )
}

const InitState = ({ state, path, flowName }: any) => {
  const { next } = useFlower()
  const { setData, getData } = useFlowerForm({ flowName })
  useEffect(() => {
    setData(state, path)
    // console.log(getData())
    next()
  }, [next, setData, getData, state, path])
  return '...'
}

const UnSetState = ({ path }: any) => {
  const { unsetData } = useFlowerForm()
  useEffect(() => {
    unsetData(path)
  }, [path, unsetData])
  return '...'
}

const ReplaceState = ({ value }: any) => {
  const { replaceData } = useFlowerForm()
  useEffect(() => {
    replaceData(value)
  }, [replaceData, value])
  return '...'
}

const Form = ({ flowName }: any) => {
  const { getData } = useFlowerForm({ flowName })
  useEffect(() => {
    getData()
    // console.log("🚀 ~ Form ~ getData:", getData())
  }, [getData])

  return null //errors && errors.join(',')
}

const FormStatus = ({ flowName, path }: any) => {
  const { getFormStatus } = useFlowerForm({ flowName })
  return JSON.stringify(getFormStatus(path), null, 2)
}

describe('Test Form', () => {
  it('Test form missing id', async () => {
    userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              validate={[
                {
                  message: 'is required',
                  rules: { $and: [{ name: { $exists: true } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('input').getAttribute('value')).toBe('')
  })

  it('Test form carret id', async () => {
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
              success: { rules: { $and: [{ '^app.name': { $eq: true } }] } },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="^app.name"
              validate={[
                {
                  message: 'is required',
                  rules: { $and: [{ '^app.name': { $exists: true } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('input').getAttribute('value')).toBe('')
  })

  it('Test form wrong operator', async () => {
    try {
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
                }
              }}
            >
              <FlowerField
                id="name"
                validate={[
                  {
                    message: 'is required',
                    rules: { $self: { $eqxxxxx: true } }
                  }
                ]}
              >
                <Input />
              </FlowerField>
            </FlowerNode>
          </Flower>
        </FlowerProvider>
      )
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toBe('Error missing operator:$eqxxxxx')
    }
  })

  it('Test form wrong validate', async () => {
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
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              validate={[
                {
                  message: 'is required'
                }
              ]}
            >
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
          <FlowerNode id="success">
            <Form />
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('input').getAttribute('value')).toBe('')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  // it('Test form wrong validate', async () => {
  //   const user = userEvent.setup()
  //   render(
  //     <FlowerProvider>
  //       <Flower name="app-test">
  //         <FlowerNode id="start" to={{ form: null }}>
  //           <InitState state={{ amount: 1 }} />
  //         </FlowerNode>
  //         <FlowerNode
  //           id="form"
  //           to={{
  //             success: { rules: { $and: [{ '$form.isValid': { $eq: true } }] } },
  //             error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } },
  //           }}>
  //           <FlowerField
  //             id="name"
  //             validate={[undefined]}
  //           >
  //             <Input />
  //           </FlowerField>
  //           <ButtonNext />
  //         </FlowerNode>
  //         <FlowerNode id="error">
  //           <Form />
  //           <Text text="error" />
  //         </FlowerNode>
  //         <FlowerNode id="success">
  //           <Form />
  //           <Text text="success" />
  //         </FlowerNode>
  //       </Flower>
  //     </FlowerProvider>
  //   )

  //   expect(screen.getByTestId('input').getAttribute('value')).toBe('')
  //   fireEvent.click(screen.getByTestId('btn-next'))
  //   expect(screen.getByTestId('h1')).toHaveTextContent('error')

  // })

  it('Test form wrong validate', async () => {
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
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name" validate={[{}]}>
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
          <FlowerNode id="success">
            <Form />
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('input').getAttribute('value')).toBe('')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form wrong validate', async () => {
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
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name" validate={['ciao']}>
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
          <FlowerNode id="success">
            <Form />
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('input').getAttribute('value')).toBe('')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form isValid', async () => {
    const user = userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState
              state={{ amount: 1 }}
              path="^app-test"
              flowName="app-test"
            />
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
            <FlowerField
              id="name"
              validate={[
                {
                  message: 'is required',
                  rules: { $and: [{ name: { $exists: true } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue id="name">
              <Text />
            </FlowerValue>
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '123')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('123')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('123')
  })

  it('Test form isValid empty id', async () => {
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
            <FlowerField
              id=""
              validate={[
                {
                  message: 'is required',
                  rules: { $and: [{ name: { $exists: true } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue id="name">
              <Text />
            </FlowerValue>
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '123')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form  empty validate', async () => {
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

    await user.type(screen.getByTestId('input'), '123')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test form empty validate', async () => {
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
                rules: {
                  $and: [
                    { '$form.isValid': { $eq: true } },
                    { '$form.isValidating': { $eq: false } }
                  ]
                }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField id="name" asyncValidate={() => false}>
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

    await user.type(screen.getByTestId('input'), '123')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test form isValid missing message error', async () => {
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
            <FlowerField
              id="name"
              validate={[
                {
                  rules: { $and: [{ name: { $exists: true } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue id="name">
              <Text />
            </FlowerValue>
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), '123')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('123')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('123')
  })

  it('Test form not isValid', async () => {
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
            <FlowerField
              id="name"
              validate={[
                {
                  rules: { $and: [{ $self: { $exists: true } }] },
                  message: 'Il campo è obbligatorio.'
                }
              ]}
            >
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue id="name">
              <Text />
            </FlowerValue>
          </FlowerNode>
          <FlowerNode id="error">
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form field $ref', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              validate={[
                {
                  message: 'is equal',
                  rules: { $and: [{ name: { $eq: '$ref:sourceName' } }] }
                }
              ]}
            >
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue id="name">
              <Text />
            </FlowerValue>
          </FlowerNode>
          <FlowerNode id="error">
            <Form />
            <Text text="error" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), 'andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('andrea')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test form complex validate', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ sourceName: '@andrea' }} />
          </FlowerNode>
          <FlowerNode
            id="form"
            to={{
              success: {
                rules: {
                  $or: [
                    { '$form.isValid': { $eq: true } },
                    { 'metadata.age': { $gt: 18 } }
                  ]
                }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              asyncValidate={(val, data) => {
                if (data?.['app-test']?.sourceName?.indexOf('@') > -1) return
                if (val.indexOf('@') > -1) return
                return ['is not email']
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
            <Text text="SUCCESS" />
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
    expect(screen.getByTestId('h1')).toHaveTextContent('SUCCESS')
  })

  it('Test form complex validate wrong', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ sourceName: '@andrea' }} />
          </FlowerNode>
          <FlowerNode
            id="form"
            to={{
              success: { rules: { $or: [{ '$form.isValid': { $eq: true } }] } },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              asyncValidate={(val, data) => {
                return ['is not email']
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
                  message: null,
                  rules: { $and: [{ $self: { $gt: 18 } }] }
                }
              ]}
            >
              <Input name="age" />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <Text text="SUCCESS" />
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
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form destroy field', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ sourceName: 'andrea' }} />
          </FlowerNode>
          <FlowerNode id="form" to={{ success: null }}>
            <FlowerField id="name" destroyValue>
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue id="name">
              {({ value }) => <Text value={value || 'EMPTY'} />}
            </FlowerValue>
            <Form />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), 'andreaa')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('andreaa')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('EMPTY')
  })

  it('Test form destroy field whit unsetData', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ sourceName: 'andrea' }} />
          </FlowerNode>
          <FlowerNode id="form" to={{ success: null }}>
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <UnSetState path="name" />
            <FlowerValue id="name">
              {({ value }) => <Text value={value || 'EMPTY'} />}
            </FlowerValue>
            <Form />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), 'andreaa')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('andreaa')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('EMPTY')
  })

  it('Test form destroy field whit unsetData with carret ^', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ sourceName: 'andrea' }} />
          </FlowerNode>
          <FlowerNode id="form" to={{ success: null }}>
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <UnSetState path="^app-test.name" />
            <FlowerValue id="name">
              {({ value }) => <Text value={value || 'EMPTY'} />}
            </FlowerValue>
            <Form />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), 'andreaa')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('andreaa')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('EMPTY')
  })

  it('Test form replace field whit replaceData', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ sourceName: 'andrea' }} path={'sourceName'} />
          </FlowerNode>
          <FlowerNode id="form" to={{ success: null }}>
            <FlowerField id="name">
              <Input />
            </FlowerField>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <ReplaceState value={{ name: 'ciao' }} />
            <FlowerValue id="^app-test.name">
              <Text />
            </FlowerValue>
            <Form />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), 'andreaa')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('andreaa')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('ciao')
  })

  it('Test form persist on destroy', async () => {
    const user = userEvent.setup()

    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ success: null }}>
            <Flower name="form" destroyOnUnmount={false}>
              <FlowerNode id="form" to={{ success: null }}>
                <FlowerField id="name">
                  <Input />
                </FlowerField>
              </FlowerNode>
            </Flower>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="success">
            <FlowerValue flowName={'form'} id="name">
              <Text />
            </FlowerValue>
            <Form flowName="form" />
          </FlowerNode>
        </Flower>
        <Flower name="form" destroyOnUnmount={false}>
          <FlowerNode id="form" to={{ success: null }}></FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await user.type(screen.getByTestId('input'), 'andrea')
    expect(screen.getByTestId('input').getAttribute('value')).toBe('andrea')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test form async asyncValidate immediate next', async () => {
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
                rules: { $and: [{ '$form.isValid': { $eq: true } }] }
              },
              error: { rules: { $and: [{ '$form.isValid': { $ne: true } }] } }
            }}
          >
            <FlowerField
              id="name"
              asyncInitialError={'error'}
              asyncValidate={async () => {
                await delay(200)
                return false
              }}
            >
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

    //await user.type(screen.getByTestId('input'), '123')
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form async asyncValidate', async () => {
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
            <FlowerField
              id="name"
              asyncValidate={async (val) => {
                await delay(100)
                return val === '123' ? [] : ['error']
              }}
            >
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

    await user.type(screen.getByTestId('input'), '123')
    await delay(200)
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test form async asyncValidate and isValidating check, wrong', async () => {
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
                rules: {
                  $and: [
                    { '$form.isValid': { $eq: true } },
                    { '$form.isValidating': { $eq: false } }
                  ]
                }
              },
              error: {
                rules: {
                  $and: [
                    { '$form.isValid': { $ne: true } },
                    { '$form.isValidating': { $eq: false } }
                  ]
                }
              }
            }}
          >
            <FlowerField
              id="name"
              asyncValidate={async (val) => {
                await delay(100)
                return val === '123' ? ['error'] : []
              }}
            >
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

    await user.type(screen.getByTestId('input'), '123')
    //await delay(200)
    fireEvent.click(screen.getByTestId('btn-next'))
    await delay(200)
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('error')
  })

  it('Test form async asyncValidate wrong2', async () => {
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
                rules: {
                  $and: [
                    { '$form.isValid': { $eq: true } },
                    { '$form.isValidating': { $eq: undefined } }
                  ]
                }
              },
              error: {
                rules: {
                  $and: [
                    { '$form.isValid': { $ne: true } },
                    { '$form.isValidating': { $eq: undefined } }
                  ]
                }
              }
            }}
          >
            <FlowerField id="name">
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

    await user.type(screen.getByTestId('input'), '123')
    //await delay(200)
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test form getFormStatus', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
            <FlowerField
              id="name"
              validate={[
                {
                  rules: {
                    $self: { $exists: true }
                  }
                }
              ]}
            >
              <Input />
            </FlowerField>
          </FlowerNode>
          <FlowerNode id="form">
            <code data-testid="log">
              <FormStatus flowName="app-test" />
            </code>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(JSON.parse(screen.getByTestId('log').innerHTML)).toEqual({
      start: {
        isSubmitted: true,
        errors: {
          name: ['error']
        }
      }
    })
  })

  it('Test form getFormStatus by path', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
            <FlowerField
              id="name"
              validate={[
                {
                  rules: {
                    $self: { $exists: true }
                  }
                }
              ]}
            >
              <Input />
            </FlowerField>
          </FlowerNode>
          <FlowerNode id="form">
            <div data-testid="log">
              <FormStatus flowName="app-test" path="start" />
            </div>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(JSON.parse(screen.getByTestId('log').innerHTML)).toEqual({
      isSubmitted: true,
      errors: {
        name: ['error']
      }
    })
  })

  it('Test form getFormStatus by path', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
            <FlowerField
              id="name"
              validate={[
                {
                  rules: {
                    $self: { $exists: true }
                  }
                }
              ]}
            >
              <Input />
            </FlowerField>
          </FlowerNode>
          <FlowerNode id="form">
            <div data-testid="log">
              <FormStatus flowName="app-test2" path="^app-test.start" />
            </div>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(JSON.parse(screen.getByTestId('log').innerHTML)).toEqual({
      isSubmitted: true,
      errors: {
        name: ['error']
      }
    })
  })
})
