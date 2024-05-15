import Flower, { FlowerNode, useFlower } from '@flowerforce/flower-react'
import './styles.css'

export function Example2() {
  // useFlower need to know context passing flowName
  const { onNext, onPrev } = useFlower({ flowName: 'demo' })

  return (
    <Flower name="example2">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <button onClick={() => onNext()}>Next &#8594;</button>
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerNode id="step2" to={{ step3: null }}>
        <div className="page step2">
          <span>2</span>
          <div className="navigate">
            <button onClick={() => onPrev()}>&#8592; Back</button>
            <button onClick={() => onNext()}>Next &#8594;</button>
          </div>
        </div>
      </FlowerNode>

      {/**
       * step 3
       */}
      <FlowerNode id="step3">
        <div className="page step3">
          <span>3</span>
          <button onClick={() => onPrev()}>&#8592; Back</button>
        </div>
      </FlowerNode>
    </Flower>
  )
}
