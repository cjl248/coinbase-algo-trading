import React from 'react'
import Button from '@material-ui/core/Button'

const websocketAPI = "wss://ws-feed.pro.coinbase.com"
const productListAPI = "http://localhost:3000/c_products/list"

export default class Prices extends React.Component {

  state = {
    socket: null,
    productList: [],
    prices: {},
  }

  precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  getAllProducts = async () => {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      }
    }
    const response = await fetch(productListAPI, config)
    response.json().then(data => {
      const productList = data.map(product => {
        return product.id
      })
      this.setState({
        productList
      })
    })
  }

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

  handlePriceSort = () => {
    const { prices } = this.state
    const priceArray = []
    for (let product in prices) {
      priceArray.push({
        name: product,
        price: prices[product],
      })
    }
    const sortedByPrices = priceArray.sort((a, b) => {
      return b.price - a.price
    })
    console.log(sortedByPrices);
  }

  render() {
    return (
      <div className='prices-container'>
        <span className='header-container'>
          <div className='prices-header'>{`Live Cryptocurrency Prices`}</div>
          <span className='sort-label'>{`Sort By: `}</span>
          <span className='prices-button-group'>
            <Button
              color='primary'
              variant='contained'
              onClick={this.handlePriceSort}>
              {`Price`}
            </Button>
            <Button
              color='primary'
              variant='contained'>
              {`Name`}
            </Button>
          </span>
        </span>
        <div className='prices'>
          {this.renderPrices()}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.getAllProducts()

    const ws = new WebSocket(websocketAPI)
    this.setState({socket: ws}, () => {

      // eslint-disable-next-line
      this.state.socket.onopen = () => {
        const subscribe = {
          "type": "subscribe",
          "product_ids": this.state.productList,
          "channels": [
            {
              "name": "ticker",
              "product_ids": this.state.productList
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
            return this.state.productList.map(id => {
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

    // const unsubscribe = {
    //   "type": "unsubscribe",
    //   "product_ids": this.state.productList,
    //   "channels": [ "ticker" ]
    // }
    // this.state.socket.send(JSON.stringify(unsubscribe))
    this.state.socket.close()

    // eslint-disable-next-line
    // this.state.socket.onclose = () => {
      // this.setState({socket: null})
    // }
  }
}
