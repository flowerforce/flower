import { memo } from 'react'

const TextCmp = ({
  value,
  text,
  children,
}) => {
  return (
    <span>
      {JSON.stringify(value || text || children)}
    </span>
  )
}

export const Text = memo(TextCmp)

/*
// flower
type: component
name: Text
category: UI
example:
  type: Text
  text: testo
editing:
- type: Input
  id: id
  label: Value
- type: Input
  id: text
  label: Testo
- type: Select
  id: variant
  label: Variant
  options:
  - name: h1
    value: h1
  - name: h2
    value: h2
  - name: h3
    value: h3
  - name: h4
    value: h4
  - name: h5
    value: h5
  - name: h6
    value: h6
  - name: subtitle1
    value: subtitle1
  - name: subtitle2
    value: subtitle2
  - name: body1
    value: body1
  - name: body2
    value: body2
- type: Switch
  id: bold
  label: Bold text
- type: Select
  id: align
  label: align
  options:
  - name: right
    value: right
  - name: center
    value: center
  - name: left
    value: left
- type: Rules
  id: rules
*/