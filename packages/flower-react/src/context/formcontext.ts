import { createContext } from 'react'

export type FormContext = {
  formName?: string
  initialData?: Record<string, unknown>
}

const _context = createContext<FormContext>({})

export const FormContext = _context
export const FormProvider = _context.Provider
export const FormConsumer = _context.Consumer
