import { Flower, FlowerNode, FlowerNavigate } from '@flowerforce/flower-react'
import { FlowerField } from '@flowerforce/flower-form'

import './styles.css'
import { FlowerRule } from '@flowerforce/flower-react-shared'

export function Example7() {
  return (
    <Flower name="example7">
      {/**
       * step 1
       */}
      <FlowerNode id="step1" to={{ step2: null }}>
        <div className="page step1">
          <span>1</span>
          <div className="navigate">
            <label htmlFor="checkbox">Enable Buttons</label>
            <FlowerField id="enableNav">
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
          {/**
           * show / hidden based on rule
           */}
          <FlowerRule rules={{ enableNav: { $eq: true } }}>
            <p>Buttons nav are enabled</p>
          </FlowerRule>
          <div className="navigate">
            {/**
             * always visible component, hidden prop is true when rule is not matched
             */}
            <FlowerNavigate
              action="next"
              rules={{ enableNav: { $eq: true } }}
              alwaysDisplay
            >
              {({ onClick, hidden }) => (
                <button disabled={hidden} onClick={onClick}>
                  Next &#8594;
                </button>
              )}
            </FlowerNavigate>
            {/**
             * visible only when rule is matched
             */}
            <FlowerNavigate action="next" rules={{ enableNav: { $eq: true } }}>
              <button>Next (hidden) &#8594;</button>
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
