export type InputObject = { [key: string]: InputData }

export type InputArray = InputData[]

export type InputCollection = InputObject | InputArray

type BasicType = string | number | boolean | undefined | null

export type InputData = InputObject | InputArray | BasicType

export interface Options {
  remove?: boolean
  noError?: boolean
  createNew?: boolean
}
