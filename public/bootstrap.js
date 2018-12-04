import { bind, wire } from '/hyperhtml.js'
import './dynamic-table.js'
import Api from './api.js'
import config from './config.js'

const api = new Api()
const data = api.get()

document.querySelector('head title').textContent = config.title
document.querySelector('#title').textContent = config.title

bind(document.querySelector('#tables'))`
  ${config.tables.map((table, index) => wire(table)`
    <h2 class="f3 lh-title">${table.title}</h1>
    <dynamic-table data=${data[index]}/>
    <br>
  `)}
`
