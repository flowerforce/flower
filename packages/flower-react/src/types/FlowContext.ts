export type FlowContext = {
  flowName?: string | undefined
  currentNode?: string | undefined
  autostart?: boolean | undefined
  initialData?: Record<string, unknown>
}
