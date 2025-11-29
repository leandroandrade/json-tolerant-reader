'use strict'

/**
 * Recursively searches through a JSON object or array for a specific key
 * @param {Object|Array} json - The JSON object or array to search through
 * @param {string} jsonKey - The key name to search for
 * @param {Boolean} allOccurrences - If true, returns all occurrences; if false, returns only the first match
 * @returns {*|Array|null} The value(s) associated with the key, or null if not found
 * @throws {Error} If json is not an object/array or if jsonKey is not a non-empty string
 */
function jsonTolerantReader (json, jsonKey, allOccurrences = false) {
  if (json == null || typeof json !== 'object') {
    throw new Error('json-tolerant-reader json must be an object or array')
  }

  if (typeof jsonKey !== 'string' || jsonKey.length === 0) {
    throw new Error('json-tolerant-reader jsonKey must be a non-empty string')
  }

  const visited = new WeakSet()

  if (allOccurrences) {
    const results = []

    function searchAll (current) {
      if (current === null || typeof current !== 'object') {
        return
      }

      if (visited.has(current)) {
        return
      }

      visited.add(current)

      if (Object.hasOwn(current, jsonKey)) {
        results.push(current[jsonKey])
      }

      const items = Array.isArray(current)
        ? current
        : Object.values(current)

      for (const item of items) {
        searchAll(item)
      }
    }
    searchAll(json)

    return results
  } else {
    let found = false
    let result = null

    function searchFirst (current) {
      if (found || current === null || typeof current !== 'object') {
        return
      }

      if (visited.has(current)) {
        return
      }

      visited.add(current)

      if (Object.hasOwn(current, jsonKey)) {
        result = current[jsonKey]
        found = true
        return
      }

      const items = Array.isArray(current)
        ? current
        : Object.values(current)

      for (const item of items) {
        searchFirst(item)
        if (found) {
          return
        }
      }
    }

    searchFirst(json)

    return result
  }
}

module.exports = jsonTolerantReader
module.exports.default = jsonTolerantReader
module.exports.jsonTolerantReader = jsonTolerantReader
