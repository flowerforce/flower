import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import WrapperComponent from '../WrapperComponent'

const ForwardComponent = React.forwardRef<HTMLButtonElement, any>(
  (props, ref) => (
    <button ref={ref} type="button" {...props}>
      fallback
    </button>
  )
)

describe('WrapperComponent fallback branch', () => {
  it('renders the forwarded component when Component is not a function', () => {
    const onNavigate = jest.fn()

    render(
      <WrapperComponent
        Component={ForwardComponent}
        onNavigate={onNavigate}
        hidden
        data-testid="fallback-button"
      />
    )

    const button = screen.getByTestId('fallback-button')

    expect(button).toHaveTextContent('fallback')
    expect(button.hidden).toBe(true)

    fireEvent.click(button)
    expect(onNavigate).toHaveBeenCalled()
  })
})
