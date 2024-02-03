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

const smallerObj = { a: 1, two: { three: 3 } }

const testObj2: any = { ...testObj1 }
delete testObj2.fun

const simpleArray = [0, 1, 2, 3]

const x = assign(simpleArray, '[1]', null, { remove: true })
console.log(JSON.stringify(x, null, 2))
