import {
  Flower,
  FlowerRule,
  FlowerNode,
  FlowerField,
  FlowerNavigate
} from '@flowerforce/flower-react'
import './styles.css'

export function Example8() {
  return (
    <Flower name="example8">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <div className="navigate">
            <label htmlFor="checkbox">Show message</label>
            <FlowerField id="enableMessage">
              {({ onChange, value }) => (
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            </FlowerField>
          </div>
          <FlowerRule rules={{ enableMessage: { $eq: true } }}>
            <p>This is your message</p>
          </FlowerRule>
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
      <FlowerNode id="step2" to={{ step3: null }}>
        <div className="page step2">
          <span>2</span>
          <FlowerNavigate action="back">
            <button>&#8592; Back</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
