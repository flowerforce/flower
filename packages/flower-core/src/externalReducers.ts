const externalReducerNames = new Set<string>()

export const registerExternalReducers = (names: string[] = []) => {
  names.forEach((name) => {
    if (name && name !== 'flower') {
      externalReducerNames.add(name)
    }
  })
}

export const isExternalReducer = (name?: string) =>
  !!name && externalReducerNames.has(name)

export const clearExternalReducers = () => {
  externalReducerNames.clear()
}

export const getExternalReducerNames = () => Array.from(externalReducerNames)
