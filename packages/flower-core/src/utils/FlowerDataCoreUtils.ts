import trimStart from 'lodash/trimStart'
import { DataUtilitiesFunctions } from '../interfaces'

export const DataUtils: DataUtilitiesFunctions = {
  cleanPath: (name: string, char = '^') => trimStart(name, char),
  getPath: (idValue?: string) => {
    if (!idValue) {
      return {
        path: []
      }
    }

    if (idValue === '*') {
      return {
        path: '*'
      }
    }

    if (idValue.indexOf('^') === 0) {
      const [rootName, ...rest] = DataUtils.cleanPath(idValue).split('.')
      return {
        rootName,
        path: rest
      }
    }

    return {
      path: idValue.split('.')
    }
  }
}
