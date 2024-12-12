import React, { memo, useEffect, useRef, PropsWithChildren } from 'react'
import { FormProvider } from '../context/formcontext'
import { useDispatch } from '../provider'

type FlowerClientProps = PropsWithChildren & {
  name: string
  destroyOnUnmount?: boolean
  initialState?: Record<string, unknown>
}

/**
 * FlowerFormClient
 */
const FlowerFormClient = ({
  children,
  name,
  destroyOnUnmount = true,
  initialState = {}
}: FlowerClientProps) => {
  const formName = name

  const dispatch = useDispatch()
  const one = useRef(false)

  useEffect(
    () => () => {
      // unmount function
      if (destroyOnUnmount && one.current === true) {
        one.current = false
        // dispatch(flowerActions.destroy({ name: formName })) // TODO: Reset form
      }
    },
    [dispatch, formName, destroyOnUnmount]
  )

  return (
    <FormProvider value={{ formName, initialData: initialState }}>
      {children}
    </FormProvider>
  )
}

export default memo(FlowerFormClient)
