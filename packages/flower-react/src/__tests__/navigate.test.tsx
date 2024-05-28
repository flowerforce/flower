/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */

// import dependencies
import React, { useEffect } from 'react'

// import react-testing methods
import { render, fireEvent, screen } from '@testing-library/react'

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'

import FlowerNode from '../components/FlowerNode'
import FlowerAction from '../components/FlowerAction'
import Flower from '../components/Flower'
import FlowerRoute from '../components/FlowerRoute'
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import useFlowerForm from '../components/useFlowerForm'

const Text = ({ text, value }: any) => {
  return <h1 data-testid="h1">{text || value}</h1>
}

// const Input = ({ onChange, value, name }: any) => <input name={name} value={value} onChange={evt => onChange(evt.target.value)} />
// const Container = ({ children, item }: any) => <div className='paper'>{item || children}</div>

const ButtonNode = ({ route }: any) => {
  const { jump } = useFlower()
  return (
    <button data-testid="btn-node" onClick={() => jump(route)}>
      NEXT
    </button>
  )
}

const ButtonNodeObject = ({ value }: any) => {
  const { jump } = useFlower()
  return (
    <button data-testid="btn-node" onClick={() => jump(value)}>
      NEXT
    </button>
  )
}

const ButtonNext = ({ route, dataIn }: any) => {
  const { next } = useFlower()
  return (
    <button data-testid="btn-next" onClick={() => next(dataIn || route)}>
      NEXT
    </button>
  )
}

const ButtonPrev = () => {
  const { back } = useFlower()
  return (
    <button data-testid="btn-prev" onClick={() => back()}>
      PREV
    </button>
  )
}

const ButtonReset = () => {
  const { reset } = useFlower()
  return (
    <button data-testid="btn-reset" onClick={() => reset()}>
      Reset
    </button>
  )
}

const ButtonResetNode = ({ node }: any) => {
  const { reset } = useFlower()
  return (
    <button data-testid="btn-reset" onClick={() => reset(node)}>
      Reset
    </button>
  )
}

const ButtonResetNodeObject = ({ value }: any) => {
  const { reset } = useFlower()
  return (
    <button data-testid="btn-reset" onClick={() => reset(value)}>
      Reset
    </button>
  )
}

const ButtonPrevNode = ({ node }: any) => {
  const { back } = useFlower()
  return (
    <button data-testid="btn-prev" onClick={() => back(node)}>
      PREV
    </button>
  )
}

const ButtonPrevNodeObject = ({ value }: any) => {
  const { back } = useFlower()
  return (
    <button data-testid="btn-prev" onClick={() => back(value)}>
      PREV
    </button>
  )
}

const MyNode = ({ children }: any) => children

const InitState = ({ state }: any) => {
  const { next } = useFlower()
  const { setData } = useFlowerForm()
  useEffect(() => {
    setData(state)
    next()
  }, [next, setData, state])
  return '...'
}

describe('Test render <Flower />', () => {
  it('Test empty', async () => {
    const { container } = render(
      <FlowerProvider>
        <Flower name="app-test1"></Flower>
      </FlowerProvider>
    )
    expect(container.innerHTML).toBe('')
  })

  it('Test first node', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: null
            }}
          >
            <Text text="andrea"></Text>
          </FlowerNode>
          <FlowerNode id="b">
            <Text id="name"></Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test first as type node', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <MyNode
            as="FlowerNode"
            id="a"
            to={{
              b: null
            }}
          >
            <Text text="andrea"></Text>
          </MyNode>
          <FlowerNode id="b">
            <Text id="name"></Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test first custom node', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <MyNode
            id="a"
            to={{
              b: null
            }}
          >
            <Text text="andrea"></Text>
          </MyNode>
          <FlowerNode id="b">
            <Text id="name"></Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test node wrong rules to', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: { rules: 'aaa' }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text>ERROR</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test node no rules', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode id="a" to={{}}>
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text>ERROR</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test node wrong rules to', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: 'aaa'
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text>ERROR</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test node wrong rules to', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: { rules: undefined }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text>ERROR</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('test next node rules complex', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test2">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              c: { rules: { $and: [{ amount: { $gt: 1497.99 } }] } },
              b: {
                rules: {
                  $and: [
                    { amount: { $lte: 1497.99 } },
                    { '$form.isValid': { $eq: true } }
                  ]
                }
              }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="gino" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="gege" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('gino')
  })

  it('test next node whitout rules', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test2">
          <FlowerNode
            id="a"
            to={{
              c: { rules: { $and: [{ name: { $eq: 'asd' } }] } },
              b: null
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="gino" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="gege" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('gino')
  })

  it('test next node with route name', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test3">
          <FlowerNode
            id="a"
            to={{
              c: 'onSuccess',
              b: null
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext route="onSuccess" />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="gino" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="gege" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('gege')
  })

  it('test next node with wrong route name', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test3">
          <FlowerNode
            id="a"
            to={{
              c: 'onSuccess',
              b: null
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext route="ERRRRR" />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="gino" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="gege" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('test next node with got to node id', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test3">
          <FlowerNode
            id="a"
            to={{
              c: 'onSuccess',
              b: 'onError'
            }}
          >
            <Text text="step0"></Text>
            <ButtonNode route="c" />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="step1" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="step2" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-node'))
    expect(screen.getByTestId('h1')).toHaveTextContent('step2')
  })

  it('test next node with got to node object node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test3">
          <FlowerNode
            id="a"
            to={{
              c: 'onSuccess',
              b: 'onError'
            }}
          >
            <Text text="step0"></Text>
            <ButtonNodeObject value={{ node: 'c' }} />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="step1" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="step2" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-node'))
    expect(screen.getByTestId('h1')).toHaveTextContent('step2')
  })

  it('test next node with got to node id not exists', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test3">
          <FlowerNode
            id="a"
            to={{
              c: 'onSuccess',
              b: 'onError'
            }}
          >
            <Text text="step0"></Text>
            <ButtonNode route="WRONG" />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="step1" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="step2" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-node'))
    expect(screen.getByTestId('h1')).toHaveTextContent('step0')
  })

  it('test next node with data $in', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test4">
          <FlowerNode
            id="a"
            to={{
              c: { rules: { $and: [{ '$in.name': { $eq: 'andrea' } }] } },
              b: { rules: { $and: [{ '$in.name': { $eq: 'zucca' } }] } }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext dataIn={{ name: 'andrea' }} />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="zucca" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="gege form" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('gege form')
  })

  it('test next node with data from state', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'andrea' }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              d: { rules: { $and: [{ name: { $eq: 'andrea' } }] } },
              b: { rules: { $and: [{ '$in.name': { $eq: 'zucca' } }] } }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="zucca" />
          </FlowerNode>
          <FlowerNode id="d">
            <Text text="value from state" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('value from state')
  })

  it('test next node with data from state wrong', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              d: { rules: { $and: [{ name: { $eq: 'andrea' } }] } },
              b: { rules: { $and: [{ '$in.name': { $eq: 'zucca' } }] } }
            }}
          >
            <Text text="form screen"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="zucca" />
          </FlowerNode>
          <FlowerNode id="d">
            <Text text="value from state" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('form screen')
  })

  it('test next node disabled', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            retain={true}
            to={{
              b: null
            }}
          >
            <Text text="form screen"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerAction
            id="b"
            disabled={true}
            to={{
              d: null
            }}
          >
            <Text text="zucca" />
            <ButtonNext />
          </FlowerAction>
          <FlowerAction id="d">
            <Text text="value from state" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('form screen')).toBeVisible()
    expect(await screen.findByText('value from state')).toBeVisible()
  })

  it('test next node disabled and retain', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            retain={true}
            disabled={true}
            to={{
              b: null
            }}
          >
            <Text text="form screen"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerAction
            id="b"
            to={{
              d: null
            }}
          >
            <Text text="zucca" />
            <ButtonNext />
          </FlowerAction>
          <FlowerAction id="d">
            <Text text="value from state" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('value from state')).toBeVisible()
  })

  it('test prev node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              b: null
            }}
          >
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonPrev />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step2')).toBeVisible()
  })

  it('test prev to node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonPrevNode node="a" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test reset to node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null, newstart: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="newstart" to={{ e: null }}>
            <Text text="newstart" />
            <ButtonPrev />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonResetNode node="newstart" />
          </FlowerAction>
          <FlowerAction id="e">
            <Text text="newstart-d" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-reset'))
    expect(await screen.findByText('newstart')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('newstart')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('newstart-d')).toBeVisible()
  })

  it('test reset to missing node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null, newstart: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonResetNode node="notExist" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-reset'))
    // resta allo step3 perché il nodo su cui fare il reset non esiste
    expect(await screen.findByText('step3')).toBeVisible()
  })

  it('test reset to node with object node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null, newstart: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="newstart" to={{ e: null }}>
            <Text text="newstart" />
            <ButtonPrev />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonResetNodeObject value={{ node: 'newstart' }} />
          </FlowerAction>
          <FlowerAction id="e">
            <Text text="newstart-d" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-reset'))
    expect(await screen.findByText('newstart')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('newstart')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('newstart-d')).toBeVisible()
  })

  it('test prev to node with object node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerRoute id="start" to={{ a: null }} autostart={false}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerRoute>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonPrevNodeObject value={{ node: 'a' }} />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test prev to node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <Text text="step1"></Text>
            <ButtonPrevNode node="start" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test prev to node not exists', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonPrevNode node="aaaaa" />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step3')).toBeVisible()
  })

  it('test prev to start', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
            <ButtonPrev />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
            <ButtonPrev />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonPrev />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    fireEvent.click(screen.getByTestId('btn-prev'))
    fireEvent.click(screen.getByTestId('btn-prev'))
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test prev only node', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <Text text="step1" />
            <ButtonPrev />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(await screen.findByText('step1')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test reset history', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode id="a" to={{ b: null }}>
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonReset />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step2')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-reset'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test prev node disabled', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'aaaa' }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              b: null
            }}
          >
            <Text text="step1"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b" disabled={true} to={{ d: null }}>
            <Text text="step2" />
            <ButtonNext />
          </FlowerNode>
          <FlowerAction id="d">
            <Text text="step3" />
            <ButtonPrev />
          </FlowerAction>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
    fireEvent.click(screen.getByTestId('btn-prev'))
    expect(await screen.findByText('step1')).toBeVisible()
  })

  it('test next node with data from state complex rules', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ name: 'andrea', age: 18, tags: ['a', 'b'] }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              b: {
                rules: {
                  $and: []
                }
              },
              d: {
                rules: {
                  $and: [
                    { name: { $eq: 'andrea' } },
                    { name: { $ne: 'z' } },
                    { name: { $strGt: 5 } },
                    { name: { $strGte: 6 } },
                    { name: { $strLte: 50 } },
                    { name: { $strLt: 50 } },
                    { age: { $gt: 17 } },
                    { age: { $gte: 18 } },
                    { age: { $lte: 118 } },
                    { age: { $lt: 118 } },
                    { name: { $exists: true } },
                    { name: { $regex: '^a' } },
                    { name: { $regex: /^a/ } },
                    { tags: { $in: ['a'] } },
                    { tags: { $nin: ['z'] } },
                    { tags: { $all: ['a', 'b'] } }
                  ]
                }
              }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="d">
            <Text text="complex" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('complex')
  })

  it('test next node with data $in and priority rules', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test4">
          <FlowerNode
            id="a"
            to={{
              c: { rules: { $and: [{ '$in.name': { $eq: 'andrea' } }] } },
              b: null
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext dataIn={{ name: 'andrea' }} />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="zucca" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('test next node with data $in and priority rules inverse', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test4">
          <FlowerNode
            id="a"
            to={{
              b: null,
              c: { rules: { $and: [{ '$in.name': { $eq: 'andrea' } }] } }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext dataIn={{ name: 'andrea' }} />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="zucca" />
          </FlowerNode>
          <FlowerNode id="c">
            <Text text="success" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('success')
  })

  it('Test node rules to object null', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: { label: 'test', rules: null }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="OK"></Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('OK')
  })

  it('Test node rules to object empty rules', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: { label: 'test' }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext />
          </FlowerNode>
          <FlowerNode id="b">
            <Text>ERROR</Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('andrea')
  })

  it('Test node rules to object label and name', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: { label: 'test', name: 'success' }
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNext route="success" />
          </FlowerNode>
          <FlowerNode id="b">
            <Text text="SUCCESS"></Text>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    fireEvent.click(screen.getByTestId('btn-next'))
    expect(screen.getByTestId('h1')).toHaveTextContent('SUCCESS')
  })
})
