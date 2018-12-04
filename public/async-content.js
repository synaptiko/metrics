import HyperHTMLElement from '/hyperhtml.js'

export default class AsyncContent extends HyperHTMLElement {
  created () {
    this.setState({
      placeholder: this.querySelector('placeholder'),
      content: this.querySelector('content'),
      loaded: false
    })
  }

  set 'wait-for' (value) {
    value.then(() => {
      this.setState({ loaded: true })
    })
  }

  render () {
    if (!this.state.loaded) {
      return this.html`${this.state.placeholder.childNodes}`
    } else {
      return this.html`${this.state.content.childNodes}`
    }
  }
}

AsyncContent.define('async-content')
