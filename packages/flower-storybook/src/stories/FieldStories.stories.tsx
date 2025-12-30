import React from 'react'
import {
  Flower,
  FlowerNavigate,
  FlowerNode,
  FlowerField,
  FlowerRule,
  FlowerValue
} from '@flowerforce/flower-react'
import { CodeSnippet } from '../components/CodeSnippet'

const fieldFlowCode = `
<Flower name="field-flow">
  <FlowerNode id="form" to={{ summary: null }}>
    <FlowerField id="profile.email">
      {({ value, onChange }) => (
        <input placeholder="Email" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </FlowerField>
    <FlowerRule rules={{ profile: { $exists: true } }}>
      <p>Email inserita</p>
    </FlowerRule>
  </FlowerNode>

  <FlowerNode id="summary">
    <FlowerValue id="profile.email">{({ value }) => <p>Email: {value}</p>}</FlowerValue>
  </FlowerNode>
</Flower>
`

export default {
  title: 'Flower/Fields'
}

export const FieldFlow = () => (
  <div>
    <Flower name="field-flow">
      <FlowerNode id="form" to={{ summary: null }}>
        <h3>Forms e validazione</h3>
        <FlowerField id="profile.email">
          {({ value = '', onChange }) => (
            <input
              style={{ marginBottom: 16, display: 'block' }}
              placeholder="Email"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </FlowerField>
        <FlowerRule rules={{ profile: { $exists: true } }}>
          <p style={{ color: '#0a0' }}>Il campo è compilato.</p>
        </FlowerRule>
        <FlowerNavigate action="next">
          <button>Vai al riepilogo</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="summary">
        <h4>Riepilogo</h4>
        <FlowerValue id="profile.email">
          {({ value }) => <p>Email salvata: {value}</p>}
        </FlowerValue>
        <FlowerNavigate action="reset">
          <button>Reset flow</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice FlowerField e FlowerRule" code={fieldFlowCode} />
  </div>
)
