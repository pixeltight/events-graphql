import React, { Component } from 'react'

import './Auth.css'

class AuthPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLogin: true
    }

    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()
  }

  submitHandler = (event) => {
    event.preventDefault()

    const email = this.emailEl.current.value
    const password = this.passwordEl.current.value

    if (email.trim().length === 0 || password.trim() === 0) {
      return
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    }

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: { email: "${email}", password: "${password}" }) {
              _id
              email
            }
          }
        `
      }
    }

    console.log(JSON.stringify(requestBody))

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Create user POST failed')
        }
        return res.json()
      })
      .then(resData => {
        console.log('J-E-L-L-O! ', resData)
      })
      .catch(err => {
        console.log('createUser post: ', err)
      })
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin }
    })
  }

  render () {
    return (
      <form className='auth-form' onSubmit={this.submitHandler}>
        <div className='form-control'>
          <label htmlFor='email'>email</label>
          <input type='email' id='email' ref={this.emailEl} />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>password</label>
          <input type='password' id='password' ref={this.passwordEl} />
        </div>
        <div className='form-actions'>
          <button type='submit'>Submit</button>
          <button type='button' onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </form>
    )
  }
}

export default AuthPage
