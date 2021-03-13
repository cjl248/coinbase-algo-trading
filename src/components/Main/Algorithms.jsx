import React from 'react'
import Bands from './Algorithms/Bands.jsx'
import Fibonacci from './Algorithms/Fibonacci.jsx'
import MovingAverages from './Algorithms/MovingAverages.jsx'

const pAPI = 'http://localhost:3000/c_products'
const websocketAPI = 'wss://ws-feed.pro.coinbase.com'


export default class Algorithms extends React.Component {

  constructor(props) {
    super(props)
    this.bollRef = React.createRef()
    this.fibRef = React.createRef()
    this.avgRef = React.createRef()
  }

  state = {
    socket: new WebSocket(websocketAPI),
    controller: new AbortController(),
    prices: {},
    bands: {},
    granularity: 3600,
    fibonacciRetracement: {},
    activeFibonacciCurrency: 'BTC-USD'
  }

  setActiveFibonacciCurrency = (activeFibonacciCurrency) => {
    this.setState({activeFibonacciCurrency})
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
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      signal: this.state.controller.signal
    }
    const requestPath = `${pAPI}/get_fibonacci_retracement?product=${productId}&granularity=${granularity}`
    fetch(requestPath, config)
    .then(r => r.json())
    .then(fibonacciRetracement => {
      this.setState({
        fibonacciRetracement
      })
    }).catch(e => {
      console.warn(`There was an error: ${e}`)
    })
  }

  getBands = (productId, granularity) => {
    const config = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      signal: this.state.controller.signal
    }
    const requestPath = `${pAPI}/get_bands?product=${productId}&granularity=${granularity}`
    fetch(requestPath, config)
    .then(r => r.json())
    .then(bands => {
      this.setState({
        bands: {...this.state.bands, [productId]: bands}
      })
    }).catch(e => {
      console.warn(`There was an error: ${e}`)
    })
  }

  // 86400 (1day), 21600 (6hours), 3600(1hr)
  getAllBands = () => {
    return this.getProductIds().map(id => {
      return this.getBands(id, this.state.granularity)
    })
  }

  scrollPage = () => {
    const { activeSection } = this.props
    if (activeSection === 'b') {
      this.bollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    if (activeSection === 'f') {
      this.fibRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    if (activeSection === 'm') {
      this.avgRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }

  render() {
    return (
      <div className='algorithms-container'>
        <div className='bollinger-bands' ref={this.bollRef}>
          <Bands
            bands={this.state.bands}
            granularity={this.state.granularity}
            setGranularity={this.setGranularity}>
          </Bands>
        </div>
        <div className='fibonacci-retracement' ref={this.fibRef}>
          <Fibonacci
            fibonacci={this.state.fibonacciRetracement}
            activeAccounts={this.props.activeAccounts}
            activeFibonacciCurrency={this.state.activeFibonacciCurrency}
            setActiveFibonacciCurrency={this.setActiveFibonacciCurrency}>
          </Fibonacci>
        </div>
        <div className='moving-averages' ref={this.avgRef}>
          <MovingAverages></MovingAverages>
        </div>
      </div>
    )
  }

  getSnapshotBeforeUpdate(prevProps, prevState){
    if (this.state.granularity !== prevState.granularity) {
      const {granularity, activeFibonacciCurrency} = this.state
      this.getAllBands()
      this.getFibonacciRetracement(activeFibonacciCurrency, granularity)
      return null
    }
    if (this.state.activeFibonacciCurrency !== prevState.activeFibonacciCurrency) {
      const {granularity, activeFibonacciCurrency} = this.state
      this.getFibonacciRetracement(activeFibonacciCurrency, granularity)
      return null
    } else {
      return null
    }
  }

  componentDidUpdate() {

  }

  componentDidMount() {
    this.scrollPage()

    const {granularity, activeFibonacciCurrency} = this.state
    this.getAllBands()
    this.getFibonacciRetracement(activeFibonacciCurrency, granularity)

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
                return this.setState({
                  prices: {...this.state.prices, [id]: response.price}
                })
              } else return null
            })
          }
        } catch (e) {
          console.log('Not valid JSON: ', message.data);
          return;
        }
      }

      // eslint-disable-next-line
      this.state.socket.onerror = (error) => {
        console.warn("There was an error: ", error);
      }
    })
  }

  componentWillUnmount() {
    this.state.socket.close()
    this.state.controller.abort()
  }

}
