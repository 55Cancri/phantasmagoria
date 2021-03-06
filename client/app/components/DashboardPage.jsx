import React, { Component } from 'react'
import Header from './Header.jsx'

class DashboardPage extends Component {
  state = {
    counters: []
  }

  componentDidMount = () => {
    fetch('/api/counters')
      .then(res => res.json())
      .then(json => {
        this.setState({
          counters: json
        })
      })
  }

  newCounter = () => {
    fetch('/api/counters', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        let data = this.state.counters
        data.push(json)

        this.setState({
          counters: data
        })
      })
  }

  incrementCounter = index => {
    const id = this.state.counters[index]._id

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json)
      })
  }

  decrementCounter = index => {
    const id = this.state.counters[index]._id

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json)
      })
  }

  deleteCounter = index => {
    const id = this.state.counters[index]._id

    fetch(`/api/counters/${id}`, { method: 'DELETE' }).then(_ => {
      this._modifyCounter(index, null)
    })
  }

  _modifyCounter = (index, data) => {
    let prevData = this.state.counters

    if (data) {
      prevData[index] = data
    } else {
      prevData.splice(index, 1)
    }

    this.setState({
      counters: prevData
    })
  }

  render = () => {
    return (
      <div>
        <h2>Counters:</h2>

        <ul>
          {this.state.counters &&
            this.state.counters.map((counter, i) => (
              <li key={i}>
                <span> {counter.count} </span>
                <button onClick={() => this.incrementCounter(i)}>+</button>
                <button onClick={() => this.decrementCounter(i)}>-</button>
                <button onClick={() => this.deleteCounter(i)}>x</button>
              </li>
            ))}
        </ul>

        <button onClick={this.newCounter}>New counter</button>
      </div>
    )
  }
}

export default DashboardPage
