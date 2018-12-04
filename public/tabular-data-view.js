import formatFns from './format-fns.js'

export default class TabularDataView {
  constructor (columns, tabularData) {
    const columnDefinitions = columns.reduce(function (list, definition) {
      const { source, title, ...definitionRest } = definition

      if (source instanceof RegExp) {
        list.push(...tabularData.matchColumns(source).map(function (column) {
          return {
            title: column.match(title)[1],
            source: column,
            ...definitionRest
          }
        }))
      } else {
        list.push(definition)
      }

      return list
    }, [])

    this.columns = columnDefinitions.map(function ({ title, source }) {
      return { title }
    })

    const columnsMap = tabularData.columns
    const rowMap = tabularData.rows

    this.rows = tabularData.ids.map(function (id) {
      const row = rowMap[id]
      return columnDefinitions.map(function ({ primaryKey, source, format }) {
        let value

        if (primaryKey) {
          value = id
        } else {
          value = row[columnsMap[source]]
        }

        return { value: format ? formatFns[format](value) : value }
      })
    })
  }
}
