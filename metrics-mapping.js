import TabularData from './common/tabular-data.js'

function isNumber (field) {
  // https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number#comment32052139_175787
  return (+field === +field) // eslint-disable-line
}

function mapLine (line) {
  const [ id, value ] = line.split(' ')
  return [id, isNumber(value) ? parseInt(value) : value]
}

function traverseRawData (prefix, rawData, tabularData) {
  for (const key in rawData) {
    const node = rawData[key]
    const name = (prefix !== '' ? `${prefix}.${key}` : key)

    if (typeof node === 'string') {
      const lines = node.trim().split('\n')

      for (const line of lines) {
        const tuple = mapLine(line)
        tabularData.addRawLogEntry(name, tuple)
      }
    } else {
      traverseRawData(name, node, tabularData)
    }
  }
}

export default function rawToTabularData (rawData) {
  const tabularData = new TabularData()

  traverseRawData('', rawData, tabularData)

  return tabularData
}
