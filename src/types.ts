export type BasicType = string | number | boolean | undefined | null | Function
export type Value = Input | BasicType
export type InputObject = { [key: string]: Value }
export type InputArray = Value[]
export type Input = InputObject | InputArray

export interface Options {
  remove?: boolean
  noError?: boolean
  createNew?: boolean
  insert?: boolean
  insertBefore?: string | number
  insertAfter?: string | number
}

export type Path = (string | number)[]

export interface FullOptions extends Options {
  noError: boolean
  fullData: Input
  fullPath: string
}
