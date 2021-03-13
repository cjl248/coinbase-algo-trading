import React from 'react'
import Button from '@material-ui/core/Button'

const productListAPI = 'http://localhost:3000/c_products/list'
const websocketAPI = 'wss://ws-feed.pro.coinbase.com'

export default class Prices extends React.Component {

  state = {
    socket: new WebSocket(websocketAPI),
    controller: new AbortController(),
    productList: [],
    prices: {},
    sortedPrices: [],
    sorting: false,
  }

  precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  getAllProducts = async () => {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      },
      signal: this.state.controller.signal
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

  renderPrices = (data) => {
    const { prices } = this.state
    if (Array.isArray(data)) {
      return data.map((crypto, index) => {
        return (
          <div className='price' key={index}>
            <span
              className='currency'>
              {`${crypto.name}: `}
            </span>
            <span
              className='exchange'>
              {`$${this.precise(crypto.price, 7)}`|| 0}
            </span>
          </div>
        )
      })
    } else {
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
  }

  handleGetSorted = (sortBy) => {
    this.setState({sorting: true}, () => {
      const { prices } = this.state
      const priceArray = []
      for (let product in prices) {
        priceArray.push({
          name: product,
          price: prices[product],
        })
      }
      let sorted = []
      if (sortBy === 'DESC') {
        sorted = priceArray.sort((a, b) => b.price - a.price)
      }
      if (sortBy === 'ASC') {
        sorted = priceArray.sort((a, b) => a.price - b.price)
      }
      this.setState({
        sortedPrices: sorted
      })
    })
  }

  handleGetUnsorted = () => {
    this.setState({sorting: false})
  }

  resolveSort = () => {
    if (this.state.sorting) {
      return this.renderPrices(this.state.sortedPrices)
    } else {
      return this.renderPrices(this.state.prices)
    }
  }

  render() {
    return (
      <div className='prices-container'>
        <span className='header-container'>
          <div className='prices-header'>{`Live Cryptocurrency Prices`}</div>
          <span className='prices-button-group'>
            <section className='sort-section'>
              <span className='sort-label'>{`Sort By Price: `}</span>
              <Button className='sort-button'
                color='primary'
                variant='contained'
                onClick={() => {this.handleGetSorted('ASC')}}>
                {`Ascending`}
              </Button>
              <Button className='sort-button'
                color='primary'
                variant='contained'
                onClick={() => {this.handleGetSorted('DESC')}}>
                {`Descending`}
              </Button>
            </section>
            <section className='live-group'>
              <span className='sort-label'>{`Live Feed: `}</span>
              <Button className='sort-button'
                color='secondary'
                variant='contained'
                onClick={this.handleGetUnsorted}>
                {`Go Live`}
              </Button>
            </section>
          </span>
        </span>
        <div className='prices'>
          {this.resolveSort()}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.getAllProducts().then(()=> {
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
            return null
          }
        }

        // eslint-disable-next-line
        this.state.socket.onerror = (error) => {
          console.warn("There was an error: ", error);
        }
      })
    }).catch(e => {
      console.warn(`Error: ${e}`)
    })
  }

  componentWillUnmount() {
    this.state.socket.close()
    this.state.controller.abort()
  }
}
