import { FlowerField } from '@flowerforce/flower-react'
import { Input as AntInput, Spin } from 'antd'

export const Input = ({
  placeholder,
  title,
  asyncInitialError,
  asyncWaitingError,
  id,
  asyncValidate,
  asyncDebounce
}) => {
  return (
    <FlowerField
      id={id}
      asyncValidate={asyncValidate}
      asyncDebounce={asyncDebounce}
      asyncWaitingError={asyncWaitingError}
      asyncInitialError={asyncInitialError}
    >
      {({ onChange, value, errors, hasError, onBlur, isValidating }) => (
        <>
          <AntInput
            //type='number'
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            status={isValidating ? 'warning' : hasError && 'error'}
            loading={isValidating}
            onBlur={onBlur}
          />
          <label>{title || placeholder}</label>
          {isValidating && <Spin />}
          {errors && errors.join(',')}
        </>
      )}
    </FlowerField>
  )
}
