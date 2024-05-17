import Flower, { FlowerNavigate, FlowerNode } from '@flowerforce/flower-react'
import './styles.css'

export function Example4() {
  return (
    <Flower name="example4" initialData={{ skipStep3: true }}>
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <FlowerNavigate action="next">
            <button>Next &#8594;</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerNode
        id="step2"
        to={{
          step4: { rules: { $and: [{ skipStep3: { $eq: true } }] } },
          step3: null
        }}
      >
        <div className="page step2">
          <span>2</span>
          <div className="navigate">
            <FlowerNavigate action="back">
              <button>&#8592; Back</button>
            </FlowerNavigate>
            <FlowerNavigate action="next">
              <button>Next &#8594;</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>

      {/**
       * step 3
       */}
      <FlowerNode id="step3" to={{ step4: null }}>
        <div className="page step3">
          <span>3</span>
          <FlowerNavigate action="next">
            <button>Next &#8594;</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * last step
       */}
      <FlowerNode id="step4">
        <div className="page step4">
          <span>4</span>
          <FlowerNavigate action="back">
            <button>&#8592; Back</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
