import {
  Flower,
  FlowerField,
  FlowerNavigate,
  FlowerNode,
  FlowerProvider,
  FlowerValue,
  createFlowerStore,
  useSelector
} from '@flowerforce/flower-react'
import './styles.css'

type ExternalState = {
  externalMessage: string
}

const externalFlowerStore = createFlowerStore({
  reducer: {
    external: (state: ExternalState = { externalMessage: '' }) => state
  },
  devTools: { name: 'flower-external-store' }
})

const ExternalControls = () => {
  const message = useSelector((state: any) => state.external?.externalMessage ?? '')

  return (
    <div className="external-message">
      <strong>External reducer value:</strong>{' '}
      <span>{message || 'empty'}</span>
    </div>
  )
}

export function ExampleExternalStore() {
  return (
    <section className="example external-store">
      <FlowerProvider store={externalFlowerStore}>
        <ExternalControls />

        <Flower name="example-external-store">

          <FlowerNode id="intro" to={{
            success: null,
            info: {
              rules: {
                "^external.externalMessage": {
                  $eq: "asd"
                }
              }
            }
          }}>
            <div className="page step1">
              <span>External Store</span>
              <p>Navigation uses the same reducers but a custom store instance.</p>
              <FlowerField id="^external.externalMessage"
                validate={[
                  {
                    rules: { $and: [{ "$self": { $exists: true } }] },
                    message: 'Field is required'
                  }
                ]}>
                {({ value = '', onChange, errors }) => (
                  <>
                    <input
                      type="text"
                      value={value}
                      placeholder="Write something outside of flower"
                      onChange={(event) => onChange(event.target.value)}
                    />
                    {errors && <div className="error">{errors.join(', ')}</div>}
                  </>
                )}
              </FlowerField>
              <FlowerNavigate
                action="next"
                rules={{
                  '^external.externalMessage': {
                    $exists: true
                  }
                }}
              >
                <button>Continue</button>
              </FlowerNavigate>
            </div>
          </FlowerNode>

          <FlowerNode id="success">
            <div className="page step2">
              <span>Success</span>
              <FlowerNavigate action="reset">
                <button>Reset flow</button>
              </FlowerNavigate>
            </div>
          </FlowerNode>

          <FlowerNode id="info">
            <div className="page step2">
              <span>Info</span>
              <FlowerValue id="^external.externalMessage">
                {({ value }) => value}
              </FlowerValue>
              <FlowerNavigate action="reset">
                <button>Reset flow</button>
              </FlowerNavigate>
            </div>
          </FlowerNode>

        </Flower>
      </FlowerProvider>
    </section>
  )
}
