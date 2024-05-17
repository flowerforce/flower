import Flower, {
  FlowerNavigate,
  FlowerField,
  FlowerNode,
  FlowerValue
} from '@flowerforce/flower-react'
import './styles.css'

export function Example5() {
  return (
    <Flower name="example5">
      {/**
       * step 1
       */}
      <FlowerNode
        id="step1"
        to={{
          step3: {
            label: 'Go to step3 if skipStep2 is checked',
            rules: { $and: [{ skipStep2: { $eq: true } }] }
          },
          step2: null
        }}
      >
        <div className="page step1">
          <span>1</span>
          <div className="navigate">
            <label htmlFor="checkbox">Skip step 2</label>
            <FlowerField id="skipStep2">
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
          <FlowerNavigate action="next">
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
          <FlowerValue id="skipStep2">
            {({ value }) => (
              <label>
                <strong>skipStep2</strong>: {String(!!value)}
              </label>
            )}
          </FlowerValue>
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
      <FlowerNode id="step3">
        <div className="page step3">
          <span>3</span>
          <FlowerValue id="skipStep2">
            {({ value }) => (
              <label>
                <strong>skipStep2</strong>: {String(!!value)}
              </label>
            )}
          </FlowerValue>
          <FlowerNavigate action="reset">
            <button>Reset</button>
          </FlowerNavigate>
        </div>
      </FlowerNode>
    </Flower>
  )
}
