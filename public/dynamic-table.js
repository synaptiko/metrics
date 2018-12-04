import HyperHTMLElement, { Component } from '/hyperhtml.js'
import './async-content.js'

class Column extends Component {
  constructor ({ title }) {
    super()
    this.title = title
  }

  render () {
    return this.html`
      <th class="pv2 ph3 tl f6 fw6 ttu">${this.title}</th>
    `
  }
}

class Cell extends Component {
  constructor ({ value }) {
    super()
    this.value = value
  }

  render () {
    return this.html`
        <td class="pv2 ph3">${this.value}</td>
    `
  }
}

class Row extends Component {
  constructor (cells) {
    super()
    this.cells = cells
  }

  render () {
    return this.html`
      <tr>
        ${this.cells.map(cell => Cell.for(cell))}
      </tr>
    `
  }
}

export default class DynamicTable extends HyperHTMLElement {
  render () {
    const data = this.data
    const { columns, rows } = data

    return this.html`
      <async-content wait-for=${data}>
        <placeholder>Loading data...</placeholder>
        <content>
          <table class="collapse ba br2 b--black-10 pv2 ph3 mt4">
            <thead>
              <tr>
                ${columns.map(column => Column.for(column))}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => Row.for(row))}
            </tbody>
          </table>
        </content>
      </async-content>
    `
  }
}

DynamicTable.define('dynamic-table')
