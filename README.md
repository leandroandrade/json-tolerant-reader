# json-tolerant-reader

A lightweight utility for recursively searching and extracting values from nested JSON structures by key name. Inspired by Martin Fowler's [Tolerant Reader](https://martinfowler.com/bliki/TolerantReader.html) pattern.

## Why Tolerant Reader?

> "Be conservative in what you do, be liberal in what you accept from others."
> — Jon Postel

The [Tolerant Reader](https://martinfowler.com/bliki/TolerantReader.html) is an approach to building robust integrations that can handle changes in **json** objects. This library embodies that principle by:

- **Ignoring unknown fields**: Only searches for the specific key you need
- **Handling structural changes**: Works regardless of nesting depth or structure
- **Graceful degradation**: Returns `null` instead of throwing errors when keys are missing
- **Flexible extraction**: Can find values anywhere in the structure without requiring exact paths

This makes your code more resilient to API changes, schema evolution, and varying data formats.

#### Real-World Example: Resilient API Integration

Imagine you're consuming a third-party API that returns user data. Your code expects to find an `email` field:

```javascript
const jtr = require('json-tolerant-reader')

// Original API response (v1)
const apiResponseV1 = {
  user: {
    id: 123,
    email: 'user@example.com',
    profile: {
      name: 'John Doe'
    }
  }
}

// Your code works fine
const email = jtr(apiResponseV1, 'email')  // 'user@example.com'
```

Later, the API changes its structure (v2), moving `email` into a nested `contact` object:

```javascript
// New API response (v2) - structure changed!
const apiResponseV2 = {
  user: {
    id: 123,
    profile: {
      name: 'John Doe',
      contact: {
        email: 'user@example.com',
        phone: '+1234567890'
      }
    }
  }
}

// Your code still works! No changes needed
const email = jtr(apiResponseV2, 'email')  // 'user@example.com'
```

**Without json-tolerant-reader**, you'd need to update your code:
```javascript
// Brittle approach - breaks when API changes
const emailV1 = apiResponseV1.user.email           // Works in v1
const emailV2 = apiResponseV2.user.email           // undefined in v2 ❌
const emailV2Fixed = apiResponseV2.user.profile.contact.email  // Now you need this
```

**With json-tolerant-reader**, your code continues to work regardless of where `email` is located in the structure. This makes your integration resilient to API changes, refactoring, and schema evolution.

## Installation

```bash
npm install json-tolerant-reader
```

## Usage

```javascript
const jtr = require('json-tolerant-reader')

const data = {
  name: 'John Doe',
  address: {
    city: 'New York',
    coordinates: {
      lat: 40.76,
      long: -73.97
    }
  },
  work: {
    address: {
      city: 'Boston'
    }
  }
}

// Find first occurrence
jtr(data, 'city')  // 'New York'

// Find all occurrences
jtr(data, 'city', true)  // ['New York', 'Boston']

// Find nested values
jtr(data, 'lat')  // 40.76

// Returns null if not found
jtr(data, 'unknown')  // null
```

## API

### `jsonTolerantReader(json, jsonKey, allOccurrences)`

Recursively searches for a key in a JSON object or array.

**Parameters:**
- `json` (Object|Array) - The JSON object or array to search
- `jsonKey` (string) - The key name to search for
- `allOccurrences` (boolean, optional) - If `true`, returns all matching values; if `false` (default), returns only the first match

**Returns:**
- When `allOccurrences` is `false`: The first matching value, or `null` if not found
- When `allOccurrences` is `true`: An array of all matching values, or `[]` if none found

## License

[MIT License](https://github.com/leandroandrade/json-tolerant-reader/blob/main/LICENSE/)
