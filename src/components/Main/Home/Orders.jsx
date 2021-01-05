import React from 'react'

export default class Orders extends React.Component {

  state = {
    prices: [],
  }

  render() {
    return (
      <div className='orders-container'>
        <div className='orders-title'>{`Orders`}</div>
      </div>
    )
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

}
