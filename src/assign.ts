import {
  isArray,
  isObject,
  isPrimitive,
  maybeThrow,
  removeFromArray,
  splitPropertyString,
  stringifyPath,
} from './helpers'
import { FullOptions, Input, InputArray, InputObject, Options, Path } from './types'

const assign = (data: Input, propertyPath: string | Path, newValue: any, options: Options = {}) => {
  const { remove = false, createNew = true, noError = false } = options
  const fullData = data
  const fullPath = stringifyPath(propertyPath)
  const fullOptions = { remove, createNew, noError, fullData, fullPath }

  const propertyPathArray = splitPropertyString(propertyPath).filter((e) => e !== '')

  if (isArray(data) && remove && propertyPathArray.length === 1) {
    // Special case for removing an array index that is at the top level. We'd
    // normally have to do this from the parent (see below), but that's not
    // possible here.
    return removeFromArray(data, propertyPathArray[0] as number)
  }

  assignProperty(data, propertyPathArray, newValue, fullOptions)
  return data
}

// Assigns a specific property or index (e.g. application.name) inside a nested
// Object -- modifies "data" in-place
const assignProperty = (
  data: Input,
  propertyPathArray: Path,
  newValue: any,
  options: FullOptions
) => {
  const dataIsObject = isObject(data)
  const dataIsArray = isArray(data)

  // Do nothing for empty property string
  if (propertyPathArray.length === 0) return

  if (!(dataIsObject || dataIsArray))
    throw new Error("Can't assign property -- invalid input object")

  const { createNew, remove, noError, fullData, fullPath } = options

  const property = propertyPathArray[0]

  if (dataIsArray && typeof property === 'string') {
    data.forEach((item) => assignProperty(item as Input, propertyPathArray, newValue, options))
    return
  }

  // BASE
  if (propertyPathArray.length === 1) {
    if (dataIsObject && typeof property === 'string') {
      updateObject(data, property, newValue, options)
      return
    }

    if (dataIsArray && typeof property === 'number') {
      updateArray(data, property, newValue, options)
      return
    }

    maybeThrow(fullData, fullPath, property, noError)
    return
  }

  // RECURSIVE

  const dataObject = data as InputObject

  if (remove && propertyPathArray.length === 2 && typeof propertyPathArray[1] === 'number') {
    // This is for removing an indexed element from an array -- it must
    // be done from the parent, as an array can't have an element removed
    // in-place, so we need to return a shallow copy of the filtered array
    const childArray = dataObject[property]
    const childArrayIndex = propertyPathArray[1]
    if (isArray(childArray)) dataObject[property] = removeFromArray(childArray, childArrayIndex)
    else
      maybeThrow(
        fullData,
        fullPath,
        property,
        noError,
        `Trying to remove an indexed item from an object that is not an array`
      )
    return
  }

  const newPathArray = propertyPathArray.slice(1)

  if (property in data) {
    // This is for the case where the current property exists, but it's not an
    // object, so subsequent path elements can't be added
    if (isPrimitive(dataObject[property])) {
      if (createNew) dataObject[property] = {}
      else return
    }

    const newData = dataObject[property] as Input

    assignProperty(newData, newPathArray, newValue, options)
    return
  }

  if (dataIsObject && createNew) {
    data[property] = {}
    const newData = data[property] as Input
    assignProperty(newData, newPathArray, newValue, options)
    return
  }

  maybeThrow(fullData, fullPath, property, noError)
}

// Actual mutations of the leaf nodes, which considers all options and cases
const updateObject = (data: InputObject, property: string, newValue: any, options: FullOptions) => {
  const { remove, createNew, noError, fullData, fullPath } = options

  const exists = property in data

  if (remove) {
    if (exists) delete data[property]
    else maybeThrow(fullData, fullPath, property, noError)
    return
  }

  if (createNew || exists) {
    data[property] = newValue
    return
  }

  maybeThrow(fullData, fullPath, property, noError)
}

const updateArray = (data: InputArray, property: number, newValue: any, options: FullOptions) => {
  const { noError, fullData, fullPath } = options

  if (!(property in data)) {
    maybeThrow(fullData, fullPath, property, noError)
    return
  }

  // Array element deletion done in parent

  data[property] = newValue
}

export default assign
