import React from 'react'
import Bands from './Algorithms/Bands.jsx'
import Fibonacci from './Algorithms/Fibonacci.jsx'

const pAPI = 'http://localhost:3000/c_products'
const websocketAPI = 'wss://ws-feed.pro.coinbase.com'


export default class Algorithms extends React.Component {

  state = {
    socket: null,
    prices: {},
    bands: {},
    granularity: 3600,
    fibonacciRetracement: {}
  }

  setGranularity = (granularity) => {
    this.setState({granularity})
  }

  getProductIds = () => {
    return this.props.activeAccounts.map(account => {
      return `${account.currency}-USD`
    })
  }

  getFibonacciRetracement = (productId, granularity) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    }
    const requestPath = `${pAPI}/get_fibonacci_retracement?product=${productId}&granularity=${granularity}`
    fetch(requestPath, config)
    .then(r => r.json())
    .then(fibonacciRetracement => {
      this.setState({
        fibonacciRetracement
      })
    })
  }

  getBands = (productId, granularity) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    }
    const requestPath = `${pAPI}/get_bands?product=${productId}&granularity=${granularity}`
    fetch(requestPath, config)
    .then(r => r.json())
    .then(bands => {
      this.setState({
        bands: {...this.state.bands, [productId]: bands}
      })
    })
  }

  // 86400 (1day), 21600 (6hours), 3600(1hr)
  getAllBands = () => {
    return this.getProductIds().map(id => {
      this.getBands(id, this.state.granularity)
    })
  }


  render() {
    return (
      <div className='algorithms-container'>
        <div className='bollinger-bands'>
          <Bands
            bands={this.state.bands}
            granularity={this.state.granularity}
            setGranularity={this.setGranularity}>
          </Bands>
        </div>
        <div className='fibonacci-retracement'>
          <Fibonacci
            fibonacci={this.state.fibonacci}>
          </Fibonacci>
        </div>
        <div className='moving-averages'>
        </div>
      </div>
    )
  }

  getSnapshotBeforeUpdate(prevProps, prevState){
    if (this.state.granularity !== prevState.granularity) {
      return  this.getAllBands()
    }
    return null
  }

  componentDidUpdate() {

  }

  componentDidMount() {
    this.getAllBands()
    this.getFibonacciRetracement("XLM-USD", 3600)

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
          if (response.type === 'ticker') {
            return this.getProductIds().map(id => {
              if (response.product_id === id) {
                this.setState({
                  prices: {...this.state.prices, [id]: response.price}
                })
              }
            })
          }
        } catch (e) {
          console.log('Not valid JSON: ', message.data);
          return;
        }
      }

      // eslint-disable-next-line
      this.state.socket.onerror = (error) => {
        console.log("There was an error: ", error.json());
      }

      // eslint-disable-next-line
      this.state.socket.onclose = () => {
        this.setState({socket: null})
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
  }

}
