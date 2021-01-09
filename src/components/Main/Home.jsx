import React from 'react'

import Orders from './Home/Orders.jsx'
import Assets from './Home/Assets.jsx'
import Signals from './Home/Signals.jsx'

const aAPI = 'http://localhost:3000/c_accounts'
const pAPI = 'http://localhost:3000/c_products'
const oAPI = 'http://localhost:3000/c_orders'

export default class Home  extends React.Component {

  precise = float => Number.parseFloat(float).toPrecision(5)

  state = {
    accounts: [],
    prices: [],
    orders: {},
    dollarBalance: 0,
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
        return this.state.accounts.map(account => {
          if (account.balance > 0 && account.currency !== 'USD') {
            const currency = account.currency
            const requestPath = `${pAPI}?product=${currency}-USD`
            fetch(requestPath, config).then(r => r.json())
            .then(price => {
              this.setState({
                prices: [...this.state.prices, {[currency]: {'currency': currency, ...price}}],
                // dollarBalance: this.state.dollarBalance+this.precise(account.balance*price.price)
              })
            })
          } else if (account.currency === 'USD') {
            this.setState({
              dollarBalance: this.precise(account.balance)
            })
          }
          return 0
        })
      })
    })
  }

  getProductIds = () => {
    const { activeAccounts } = this.props
    return activeAccounts.map(account => {
      return `${account.currency}-USD`
    })
  }

  getActiveOrders = () => {
    return this.getProductIds().map(product => {
      const requestPath = `${oAPI}?product=${product}`
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Accepts": "application/json",
        }
      }
      fetch(requestPath, config)
      .then(r => r.json())
      .then(orders => {
        if (orders.length > 0) {
          this.setState({
            orders: {...this.state.orders, [product]: orders}
          })
        }
      })
    })
  }

  render() {
    return (
      <div className='home-container'>
        <Orders
          accounts={this.state.accounts}
          orders={this.state.orders}>
        </Orders>
        <Assets
          accounts={this.state.accounts}
          prices={this.state.prices}
          dollarBalance={this.state.dollarBalance}>
        </Assets>
        <Signals>
        </Signals>
        <div className='col2-row2'></div>
      </div>
    )
  }

  componentDidMount() {
    this.getAccounts()
    this.getActiveOrders()
  }

}
