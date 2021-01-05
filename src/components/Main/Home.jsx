import React from 'react'

import Orders from './Home/Orders.jsx'
import Assets from './Home/Assets.jsx'

const aAPI = 'http://localhost:3000/c_accounts'
const pAPI = 'http://localhost:3000/c_products'

export default class Home  extends React.Component {

  state = {
    accounts: [],
    prices: [],
    portfolioBalance: 0,
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
      }, () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json",
          }
        }
        this.state.accounts.map(account => {
          if (account.balance > 0 && account.currency !== 'USD') {
            const currency = account.currency
            const requestPath = `${pAPI}?product=${currency}-USD`
            fetch(requestPath, config).then(r => r.json())
            .then(price => {
              this.setState({
                prices: [...this.state.prices, {[currency]: {'currency': currency, ...price}}]
              })
            })
          }
        })
      })
    })
  }

  render() {
    return (
      <div className='home-container'>
        <Orders
          accounts={this.state.accounts}
          prices={this.state.prices}>
        </Orders>
        <Assets
          accounts={this.state.accounts}
          prices={this.state.prices}>
        </Assets>
        <div className='col2-row1'></div>
        <div className='col2-row2'></div>
      </div>
    )
  }

  componentDidMount() {
    this.getAccounts()
  }
}
