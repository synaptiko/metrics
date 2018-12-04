import { mkdir, appendFile, readFile, readdir } from 'fs'
import { join, sep } from 'path'
import { promisify } from 'util'
import rawToTabularData from './metrics-mapping.js'

const mkdirAsync = promisify(mkdir)
const appendFileAsync = promisify(appendFile)
const readFileAsync = promisify(readFile)
const readdirAsync = promisify(readdir)

async function ensureFileExist (path) {
  const parts = path.split(sep)

  for (let i = 0, ln = parts.length, subpath; i < ln; i += 1) {
    const part = parts[i]

    subpath = (subpath ? join(subpath, part) : part)

    if (i < ln - 1) {
      try {
        await mkdirAsync(subpath)
      } catch (_) {
        // do not fail; dir most probably already exists (stat would fail as well)
      }
    } else {
      await appendToFile(subpath, '')
    }
  }
}

async function appendToFile (path, line) {
  await appendFileAsync(path, line, 'utf8')
}

export async function writeMetric (id, name, value) {
  const path = join('db', ...name.split('.')) + '.log'

  await ensureFileExist(path)
  await appendToFile(path, `${id} ${value}\n`)
}

function addToMap (map, path, log) {
  const parts = path.replace(/\.log$/, '').split(sep)
  let object = map

  for (const part of parts.slice(0, -1)) {
    object[part] = object[part] || {}
    object = object[part]
  }

  object[parts.slice(-1)] = log
}

async function readMetrics (path, map) {
  const dirents = await readdirAsync(path, {
    withFileTypes: true
  })

  for (const dirent of dirents) {
    const { name } = dirent
    const newPath = join(path, name)

    if (dirent.isDirectory()) {
      await readMetrics(newPath, map)
    } else if (dirent.isFile() && name.endsWith('.log')) {
      const log = await readFileAsync(newPath, 'utf8')
      addToMap(map, newPath, log)
    }
  }

  return map
}

export async function readAllMetrics () {
  return rawToTabularData((await readMetrics('db', {})).db)
}
