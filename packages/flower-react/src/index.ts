import Flower from './components/Flower'

/* // FOR REACT NATIVE
if (global.window === undefined) {
  global.window = global;
} */

export { FlowerCoreContext as FlowerContext } from './context'
export { default as FlowerNode } from './components/FlowerNode'
export { default as FlowerAction } from './components/FlowerAction'
export { default as FlowerServer } from './components/FlowerServer'
export { default as FlowerFlow } from './components/FlowerFlow'
export { default as FlowerStart } from './components/FlowerStart'
export { default as FlowerRoute } from './components/FlowerRoute'
export { default as FlowerRule } from './components/FlowerRule'
export { default as FlowerField } from './components/FlowerField'
export { default as FlowerValue } from './components/FlowerValue'
export { default as FlowerNavigate } from './components/FlowerNavigate'
export { default as FlowerComponent } from './components/FlowerComponent'
export { default as useFlower } from './components/useFlower'
export { default as useFlowerForm } from './components/useFlowerForm'
export { default as FlowerProvider } from './provider'
export { getDataByFlow } from './selectors'
export { useSelector } from './provider'

export default Flower
