import React, { memo, useEffect, useRef, PropsWithChildren } from 'react'
import { flowerDataActions, useDispatch } from '@flowerforce/flower-react-store'
import { FlowerReactProvider } from '@flowerforce/flower-react-context'

type FlowerClientProps = PropsWithChildren<{
  name: string
  destroyOnUnmount?: boolean
  initialState?: Record<string, unknown>
}>

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
  useEffect(() => {
    if (initialState && one.current === false) {
      one.current = true
      dispatch(
        flowerDataActions.initForm({
          formName,
          initialData: initialState
        })
      )
    }
  }, [dispatch, destroyOnUnmount, initialState, formName])

  return (
    <FlowerReactProvider value={{ name: formName, initialData: initialState }}>
      {children}
    </FlowerReactProvider>
  )
}

export const FlowerForm = memo(FlowerFormClient) as typeof FlowerFormClient
