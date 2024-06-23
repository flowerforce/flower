import React from 'react';
import { FlowerField, FlowerFieldProps } from '@flowerforce/flower-react'

type Props = {
  id: string
  placeholder?: string
  label?: string
  caption?: string
} & FlowerFieldProps

export const FlowerInput = ({ id, validate, placeholder, label, caption, rules, children, alwaysDisplay, ...props }: Props) => {
  return (
    <FlowerField id={id} validate={validate} alwaysDisplay={alwaysDisplay} rules={rules}>
      {({ errors, value = '', onChange, onBlur, isTouched }) => (
        null
      )}
    </FlowerField>
  )
}