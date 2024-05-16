import React, { useEffect } from 'react'
import { useFlower } from '@flowerforce/flower-react'

const Saga = React.memo(() => {
  const { onNext } = useFlower()

  useEffect(() => {
    console.log('>>>>>')
    //onNext()
  }, [onNext])

  return '...'
})

export default Saga

/*
// flower
type: component
isAction: true
name: Saga
title: Saga
category: utils
editing:
- type: Input
  id: name
  label: Saga name
- type: Input
  id: id
  label: ID source data
- type: Input
  id: reducer
  label: reducer
- type: Input
  id: loaderColor
  default: primary
  label: color loader
output:
  success: bool
  error: text
*/
