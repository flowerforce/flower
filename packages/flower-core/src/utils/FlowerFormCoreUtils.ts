import trimStart from 'lodash/trimStart'
import { FormUtilitiesFunctions } from '../interfaces'

export const FormUtils: FormUtilitiesFunctions = {
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
      const [formName, ...rest] = FormUtils.cleanPath(idValue).split('.')
      return {
        formName,
        path: rest
      }
    }

    return {
      path: idValue.split('.')
    }
  }
}
