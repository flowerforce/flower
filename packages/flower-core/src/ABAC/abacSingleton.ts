import { AbacEngine, RuleInput, Subject } from './abacEngine'

let engine: AbacEngine | null = null
let rawRules: RuleInput[] | null = null
let currentSubject: Subject | null = null

export function initAbac(rules: RuleInput[]) {
  engine = new AbacEngine(rules)
  rawRules = rules
}

export function getAbacEngine() {
  if (!engine) console.warn('ABAC engine non inizializzato')
  return engine
}

export function getRawRules() {
  return rawRules
}

export function isAbacInitialized() {
  return engine !== null
}

export function setSubject(subject: Subject) {
  currentSubject = subject
}

export function getSubject() {
  return currentSubject
}

export function clearSubject() {
  currentSubject = null
}
