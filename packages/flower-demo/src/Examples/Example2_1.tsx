import Flower, { FlowerNode, useFlower } from '@flowerforce/flower-react'
import './styles.css'

const ButtonNext = () => {
  const { next } = useFlower() // useFlower get the context of the parent Flower
  return <button onClick={() => next()}>Next &#8594;</button>
}

const ButtonPrev = () => {
  const { back } = useFlower() // useFlower get the context of the parent Flower
  return <button onClick={() => back()}>&#8592; Back</button>
}

export function Example2v1() {
  return (
    <Flower name="example2v1">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <ButtonNext />
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerNode id="step2" to={{ step3: null }}>
        <div className="page step2">
          <span>2</span>
          <div className="navigate">
            <ButtonPrev />
            <ButtonNext />
          </div>
        </div>
      </FlowerNode>

      {/**
       * step 3
       */}
      <FlowerNode id="step3">
        <div className="page step3">
          <span>3</span>
          <ButtonPrev />
        </div>
      </FlowerNode>
    </Flower>
  )
}
