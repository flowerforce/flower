import { useCallback, useContext } from 'react';
import { CoreUtils } from '@flowerforce/flower-core';
import get from 'lodash/get';
import { FlowerCoreContext } from '../context';
import { makeSelectCurrentNodeId, makeSelectNodeErrors } from '../selectors';
import { actions } from '../reducer';
import { useDispatch, useSelector, useStore } from '../provider';
import { UseFlowerForm } from './types/FlowerHooks';

/**  This hook allows you to manage and retrieve information about Forms.
 *
 * It exposes details regarding the form's state and a set of methods for reading and writing within it:
 *
 * - getData
 *
 * - setData
 *
 * - unSetData
 *
 * - replaceData
 *
 * @param {string} flowName - first optional parameter
 *
 * @param {string} name - optional parameter, if flowName exist, name is not used
 *
 */
const useFlowerForm: UseFlowerForm = ({
  flowName: customFlowName,
  name,
} = {}) => {
  const { flowName: flowNameDefault } = useContext(FlowerCoreContext);

  const dispatch = useDispatch();
  const store = useStore();
  const flowName = customFlowName || name || flowNameDefault || '';
  const currentNode = useSelector(makeSelectCurrentNodeId(flowName));
  const { errors, isValid, touched, isValidating } = useSelector(
    makeSelectNodeErrors(flowName, currentNode)
  );

  const getData = useCallback(
    (path?: string) => {
      const { flowNameFromPath = flowName, path: newpath } =
        CoreUtils.getPath(path);
      return get(store.getState(), [
        'flower',
        flowNameFromPath,
        'data',
        ...newpath,
      ]);
    },
    [store, flowName]
  );

  const setData = useCallback(
    (val: any, path?: string) => {
      if (path) {
        const { flowNameFromPath = flowName, path: newpath } =
          CoreUtils.getPath(path);
        dispatch(
          actions.addDataByPath({
            flowName: flowNameFromPath,
            id: Array.isArray(newpath) ? newpath : [newpath],
            value: val,
          })
        );
        return;
      }
      dispatch(actions.addData({ flowName, value: val }));
    },
    [flowName, dispatch]
  );

  const unsetData = useCallback(
    (path: string) => {
      const { flowNameFromPath = flowName, path: newpath } =
        CoreUtils.getPath(path);
      dispatch(actions.unsetData({ flowName: flowNameFromPath, id: newpath }));
    },
    [flowName, dispatch]
  );

  const replaceData = useCallback(
    (val: any) => {
      dispatch(actions.replaceData({ flowName, value: val }));
    },
    [flowName, dispatch]
  );

  return {
    touched,
    errors,
    isValid,
    isValidating,
    getData,
    setData,
    unsetData,
    replaceData,
  };
};

export default useFlowerForm;
