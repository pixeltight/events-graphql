import React, { Component } from 'react'

import AuthContext from '../context/auth-context'
import Backdrop from '../components/Backdrop/Backdrop'
import Modal from '../components/Modal/Modal'
import EventList from '../components/Events/EventList/EventList'
import './Events.css'

class EventsPage extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      creating: false,
      events: []
    }

    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }
  
  static contextType = AuthContext

  componentDidMount() {
    this.fetchEvents()
  }

  fetchEvents = () => {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Create user POST failed')
        }
        return res.json()
      })
      .then(resData => {
        const events = resData.data.events
        this.setState({ events: events })
      })
      .catch(err => {
        console.log('events query err: ', err)
      })
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true })
  }

  modalConfirmHandler = () => {
    this.setState({ creating: false })
    const title = this.titleElRef.current.value
    const price = +this.priceElRef.current.value
    const date = this.dateElRef.current.value
    const description = this.descriptionElRef.current.value

    if(
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return
    }

    const event = {
      title,
      price,
      date,
      description
    }
    console.log(event)
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: { title: "${title}", description: "${description}", price: ${price}, date: "${date}" }) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    }

    const token = this.context.token

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Create user POST failed')
        }
        return res.json()
      })
      .then(resData => {
        this.fetchEvents()
      })
      .catch(err => {
        console.log('createEvent post: ', err)
      })
  }

  modalCancelHandler = () => {
    this.setState({ creating: false })
  }

  render () {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating &&
          <Modal title='Add Event'
            onCancel = {this.modalCancelHandler}
            onConfirm = {this.modalConfirmHandler}
            canCancel 
            canConfirm>
          <form>
            <div className='form-control'>
              <label htmlFor='title'>Title</label>
              <input type='text' id='title' ref={this.titleElRef} />
            </div>
            <div className='form-control'>
              <label htmlFor='price'>Price</label>
              <input type='number' id='price' ref={this.priceElRef} />
            </div>
            <div className='form-control'>
              <label htmlFor='date'>Date</label>
              <input type='datetime-local' id='date' ref={this.dateElRef} />
            </div>
            <div className='form-control'>
              <label htmlFor="description">Description</label>
              <textarea id='description' rows='4' ref={this.descriptionElRef} />
            </div>
          </form>
        </Modal>}
        {this.context.token && (
          <div className='events-control'>
            <p>Share your own events!</p>
            <button className='btn' onClick={this.startCreateEventHandler}>Create Event</button>
          </div>)}
        <EventList
          events={this.state.events}
          authUserId={this.context.userId} />
      </React.Fragment>
    )
  }
}

export default EventsPage
