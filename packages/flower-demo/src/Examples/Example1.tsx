import Flower, { FlowerNavigate, FlowerNode } from '@flowerforce/flower-react'
import './styles.css'
import { FlowerCoreReducers } from '@flowerforce/flower-core'

export function Example1() {
  return (
    <Flower name="example1">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <FlowerNavigate action="onNext">
            <button>Next &#8594;</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step 2
       */}
      <FlowerNode id="step2" to={{ step3: null }}>
        <div className="page step2">
          <span>2</span>
          <div className="navigate">
            <FlowerNavigate action="onPrev">
              <button>&#8592; Back</button>
            </FlowerNavigate>
            <FlowerNavigate action="onNext">
              <button>Next &#8594;</button>
            </FlowerNavigate>
          </div>
        </div>
      </FlowerNode>

      {/**
       * step 3
       */}
      <FlowerNode id="step3">
        <div className="page step3">
          <span>3</span>
          <FlowerNavigate action="onReset">
            <button>Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
