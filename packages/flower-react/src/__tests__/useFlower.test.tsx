/**
 * @jest-environment jsdom
 */

import React, { useEffect, useRef } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import Flower from '../components/Flower'
import FlowerNode from '../components/FlowerNode'
import FlowerProvider from '../provider'
import useFlower from '../components/useFlower'
import { Emitter, devtoolState } from '@flowerforce/flower-core'

const HookConsumer = ({ onReady }: { onReady: (value: string) => void }) => {
  const { next, back, jump, reset, restart, getCurrentNodeId } = useFlower({
    flowName: 'navigation-test'
  })

  const executed = useRef(false)

  useEffect(() => {
    if (executed.current) return
    executed.current = true

    next('next')
    back('start')
    jump('start')
    reset('start')
    restart('start')
    onReady(getCurrentNodeId())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, back, jump, reset, restart, getCurrentNodeId, onReady])

  return <span data-testid="current-node">{getCurrentNodeId()}</span>
}

describe('useFlower hook coverage', () => {
  const originalDevtool = devtoolState.__FLOWER_DEVTOOLS__

  afterEach(() => {
    devtoolState.__FLOWER_DEVTOOLS__ = originalDevtool
  })

  it('dispatches navigation actions and emits devtool events', async () => {
    devtoolState.__FLOWER_DEVTOOLS__ = true
    const emitSpy = jest.spyOn(Emitter, 'emit')
    const ready = jest.fn()

    render(
      <FlowerProvider>
        <Flower name="navigation-test">
          <FlowerNode id="start" to={{ next: null }}>
            <HookConsumer onReady={ready} />
          </FlowerNode>
          <FlowerNode id="next">
            <span data-testid="next-node">Next node</span>
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await waitFor(() => expect(ready).toHaveBeenCalled())

    expect(screen.getByTestId('current-node')).toHaveTextContent('start')
    expect(emitSpy).toHaveBeenCalled()

    emitSpy.mockRestore()
  })
})
