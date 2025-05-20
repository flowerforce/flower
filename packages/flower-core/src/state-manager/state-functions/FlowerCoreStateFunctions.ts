import _set from 'lodash/set'
import _get from 'lodash/get'
import _last from 'lodash/last'
import _slice from 'lodash/slice'
import _cloneDeep from 'lodash/cloneDeep'
import lastIndexOf from 'lodash/lastIndexOf'
import { CoreUtils } from '../../utils/FlowerCoreUtils'
import { CoreReducersFunctions } from '../../interfaces/ReducerInterface'
import { FlowerStateUtils } from '../../utils/FlowerCoreStateUtils'
import { devtoolState } from '../../constants'

const {
  generateNodes,
  hasNode,
  makeObjectRules,
  generateRulesName,
  findValidRule
} = CoreUtils

/**
 * These functions are Redux reducers used in a Flux architecture for managing state transitions and updates in a Flower application.
 */
export const FlowerCoreBaseReducers: CoreReducersFunctions = {
  historyAdd: (state, { payload }) => {
    if (hasNode(state, payload.name, payload.node)) {
      state[payload.name].history.push(payload.node)
      _set(state, [payload.name, 'current'], payload.node)
    }
    return state
  },
  historyPrevToNode: (state, { payload }) => {
    const history = _get(
      state[typeof payload === 'string' ? payload : payload.name],
      ['history'],
      []
    )
    const lastIndex = lastIndexOf(
      history,
      typeof payload === 'string' ? payload : payload.node
    )
    // se passo un nodo che non esiste
    if (lastIndex >= 0) {
      const newHistory = _slice(history, 0, lastIndex + 1)
      _set(
        state,
        [typeof payload === 'string' ? payload : payload.name, 'history'],
        newHistory
      )
      _set(
        state,
        [typeof payload === 'string' ? payload : payload.name, 'current'],
        typeof payload === 'string' ? payload : payload.node
      )
    }
    return state
  },
  // TODO check internal logic and use case
  /* istanbul ignore next */
  forceAddHistory: (state, { payload }) => {
    const { name, flowName, history } = payload

    const key = name || flowName || ''
    const resultHistory = history.slice(1, -1)

    state[key].history.push(...resultHistory)
    return state
  },

  historyPop: (state, { payload }) => {
    const container = _get(state, [payload.name])
    const startId = _get(container, ['startId'])
    const history = _get(container, ['history'])
    const originHistory = [..._get(container, ['history'], [])]

    if (originHistory.length < 2) {
      _set(state, [payload.name, 'current'], startId)
      _set(state, [payload.name, 'history'], [startId])
      return state
    }

    // elimino lo node corrente
    history.pop()

    const total = originHistory.length - 2

    // eslint-disable-next-line no-plusplus
    for (let index = total; index > 0; index--) {
      const curr = originHistory[index]
      const nodeType = _get(container, ['nodes', curr, 'nodeType'])
      const nodeDisabled = _get(container, ['nodes', curr, 'disabled'])

      if (
        nodeDisabled ||
        nodeType === 'FlowerAction' ||
        nodeType === 'FlowerServer' ||
        !nodeType
      ) {
        history.pop()
      } else {
        break
      }
    }

    const lastId = _last(history)
    _set(state, [payload.name, 'current'], lastId)
    return state
  },

  restoreHistory: (state, { payload }) => {
    const startId = _get(state, [payload.name, 'startId'])
    _set(state, [payload.name, 'current'], startId)
    _set(state, [payload.name, 'history'], [startId])
    return state
  },

  replaceNode: (state, { payload }) => {
    const { name, flowName, node } = payload
    // non ancora implementanto nell'hook useFlower
    /* istanbul ignore next */
    if (hasNode(state, name || flowName || '', node)) {
      _set(state, [name || flowName || '', 'current'], node)
      _set(state, [name || flowName || '', 'history'], [node])
    }
    /* istanbul ignore next */
    return state
  },

  /* istanbul ignore next */
  initializeFromNode: (state, { payload }) => {
    const { name, flowName, node } = payload
    if (hasNode(state, name || flowName || '', node)) {
      _set(state, [name || flowName || '', 'startId'], node)
      _set(state, [name || flowName || '', 'current'], node)
      _set(state, [name || flowName || '', 'history'], [node])
    }
    return state
  },

  /* istanbul ignore next */
  forceResetHistory: (state, { payload }) => {
    const { name, flowName } = payload
    if (!name && !flowName) return state
    _set(state, [name || flowName || '', 'history'], [])
    return state
  },

  destroy: (state, { payload }) => {
    delete state[payload.name]
    return state
  },
  initNodes: (state, { payload }) => {
    if (payload.persist && _get(state, [payload.name, 'persist'])) return

    const startId =
      payload.startId ||
      _get(payload, 'initialState.startId') ||
      _get(payload, 'nodes.0.nodeId')

    // TODO non verificato, controllo precendente che non lo permette
    /* istanbul ignore next */
    if (!startId) {
      // eslint-disable-next-line no-console
      console.warn('Flower is empty')
      return
    }

    const current = _get(payload, 'initialState.current') || startId
    const history = _get(payload, 'initialState.history') || [startId]

    _set(state, payload.name, {
      persist: payload.persist,
      startId,
      current,
      history,
      nodes: generateNodes(payload.nodes),
      nextRules: makeObjectRules(payload.nodes),
      data:
        (payload?.initialData && Object.keys(payload.initialData).length === 0)
          ? _get(state, [payload.name, 'data'], {})
          : payload.initialData
    })
  },
  // TODO usato solo da flower su vscode
  setCurrentNode: /* istanbul ignore next */ (state, { payload }) => {
    /* istanbul ignore next */
    if (hasNode(state, payload.name, payload.node)) {
      const startId = _get(state, [payload.name, 'startId'])
      if (payload.node === startId) {
        _set(state, [payload.name, 'current'], startId)
        _set(state, [payload.name, 'history'], [startId])
      } else {
        _set(state, [payload.name, 'current'], payload.node)
      }
    }
  },
  node: (state, { payload }) => {
    const { name, history } = payload
    const node = payload.nodeId || payload.node || ''
    const flowName = name || payload.flowName || ''

    /* istanbul ignore next */
    // eslint-disable-next-line no-underscore-dangle
    if (devtoolState && _get(devtoolState, '__FLOWER_DEVTOOLS__') && history) {
      FlowerCoreBaseReducers.forceAddHistory(state, {
        type: 'forceAddHistory',
        payload: {
          name,
          flowName,
          history
        }
      })
    }

    FlowerCoreBaseReducers.historyAdd(state, {
      type: 'historyAdd',
      payload: { name: name || flowName || '', node }
    })
  },
  prevToNode: (state, { payload }) => {
    const { node, name, flowName } = payload
    FlowerCoreBaseReducers.historyPrevToNode(state, {
      type: 'historyPrevToNode',
      payload: { name: name || flowName || '', node }
    })
  },
  next: (state, { payload }) => {
    const { name, route, flowName: flow, data = {}, dataIn = {} } = payload

    const flowName = name || flow || ''

    const { FlowerData, FlowerFlow, ...external } = data

    const currentNodeId =
      FlowerStateUtils.makeSelectCurrentNodeId(flowName)(state)
    const currentNextRules =
      FlowerStateUtils.makeSelectCurrentNextRules(flowName)(state)

    const $data = FlowerStateUtils.makeSelectNodeErrors(
      flowName,
      currentNodeId
    )(FlowerData)

    const internalClonedData = _cloneDeep(
      FlowerStateUtils.getAllData(FlowerData)
    )

    const externalClonedData = _cloneDeep(FlowerStateUtils.getAllData(external))

    const stateWithNodeData = {
      $in: dataIn,
      /** @deprecated use $data instead */
      $form: $data,
      $data,
      ...externalClonedData,
      ...internalClonedData
    }

    if (!currentNextRules) {
      return
    }

    if (route) {
      const rulesByName = generateRulesName(currentNextRules)

      if (!rulesByName[route]) {
        return
      }

      FlowerCoreBaseReducers.historyAdd(state, {
        type: 'historyAdd',
        payload: { name: flowName, node: rulesByName[route] }
      })

      return
    }

    const validRule = findValidRule(
      currentNextRules,
      stateWithNodeData,
      flowName
    )

    const nextNumberNode = _get(validRule, 'nodeId')

    if (!nextNumberNode) {
      return
    }

    FlowerCoreBaseReducers.historyAdd(state, {
      type: 'historyAdd',
      payload: { name: flowName, node: nextNumberNode }
    })
  },
  back: (state, { payload }) => {
    const { name, flowName } = payload

    FlowerCoreBaseReducers.historyPop(state, {
      type: 'historyPop',
      payload: { name: name || flowName || '' }
    })
  },
  restart: (state, { payload }) => {
    const { name, flowName } = payload
    FlowerCoreBaseReducers.restoreHistory(state, {
      type: 'restoreHistory',
      payload: { name: name || flowName || '' }
    })
  },
  reset: (state, { payload }) => {
    const { name, flowName } = payload
    FlowerCoreBaseReducers.restoreHistory(state, {
      type: 'restoreHistory',
      payload: { name: name || flowName || '' }
    })
  }
}
