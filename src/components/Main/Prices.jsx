import React from 'react'

const websocketAPI = 'wss://ws-feed.pro.coinbase.com'

export default class Prices extends React.Component {

  state = {
    socket: null,
    prices: {}
  }

  precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  getProductIds = () => {
    const { activeAccounts } = this.props
    return activeAccounts.map(account => {
      return `${account.currency}-USD`
    })
  }

  renderPrices = () => {
    const { prices } = this.state
    return Object.keys(prices).map((crypto, index)=> {
      return (
        <div className='price' key={index}>
          <span
            className='currency'>
            {`${crypto}: `}
          </span>
          <span
            className='exchange'>
            {`$${this.precise(prices[crypto], 7)}`|| 0}
          </span>
        </div>
      )
    })
  }

  render() {

    return (
      <div className='prices-container'>
        <div className='prices-header'>{`Live Cryptocurrency Prices`}</div>
        <div className='prices'>
          {this.renderPrices()}
        </div>
      </div>
    )
  }

  componentDidMount() {

    const ws = new WebSocket(websocketAPI)
    this.setState({socket: ws}, () => {

      // eslint-disable-next-line
      this.state.socket.onopen = () => {
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
        this.state.socket.send(JSON.stringify(subscribe))
      }

      // eslint-disable-next-line
      this.state.socket.onmessage = (message) => {
        try {
          const response = JSON.parse(message.data)
          if (response.type === 'ticker'){
            return this.getProductIds().map(id => {
              if (response.product_id === id) {
                this.setState({
                  prices: {...this.state.prices, [id]: response.price}
                })
              }
              return 0
            })
          }
        } catch (e) {
          console.log('Not valid JSON: ', message.data);
          return;
        }
      }

      // eslint-disable-next-line
      this.state.socket.onerror = (error) => {
        console.log("There was an error: ", error);
      }
    })
  }

  componentWillUnmount() {

    const unsubscribe = {
      "type": "unsubscribe",
      "product_ids": this.getProductIds(),
      "channels": [ "ticker" ]
    }
    this.state.socket.send(JSON.stringify(unsubscribe))
    this.state.socket.close()

    // eslint-disable-next-line
    this.state.socket.onclose = () => {
      this.setState({socket: null})
    }
  }
}
