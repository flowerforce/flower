import React, { useCallback } from 'react'
import { useFlowerForm, useFlower } from '@flowerforce/flower-react'
import { Button } from 'antd'

export const Form = ({ children }) => {
  const { onNext } = useFlower()
  const { isValid, getData, setData } = useFlowerForm()

  const onSubmit = useCallback(() => {
    setData({ gino: 1 })
    console.log(getData())
    onNext({ isValid })
  }, [isValid, onNext, getData, setData])

  return (
    <form style={{ padding: 30 }}>
      {children}
      <Button type="primary" onClick={onSubmit} /* disabled={!isValid} */>
        LOGIN
      </Button>
    </form>
  )
}
