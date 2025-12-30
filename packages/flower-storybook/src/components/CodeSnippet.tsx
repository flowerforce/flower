import React from 'react'

type CodeSnippetProps = {
  title: string
  code: string
}

export const CodeSnippet = ({ title, code }: CodeSnippetProps) => (
  <section style={{ margin: '16px 0', fontFamily: 'monospace', fontSize: 13 }}>
    <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
    <pre
      style={{
        background: '#0d0d0d',
        color: '#f5f5f5',
        padding: 12,
        borderRadius: 6,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.5
      }}
    >
      <code>{code}</code>
    </pre>
  </section>
)
