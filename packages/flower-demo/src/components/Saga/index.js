import React, { useEffect } from 'react'
import { useFlower } from '@flowerforce/flower-react'

const Saga = React.memo(() => {
  const { next } = useFlower()

  useEffect(() => {
    console.log('>>>>>')
    next()
  }, [next])

  return '...'
})

export default Saga
