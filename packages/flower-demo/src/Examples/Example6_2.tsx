import {
  Flower,
  FlowerNode,
  FlowerAction,
  FlowerNavigate
} from '@flowerforce/flower-react'
import './styles.css'

export function Example6v2() {
  return (
    <Flower name="example6v2">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }} retain>
        <div className="page auto step1">
          <span>1</span>
          <div className="navigate">
            <FlowerNavigate action="next">
              <button>Next &#8594;</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerAction id="step2" to={{ step3: null }}>
        <div className="page auto step2">
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
      </FlowerAction>

      {/**
       * step 3
       */}
      <FlowerAction id="step3">
        <div className="page auto step3">
          <span>3</span>
          <div className="navigate">
            <FlowerNavigate action="back">
              <button>&#8592; Back</button>
            </FlowerNavigate>
            <FlowerNavigate action="next">
              <button>Next &#8594;</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerAction>
    </Flower>
  )
}
