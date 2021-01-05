import React from 'react'

const pAPI = 'http://localhost:3000/c_products'

export default class Balance extends React.Component {

  state = {
    prices: [],
    balance: 0
  }

  render() {
    return (
      <div className='balance-container'>
        {`Balance: ${this.state.balance}`}
      </div>
    )
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

}
