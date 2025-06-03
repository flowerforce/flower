import { createFlowerApp } from './create-flower-app.js' // assicurati di usare .js se type=module
import prompts from 'prompts'

;(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'App name:'
    },
    {
      type: 'select',
      name: 'flowForm',
      message: 'Choose management type:',
      choices: [
        { title: 'Flow', value: 'flow' },
        { title: 'Form', value: 'form' },
        { title: 'Both', value: 'both' }
      ],
      initial: 0
    },
    {
      type: 'toggle',
      name: 'historySync',
      message: 'Enable sync with browser history?',
      initial: true,
      active: 'yes',
      inactive: 'no',
      // mostra solo se flowForm è flow o both
      on: (prev, values) =>
        values.flowForm === 'flow' || values.flowForm === 'both'
    },
    {
      type: 'toggle',
      name: 'urlChanges',
      message: 'Enable URL changes during navigation?',
      initial: true,
      active: 'yes',
      inactive: 'no',
      // mostra solo se flowForm è flow o both
      on: (prev, values) =>
        values.historySync === true &&
        (values.flowForm === 'flow' || values.flowForm === 'both')
    }
  ])

  await createFlowerApp(response)
})()
