import React from 'react'

const websocketAPI = 'wss://ws-feed.pro.coinbase.com'

export default class Portfolio extends React.Component {

  state = {
    socket: new WebSocket(websocketAPI),
    prices: [],
    dollar: 0,
    dollarCoin: 0,
  }

  precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  getProductIds = () => {
    return this.props.activeAccounts.map(account => {
      if (account.currency !== 'USD' || account.currency !== 'USDC') {
        return `${account.currency}-USD`
      } else return null
    })
  }

  setDollarAccounts = () => {
    return this.props.activeAccounts.map(account => {
      if (account.currency === 'USD') {
        return this.setState({dollar: account.balance})
      }
      if (account.currency === 'USDC') {
        return this.setState({dollarCoin: account.balance})
      }
      else return null
    })
  }

  componentDidMount() {
    this.setDollarAccounts()

    const { socket } = this.state
    socket.onopen = () => {
      const subscribe = {
        "type": "subscribe",
        "product_ids": this.getProductIds(),
        "channels": [
          {
            "name": "ticker",
            "product_ids": this.getProductIds()
          }
        ]
      }
      socket.send(JSON.stringify(subscribe))
    }

    socket.onmessage = (message) => {
      try {
        const response = JSON.parse(message.data);
        if (response.type === 'ticker'){
          return this.getProductIds().map(id => {
            if (response.product_id === id) {
              return this.setState({
                prices: {...this.state.prices, [id]: response.price}
              })
            } else return null
          })
        } else return null
      } catch (e) {
        console.log('Not valid JSON: ', JSON.parse(message.data))
        return
      }
    }

    socket.onerror = (error) => {
      try {
        console.log("There was an error: ", error);
      } catch (e) {
        console.log("There was an error: ", e);
        return
      }
    }

    socket.onclose = () => {

    }

  }

  componentWillUnmount() {
    const { socket } = this.state
      // const unsubscribe = {
      //   "type": "unsubscribe",
      //   "product_ids": this.getProductIds(),
      //   "channels": [ "ticker" ]
      // }
      // socket.send(JSON.stringify(unsubscribe))
      socket.close()
  }

  renderInvested = () => {
    return this.props.activeAccounts.map((account, index) => {
      for (let key in this.state.prices) {
        if (key.slice(0, 3) === account.currency || key.slice(0, 4) === account.currency) {
          return (
            <div className='p-price' key={index}>
              <div
                className='p-currency'>
                {`${account.currency}: `}
              </div>
              <div
                className='p-value'>
                {`$${this.precise(account.balance*this.state.prices[key], 5)}`}
              </div>
            </div>
          )
        }
      }
      return null
    })
  }

  render() {
    // console.log(this.props.activeAccounts);
    // console.log(this.state.prices);
    return (
      <div className='portfolio-container'>
        <div
          className='portfolio-balance-container'>
          <div className='p-balance-title'>{`Invested`}</div>
          <div className='balances'>
            {this.renderInvested()}
          </div>
        </div>
        <div
          className='portfolio-assets-container'>
          <div className='p-assets-title'>{`Available`}</div>
          <div className='usd-group'>
            <span className='usd-label'>{`USD: `}</span>
            <span className='usd-value'>{`$${this.precise(this.state.dollar, 5)}`}</span>
          </div>
          <div className='usd-group'>
            <span className='usd-label'>{`USDC: `}</span>
            <span className='usd-value'>{`$${this.precise(this.state.dollarCoin, 2)}`}</span>
          </div>
        </div>
      </div>
    )
  }
}
