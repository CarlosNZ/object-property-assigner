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

const data = {
  list: [
    {
      sterility: {
        value: {
          text: 'Non-sterile',
          selection: 'Non-sterile',
          optionIndex: 1,
        },
        isValid: true,
        stageNumber: 1,
        evaluatedParameters: {
          label: 'Sterility',
          options: ['Sterile', 'Non-sterile'],
        },
      },
    },
    {
      sterility: {
        value: {
          text: 'Another',
          selection: 'Non-sterile',
          optionIndex: 1,
        },
        isValid: true,
        stageNumber: 1,
        evaluatedParameters: {
          label: 'Sterility',
          options: ['Sterile', 'Non-sterile'],
        },
      },
    },
  ],
  text: 'Sterility: Non-sterile, Dosage Form: Solid Unit Dosage Forms, \n',
}

// console.log(extract(data, 'user.children[0].'))
const arrData = [
  1,
  2,
  {
    one: [
      { x: 'Ex', y: 'Why' },
      { x: 'XXX', y: 'YYY' },
    ],
  },
]

const smallerObj = { a: 1, two: { three: 3 } }

const testObj2: any = { ...testObj1 }
delete testObj2.fun

const simpleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

assign(testObj1, 'a', 'ten', {})
// console.log(JSON.stringify(arrData, null, 2))
console.log(JSON.stringify(testObj1, null, 2))
// console.log(x)
// console.log(arrData[2])
