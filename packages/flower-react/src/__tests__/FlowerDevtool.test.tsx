/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import Flower from '../components/Flower'
import FlowerNode from '../components/FlowerNode'
import FlowerNavigate from '../components/FlowerNavigate'
import FlowerProvider from '../provider'
import { Emitter, devtoolState } from '@flowerforce/flower-core'

const Text = ({ text, testId }: { text: string; testId: string }) => (
  <h1 data-testid={testId}>{text}</h1>
)

describe('Flower devtool integration', () => {
  const originalDevtool = devtoolState.__FLOWER_DEVTOOLS__
  const originalInitialized = devtoolState.__FLOWER_DEVTOOLS_INITIALIZED__

  beforeEach(() => {
    devtoolState.__FLOWER_DEVTOOLS__ = true
    devtoolState.__FLOWER_DEVTOOLS_INITIALIZED__ = false
  })

  afterEach(() => {
    devtoolState.__FLOWER_DEVTOOLS__ = originalDevtool
    devtoolState.__FLOWER_DEVTOOLS_INITIALIZED__ = originalInitialized
  })

  it('emits client events when devtools are active and navigation occurs', async () => {
    const emitSpy = jest.spyOn(Emitter, 'emit')

    render(
      <FlowerProvider>
        <Flower name="devtool-flow">
          <FlowerNode id="start" to={{ next: null }}>
            <Text text="start" testId="start-step" />
            <FlowerNavigate action="jump" node="next">
              <button data-testid="btn-next">NEXT</button>
            </FlowerNavigate>
          </FlowerNode>
          <FlowerNode id="next">
            <Text text="next" testId="next-step" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    Emitter.emit('flower-devtool-to-client', {
      source: 'flower-devtool',
      action: 'FLOWER_DEVTOOL_WEB_INIT'
    })
    Emitter.emit('flower-devtool-to-client', {
      source: 'flower-devtool',
      action: 'FLOWER_EXTENSION_INIT'
    })
    Emitter.emit('flower-devtool-to-client', {
      source: 'flower-devtool',
      action: 'SELECTED_NODE',
      name: 'devtool-flow',
      id: 'start'
    })
    Emitter.emit('flower-devtool-to-client', {
      source: 'flower-devtool',
      action: 'REPLACE_DATA',
      name: 'devtool-flow',
      data: { replaced: true }
    })
    Emitter.emit('flower-devtool-to-client', {
      source: 'flower-devtool',
      action: 'ADD_DATA',
      name: 'devtool-flow',
      data: { extra: true }
    })

    fireEvent.click(screen.getByTestId('btn-next'))

    await waitFor(() =>
      expect(screen.getByTestId('next-step')).toHaveTextContent('next')
    )

    await waitFor(() => {
      const events = emitSpy.mock.calls.filter(
        ([eventName]) => eventName === 'flower-devtool-from-client'
      )
      const actions = events.map(([, payload]) => payload.action)
      expect(actions).toEqual(
        expect.arrayContaining([
          'FLOWER_CLIENT_INIT',
          'SET_HISTORY',
          'SET_CURRENT',
          'SET_SELECTED'
        ])
      )
    })

    emitSpy.mockRestore()
  })

  it('emits FLOWER_NAVIGATE when the current node is disabled', async () => {
    const emitSpy = jest.spyOn(Emitter, 'emit')

    devtoolState.__FLOWER_DEVTOOLS_INITIALIZED__ = true

    render(
      <FlowerProvider>
        <Flower name="disabled-flow">
          <FlowerNode id="start" disabled to={{ next: null }}>
            <Text text="start" testId="start-disabled" />
            <FlowerNavigate action="next" route="next">
              <button data-testid="btn-next-disabled">NEXT</button>
            </FlowerNavigate>
          </FlowerNode>
          <FlowerNode id="next">
            <Text text="next" testId="next-disabled" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    await waitFor(() => {
      const events = emitSpy.mock.calls.filter(
        ([eventName]) => eventName === 'flower-devtool-from-client'
      )
      return events.some(([, payload]) => payload.action === 'FLOWER_NAVIGATE')
    })

    emitSpy.mockRestore()
  })

  it('registers and unregisters devtool listeners on mount', () => {
    const onSpy = jest.spyOn(Emitter, 'on')
    const offSpy = jest.spyOn(Emitter, 'off')

    const { unmount } = render(
      <FlowerProvider>
        <Flower name="listener-flow">
          <FlowerNode id="start">
            <Text text="start" testId="start-node" />
          </FlowerNode>
        </Flower>
      </FlowerProvider>
    )

    expect(onSpy).toHaveBeenCalledWith(
      'flower-devtool-to-client',
      expect.any(Function)
    )

    unmount()

    expect(offSpy).toHaveBeenCalledWith(
      'flower-devtool-to-client',
      expect.any(Function)
    )
    expect(offSpy.mock.calls[0][1]).toBe(onSpy.mock.calls[0][1])

    onSpy.mockRestore()
    offSpy.mockRestore()
  })
})
