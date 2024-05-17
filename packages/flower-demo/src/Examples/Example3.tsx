import Flower, { FlowerNavigate, FlowerNode } from '@flowerforce/flower-react'
import './styles.css'

export function Example3() {
  return (
    <Flower name="example3">
      {/**
       * step 1
       */}
      <FlowerNode
        id="step1"
        to={{ stepOK: 'onSuccess', stepKO: 'onError', step: null }}
      >
        <div className="page step1">
          <span>Choose route</span>
          <div className="navigate">
            <FlowerNavigate action="next" route="onSuccess">
              <button className="success">Success &#8594;</button>
            </FlowerNavigate>
            <FlowerNavigate action="next" route="onError">
              <button className="error">Error &#8594;</button>
            </FlowerNavigate>
          </div>
          <FlowerNavigate action="next">
            <button>Next &#8594;</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step OK
       */}
      <FlowerNode id="stepOK">
        <div className="page step2">
          <span>OK</span>
          <FlowerNavigate action="back">
            <button>&#8592; Back</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step KO
       */}
      <FlowerNode id="stepKO">
        <div className="page step3">
          <span>KO</span>
          <FlowerNavigate action="back">
            <button>&#8592; Back</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>

      {/**
       * step Default
       */}
      <FlowerNode id="step">
        <div className="page step4">
          <span>step</span>
          <FlowerNavigate action="back">
            <button>&#8592; Back</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
