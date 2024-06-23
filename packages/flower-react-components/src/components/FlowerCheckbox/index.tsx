import React from 'react';
import { FlowerField, FlowerFieldProps } from '@flowerforce/flower-react'

type option = { value: string; label: string }

type Props = {
    value?: string[]
    options: option[]
    placeholder?: string
    label?: string
    caption?: string
} & Omit<FlowerFieldProps, "children">

export const FlowerCheckbox = ({
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
