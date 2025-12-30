import React from 'react'
import {
  Flower,
  FlowerNavigate,
  FlowerNode,
  FlowerField
} from '@flowerforce/flower-react'
import { CodeSnippet } from '../components/CodeSnippet'

const baseFlowCode = `
<Flower name="story-base">
  <FlowerNode id="start" to={{ stepTwo: null }}>
    <FlowerNavigate action="next">
      <button>Avanti</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerNode id="stepTwo" to={{ final: null }}>
    <FlowerNavigate action="back">
      <button>Indietro</button>
    </FlowerNavigate>
    <FlowerNavigate action="next">
      <button>Vai a fine</button>
    </FlowerNavigate>
  </FlowerNode>

  <FlowerNode id="final">
    <FlowerNavigate action="reset">
      <button>Reset</button>
    </FlowerNavigate>
  </FlowerNode>
</Flower>
`

const rulesFlowCode = `
<Flower name="rules-flow">
  <FlowerNode id="start" to={{
    skip: { rules: { $and: [{ skipStep2: { $eq: true } }] } },
    default: null
  }}>
    <FlowerField id="skipStep2">
      {({ value, onChange }) => (
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
      )}
    </FlowerField>
  </FlowerNode>

  <FlowerNode id="skip">...</FlowerNode>
  <FlowerNode id="default">...</FlowerNode>
</Flower>
`

export default {
  title: 'Flower/Flows'
}

export const BaseFlow = () => (
  <div>
    <Flower name="story-base">
      <FlowerNode id="start" to={{ stepTwo: null }}>
        <h3>Base Flow</h3>
        <p>Passaggi sequenziali semplici.</p>
        <FlowerNavigate action="next">
          <button>Avanti</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="stepTwo" to={{ final: null }}>
        <h3>Secondo passaggio</h3>
        <FlowerNavigate action="back">
          <button>Indietro</button>
        </FlowerNavigate>
        <FlowerNavigate action="next">
          <button>Vai avanti</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="final">
        <h3>Fine del flow</h3>
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice base" code={baseFlowCode} />
  </div>
)

export const RulesFlow = () => (
  <div>
    <Flower name="rules-flow">
      <FlowerNode
        id="start"
        to={{
          skip: {
            rules: { $and: [{ skipStep2: { $eq: true } }] }
          },
          default: null
        }}
      >
        <h3>Flow con regole</h3>
        <FlowerField id="skipStep2">
          {({ value = false, onChange }) => (
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
              />
              Salta il nodo secondario
            </label>
          )}
        </FlowerField>
        <FlowerNavigate action="next">
          <button>Valuta regola</button>
        </FlowerNavigate>
      </FlowerNode>

      <FlowerNode id="skip">
        <h4>Nodo skip</h4>
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
      <FlowerNode id="default">
        <h4>Nodo default</h4>
        <FlowerNavigate action="reset">
          <button>Reset</button>
        </FlowerNavigate>
      </FlowerNode>
    </Flower>
    <CodeSnippet title="Codice flow con regole" code={rulesFlowCode} />
  </div>
)
