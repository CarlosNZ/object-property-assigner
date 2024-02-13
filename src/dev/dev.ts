import assign from '../assign'

const testObj1 = {
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

const arrayNestedEarly = {
  list: [
    { one: 1, value: { text: 'Number 1' }, three: [1, 2, 3] },
    { one: 2, value: { text: 'Number 2' }, three: [4, 5, 6] },
    { one: 3, value: { text: 'Number 3' }, three: [7, 8, 9] },
  ],
}

const arrayDoubleNested = {
  list: [
    {
      one: 1,
      value: { text: 'Number 1' },
      three: [
        { name: 'Carl', height: 1.83 },
        { name: 'Bodhi', height: 1.2 },
        { name: 'ANM', height: 1.6 },
      ],
    },
    {
      one: 2,
      value: { text: 'Number 2' },
      three: [
        { name: 'Tom', height: 1.61 },
        { name: 'Jerry', height: 1.61 },
      ],
    },
    { one: 3, value: { text: 'Number 3' }, three: [{ name: 'Hugo', height: 1.5 }] },
  ],
}

const smallerObj = { two: { three: 3 }, a: 1 }

const simpleArray = [0, 1, 2, 3]

const x = assign(testObj1, 'b.inner3.innerArray[2][2]', 'ADD THIS')
// console.log(JSON.stringify(testObj1, null, 2))
console.log(JSON.stringify(x, null, 2))
