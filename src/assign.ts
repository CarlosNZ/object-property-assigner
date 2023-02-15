import { InputObject, Options } from './types'

// Assigns a specific property or index (e.g. application.name) inside a nested
// Object
const assignProperty = (
  inputObj: InputObject,
  propertyPath: string,
  newValue: any,
  { remove = false, createNew = true, noError = false }: Options = {}
): any => {
  if (!isObject(inputObj)) throw new Error("Can't assign property -- invalid input object")

  const propertyPathArray = splitPropertyString(propertyPath as string).filter((e) => e !== '')

  propertyPathArray.reduce((acc: any, part, index) => {
    if (isObject(acc) && !Array.isArray(acc) && !(part in acc)) {
      if (!noError && !createNew) throwError(inputObj, propertyPath, part)
    }

    if (index === propertyPathArray.length - 1) {
      if (Array.isArray(acc) && typeof part !== 'number') {
        acc.forEach((e) => {
          e[part] = newValue
        })
      } else {
        if (createNew) acc[part] = newValue
        if (remove) delete acc[part]
        return acc
      }

      return
    }

    if (!(part in acc) || !isObject(acc[part])) {
      if (createNew) acc[part] = {}
      // if (remove) delete acc[part]
      else return acc
    }

    return acc[part]
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

const throwError = (obj: any, fullPath: string, part: string | number): void => {
  throw new Error(
    `Invalid property path: ${fullPath}\nCouldn't access "${part}" in ${JSON.stringify(obj)}`
  )
}

const isObject = (obj: unknown) => obj instanceof Object && obj !== null

// const createNewProperty = (obj: InputObject, pathArray: (string | number)[], newValue: any) => {
//   let current = obj
//   pathArray.forEach((part, index) => {
//     if (!isObject(current)) return
//     if (!(part in current)) (current as any)[part] = index === pathArray.length - 1 ? newValue : {}

//     current = (current as any)[part]
//   })
// }

export default assignProperty
