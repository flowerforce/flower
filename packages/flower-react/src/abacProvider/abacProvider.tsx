import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  RuleInput,
  AbacCtx,
  Resource,
  Action,
  isAbacInitialized,
  getRawRules,
  initAbac,
  getAbacEngine,
  getSubject
} from '@flowerforce/flower-core'

type AbacProviderProps = {
  children: React.ReactNode
  rules?: RuleInput[]
  rulesPath?: string
  fetchOptions?: RequestInit
  denyByDefault?: boolean
}

type AbacContextValue = {
  can: (args: Omit<AbacCtx, 'subject'>) => boolean
  allowedActions: (
    resource: Resource | undefined,
    actions?: Action[]
  ) => Action[] | undefined
  loaded: boolean
  rawRules?: RuleInput[] | null
}

const AbacContext = createContext<AbacContextValue>({
  can: () => false,
  allowedActions: () => [],
  loaded: false,
  rawRules: null
})

export const AbacProvider: React.FC<AbacProviderProps> = ({
  children,
  rules,
  rulesPath,
  fetchOptions,
  denyByDefault = true
}) => {
  const [loaded, setLoaded] = useState<boolean>(isAbacInitialized())
  const [localRawRules, setLocalRawRules] = useState<RuleInput[] | null>(
    getRawRules()
  )

  useEffect(() => {
    if (rules) {
      initAbac(rules)
      setLocalRawRules(rules)
      setLoaded(true)
      return
    }

    if (!rulesPath) {
      setLoaded(false)
      setLocalRawRules(null)
      return
    }

    let mounted = true

    const init = async () => {
      try {
        const res = await fetch(rulesPath, fetchOptions)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as RuleInput[]
        if (!mounted) return
        initAbac(json)
        setLocalRawRules(json)
        setLoaded(true)
      } catch (err) {
        console.error('ABAC: failed to load rules from', rulesPath, err)
        setLocalRawRules(null)
        setLoaded(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [rules, rulesPath, fetchOptions])

  const can = useCallback(
    (ctx: Omit<AbacCtx, 'subject'>) => {
      if (!isAbacInitialized()) return !denyByDefault
      const subject = getSubject()
      return (
        getAbacEngine()?.decide({ subject: subject ?? {}, ...ctx }) === 'Permit'
      )
    },
    []
  )

  const allowedActions = useCallback(
    (
      resource?: Resource,
      actions: Action[] = ['read', 'create', 'update', 'delete']
    ) => {
      if (!isAbacInitialized()) return denyByDefault ? [] : actions.slice()
      const subject = getSubject()
      return getAbacEngine()?.allowedActions(
        { subject: subject ?? {}, resource, environment: undefined },
        actions
      )
    },
    []
  )

  const value = useMemo(
    () => ({
      can,
      allowedActions,
      loaded,
      rawRules: localRawRules
    }),
    [loaded, localRawRules]
  )

  return <AbacContext.Provider value={value}>{children}</AbacContext.Provider>
}

export function useAbac() {
  return useContext(AbacContext)
}
