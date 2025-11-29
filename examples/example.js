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

console.log(jtr(jsonObj, 'name')) // John Doe
