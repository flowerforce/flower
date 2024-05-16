import React from 'react'
import { memo } from 'react'
import { useFlower } from '@flowerforce/flower-react'

const MyButton = ({ title }) => {
  const { onNext } = useFlower()
  return (
    <button
      onClick={() => {
        onNext('onSuccess')
      }}
    >
      {title}
    </button>
  )
}

export const Button = memo(MyButton)

/*
// flower
name: MyButton
editing:
- type: Input
  id: id
  label: Value
- type: Input
  id: title
  label: placeholder
- type: Rules
  id: rules
output:
  success: bool
  error: text
*/
