import { FlowerCoreStateSelectors } from '../FlowerCoreStateSelectors';
import { Flower } from '../interfaces/Store';

//todo: double check if tests are ok

const state: { flower: Flower<{ [x: string]: any }> } = {
  flower: {
    persist: false,
    startId: 'Start',
    current: 'Node1',
    history: ['start', 'Node1'],
    nodes: {
      Start: { nodeId: 'start', nodeType: 'FlowerRoute' },
      Node1: { nodeId: 'Node1', nodeType: 'FlowerNode' },
      Node2: { nodeId: 'Node2', nodeType: 'FlowerNode', retain: true },
    },
    nextRules: {
      Start: [{ nodeId: 'Node1', rules: null }],
    },
    data: {
      name: 'UserName',
    },
    form: {
      Start: {
        touched: true,
        errors: {},
        isValidating: false,
      },
    },
  },
};

describe('FlowerCoreSelectors', () => {
  describe('SelectGlobal', () => {
    it('should return the flower object in state.flower', () => {
      const flower = FlowerCoreStateSelectors.selectGlobal(state);
      expect(flower).toEqual(state.flower);
    });
  });

  describe('selectFlower', () => {
    it('should return the flower object for the given name', () => {
      const flower = FlowerCoreStateSelectors.selectFlower('flower')(
        state.flower
      );
      expect(flower).toEqual(state.flower);
    });
  });

  describe('selectFlowerFormNode', () => {
    it('should return the form object for the given node id', () => {
      const nodeId = 'start';
      const selectedForm = FlowerCoreStateSelectors.selectFlowerFormNode(
        nodeId
      )(state.flower);
      expect(selectedForm).toEqual(state.flower.form[nodeId]);
    });
  });

  describe('selectFlowerHistory', () => {
    it('should return the history array from the given flower object', () => {
      const history = FlowerCoreStateSelectors.selectFlowerHistory(
        state.flower
      );
      expect(history).toEqual(state.flower.history);
    });
  });

  describe('makeSelectNodesIds', () => {
    it('should return the nodes object from the given flower object', () => {
      const nodes = FlowerCoreStateSelectors.makeSelectNodesIds(state.flower);
      expect(nodes).toEqual(state.flower.nodes);
    });
  });

  describe('makeSelectStartNodeId', () => {
    it('should return the startNodeId from the given flower object', () => {
      const startNodeId = FlowerCoreStateSelectors.makeSelectStartNodeId(
        state.flower
      );
      expect(startNodeId).toEqual(state.flower.startId);
    });
  });

  describe('getDataByFlow', () => {
    it('should return the data object in the state.flower.data', () => {
      const data = FlowerCoreStateSelectors.getDataByFlow(state.flower);
      expect(data).toEqual(state.flower.data);
    });
  });

  describe('getDataFromState', () => {
    it('should return data object if id is "*"', () => {
      const id = '*';
      const data = { data: 'test', nested: { value: 'nested' } };

      const result = FlowerCoreStateSelectors.getDataFromState(id)(state.flower);

      expect(result).toEqual(data);
    });

    it('should return the data at the specified id if id is not "*"', () => {
      const id = 'test.value';
      const data = { data: 'data', test: { value: 'test' } };

      const result = FlowerCoreStateSelectors.getDataFromState(id)(state.flower);

      expect(result).toEqual('test');
    });
  });

  describe('makeSelectNodeFormTouched', () => {
    it('should return the touched node', () => {
      const touched = FlowerCoreStateSelectors.makeSelectNodeFormTouched(
        state.flower.form.Start
      );
      expect(touched).toEqual(state.flower.form.Start.touched);
    });
  });

  describe('makeSelectCurrentNodeId', () => {
    it('should return the currentNodeId or startNodeId', () => {
      const current = FlowerCoreStateSelectors.makeSelectCurrentNodeId(
        state.flower,
        state.flower.startId
      );

      expect(current).toEqual(state.flower.current || 'start');
    });
  });

  describe('makeSelectCurrentNodeDisabled', () => {
    it('should return true if the current node is disabled', () => {
      const nodes = {
        Start: { disabled: true },
        Node1: { disabled: false },
      };
      const current = 'Start';

      const isDisabled = FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled(
        nodes,
        current
      );

      expect(isDisabled).toBe(true);
    });

    it('should return false if the current node is not disabled', () => {
      const nodes = {
        Start: { disabled: true },
        Node1: { disabled: false },
      };
      const current = 'Node1';

      const isDisabled = FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled(
        nodes,
        current
      );

      expect(isDisabled).toBe(false);
    });

    it('should return false if the current node does not exist in the nodes object', () => {
      const nodes = {
        Start: { disabled: true },
        Node1: { disabled: false },
      };
      const current = 'UnknownNode';

      const isDisabled = FlowerCoreStateSelectors.makeSelectCurrentNodeDisabled(
        nodes,
        current
      );

      expect(isDisabled).toBe(false);
    });
  });

  describe('makeSelectPrevNodeRetain', () => {
    it("should return undefined if no previous node has 'retain' property", () => {
      const prevNode = FlowerCoreStateSelectors.makeSelectPrevNodeRetain(
        state.flower.nodes,
        state.flower.history,
        'Node1'
      );
      expect(prevNode).toBeUndefined();
    });

    it("should return undefined if the current node has 'retain' property", () => {
      const prevNode = FlowerCoreStateSelectors.makeSelectPrevNodeRetain(
        state.flower.nodes,
        state.flower.history,
        'Node1'
      );
      expect(prevNode).toBeUndefined();
    });

    describe('makeSelectNodeErrors', () => {
      it('should return default values if form is not provided', () => {
        const defaultErrors = {
          touched: false,
          errors: undefined,
          isValidating: undefined,
          isValid: true,
        };
        const nodeErrors =
          FlowerCoreStateSelectors.makeSelectNodeErrors(undefined);
        expect(nodeErrors).toEqual(defaultErrors);
      });
    });
  });

  describe('makeSelectFieldError', () => {
    it('should return an empty array if validate is false', () => {
      const name = 'UserName';
      const id = 'start';
      const validate = null;

      const selectFieldError = FlowerCoreStateSelectors.makeSelectFieldError(
        name,
        id,
        validate
      );
      const result = selectFieldError({} as Flower<any>);

      expect(result).toEqual([]);
    });

    it('should return an empty array if validate array is empty', () => {
      const name = 'UserName';
      const id = 'start';
      const validate: Array<any> = [];

      const selectFieldError = FlowerCoreStateSelectors.makeSelectFieldError(
        name,
        id,
        validate
      );
      const result = selectFieldError({} as Flower<any>);

      expect(result).toEqual([]);
    });
  });

  describe('selectorRulesDisabled', () => {
    it('should return false if rules or keys are not provided', () => {
      const id = 'id';
      const rules = null;
      const keys = null;
      const flowName = 'flower';
      const value = { value: 'test' };

      const data: any = {};
      const form: any = {};

      const result = FlowerCoreStateSelectors.selectorRulesDisabled(
        id,
        rules,
        keys,
        flowName,
        value
      )(data, form);
      expect(result).toBe(false);
    });
  });

  describe('', () => {});
});
