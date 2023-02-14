import { InputObject, Options } from './types'

// Returns a specific property or index (e.g. application.name) from a nested Object
const assignProperty = (
  inputObj: InputObject,
  properties: string,
  newValue: any,
  { remove = false, createNew = false, noError = false }: Options = {}
): any => {
  const propertyPathArray = splitPropertyString(properties as string).filter((e) => e !== '')

  // console.log(propertyPathArray)

  propertyPathArray.reduce((acc: any, part, index) => {
    if (index === propertyPathArray.length - 1) {
      if (Array.isArray(acc) && typeof part !== 'number') {
        acc.forEach((e) => setValueOrError(e, part, newValue, remove, createNew, !noError))
      } else setValueOrError(acc, part, newValue, remove, createNew, !noError)
    } else {
      return acc[part]
    }
  }, inputObj)

  return inputObj
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

const setValueOrError = (
  obj: Record<string, any>,
  part: string | number,
  newValue: any,
  remove: boolean,
  createNew: boolean,
  throwError: boolean
) => {
  if (part in obj) {
    if (remove) delete obj[part]
    else obj[part] = newValue
    return
  }

  if (throwError) throw new Error(`Invalid property path: ${part}`)

  if (createNew) obj[part] = newValue
}

export default assignProperty

export const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
