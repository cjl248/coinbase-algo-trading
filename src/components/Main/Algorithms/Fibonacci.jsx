import React from 'react'

export default class Fibonacci extends React.Component {

  getProductIds = () => {
    
  }

  getFibonacciRetracement = () => {

  }

  render() {
    return (
      <>
      <div className='fibonacci-main-title'>{`Fibonacci Retracement`}</div>
      <div
        className='fibonacci-container'>
        {`fibonacci stuff`}
      </div>
      </>
    )
  }

  componentDidMount() {
    this.getFibonacciRetracement()
  }
}
