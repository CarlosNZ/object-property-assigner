import assign from '../assign'
import { cloneDeep } from 'lodash'

const testObj1: any = {
  a: 1,
  b: {
    inner: 'this',
    inner2: 45,
    inner3: {
      innerDeep: 2.4,
      innerDeep2: [1, 2, 3],
      innerBool: false,
      innerArray: [
        { one: 1, two: 'two', three: true, four: null, five: true },
        { one: 'one', two: 2, three: 3, four: { one: 1 } },
      ],
    },
  },
  cee: null,
  dee: { 1: true, 2: 'two' },
  ee: [1, 'two', { three: 4 }, false, undefined, null],
  fun: (n: number) => n * 2,
}

const testObj2: any = { ...testObj1 }
delete testObj2.fun

const arrayObj = [
  1,
  2,
  {
    one: [
      { x: 'Ex', y: 'Why' },
      { x: 'XXX', y: 'YYY' },
    ],
  },
]

// Base level properties
test('Base props 1', () => {
  expect(assign(cloneDeep(testObj1), 'a', 'ten')).toStrictEqual({
    ...testObj1,
    a: 'ten',
  })
})

test('Base props 2', () => {
  expect(assign(cloneDeep(testObj1), 'cee', 'something')).toStrictEqual({
    ...testObj1,
    cee: 'something',
  })
})

// Deep objects, various types
test('Deep props 1', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner', 'that')).toStrictEqual({
    ...testObj1,
    b: { ...testObj1.b, inner: 'that' },
  })
})

test('Deep props 2', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.innerDeep', null)).toStrictEqual({
    ...testObj1,
    b: { ...testObj1.b, inner3: { ...testObj1.b.inner3, innerDeep: null } },
  })
})

test('Get inner object, deeper', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3', { new: 'Hi', val: 'There' })).toStrictEqual({
    ...testObj1,
    b: { ...testObj1.b, inner3: { new: 'Hi', val: 'There' } },
  })
})

// Get arrays, various depths
test('Array at top level', () => {
  expect(assign(cloneDeep(testObj1), 'ee', ['new', 'array'])).toStrictEqual({
    ...testObj1,
    ee: ['new', 'array'],
  })
})

test('Array inner', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.innerArray', 'plain string')).toStrictEqual({
    ...testObj1,
    b: { ...testObj1.b, inner3: { ...testObj1.b.inner3, innerArray: 'plain string' } },
  })
})

test('Assign array by index', () => {
  expect(assign(cloneDeep(testObj1), 'ee[1]', 'No longer two')).toStrictEqual({
    ...testObj1,
    ee: [1, 'No longer two', { three: 4 }, false, undefined, null],
  })
})

test('Assign array by index - deeper', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.innerDeep2[2]', undefined)).toStrictEqual({
    ...testObj1,
    b: { ...testObj1.b, inner3: { ...testObj1.b.inner3, innerDeep2: [1, 2, undefined] } },
  })
})

test('Assign property inside object in indexed array', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.innerArray[1].four', '{ one: 1 }')).toStrictEqual({
    ...testObj1,
    b: {
      ...testObj1.b,
      inner3: {
        ...testObj1.b.inner3,
        innerArray: [
          { one: 1, two: 'two', three: true, four: null, five: true },
          { one: 'one', two: 2, three: 3, four: '{ one: 1 }' },
        ],
      },
    },
  })
})

test('Array at top level (object is array)', () => {
  expect(assign(cloneDeep(arrayObj), '[0]', 99)).toStrictEqual([
    99,
    2,
    {
      one: [
        { x: 'Ex', y: 'Why' },
        { x: 'XXX', y: 'YYY' },
      ],
    },
  ])
})

test('Array at top level (object is array), with nested elements', () => {
  expect(assign(cloneDeep(arrayObj), '[2].one.y', { more: 'yes' })).toStrictEqual([
    1,
    2,
    {
      one: [
        { x: 'Ex', y: { more: 'yes' } },
        { x: 'XXX', y: { more: 'yes' } },
      ],
    },
  ])
})

test('Ignore irrelevant trailing characters in property string', () => {
  expect(assign(cloneDeep(testObj1), 'ee[0].', 'NEW')).toStrictEqual({
    ...testObj1,
    ee: ['NEW', 'two', { three: 4 }, false, undefined, null],
  })
})

test('Ignore irrelevant trailing characters in property string, array top-level', () => {
  expect(assign(cloneDeep(arrayObj), '[0].', 'Bob')).toStrictEqual([
    'Bob',
    2,
    {
      one: [
        { x: 'Ex', y: 'Why' },
        { x: 'XXX', y: 'YYY' },
      ],
    },
  ])
})

test('Throw error with missing final property', () => {
  expect(() =>
    assign(cloneDeep(testObj1), 'b.inner3.missing', 'NEW', { createNew: false })
  ).toThrow(
    `Invalid property path: b.inner3.missing\nCouldn't access "missing" in ${JSON.stringify(
      testObj1
    )}`
  )
})

test('Throw error with missing early property', () => {
  expect(() => assign(cloneDeep(testObj1), 'b.nope', 'NEW', { createNew: false })).toThrow(
    `Invalid property path: b.nope\nCouldn't access "nope" in ${JSON.stringify(testObj1)}`
  )
})

test('Create new property with missing final property', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.missing', 'Bob', { createNew: true })).toStrictEqual(
    {
      ...testObj1,
      b: { ...testObj1.b, inner3: { ...testObj1.b.inner3, missing: 'Bob' } },
    }
  )
})

// Create or replace properties
test('Create new property with missing early property', () => {
  expect(assign(cloneDeep(testObj1), 'x', 'More XXX', { createNew: true })).toStrictEqual({
    ...testObj1,
    x: 'More XXX',
  })
})

test('Create new property with missing early property with additional path parts', () => {
  expect(assign(cloneDeep(testObj1), 'x.one.two', 'This is deep')).toStrictEqual({
    ...testObj1,
    x: { one: { two: 'This is deep' } },
  })
})

test('Create new property in array objects (one exists)', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.innerArray.five', 666)).toStrictEqual({
    ...testObj1,
    b: {
      ...testObj1.b,
      inner3: {
        ...testObj1.b.inner3,
        innerArray: [
          { one: 1, two: 'two', three: true, four: null, five: 666 },
          { one: 'one', two: 2, three: 3, four: { one: 1 }, five: 666 },
        ],
      },
    },
  })
})

test('Replace simple property with a deeper object', () => {
  expect(assign(cloneDeep(testObj1), 'a.one.two', 'This is deep')).toStrictEqual({
    ...testObj1,
    a: { one: { two: 'This is deep' } },
  })
})

// DON'T create new properties (but don't throw error)
test("Don't create new early property", () => {
  expect(
    assign(cloneDeep(testObj1), 'x', 'More XXX', { createNew: false, noError: true })
  ).toStrictEqual(testObj1)
})

test("Don't create new missing early property with additional path parts", () => {
  expect(
    assign(cloneDeep(testObj1), 'x.one.two', 'This is deep', { createNew: false, noError: true })
  ).toStrictEqual(testObj1)
})

test("Don't replace simple property with a deeper object", () => {
  expect(
    assign(cloneDeep(testObj1), 'a.one.two', 'This is deep', { createNew: false, noError: true })
  ).toStrictEqual(testObj1)
})

// Remove properties using "remove" parameter
test('Remove early property', () => {
  const t = { ...testObj2 }
  delete t.a
  expect(assign(cloneDeep(testObj2), 'a', null, { remove: true })).toStrictEqual(t)
})

test('Remove deeper property', () => {
  const t = cloneDeep(testObj2)
  delete t.b.inner3.innerDeep2
  expect(assign(cloneDeep(testObj2), 'b.inner3.innerDeep2', null, { remove: true })).toStrictEqual(
    t
  )
})

test('Remove an array item by index', () => {
  const t = cloneDeep(testObj2)
  t.b.inner3.innerDeep2 = [1, 3]
  expect(
    assign(cloneDeep(testObj2), 'b.inner3.innerDeep2[1]', null, { remove: true })
  ).toStrictEqual(t)
})

test('Remove a top-level array item by index', () => {
  const t = { ...testObj2 }
  t.ee = [1, 'two', { three: 4 }, false, undefined]
  expect(assign(cloneDeep(testObj2), 'ee[5]', null, { remove: true })).toStrictEqual(t)
})

test('Remove an array item when root object is an array', () => {
  const t = cloneDeep(testObj2)
  t.b.inner3.innerDeep2 = [1, 3]
  expect(
    assign(cloneDeep(testObj2), 'b.inner3.innerDeep2[1]', null, { remove: true })
  ).toStrictEqual(t)
})

// Empty property strings
test('Empty property string (does nothing)', () => {
  expect(assign(cloneDeep(testObj1), '', 'ALT?')).toStrictEqual(testObj1)
})

test('Empty property string after .', () => {
  expect(assign(cloneDeep(testObj1), 'b.inner3.', 'REPLACED')).toStrictEqual({
    ...testObj1,
    b: { ...testObj1.b, inner3: 'REPLACED' },
  })
})

// Functions
test('Add a function', () => {
  const obj = assign(cloneDeep(testObj1), 'b.newFun', (a: string) => a + 'output')
  expect(obj?.b?.newFun('NEW ')).toBe('NEW output')
})

test('Replace a function', () => {
  const obj = assign(cloneDeep(testObj1), 'fun', (a: string) => a + 'output')
  expect(obj.fun('NEW ')).toBe('NEW output')
})
