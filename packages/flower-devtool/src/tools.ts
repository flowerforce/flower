import omit from 'lodash/omit'
import set from 'lodash/set'

import { record } from 'rrweb'
import { Emitter, devtoolState } from '@flowerforce/flower-core'
import { screenshot } from './screenshot'

const cleanStore = (state = {}, omitStateKeys: string[]) =>
  Object.entries(state).reduce(
    (acc, [k, v]: Array<any>) => ({
      ...acc,
      [k]: {
        current: v.current,
        form: v.form,
        history: v.history,
        startId: v.startId,
        data: omit(v.data, omitStateKeys)
      }
    }),
    {}
  )

export const customLog = (name: string, payload: any) => {
  Emitter.emit('flower-devtool-from-client', {
    source: 'flower-client',
    action: 'FLOWER_LOG',
    time: new Date(),
    name,
    payload
  })
}

function makeid(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

let collectedActions: any[] = []
let stopFn: any

type DeltoolsProps = {
  port?: number
  host?: string
  auto?: boolean
  omitStateKeys?: string[]
  sourceMap?: Record<string, any> | string
  mainFlow?: any
  sessionId?: string
}

export default function Devtool({
  port = 8770,
  host = 'localhost',
  auto = false,
  omitStateKeys = [],
  sourceMap,
  mainFlow,
  sessionId: customSessionId
}: DeltoolsProps) {
  set(devtoolState, ['__FLOWER_DEVTOOLS__'], true)

  if (auto) {
    set(devtoolState, ['__FLOWER_DEVTOOLS__AUTO'], true)
  }

  const sessionId = sourceMap && (customSessionId || makeid(20))

  const uri = sessionId
    ? `https://web.flower.stackhouse.dev/#/remote/${sessionId}`
    : `open vscode ${port}`

  const pathWs = sessionId
    ? `wss://remote.flower.stackhouse.dev/${sessionId}`
    : `ws://${host}:${port}`

  const ws = new WebSocket(pathWs)
  let intervalSM: any | null = null
  let enableScreenshot = false

  let getState = () => ({ flower: {} })

  ws.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('FlowerDevtool connected', uri, sessionId)

    const onMessage = ({ data }: { data: string }) => {
      const msg = JSON.parse(data)

      if (msg.source !== 'flower-devtool') return

      if (msg.action === 'FLOWER_DEVTOOL_DELAY') {
        set(devtoolState, ['__FLOWER_DEVTOOLS__DELAY'], msg.state)
      }

      if (msg.action === 'START_RECORDING_TEST') {
        if (stopFn) return
        collectedActions = []
        stopFn = record({
          emit(event) {
            if (!getState?.()?.flower) return
            // push event into the events array
            const flowerHistory = Object.entries(getState?.()?.flower).reduce(
              (acc, [key, value]: Array<any>) => ({
                ...acc,
                [key]: value?.history
              }),
              {}
            )
            collectedActions.push({ ...event, flowerHistory })
          },
          sampling: {
            input: 'last'
          }
        })
      }

      if (msg.action === 'STOP_RECORDING_TEST') {
        stopFn?.()
        stopFn = undefined
        ws.send(
          JSON.stringify({
            source: 'flower-client',
            action: 'TEST_DATA',
            payload: collectedActions
          })
        )
        collectedActions = []
      }

      if (msg.action === 'FLOWER_EXTENSION_INIT') {
        set(devtoolState, ['__FLOWER_DEVTOOLS_INITIALIZED__'], true)
        ws.send(
          JSON.stringify({
            from: 'flower-devtool-from-client',
            action: 'INIT_CLIENT'
          })
        )
      }

      if (msg.action === 'FLOWER_DEVTOOL_WEB_INIT') {
        set(devtoolState, ['__FLOWER_DEVTOOLS_INITIALIZED__'], true)
        enableScreenshot = !!msg.enableScreenshot
        ws.send(
          JSON.stringify({
            from: 'flower-devtool-from-client',
            action: 'INIT_CLIENT',
            pathWs,
            sessionId
          })
        )
      }
      Emitter.emit('flower-devtool-to-client', msg)
    }

    ws.addEventListener('message', onMessage)

    // send crypted flow for debug
    if (sourceMap) {
      intervalSM = setInterval(() => {
        ws.send(
          JSON.stringify({
            action: 'FLOWER_SOURCE_MAP',
            sourceMap,
            mainFlow,
            sessionId
          })
        )
      }, 1000)
    }

    Emitter.on('flower-devtool-from-client', async (msg: any) => {
      if (msg.action === 'FLOWER_CLIENT_INIT') {
        getState = msg.getState
      }

      if (
        msg.action === 'SET_SELECTED' ||
        msg.action === 'FLOWER_CLIENT_INIT' ||
        msg.action === 'FLOWER_NAVIGATE' ||
        msg.action === 'FLOWER_LOG'
      ) {
        const obj = {
          ...msg,
          sessionId,
          state: cleanStore(getState?.()?.flower ?? {}, omitStateKeys) ?? {}
        }
        ws.send(JSON.stringify(obj))

        if (
          enableScreenshot &&
          (msg.action === 'SET_SELECTED' || msg.action === 'FLOWER_CLIENT_INIT')
        ) {
          const screen = await screenshot()
          if (screen) {
            const objs = {
              ...msg,
              action: 'FLOWER_SCREEN',
              sessionId,
              screen
            }
            ws.send(JSON.stringify(objs))
          }
        }

        return
      }
      ws.send(JSON.stringify({ ...msg, sessionId }))
    })
  }

  ws.onclose = () => {
    if (intervalSM) {
      clearInterval(intervalSM)
    }
  }
}
