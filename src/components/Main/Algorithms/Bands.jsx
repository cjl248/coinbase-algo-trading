import React from 'react'

export default class Bands extends React.Component {

  state = {

  }

  precise = (float) => Number.parseFloat(float).toPrecision(5)

  renderBands = () => {
    const { bands } = this.props
    return Object.keys(bands).map(currency => {
      return Object.keys(bands[currency]).map(level => {
        const stats = bands[currency][level]
          return (
            <div className='b-currency'>
              <div className='b-currency-title'>{`CURRENCY: ${currency}`}</div>
              <div className='b-level'>
                <div className='level-title'>{`STD DEVIATIONS: ${level}`}</div>
                <div className='b-level'>{`$${this.precise(stats[0])}`}</div>
                <div className='b-level'>{`$${this.precise(stats[1])}`}</div>
                <div className='b-level'>{`$${this.precise(stats[2])}`}</div>
              </div>
            </div>
          )
      })
    })
  }

  render() {
    return (
      <>
      <div className="bands-main-title">{`Bollinger Bands`}</div>
      <div className='bands-container'>
        {this.renderBands()}
      </div>
      </>
    )
  }

  componentDidUpdate() {
  }

}
