import React from 'react'
import { memo } from 'react'
import { useFlower } from '@flowerforce/flower-react'

const MyButton = ({ title }) => {
  const { next } = useFlower()
  return (
    <button
      onClick={() => {
        next('onSuccess')
      }}
    >
      {title}
    </button>
  )
}

export const Button = memo(MyButton)
