// abacEngine.ts
export type Action = string
export type Subject = Record<string, any>
export type Resource = Record<string, any>
export type Environment = Record<string, any>

export type AbacCtx = {
  subject: Subject
  resource?: Resource
  action: Action
  environment?: Environment
}

export type RuleInput = {
  id: string
  description?: string
  effect: 'Permit' | 'Deny'
  priority?: number
  action?: string | string[] // ← add this
  /**
   * condition: string JS expression that returns boolean.
   * It can reference `subject`, `resource`, `action`, `environment`.
   * Example: "action === 'read' && (!resource.confidential || resource.ownerID === subject.id)"
   */
  condition?: string
}

export type CompiledRule = RuleInput & {
  conditionFn?: (
    subject: Subject,
    resource?: Resource,
    action?: Action,
    environment?: Environment
  ) => boolean
}

export class AbacEngine {
  private rules: CompiledRule[]

  constructor(rules: RuleInput[] = []) {
    // compile string conditions once
    this.rules = (rules || [])
      .map((r) => {
        let conditionFn: CompiledRule['conditionFn'] | undefined = undefined
        if (r.condition) {
          try {
            // NOTE: uses new Function -> ensure rules.json is trusted by the app owner
            conditionFn = new Function(
              'subject',
              'resource',
              'action',
              'environment',
              `return (${r.condition});`
            ) as any
          } catch (err) {
            console.error('ABAC: failed to compile rule condition', r.id, err)
          }
        }
        return { ...r, conditionFn }
      })
      .sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
  }

  decide(ctx: AbacCtx): 'Permit' | 'Deny' {
    let anyPermit = false

    for (const r of this.rules) {
      const matchesAction = Array.isArray(r.action)
        ? r.action.includes(ctx.action)
        : r.action === ctx.action || r.action === '*'

      if (!matchesAction) continue

      let matches = true
      if (r.conditionFn) {
        try {
          matches = !!r.conditionFn(
            ctx.subject,
            ctx.resource,
            ctx.action,
            ctx.environment
          )
        } catch (err) {
          matches = false
          console.error(`ABAC: rule ${r.id} threw while evaluating`, err)
        }
      }
      if (!matches) continue

      if (r.effect === 'Deny') {
        // deny-overrides
        return 'Deny'
      }
      if (r.effect === 'Permit') {
        anyPermit = true
      }
    }

    return anyPermit ? 'Permit' : 'Deny'
  }

  // utility: checks multiple actions and returns those allowed
  allowedActions(ctxBase: Omit<AbacCtx, 'action'>, actions: Action[]) {
    return actions.filter(
      (a) => this.decide({ ...ctxBase, action: a }) === 'Permit'
    )
  }
}
