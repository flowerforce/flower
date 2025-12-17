/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'

import FlowerAction from '../components/FlowerAction'
import FlowerNode from '../components/FlowerNode'

describe('Flower node lifecycle', () => {
  it('invokes onEnter and onExit inside FlowerNode', () => {
    const onEnter = jest.fn()
    const onExit = jest.fn()

    const { unmount } = render(
      <FlowerNode id="node" onEnter={onEnter} onExit={onExit}>
        <div>content</div>
      </FlowerNode>
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    unmount()
    expect(onExit).toHaveBeenCalledTimes(1)
  })

  it('invokes onEnter and onExit inside FlowerAction', () => {
    const onEnter = jest.fn()
    const onExit = jest.fn()

    const { unmount } = render(
      <FlowerAction id="action" onEnter={onEnter} onExit={onExit}>
        <div>action</div>
      </FlowerAction>
    )

    expect(onEnter).toHaveBeenCalledTimes(1)
    unmount()
    expect(onExit).toHaveBeenCalledTimes(1)
  })
})
