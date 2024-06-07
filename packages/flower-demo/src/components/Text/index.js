import { memo } from 'react'

const TextCmp = ({ value, text, children }) => {
  return <span>{JSON.stringify(value || text || children)}</span>
}

export const Text = memo(TextCmp)
