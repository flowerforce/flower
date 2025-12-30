import React from 'react'
import type { Preview } from '@storybook/react'
import { FlowerProvider } from '@flowerforce/flower-react'

const preview: Preview = {
  decorators: [
    (Story) => (
      <FlowerProvider>
        <div style={{ padding: 24, fontFamily: 'system-ui' }}>
          <Story />
        </div>
      </FlowerProvider>
    )
  ],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

export default preview
