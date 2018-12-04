import TabularDataView from './tabular-data-view.js'
import TabularData from './tabular-data.js'
import config from './config.js'

class ProxyHandler {
  constructor () {
    this.cache = {}
  }

  get (object, property) {
    const cache = this.cache

    if (property in cache) {
      return cache[property]
    }

    if (property in object) {
      if (typeof object[property] === 'function') {
        cache[property] = object[property].bind(object)
        return cache[property]
      } else {
        // do not cache this (could be a primitive value)
        return object[property]
      }
    } else if (property === 'map') {
      cache[property] = function map (...args) {
        return object.then(result => result.map(...args))
      }
      return cache[property]
    } else {
      cache[property] = new NestedPromise(function (resolve) {
        object.then(function (result) {
          resolve(result[property])
        })
      })
      return cache[property]
    }
  }
}

function NestedPromise (executor) {
  return new Proxy(new Promise(executor), new ProxyHandler())
}

export default class Api {
  get () {
    return new NestedPromise(function (resolve) {
      fetch('/metrics')
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
          const tabularData = new TabularData(data)

          resolve(config.tables.map(function ({ columns }) {
            return new TabularDataView(columns, tabularData)
          }))
        })
    })
  }
}
