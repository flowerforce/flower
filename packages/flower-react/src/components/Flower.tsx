/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, {
  ReactNode,
  Children,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import _keyBy from 'lodash/keyBy';
import { Emitter } from '@flowerforce/flower-core';
import { FlowerCoreContextProvider } from '../context';

import { convertElements } from '../utils';
import { actions } from '../reducer';
import {
  makeSelectStartNodeId,
  selectFlowerHistory,
  makeSelectCurrentNodeId,
  makeSelectCurrentNodeDisabled,
  makeSelectPrevNodeRetain,
} from '../selectors';
import { useDispatch, useSelector, useStore } from '../provider';

/**
 * FlowerClient
 */
const FlowerClient = (props) => {
  const {
    children,
    name,
    destroyOnUnmount = true,
    startId = null,
    initialData,
  } = props;

  const flowName = name;

  const dispatch = useDispatch();
  const one = useRef(false);
  const [wsDevtools, setWsDevtools] = useState(
    global.window && global.window['__FLOWER_DEVTOOLS_INITIALIZED__']
  );

  // TODO rivedere il giro, potremmo fare le trasformazioni in CoreUtils.generateNodesForFlowerJson
  // eslint-disable-next-line react-hooks/exhaustive-deps, max-len
  const nodes = useMemo(
    () => convertElements(Children.toArray(children) as any),
    [children]
  );
  const nodeById = useMemo(
    () => _keyBy(Children.toArray(children), 'props.id'),
    [children]
  );
  const isInitialized = useSelector(makeSelectStartNodeId(name));
  const history = useSelector(selectFlowerHistory(name));
  const current = useSelector(makeSelectCurrentNodeId(flowName));
  const isDisabled = useSelector(makeSelectCurrentNodeDisabled(flowName));
  const prevFlowerNodeId = useSelector(makeSelectPrevNodeRetain(flowName));
  const store = useStore();

  useEffect(() => {
    if (nodes.length > 0 && one.current === false) {
      one.current = true;
      dispatch(
        actions.initNodes({
          name: flowName,
          nodes,
          startId,
          persist: destroyOnUnmount === false,
          initialData,
        })
      );
    }
  }, [dispatch, flowName, nodes, startId, initialData, destroyOnUnmount]);

  useEffect(() => {
    /* istanbul ignore next */
    const eventCb = (msg) => {
      if (msg.source !== 'flower-devtool') return;

      if (
        msg.action === 'FLOWER_EXTENSION_INIT' ||
        msg.action === 'FLOWER_DEVTOOL_WEB_INIT'
      ) {
        setWsDevtools(true);
      }

      if (msg.action === 'SELECTED_NODE' && msg.name === flowName) {
        dispatch(actions.setCurrentNode({ name: msg.name, node: msg.id }));
      }

      if (msg.action === 'REPLACE_DATA' && msg.name === flowName) {
        dispatch(actions.replaceData({ flowName: msg.name, value: msg.data }));
      }

      if (msg.action === 'ADD_DATA' && msg.name === flowName) {
        dispatch(actions.addData({ flowName: msg.name, value: msg.data }));
      }
    };

    /* istanbul ignore next */
    if (global.window && global.window['__FLOWER_DEVTOOLS__']) {
      Emitter.on('flower-devtool-to-client', eventCb);
    }

    return () => {
      /* istanbul ignore next */
      if (global.window && global.window['__FLOWER_DEVTOOLS__']) {
        Emitter.off('flower-devtool-to-client', eventCb);
      }
    };
  }, [dispatch, flowName]);

  useEffect(
    () => () => {
      // unmount function
      if (destroyOnUnmount && one.current === true) {
        one.current = false;
        dispatch(actions.destroy({ name: flowName }));
      }
    },
    [dispatch, flowName, destroyOnUnmount]
  );

  useEffect(() => {
    /* istanbul ignore next */
    if (
      isInitialized &&
      wsDevtools &&
      global.window &&
      global.window['__FLOWER_DEVTOOLS__']
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'FLOWER_CLIENT_INIT',
        name: flowName,
        time: new Date(),
        nodeId: isInitialized
      });
    }
  }, [dispatch, flowName, wsDevtools, isInitialized]);

  useEffect(() => {
    /* istanbul ignore next */
    if (
      isInitialized &&
      wsDevtools &&
      global.window &&
      global.window['__FLOWER_DEVTOOLS__']
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_HISTORY',
        name: flowName,
        history,
      });
    }
  }, [dispatch, flowName, history, wsDevtools, isInitialized]);

  useEffect(() => {
    if (!current) return;
    /* istanbul ignore next */
    if (!isInitialized) return;
    /* istanbul ignore next */
    if (
      isInitialized &&
      wsDevtools &&
      global.window &&
      global.window['__FLOWER_DEVTOOLS__']
    ) {
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_CURRENT',
        name: flowName,
        current,
      });
    }
  }, [flowName, current, wsDevtools, isInitialized]);

  useEffect(() => {
    if (!current) return;
    /* istanbul ignore next */
    if (!isInitialized) return;

    if (isDisabled) {
      dispatch({ type: 'flower/next', payload: { flowName, disabled: true } });
      // eslint-disable-next-line no-underscore-dangle, no-undef
      /* istanbul ignore next */
      if (wsDevtools && global.window && global.window['__FLOWER_DEVTOOLS__']) {
        Emitter.emit('flower-devtool-from-client', {
          source: 'flower-client',
          action: 'FLOWER_NAVIGATE',
          nodeId: current,
          name: flowName,
          time: new Date(),
          params: { action: 'next', payload: { flowName, disabled: true } },
        });
      }
      return;
    }

    // eslint-disable-next-line no-underscore-dangle, no-undef
    /* istanbul ignore next */
    if (wsDevtools && global.window && global.window['__FLOWER_DEVTOOLS__']) {
      if (isInitialized === current) return; // salto il primo evento
      Emitter.emit('flower-devtool-from-client', {
        source: 'flower-client',
        action: 'SET_SELECTED',
        nodeId: current,
        name: flowName,
        time: new Date(),
      });
    }
  }, [
    dispatch,
    flowName,
    current,
    isDisabled,
    store,
    wsDevtools,
    isInitialized,
  ]);

  const contextValues = useMemo(
    () => ({
      flowName,
      currentNode: current,
    }),
    [flowName, current]
  );

  return isInitialized ? (
    <FlowerCoreContextProvider value={contextValues}>
      {prevFlowerNodeId !== current &&
        typeof prevFlowerNodeId === 'string' &&
        nodeById[prevFlowerNodeId]}
      {!isDisabled && nodeById[current]}
    </FlowerCoreContextProvider>
  ) : null;
};

export default memo(FlowerClient);
