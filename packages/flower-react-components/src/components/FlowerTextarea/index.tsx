import React from 'react';
import { FlowerField, FlowerFieldProps } from '@flowerforce/flower-react'


type Props = {
  id: string
  label?: string
  caption?: string
} & Omit<FlowerFieldProps, "children">

export const FlowerTextarea = ({ id, validate, label, caption, rules, alwaysDisplay, ...props }: Props) => {
  return (
    <FlowerField id={id} validate={validate} alwaysDisplay={alwaysDisplay} rules={rules}>
      {({ errors, value = '', onChange, onBlur, isTouched }) => (
        null
      )}
    </FlowerField>
  )
}
