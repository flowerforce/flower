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
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import { useFlowerForm } from '@flowerforce/flower-react-form'
import { FlowerRule } from '@flowerforce/flower-react-shared'

const Text = ({ text, value, children }: any) => (
  <h1 data-testid="h1">{text || value || children}</h1>
)
// const Input = ({ onChange, value = '', name }: any) => {
//   return <input data-testid={name || "input"} name={name} value={value} onChange={evt => onChange(evt.target.value)} />
// }

// const ButtonNext = () => {
//   const { next } = useFlower()
//   return (
//     <button data-testid="btn-next" onClick={() => next()}>NEXT</button>
//   )
// }

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

// const Form = () => {
//   const { errors } = useFlowerForm()
//   return errors && errors.join(',')
// }

describe('Test Visibility', () => {
  it('Test show by rule', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule rules={{ amount: { $eq: 1 } }}>
              <Text>HELLO</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  })

  it('Test hide by rule', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule rules={{ amount: { $eq: 2 } }}>
              <Text>HELLO</Text>
            </FlowerRule>
            <FlowerRule rules={{ amount: { $eq: 1 } }}>
              <Text>ERR</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('ERR')
  })

  it('Test hide by rule with $ref', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule rules={{ amount: { $eq: '$ref:name' } }}>
              <Text>HELLO</Text>
            </FlowerRule>
            <FlowerRule rules={{ amount: { $eq: 1 } }}>
              <Text>ERR</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('ERR')
  })

  it('Test hide by rule all operators', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState
              state={{
                name: 'and',
                lastname: null,
                age: 2,
                presence: true,
                date: new Date(),
                val: { a: 1 },
                val2: {},
                func: () => null,
                arr: ['1'],
                ageString: '2.1'
              }}
            />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule
              rules={{
                $and: [
                  { date: { $exists: true } },
                  { val: { $exists: true } },
                  { val2: { $exists: false } },
                  { func: { $exists: true } },
                  { arr: { $exists: true } },
                  { name: 'and' },
                  { name: '$required' },
                  { name: '$exists' },
                  { age: 2 },
                  { age: { $gt: '1and' } },
                  { name: { $strGt: 1 } },
                  { arr: { $gte: [1] } },
                  { presence: true },
                  { arr: ['1'] },
                  { lastname: null },
                  { lastname: { $strGte: 0 } },
                  { lastname: { $strLte: 0 } },
                  { lastname: { $strGt: -1 } },
                  { lastname: { $strLt: 1 } },
                  { xxxx: { $exists: false } },
                  { age: { $lte: Infinity } },
                  { age: { $lte: 100.5 } },
                  { age: { $gte: -100.5 } },
                  { ageString: { $gte: -100.5 } },
                  {
                    $or: [{ name: 'and' }]
                  }
                ]
              }}
            >
              <Text>HELLO</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  })

  it('Test without rules', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule>
              <Text>HELLO</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  })

  it('Test without rules $and', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule rules={{ $and: [] }}>
              <Text>HELLO</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  })

  it('Test without rules $or', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule rules={{ $or: [] }}>
              <Text>HELLO</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  })

  it('Test without rules $and array', async () => {
    userEvent.setup()
    render(
      <FlowerProvider>
        <Flower name="app-test">
          <FlowerNode id="start" to={{ form: null }}>
            <InitState state={{ amount: 1 }} />
          </FlowerNode>
          <FlowerNode id="form">
            <FlowerRule rules={[]}>
              <Text>HELLO</Text>
            </FlowerRule>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  })

  // it('Test without rules undefined', async () => {
  //   const user = userEvent.setup()
  //   render(
  //     <FlowerProvider>
  //       <Flower name="app-test">
  //         <FlowerNode id="start" to={{ form: null }}>
  //           <InitState state={{ amount: 1 }} />
  //         </FlowerNode>
  //         <FlowerNode id="form">
  //           <FlowerRule rules={[undefined]}>
  //             <Text>HELLO</Text>
  //           </FlowerRule>
  //         </FlowerNode>
  //       </Flower>
  //     </FlowerProvider>
  //   )

  //   expect(screen.getByTestId('h1')).toHaveTextContent('HELLO')
  // })
})
