import React from 'react';
import { FlowerField, FlowerFieldProps } from '@flowerforce/flower-react'


type option = { label: string; value: string }

type Props = {
  value?: any
  options: option[]
  placeholder?: string
  label?: string
  caption?: string
} & Omit<FlowerFieldProps, "children"> 

export const FlowerSelect = ({
  validate,
  id,
  value,
  options = [],
  placeholder,
  rules,
  alwaysDisplay,
  label,
  caption,
  ...props
}: Props) => {
  return (
    <FlowerField id={id} validate={validate} alwaysDisplay={alwaysDisplay} rules={rules}>
      {({ errors, value = [], onChange, onBlur, isTouched }) => (
        null
      )}
    </FlowerField>
  )
}
