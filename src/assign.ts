import { InputArray, InputCollection, InputData, InputObject, Options } from './types'

// Assigns a specific property or index (e.g. application.name) inside a nested
// Object
const assignProperty = <T>(
  inputObj: T,
  propertyPath: string | number | (string | number)[],
  newValue: any,
  { remove = false, createNew = true, noError = false }: Options = {}
): T => {
  if (!(isObject(inputObj) || isArray(inputObj)))
    throw new Error("Can't assign property -- invalid input object")

  const propertyPathArray = Array.isArray(propertyPath)
    ? propertyPath
    : splitPropertyString(propertyPath as string).filter((e) => e !== '')

  // console.log('propertyPathArray', propertyPathArray)

  let current: InputData = inputObj
  let parent: InputCollection = []
  let parentPart: string | number = ''

  // Drill down into object/array via the path sequence
  propertyPathArray.forEach((part, index) => {
    const currentIsArray = isArray(current)
    const currentIsObject = isObject(current)

    console.log('part', part)
    console.log('current', current)

    if (index < propertyPathArray.length - 1) {
      if (currentIsArray && typeof part !== 'number') {
        maybeThrow(inputObj, stringifyPath(propertyPathArray), part, noError)
        return
      }

      if (!(currentIsObject || currentIsArray)) {
        if (createNew) {
          ;(parent as any)[parentPart] = { [part]: {} }
          parent = current as InputCollection
        } else maybeThrow(inputObj, stringifyPath(propertyPathArray), part, noError)
      }

      if (!(part in (current as InputCollection))) {
        if (createNew) {
          const newCollection = isArray(propertyPathArray[index + 1]) ? [] : {}
          ;(current as InputObject)[part] = newCollection
        } else maybeThrow(inputObj, stringifyPath(propertyPathArray), part, noError)
      }

      parent = current as InputCollection
      parentPart = part
      current = (current as InputObject)[part]
      return
    }

    // We've found the base of the path, now replace the data
    // OBJECTS
    if (currentIsObject) {
      current = current as InputObject
      if (part in current) {
        if (remove) delete current[part]
        else current[part] = newValue
        return
      }
      if (createNew) current[part] = newValue
      else maybeThrow(inputObj, stringifyPath(propertyPathArray), part, noError)
      return
    }

    // ARRAYS
    if (typeof part !== 'number') {
      maybeThrow(inputObj, stringifyPath(propertyPathArray), part, noError)
      return
    }
    current = current as InputArray
    if (part in current) {
      if (remove) {
        const currentArray: InputArray = (parent as any)[parentPart]
        const newArray = [
          ...currentArray.slice(0, part),
          ...currentArray.slice((part as number) + 1),
        ]
        ;(parent as any)[parentPart] = newArray
      } else current[part as number] = newValue // Update
      return
    }

    if (createNew) {
      current.push(newValue)
    } else maybeThrow(inputObj, stringifyPath(propertyPathArray), part, noError)
    return
  })

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

const maybeThrow = (obj: any, fullPath: string, part: string | number, noError: boolean): void => {
  if (!noError)
    throw new Error(
      `Invalid property path: ${fullPath}\nCouldn't access "${part}" in ${JSON.stringify(obj)}`
    )
  return
}

const isObject = (input: unknown): input is InputObject =>
  typeof input === 'object' && input !== null && !Array.isArray(input)

const isArray = (input: unknown): input is InputArray => Array.isArray(input)

const stringifyPath = (path: (string | number)[] | string | number): string => {
  if (typeof path === 'string') return path
  if (typeof path === 'number') return String(path)
  return path.reduce((str: string, part) => {
    if (typeof part === 'number') return `${str}[${part}]`
    else return str === '' ? part : `${str}.${part}`
  }, '')
}

export default assignProperty
