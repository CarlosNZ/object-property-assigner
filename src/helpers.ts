import { BasicType, InputObject, Path, Value } from './types'

// Splits a string representing a (nested) property/index on an Object or Array
// into array of strings/indexes
// e.g. "data.organisations.nodes[0]" => ["data","organisations", "nodes", 0]
export const splitPropertyString = (propertyPath: string | Path) => {
  if (Array.isArray(propertyPath)) return propertyPath
  const arr = propertyPath
    .split(/(\.|\[\d+\])/)
    .filter((part) => part !== '.' && part !== '')
    .map((part) => {
      const match = /\[(\d+)\]/.exec(part)
      if (!match) return part
      return Number(match[1])
    })
  return arr.flat()
}

export const stringifyPath = (path: (string | number)[] | string | number): string => {
  if (typeof path === 'string') return path
  if (typeof path === 'number') return String(path)
  return path.reduce((str: string, part) => {
    if (typeof part === 'number') return `${str}[${part}]`
    else return str === '' ? part : `${str}.${part}`
  }, '')
}

export const maybeThrow = (
  obj: any,
  fullPath: string,
  part: string | number,
  noError: boolean,
  message?: string
): void => {
  if (!noError)
    throw new Error(
      message ??
        `Invalid property path: ${fullPath}\nCouldn't access "${part}" in ${JSON.stringify(obj)}`
    )
  return
}

export const isObject = (input: unknown): input is InputObject =>
  typeof input === 'object' && input !== null && !Array.isArray(input)

export const isArray = (input: unknown): input is Array<Value> => Array.isArray(input)

export const isPrimitive = (input: unknown): input is BasicType =>
  !isArray(input) && !isObject(input)

// Returns a copy of an array with a specific index removed.
export const removeFromArray = <T>(input: T[], index: number): T[] =>
  input.filter((_, i) => i !== index)
