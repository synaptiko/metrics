// overtaken from https://github.com/sindresorhus/pretty-bytes/blob/master/index.js and simplified
const SIZE_UNITS = ['B', 'kB', 'MB']
function formatFileSize (value) { // in bytes
  if (!Number.isFinite(value)) {
    return value
  }

  const isNegative = value < 0
  const prefix = isNegative ? '-' : ''

  if (isNegative) {
    value = -value
  }

  if (value < 1) {
    return prefix + value + ' B'
  }

  const exponent = Math.min(Math.floor(Math.log10(value) / 3), SIZE_UNITS.length - 1)
  const unit = SIZE_UNITS[exponent]

  value = Number((value / Math.pow(1000, exponent)).toPrecision(3))

  return prefix + value + ' ' + unit
}

function pad (value) {
  value = '' + value
  return (value.length === 1 ? '0' + value : value)
}

function formatDateTime (value) {
  if (!Number.isFinite(value)) {
    return value
  }

  const date = new Date(value * 1000)
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  const second = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const DURATION_UNITS = ['h', 'm', 's']
function formatDuration (value) { // in ms
  if (!Number.isFinite(value)) {
    return value
  }

  const isNegative = value < 0
  const prefix = isNegative ? '-' : ''

  if (isNegative) {
    value = -value
  }

  return prefix + [
    Math.floor(value / 3600000), // hours
    Math.floor(value / 60000) % 60, // minutes
    Math.floor(value / 1000) % 60 // seconds
  ].reduce(function (result, value, index) {
    if (value > 0 || DURATION_UNITS[index] === 's') {
      result.push(value + DURATION_UNITS[index])
    }
    return result
  }, []).join(' ')
}

export default {
  fileSize: formatFileSize,
  dateTime: formatDateTime,
  duration: formatDuration
}
