import React from 'react'
import { FlowerValue } from '@flowerforce/flower-react'
import { FlowerRule } from '@flowerforce/flower-react'
import { FlowerField } from '@flowerforce/flower-react'

export default ({ name }) => {
  return (
    <div>
      AAAA {name}
      <FlowerComponent name="Step3">
        <FlowerValue id="asd asdasdasdsa" />
      </FlowerComponent>
    </div>
  )
}
