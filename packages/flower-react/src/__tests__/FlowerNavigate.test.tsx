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
import FlowerNavigate from '../components/FlowerNavigate'
import FlowerRoute from '../components/FlowerRoute'
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import { useFlowerForm } from '@flowerforce/flower-form'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const Text = ({
  text,
  value
}: {
  text?: string
  value?: any
  id?: any
  children?: any
}) => {
  return <h1 data-testid="h1">{text || value}</h1>
}

const ButtonNode = ({ route }: any) => {
  return (
    <FlowerNavigate action="jump" node={{ node: route }}>
      <button data-testid="btn-node">NEXT</button>
    </FlowerNavigate>
  )
}

const ButtonNodeObject = ({ value }: any) => {
  return (
    <FlowerNavigate action="jump" node={value}>
      <button data-testid="btn-node">NEXT</button>
    </FlowerNavigate>
  )
}

const ButtonNextDefault = () => {
  return (
    <FlowerNavigate action="next">
      <button data-testid="btn-next">NEXT</button>
    </FlowerNavigate>
  )
}

const ButtonNext = ({ route, dataIn }: any) => {
  return (
    <FlowerNavigate action="next" route={dataIn || route}>
      <button data-testid="btn-next">NEXT</button>
    </FlowerNavigate>
  )
}

const ButtonNextFunc = ({ route, dataIn }: any) => {
  return (
    <FlowerNavigate action="next" route={dataIn || route}>
      {({ onClick }) => (
        <button data-testid="btn-next" onClick={onClick}>
          NEXT
        </button>
      )}
    </FlowerNavigate>
  )
}

const ButtonPrev = () => {
  return (
    <FlowerNavigate action="back">
      prev
      <button data-testid="btn-prev">PREV</button>
    </FlowerNavigate>
  )
}

const ButtonReset = () => {
  return (
    <FlowerNavigate action="reset">
      <button data-testid="btn-reset">Reset</button>
    </FlowerNavigate>
  )
}

const ButtonResetNode = ({ node }: any) => {
  return (
    <FlowerNavigate action="reset" node={node}>
      <button data-testid="btn-reset">Reset</button>
    </FlowerNavigate>
  )
}

const ButtonRestart = () => {
  return (
    <FlowerNavigate action="restart">
      <button data-testid="btn-restart">Restart</button>
    </FlowerNavigate>
  )
}

const ButtonRestartNode = ({ node }: any) => {
  return (
    <FlowerNavigate action="restart" node={node}>
      <button data-testid="btn-restart">Restart</button>
    </FlowerNavigate>
  )
}

const ButtonResetNodeObject = ({ value }: any) => {
  return (
    <FlowerNavigate action="reset" node={value}>
      <button data-testid="btn-reset">Reset</button>
    </FlowerNavigate>
  )
}

const ButtonPrevNode = ({ node }: any) => {
  return (
    <FlowerNavigate action="back" node={node}>
      <button data-testid="btn-prev">PREV</button>
    </FlowerNavigate>
  )
}

const ButtonPrevNodeObject = ({ value }: any) => {
  return (
    <FlowerNavigate action="back" node={value}>
      <button data-testid="btn-prev">PREV</button>
    </FlowerNavigate>
  )
}

const MyNode = ({ children, ...props }: any) => children

const InitState = ({ state }: any) => {
  const { next } = useFlower()
  const { setData } = useFlowerForm()
  useEffect(() => {
    setData(state)
    next()
  }, [next, setData, state])
  return '...'
}

describe('FlowerNavigate test render <Flower />', () => {
  it('FlowerNavigate test first node', () => {
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

  it('FlowerNavigate test first as type node', () => {
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

  it('FlowerNavigate test first custom node', () => {
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

  it('FlowerNavigate test node wrong rules to', () => {
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

  it('FlowerNavigate test node with rules function', () => {
    render(
      <FlowerProvider>
        <Flower name="app-test1">
          <FlowerNode
            id="a"
            to={{
              b: (val) => {
                return val.$data.isValid
              }
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

  it('FlowerNavigate test node no rules', () => {
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

  it('FlowerNavigate test node wrong rules to', () => {
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

  it('FlowerNavigate test node wrong rules to', () => {
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

  it('FlowerNavigate test cmp func', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test2">
          <FlowerNode id="start" to={{ a: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode
            id="a"
            to={{
              c: null
            }}
          >
            <Text text="andrea"></Text>
            <ButtonNextFunc />
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

  it('FlowerNavigate test next node rules complex', async () => {
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
                    { '$data.isValid': { $eq: true } }
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

  it('FlowerNavigate test next node whitout rules', async () => {
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

  it('FlowerNavigate test next node with route name', async () => {
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

  it('FlowerNavigate test next node with wrong route name', async () => {
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

  it('FlowerNavigate test next node with got to node id', async () => {
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

  it('FlowerNavigate test next node with got to node object node', async () => {
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

  it('FlowerNavigate test next node with got to node id not exists', async () => {
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

  it('FlowerNavigate test next node with data $in', async () => {
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

  it('FlowerNavigate test next node with data from state', async () => {
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

  it('FlowerNavigate test next node with data from state wrong', async () => {
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

  it('FlowerNavigate test next node disabled', async () => {
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

  it('FlowerNavigate test next node disabled and retain', async () => {
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

  it('FlowerNavigate test prev node', async () => {
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

  it('FlowerNavigate test prev to node', async () => {
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

  it('FlowerNavigate test prev to node with object node', async () => {
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

  it('FlowerNavigate test prev to node', async () => {
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

  it('FlowerNavigate test prev to node not exists', async () => {
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

  it('FlowerNavigate test prev to start', async () => {
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

  it('FlowerNavigate test prev only node', async () => {
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

  it('FlowerNavigate test reset history', async () => {
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

  // it('FlowerNavigate test restart flow', async () => {
  //   render(
  //     <FlowerProvider>
  //       <Flower name="app-test5">
  //         <FlowerNode id="start" to={{ a: null }}>
  //           <InitState state={{ name: 'aaaa' }} />
  //         </FlowerNode>
  //         <FlowerNode id="a" to={{ b: null }}>
  //           <Text text="step1"></Text>
  //           <ButtonNext />
  //         </FlowerNode>
  //         <FlowerNode id="b" to={{ d: null }}>
  //           <Text text="step2" />
  //           <ButtonNext />
  //         </FlowerNode>
  //         <FlowerAction id="d">
  //           <Text text="step3" />
  //           <ButtonRestart />
  //         </FlowerAction>
  //       </Flower>
  //     </FlowerProvider>
  //   )

  //   fireEvent.click(screen.getByTestId('btn-next'))
  //   expect(await screen.findByText('step2')).toBeVisible()
  //   fireEvent.click(screen.getByTestId('btn-next'))
  //   expect(await screen.findByText('step3')).toBeVisible()
  //   fireEvent.click(screen.getByTestId('btn-restart'))
  //   await delay(1000)
  //   expect(await screen.findByText('step1')).toBeVisible()
  // })

  it('FlowerNavigate test prev node disabled', async () => {
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

  it('FlowerNavigate test next node with data from state complex rules', async () => {
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

  it('FlowerNavigate test next node with data $in and priority rules', async () => {
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

  it('FlowerNavigate test next node with data $in and priority rules inverse', async () => {
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

  it('FlowerNavigate test node rules to object null', () => {
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

  it('FlowerNavigate test node rules to object empty rules', () => {
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

  it('FlowerNavigate test node rules to object label and name', () => {
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

  it('FlowerNavigate test next default', async () => {
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
            <ButtonNextDefault />
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

  it('FlowerNavigate test hide by rule', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerNavigate action="next" rules={{ amount: { $eq: 2 } }}>
              <button data-testid="btn-next">HIDDEN</button>
            </FlowerNavigate>
            <FlowerNavigate action="next" rules={{ amount: { $eq: 1 } }}>
              <button data-testid="btn-next2">VISIBLE</button>
            </FlowerNavigate>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    expect(screen.queryByTestId('btn-next')).not.toBeInTheDocument()
    expect(screen.queryByTestId('btn-next2')).toBeInTheDocument()
  })

  it('FlowerNavigate test hide by rule BUT alwaysDisplay', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerNavigate
              action="next"
              rules={{ amount: { $eq: 2 } }}
              alwaysDisplay
            >
              <button data-testid="btn-next">ALWAYS</button>
            </FlowerNavigate>
            <FlowerNavigate action="next" rules={{ amount: { $eq: 1 } }}>
              <button data-testid="btn-next2">VISIBLE</button>
            </FlowerNavigate>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )
    expect(screen.queryByTestId('btn-next')).toBeInTheDocument()
    expect(screen.queryByTestId('btn-next2')).toBeInTheDocument()
  })

  it('FlowerNavigate test next to node with functional children', async () => {
    render(
      <FlowerProvider>
        <Flower name="app-test5">
          <FlowerRoute
            onEnter={() => {
              console.log('start')
            }}
            id="start"
            to={{ step1: null }}
          />
          <FlowerNode id="step1" to={{ step2: null }}>
            <Text text="step1"></Text>
            <FlowerNavigate action="next">
              {({ onClick, hidden }) => (
                <button
                  data-testid="btn-next"
                  onClick={onClick}
                  disabled={hidden}
                >
                  NEXT
                </button>
              )}
            </FlowerNavigate>
          </FlowerNode>
          <FlowerRoute autostart={false} id="step2" to={{ step3: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerRoute>
          <FlowerNode id="step3">
            <Text text="step3" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    fireEvent.click(screen.getByTestId('btn-next'))
    expect(await screen.findByText('step3')).toBeVisible()
  })
})
