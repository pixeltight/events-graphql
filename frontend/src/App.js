import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Router path='/' component={null}>
      </BrowserRouter>
    )
  }
}

export default App
