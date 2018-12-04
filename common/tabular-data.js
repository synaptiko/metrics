export default class TabularData {
  // TODO jprokop: add sorting?
  constructor ({ columns, rows } = { columns: {}, rows: {} }) {
    this.ids = Object.keys(rows)
    this.columns = columns
    this.columnCount = Object.keys(columns).length
    this.rows = rows
  }

  addRawLogEntry (name, [ id, value ]) {
    const { ids, rows, columns, columnCount } = this

    let row

    if (id in rows) {
      row = rows[id]
    } else {
      ids.push(id)
      row = []
      rows[id] = row
    }

    let columnIndex

    if (name in columns) {
      columnIndex = columns[name]
    } else {
      columnIndex = columnCount
      columns[name] = columnIndex
      this.columnCount += 1
    }

    row[columnIndex] = value
  }

  matchColumns (pattern) {
    const columns = Object.keys(this.columns)

    return columns.filter(function (column) {
      return pattern.test(column)
    })
  }

  toJsonObject () {
    const { columns, rows } = this
    return {
      columns,
      rows
    }
  }
}
