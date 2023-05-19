import { cloneDeep } from 'lodash'
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
  user: {
    name: { first: 'Jango', last: 'Fett' },
    children: ['Boba', 'Clone 1', 'Clone 2'],
    weapons: [
      { name: 'Blaster', description: 'For shooting stuff' },
      { name: 'Seismic charge', description: '...BWAAAAAANG' },
    ],
  },
}

const smallerObj = { a: 1, two: { three: 3 } }

const testObj2: any = { ...testObj1 }
delete testObj2.fun

const smallObject = { a: 'three' }

const t = { ...testObj2 }
// console.log(t)
// delete t.b.inner3.innerDeep2
// console.log(t)

const x = assign(arrayObj, '[2].one.y', { more: 'yes' })
// console.log(JSON.stringify(arrData, null, 2))
console.log(JSON.stringify(x, null, 2))
// console.log(JSON.stringify(t, null, 2))
// console.log(x)
// console.log(JSON.stringify(x, null, 2) === JSON.stringify(t, null, 2))
// console.log(arrData[2])
