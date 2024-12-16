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

// Wrapper function
const assign = (data: Input, propertyPath: string | Path, newValue: any, options: Options = {}) => {
  const { remove = false, createNew = true, noError = false } = options
  const fullData = data
  const fullPath = stringifyPath(propertyPath)
  const fullOptions = { ...options, remove, createNew, noError, fullData, fullPath }

  const propertyPathArray = Array.isArray(propertyPath)
    ? propertyPath
    : splitPropertyString(propertyPath).filter((e) => e !== '')

  if (isArray(data) && remove && propertyPathArray.length === 1) {
    // Special case for removing an array index that is at the root level. We'd
    // normally have to do this from the parent (see below), but that's not
    // possible here.
    return removeFromArray(data, propertyPathArray[0] as number)
  }

  return assignProperty(data, propertyPathArray, newValue, fullOptions)
}

// Recursive function called by wrapper
const assignProperty = (
  data: Input,
  propertyPathArray: Path,
  newValue: any,
  options: FullOptions
): Input => {
  const objectData = isObject(data) ? { ...data } : null
  const arrayData = isArray(data) ? [...data] : null

  // Do nothing for empty property string
  if (propertyPathArray.length === 0) return data

  if (!(objectData || arrayData)) throw new Error("Can't assign property -- invalid input object")

  const { createNew, remove, noError, fullData, fullPath } = options

  const property = propertyPathArray[0]

  if (arrayData && typeof property === 'string') {
    return arrayData.map((item) =>
      assignProperty(item as Input, propertyPathArray, newValue, options)
    )
  }

  // BASE
  if (propertyPathArray.length === 1) {
    if (objectData && typeof property === 'string') {
      const newObj = updateObject(objectData, property, newValue, options)
      return newObj ?? objectData
    }

    if (arrayData && typeof property === 'number') {
      updateArray(arrayData, property, newValue, options)
      return arrayData
    }

    maybeThrow(fullData, fullPath, property, noError)
    return data
  }

  // RECURSIVE
  const newData = (objectData || arrayData || []) as InputObject

  if (remove && propertyPathArray.length === 2 && typeof propertyPathArray[1] === 'number') {
    // This is for removing an indexed element from an array -- it must
    // be done from the parent, as an array can't have an element removed
    // in-place, so we need to return a copy of the filtered array
    const childArray = newData[property]
    const childArrayIndex = propertyPathArray[1]
    if (isArray(childArray)) newData[property] = removeFromArray(childArray, childArrayIndex)
    else
      maybeThrow(
        fullData,
        fullPath,
        property,
        noError,
        `Trying to remove an indexed item from an object that is not an array`
      )
    return newData
  }

  const newPathArray = propertyPathArray.slice(1)

  if (property in data) {
    // This is for the case where the current property exists, but it's not an
    // object, so subsequent path elements can't be added
    if (isPrimitive(newData[property])) {
      if (createNew) newData[property] = {}
      else {
        maybeThrow(fullData, fullPath, property, noError)
        return newData
      }
    }
    newData[property] = assignProperty(newData[property] as Input, newPathArray, newValue, options)

    return newData
  }

  if (createNew) {
    const nextPathElement = newPathArray[0]
    const newElement = typeof nextPathElement === 'number' ? [] : {}

    if (objectData) {
      newData[property] = newElement
      newData[property] = assignProperty(
        newData[property] as Input,
        newPathArray,
        newValue,
        options
      )
      return newData
    }

    if (arrayData && Array.isArray(newData)) {
      newData.push(newElement)
      const newIndex = newData.length - 1
      newData[newIndex] = assignProperty(
        newData[newIndex] as Input,
        newPathArray,
        newValue,
        options
      )
      return newData
    }
  }

  maybeThrow(fullData, fullPath, property, noError)
  return newData
}

// Actual mutations of the leaf nodes, which considers all options and cases
const updateObject = (data: InputObject, property: string, newValue: any, options: FullOptions) => {
  const { remove, createNew, noError, insertAfter, insertBefore, fullData, fullPath } = options

  if (insertBefore !== undefined || insertAfter !== undefined) {
    const entries = Object.entries(data)
    let index = Infinity
    if (typeof insertBefore === 'number') index = insertBefore
    else if (typeof insertAfter === 'number') index = insertAfter
    else index = entries.findIndex(([key, _]) => key === (insertBefore ?? insertAfter))

    if (insertAfter) index++

    entries.splice(index, 0, [property, newValue])
    return Object.fromEntries(entries)
  }

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
  const { noError, fullData, fullPath, createNew, insert } = options

  if (insert) data.splice(property, 0, newValue)

  if (!(property in data)) {
    if (createNew) data.push(newValue)
    else maybeThrow(fullData, fullPath, property, noError)
    return
  }

  // Array element deletion done in parent

  data[property] = newValue
}

export default assign
