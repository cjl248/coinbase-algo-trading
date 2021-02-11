import React from 'react'

import Orders from './Home/Orders.jsx'
import Assets from './Home/Assets.jsx'
import Signals from './Home/Signals.jsx'

const aAPI = 'http://localhost:3000/c_accounts'
const pAPI = 'http://localhost:3000/c_products'

export default class Home extends React.Component {

  precise = float => Number.parseFloat(float).toPrecision(6)

  state = {
    accounts: [],
    prices: [],
    orders: {},
    dollarBalance: 0,
    dollarcoinBalance: 0,
    controller: new AbortController()
  }

  getAccounts = async () => {
    const config = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json",
      },
      signal: this.state.controller.signal
    }
    try {
      const response = await fetch(aAPI, config)
      response.json().then(accounts => {
        this.setState({
          accounts
        }, () => {
          const config = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Accepts": "application/json",
            },
            signal: this.state.controller.signal
          }
          return this.state.accounts.map(account => {
            if (account.balance > 0 && account.currency !== 'USD' && account.currency !== 'USDC') {
              const currency = account.currency
              const requestPath = `${pAPI}?product=${currency}-USD`
              fetch(requestPath, config)
              .then(r => r.json())
              .then(price => {
                this.setState({
                  prices: [...this.state.prices, {[currency]: {'currency': currency, ...price}}],
                })
              })
            } else if (account.balance > 0 && account.currency === 'USDC') {
              this.setState({
                dollarcoinBalance: account.balance
              })

            } else if (account.balance > 0 && account.currency === 'USD') {
              this.setState({
                dollarBalance: account.balance
              })
            }
            return null
          })
        })
      })
    } catch(e) {
      if (e.name === 'AbortError') {
        console.warn('Accounts fetch aborted.')
      } else {
        throw e
      }
    }
  }

  render() {
    return (
      <div className='home-container'>
        <Orders
          accounts={this.state.accounts}>
        </Orders>
        <Assets
          accounts={this.state.accounts}
          prices={this.state.prices}
          dollarBalance={this.state.dollarBalance}
          dollarcoinBalance={this.state.dollarcoinBalance}>
        </Assets>
        <Signals
          setActivePage={this.props.setActivePage}>
        </Signals>
        <div className='col2-row2'></div>
      </div>
    )
  }

  componentDidMount() {
    this.getAccounts()
  }

  componentWillUnmount() {
    this.state.controller.abort()
  }

}
