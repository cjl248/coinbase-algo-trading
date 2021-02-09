import React from 'react'

const websocketAPI = 'wss://ws-feed.pro.coinbase.com'

export default class Portfolio extends React.Component {

  state = {
    socket: new WebSocket(websocketAPI),
    prices: {},
    dollarValue: 0,
    dollarCoinValue: 0,
    totalValue: 0,
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
        return this.setState({dollarValue: account.balance})
      }
      if (account.currency === 'USDC') {
        return this.setState({dollarCoinValue: account.balance})
      }
      else return null
    })
  }

  renderInvested = () => {
    return this.props.activeAccounts.map((account, index) => {
      for (let key in this.state.prices) {
        if (key.slice(0, 3) === account.currency || key.slice(0, 4) === account.currency) {
          const percentage = this.getPortfolioPercentage(account.balance*this.state.prices[key])
          return (
            <div className='p-price' key={index}>
              <div className='p-currency'>
                {`${account.currency}: `}
              </div>
              <div className='p-value'>
                {`$${this.precise(account.balance*this.state.prices[key], 5)}`}
              </div>
              <div className='p-percentage'>
                {`${percentage}%`}
              </div>
            </div>
          )
        }
      }
      return null
    })
  }

  getTotalValue = () => {
    const { activeAccounts } = this.props
    const totalValue = activeAccounts.reduce((sum, current) => {
      if (current.currency === 'USD' || current.currency === 'USDC') {
        return sum += Number.parseFloat(current.balance)
      } else {
        const currentPrice = this.state.prices[`${current.currency}-USD`]
        const currentBalance = current.balance
        const currentValue = Number.parseFloat(currentPrice) * Number.parseFloat(currentBalance)
        return sum += currentValue
      }
    }, 0)
    this.setState({ totalValue })
  }

  getPortfolioPercentage = (product) => {
    if (this.state.totalValue === 0 && product === 0 ) {
      return 0
    } else if (this.state.totalvalue === product) {
      return 100
    } else if (this.state.totalValue === 0 && product > 0){
      return 100
    } else {
      return this.precise(Number.parseFloat(product) / Number.parseFloat(this.state.totalValue) * 100, 4)

    }
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
              this.setState({
                prices: {...this.state.prices, [id]: response.price}
              })
              return this.getTotalValue()
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
      return null
    }

  }

  render() {
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
            <span className='usd-value'>{`$${this.precise(this.state.dollarValue, 5)}`}</span>
            <span
              className='percentage'>
              {`${this.getPortfolioPercentage(this.state.dollarValue)}%`}
            </span>
          </div>
          <div className='usd-group'>
            <span className='usd-label'>{`USDC: `}</span>
            <span className='usd-value'>{`$${this.precise(this.state.dollarCoinValue, 2)}`}</span>
            <span
              className='percentage'>
              {`${this.getPortfolioPercentage(this.state.dollarCoinValue)}%`}
            </span>
          </div>
        </div>
      </div>
    )
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

}
