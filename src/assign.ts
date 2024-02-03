import {
  BasicType,
  FullOptions,
  Input,
  InputArray,
  InputObject,
  Options,
  Path,
  Value,
} from './types'

const assign = (data: Input, propertyPath: string, newValue: any, options: Options = {}) => {
  const fullData = data
  const fullPath = propertyPath
  assignProperty(
    data,
    splitPropertyString(propertyPath).filter((e) => e !== ''),
    newValue,
    { ...options, fullData, fullPath }
  )
}

// Assigns a specific property or index (e.g. application.name) inside a nested
// Object
const assignProperty = (data: Input, propertyPath: Path, newValue: any, options: FullOptions) => {
  if (!(isObject(data) || isArray(data)))
    throw new Error("Can't assign property -- invalid input object")

  const propertyPathArray = Array.isArray(propertyPath)
    ? propertyPath
    : splitPropertyString(propertyPath as string).filter((e) => e !== '')

  const property = propertyPathArray[0]

  // Base
  if (propertyPathArray.length === 1) {
    if (isObject(data) && typeof property === 'string') {
      updateObject(data, property, newValue, options)
      return
    }

    // data is array and property is number

    // data is array and property is string

    // data is object and property is number
  } else {
    // Recursive
    const newPathArray = propertyPathArray.slice(1)
    if (isObject(data) && property in data)
      assignProperty(data[property] as InputObject, newPathArray, newValue, options)
  }
}

// Actual update operation, which considers all options and cases
const updateObject = (data: InputObject, property: string, newValue: any, options: FullOptions) => {
  const { remove = false, createNew = true, noError = false, fullData, fullPath } = options

  const exists = property in data

  if (remove) {
    exists ? delete data[property] : maybeThrow(fullData, fullPath, property, noError)
  }

  if (createNew || exists) {
    data[property] = newValue
    return
  }

  maybeThrow(fullData, fullPath, property, noError)
}

// Splits a string representing a (nested) property/index on an Object or Array
// into array of strings/indexes
// e.g. "data.organisations.nodes[0]" => ["data","organisations", "nodes", 0]
const splitPropertyString = (propertyPath: string) => {
  const arr = propertyPath.split('.').map((part) => {
    const match = /(.*)\[(\d)\]$/.exec(part)
    return !match ? part : [match[1], Number(match[2])].filter((val) => val !== '')
  })
  return arr.flat()
}

const maybeThrow = (obj: any, fullPath: string, part: string | number, noError: boolean): void => {
  if (!noError)
    throw new Error(
      `Invalid property path: ${fullPath}\nCouldn't access "${part}" in ${JSON.stringify(obj)}`
    )
  return
}

const isObject = (input: unknown): input is InputObject =>
  typeof input === 'object' && input !== null && !Array.isArray(input)

const isArray = (input: unknown): input is Array<Value> => Array.isArray(input)

const stringifyPath = (path: (string | number)[] | string | number): string => {
  if (typeof path === 'string') return path
  if (typeof path === 'number') return String(path)
  return path.reduce((str: string, part) => {
    if (typeof part === 'number') return `${str}[${part}]`
    else return str === '' ? part : `${str}.${part}`
  }, '')
}

// Returns a copy of an array with a specific index removed.
const sliceArray = <T>(input: T[], index: number): T[] => [
  ...input.slice(0, index),
  ...input.slice(index + 1),
]

export default assign
