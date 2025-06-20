import _set from 'lodash/set'
import _unset from 'lodash/unset'
import _get from 'lodash/get'
import _last from 'lodash/last'
import _slice from 'lodash/slice'
import _cloneDeep from 'lodash/cloneDeep'
import lastIndexOf from 'lodash/lastIndexOf'
import { CoreUtils } from './CoreUtils'
import { ReducersFunctions } from './interfaces/ReducerInterface'
import { FlowerStateUtils } from './FlowerCoreStateUtils'
import { devtoolState } from './devtoolState'

const {
  generateNodes,
  hasNode,
  makeObjectRules,
  generateRulesName,
  findValidRule,
  getPath
} = CoreUtils

/**
 * These functions are Redux reducers used in a Flux architecture for managing state transitions and updates in a Flower application.
 */
export const FlowerCoreReducers: ReducersFunctions = {
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

  setFormTouched: (state, { payload }) => {
    if (
      !_get(state, [
        typeof payload === 'string' ? payload : payload.flowName,
        'nodes',
        typeof payload === 'string' ? payload : payload.currentNode
      ])
    ) {
      return state
    }
    _set(
      state,
      [
        typeof payload === 'string' ? payload : payload.flowName,
        'form',
        typeof payload === 'string' ? payload : payload.currentNode,
        'isSubmitted'
      ],
      true
    )
    return state
  },
  // TODO check internal logic and use case
  /* istanbul ignore next */
  forceAddHistory: (state, { payload }) => {
    const { name, flowName, history } = payload

    const key = name || flowName || '' || ''
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
    _set(state, [payload.name], {})
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
        Object.keys(payload.initialData).length === 0
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
  formAddCustomErrors: (state, { payload }) => {
    _set(
      state,
      [payload.name, 'form', payload.currentNode, 'customErrors', payload.id],
      payload.errors
    )
  },
  formAddErrors: (state, { payload }) => {
    _set(
      state,
      [payload.name, 'form', payload.currentNode, 'errors', payload.id],
      payload.errors
    )
  },
  formRemoveErrors: (state, { payload }) => {
    _unset(state, [
      payload.name,
      'form',
      payload.currentNode,
      'errors',
      payload.id
    ])
    _unset(state, [
      payload.name,
      'form',
      payload.currentNode,
      'customErrors',
      payload.id
    ])
    _unset(state, [payload.name, 'form', payload.currentNode, 'isValidating'])
  },
  formFieldTouch: (state, { payload }) => {
    _set(
      state,
      [payload.name, 'form', payload.currentNode, 'touches', payload.id],
      payload.touched
    )
  },
  formFieldDirty: (state, { payload }) => {
    _set(
      state,
      [payload.name, 'form', payload.currentNode, 'dirty', payload.id],
      payload.dirty
    )
  },
  formFieldFocus: (state, { payload }) => {
    if (!payload.focused) {
      _unset(state, [payload.name, 'form', payload.currentNode, 'hasFocus'])
      return
    }
    _set(
      state,
      [payload.name, 'form', payload.currentNode, 'hasFocus'],
      payload.id
    )
  },
  addData: (state, { payload }) => {
    const prevData = _get(state, [payload.flowName, 'data'])
    _set(state, [payload.flowName, 'data'], { ...prevData, ...payload.value })
  },
  addDataByPath: (state, { payload }) => {
    const { path: newpath } = getPath(payload.id)
    const currentNode = FlowerStateUtils.makeSelectCurrentNodeId(
      payload.flowName
    )(state)

    if (payload.id && payload.id.length) {
      _set(state, [payload.flowName, 'data', ...newpath], payload.value)
      if (payload && payload.dirty) {
        _set(
          state,
          [payload.flowName, 'form', currentNode, 'dirty', payload.id],
          payload.dirty
        )
      }
    }
  },
  // TODO usato al momento solo il devtool
  replaceData: /* istanbul ignore next */ (state, { payload }) => {
    /* istanbul ignore next */
    _set(state, [payload.flowName, 'data'], payload.value)
  },
  unsetData: (state, { payload }) => {
    _unset(state, [payload.flowName, 'data', ...payload.id])
  },
  setFormIsValidating: (state, { payload }) => {
    _set(
      state,
      [payload.name, 'form', payload.currentNode, 'isValidating'],
      payload.isValidating
    )
  },
  resetForm: (state, { payload }) => {
    const touchedFields = _get(
      state,
      [payload.flowName, 'form', payload.id, 'errors'],
      {}
    )

    Object.keys(touchedFields).forEach((key) => {
      const { flowNameFromPath = payload.flowName, path } = getPath(key)
      _unset(state, [flowNameFromPath, 'data', ...path])
    })

    _unset(state, [payload.flowName, 'form', payload.id, 'touches'])
    _unset(state, [payload.flowName, 'form', payload.id, 'dirty'])
    _unset(state, [payload.flowName, 'form', payload.id, 'isSubmitted'])
  },
  node: (state, { payload }) => {
    const { name, history } = payload
    const node = payload.nodeId || payload.node || ''
    const flowName = name || payload.flowName || ''
    const startNode = _get(state, [payload.name, 'startId'])
    const currentNodeId = _get(state, [payload.name, 'current'], startNode)

    FlowerCoreReducers.setFormTouched(state, {
      type: 'setFormTouched',
      payload: { flowName, currentNode: currentNodeId }
    })

    /* istanbul ignore next */
    // eslint-disable-next-line no-underscore-dangle
    if (devtoolState && _get(devtoolState, '__FLOWER_DEVTOOLS__') && history) {
      FlowerCoreReducers.forceAddHistory(state, {
        type: 'forceAddHistory',
        payload: {
          name,
          flowName,
          history
        }
      })
    }

    FlowerCoreReducers.historyAdd(state, {
      type: 'historyAdd',
      payload: { name: name || flowName || '', node }
    })
  },
  prevToNode: (state, { payload }) => {
    const { node, name, flowName } = payload
    FlowerCoreReducers.historyPrevToNode(state, {
      type: 'historyPrevToNode',
      payload: { name: name || flowName || '', node }
    })
  },
  next: (state, { payload }) => {
    const { name, data = {}, route } = payload

    const flowName = name || payload.flowName || ''

    const currentNodeId =
      FlowerStateUtils.makeSelectCurrentNodeId(flowName)(state)
    const currentNextRules =
      FlowerStateUtils.makeSelectCurrentNextRules(flowName)(state)

    const form = FlowerStateUtils.makeSelectNodeErrors(
      flowName,
      currentNodeId
    )(state)

    const clonedData = _cloneDeep(FlowerStateUtils.getAllData(state))

    const stateWithNodeData = {
      $in: data,
      $form: form,
      ...clonedData
    }

    FlowerCoreReducers.setFormTouched(state, {
      type: 'setFormTouched',
      payload: { flowName, currentNode: currentNodeId }
    })

    if (!currentNextRules) {
      return
    }

    if (route) {
      const rulesByName = generateRulesName(currentNextRules)

      if (!rulesByName[route]) {
        return
      }

      FlowerCoreReducers.historyAdd(state, {
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

    FlowerCoreReducers.historyAdd(state, {
      type: 'historyAdd',
      payload: { name: flowName, node: nextNumberNode }
    })
  },
  prev: (state, { payload }) => {
    const { name, flowName } = payload

    FlowerCoreReducers.historyPop(state, {
      type: 'historyPop',
      payload: { name: name || flowName || '' }
    })
  },
  restart: (state, { payload }) => {
    const { name, flowName } = payload
    FlowerCoreReducers.restoreHistory(state, {
      type: 'restoreHistory',
      payload: { name: name || flowName || '' }
    })
  },
  reset: (state, { payload }) => {
    const { name, flowName, initialData } = payload
    FlowerCoreReducers.restoreHistory(state, {
      type: 'restoreHistory',
      payload: { name: name || flowName || '' }
    })
    _set(state, [name || flowName || '', 'form'], {})
    _set(state, [name || flowName || '', 'data'], initialData)
  }
}
