import {
  FlowerProvider,
  Flower,
  FlowerNode,
  FlowerNavigate,
  useFlower,
  FlowerAction
} from '@flowerforce/flower-react'
import { useFlowerForm } from '@flowerforce/flower-react-form'
import { useEffect } from 'react'
const Text = ({
  text,
  value
}: {
  text?: string
  value?: any
  id?: any
  children?: any
}) => {
  return <h1 data-testid="h1">{text || value}</h1>
}

const InitState = ({ state }: any) => {
  const { next } = useFlower()
  const { setData } = useFlowerForm()
  useEffect(() => {
    setData(state)
    next()
  }, [next, setData, state])
  return '...'
}

const ButtonNext = ({ route, dataIn }: any) => {
  return (
    <FlowerNavigate action="next" route={dataIn || route}>
      <button data-testid="btn-next">NEXT</button>
    </FlowerNavigate>
  )
}
export const FlowerNavigateTest = () => {
  return (
    <FlowerProvider>
    <Flower name="app-test4">
      <FlowerNode id="start" to={{ a: null }}>
        <InitState state={{ name: 'aaaa' }} />
      </FlowerNode>
      <FlowerNode
        id="a"
        retain={true}
        disabled={true}
        to={{
          b: null
        }}
      >
        <Text text="form screen"></Text>
        <ButtonNext />
      </FlowerNode>
      <FlowerAction
        id="b"
        to={{
          d: null
        }}
      >
        <Text text="zucca" />
        <ButtonNext />
      </FlowerAction>
      <FlowerAction id="d">
        <Text text="value from state" />
      </FlowerAction>
    </Flower>
  </FlowerProvider>
  )
}
