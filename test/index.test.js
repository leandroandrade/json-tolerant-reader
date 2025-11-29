'use strict'

const { test } = require('node:test')
const jtr = require('..')

const jsonObj = {
  name: 'John Doe',
  age: 30,
  address: {
    street: 'Home address',
    city: 'New York',
    coordinates: {
      lat: 40.76,
      long: -73.97
    }
  },
  work: {
    company: 'Tech Corp',
    address: {
      street: 'Work Address',
      city: 'New York'
    }
  },
  hobbies: [
    { name: 'Soccer', category: 'Sport' },
    { name: 'Reading', category: 'Culture' }
  ]
}

const jsonArr = [
  {
    languages: [
      {
        language: 'C',
        creator: 'Dennis Ritchie'
      },
      {
        language: 'C++',
        creator: 'Bjarne Stroustrup'
      },
      {
        language: 'JavaScript',
        creator: 'Brendan Eich'
      }
    ]
  }

]

test('json-tolerant-reader return single value', t => {
  t.assert.deepStrictEqual(
    jtr(jsonObj, 'name'),
    'John Doe'
  )

  t.assert.deepStrictEqual(
    jtr(jsonArr, 'language'),
    'C'
  )
})

test('json-tolerant-reader return object', t => {
  t.assert.deepStrictEqual(
    jtr(jsonObj, 'address'),
    {
      street: 'Home address',
      city: 'New York',
      coordinates: {
        lat: 40.76,
        long: -73.97
      }
    }
  )

  t.assert.deepStrictEqual(
    jtr(jsonArr, 'languages'),
    [
      {
        language: 'C',
        creator: 'Dennis Ritchie'
      },
      {
        language: 'C++',
        creator: 'Bjarne Stroustrup'
      },
      {
        language: 'JavaScript',
        creator: 'Brendan Eich'
      }
    ]
  )
})

test('json-tolerant-reader return object with all occurrences', t => {
  t.assert.deepStrictEqual(
    jtr(jsonObj, 'address', true),
    [
      {
        street: 'Home address',
        city: 'New York',
        coordinates: {
          lat: 40.76,
          long: -73.97
        }
      },
      {
        street: 'Work Address',
        city: 'New York'
      }
    ]
  )

  t.assert.deepStrictEqual(
    jtr(jsonArr, 'language', true),
    [
      'C',
      'C++',
      'JavaScript'
    ]
  )
})

test('json-tolerant-reader return null when key does not exists', t => {
  t.assert.deepStrictEqual(
    jtr(jsonObj, 'foo'),
    null
  )

  t.assert.deepStrictEqual(
    jtr(jsonArr, 'foo'),
    null
  )
})

test('json-tolerant-reader return empty array when key does not exists and allOccurrences is true', t => {
  t.assert.deepStrictEqual(
    jtr(jsonArr, 'foo', true),
    []
  )
})

test('json-tolerant-reader throw error when json not an object', t => {
  t.assert.throws(
    () => jtr(null, 'foo'),
    { message: 'json-tolerant-reader json must be an object or array' }
  )

  t.assert.throws(
    () => jtr('foobar', 'foo'),
    { message: 'json-tolerant-reader json must be an object or array' }
  )

  t.assert.throws(
    () => jtr(123, 'foo'),
    { message: 'json-tolerant-reader json must be an object or array' }
  )

  t.assert.throws(
    () => jtr(undefined, 'foo'),
    { message: 'json-tolerant-reader json must be an object or array' }
  )
})

test('json-tolerant-reader throw error when jsonKey not a string', t => {
  t.assert.throws(
    () => jtr(jsonObj, ''),
    { message: 'json-tolerant-reader jsonKey must be a non-empty string' }
  )

  t.assert.throws(
    () => jtr(jsonObj, 123),
    { message: 'json-tolerant-reader jsonKey must be a non-empty string' }
  )

  t.assert.throws(
    () => jtr(jsonObj, null),
    { message: 'json-tolerant-reader jsonKey must be a non-empty string' }
  )

  t.assert.throws(
    () => jtr(jsonObj, undefined),
    { message: 'json-tolerant-reader jsonKey must be a non-empty string' }
  )
})

test('json-tolerant-reader handle circular references', t => {
  const circular = { name: 'root', child: {} }
  circular.child.parent = circular

  t.assert.deepStrictEqual(
    jtr(circular, 'name'),
    'root'
  )

  const circularWithTarget = { data: { value: 'found' } }
  circularWithTarget.data.self = circularWithTarget

  t.assert.deepStrictEqual(
    jtr(circularWithTarget, 'value'),
    'found'
  )
})

test('json-tolerant-reader handle empty objects and arrays', t => {
  t.assert.deepStrictEqual(
    jtr({}, 'foo'),
    null
  )

  t.assert.deepStrictEqual(
    jtr([], 'foo'),
    null
  )

  t.assert.deepStrictEqual(
    jtr({ nested: {} }, 'foo'),
    null
  )
})

test('json-tolerant-reader handle arrays with primitive values', t => {
  const arrWithPrimitives = [1, 2, 3, 'string', true, null]

  t.assert.deepStrictEqual(
    jtr(arrWithPrimitives, 'foo'),
    null
  )

  const mixedArr = [1, { foo: 'bar' }, 3]
  t.assert.deepStrictEqual(
    jtr(mixedArr, 'foo'),
    'bar'
  )
})

test('json-tolerant-reader handle falsy values', t => {
  const objWithFalsy = {
    nullValue: null,
    zeroValue: 0,
    falseValue: false,
    emptyString: '',
    undefinedValue: undefined
  }

  t.assert.deepStrictEqual(
    jtr(objWithFalsy, 'nullValue'),
    null
  )

  t.assert.deepStrictEqual(
    jtr(objWithFalsy, 'zeroValue'),
    0
  )

  t.assert.deepStrictEqual(
    jtr(objWithFalsy, 'falseValue'),
    false
  )

  t.assert.deepStrictEqual(
    jtr(objWithFalsy, 'emptyString'),
    ''
  )

  t.assert.deepStrictEqual(
    jtr(objWithFalsy, 'undefinedValue'),
    undefined
  )
})

test('json-tolerant-reader handle deeply nested structures', t => {
  const deep = { level1: { level2: { level3: { level4: { level5: { target: 'deep value' } } } } } }

  t.assert.deepStrictEqual(
    jtr(deep, 'target'),
    'deep value'
  )

  t.assert.deepStrictEqual(
    jtr(deep, 'level3'),
    { level4: { level5: { target: 'deep value' } } }
  )
})

test('json-tolerant-reader handle key collision at multiple levels', t => {
  const collision = {
    name: 'root level',
    child: {
      name: 'child level',
      grandchild: {
        name: 'grandchild level'
      }
    }
  }

  t.assert.deepStrictEqual(
    jtr(collision, 'name'),
    'root level'
  )

  t.assert.deepStrictEqual(
    jtr(collision, 'name', true),
    ['root level', 'child level', 'grandchild level']
  )
})
