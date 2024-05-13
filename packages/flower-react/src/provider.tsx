import React, { PropsWithChildren, Component, createContext } from 'react';
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducerFlower } from './reducer';
import {
  FlowerProviderInterface,
  FlowerProviderProps,
} from './components/types/FlowerProvider';

//TODO check reduxContext type due to remove all any types

const reduxContext = createContext(null);

export const useDispatch = createDispatchHook(reduxContext as any);
export const useSelector = createSelectorHook(reduxContext as any);
export const useStore = createStoreHook(reduxContext as any);

export const store = configureStore({
  reducer: reducerFlower,
  devTools: {
    name: 'flower',
  },
});

class FlowerProvider extends Component<PropsWithChildren, FlowerProviderProps> {
  private store: FlowerProviderProps;
  constructor(props: PropsWithChildren) {
    super(props);
    this.store = store;
  }

  render() {
    const { children } = this.props;
    return (
      <Provider context={reduxContext as any} store={this.store}>
        {children}
      </Provider>
    );
  }
}

export default FlowerProvider;
