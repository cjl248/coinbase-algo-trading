import React from 'react'

import Balance from './Home/Balance.jsx'
import Assets from './Home/Assets.jsx'

const aAPI = 'http://localhost:3000/c_accounts'

export default class Home  extends React.Component {

  state = {
    accounts: [],
  }

  getAccounts = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json",
      }
    }
    const response = await fetch(aAPI, config)
    response.json().then(accounts => {
      this.setState({
        accounts
      })
    })
  }

  render() {
    return (
      <div className='home-container'>
        <Balance accounts={this.state.accounts}></Balance>
        <Assets accounts={this.state.accounts}></Assets>
        <div className='col2-row1'></div>
        <div className='col2-row2'></div>
      </div>
    )
  }

  componentDidMount() {
    this.getAccounts()
  }
}
