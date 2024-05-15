import Flower, {
  FlowerAction,
  FlowerNavigate,
  FlowerNode,
  useFlower,
} from '@flowerforce/flower-react'
import { memo, useEffect, useState } from 'react'
import './styles.css'

const ComponentAction = memo(({ setCounter }: { setCounter: React.Dispatch<React.SetStateAction<number>>}) => {
  const { onNext } = useFlower()

  useEffect(() => {
    // * do your staff here - api call etc **
    setCounter((state) => state + 1)

    // setTimeout only for simulate delay
    setTimeout(() => {
      // * then next to Success step **
      onNext('onSuccess')
    }, 500)
  }, [onNext, setCounter])

  return <span className="loader"></span>
})

export function Example6() {
  const [counter, setCounter] = useState(0)

  return (
    <Flower name="example6">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <div>Action invoked: {counter}</div>
          <FlowerNavigate action="onNext">
            <button>Next &#8594;</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerAction id="step2" to={{ success: 'onSuccess', error: 'onError' }}>
        <div className="page step2">
          <ComponentAction setCounter={setCounter} />
        </div>
      </FlowerAction>

      {/**
       * step 3
       */}
      <FlowerNode id="success">
        <div className="page step3">
          <span>Success</span>
          <div>Action invoked: {counter}</div>
          <FlowerNavigate action="onPrev">
            <button>&#8592; Prev</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 4
       */}
      <FlowerNode id="error">
        <div className="page step4">
          <span>Error</span>
          <FlowerNavigate action="onReset">
            <button>Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
