import React from 'react'
import Button from '@material-ui/core/Button'

export default class Bands extends React.Component {

  state = {

  }

  precise = (float) => Number.parseFloat(float).toPrecision(5)

  renderBands = () => {
    const { bands } = this.props
    return Object.keys(bands).map(currency => {
      return Object.keys(bands[currency]).map((level, index) => {
        const stats = bands[currency][level]
          return (
            <div className='b-currency' key={index}>
              <div className='b-currency-title'>{`Currency: ${currency}`}</div>
              <div className='b-level'>
                <div className='level-title'>{`Standard Deviation: ${level}`}</div>
                <div className='b-level'>{`$${this.precise(stats[0])}`}</div>
                <div className='b-level'>{`$${this.precise(stats[1])}`}</div>
                <div className='b-level'>{`$${this.precise(stats[2])}`}</div>
              </div>
            </div>
          )
      })
    })
  }

  handleGranularityChange = (granularity) => {
    this.props.setGranularity(granularity)
  }

  render() {
    return (
      <>
      <div className="bands-main-title-section">
        <div className='title'>{`Bollinger Bands`}</div>
        <div className='granularity-options'>
          <div
            className='current-granularity'>
            {`Granularity: ${(this.props.granularity*300/60/60/24)} D`}
          </div>
          <Button
            color='primary'
            variant='outlined'
            onClick={()=>{this.handleGranularityChange(3600)}}>
            {`12.5 Days`}
          </Button>
          <Button
            color='primary'
            variant='outlined'
            onClick={() => {this.handleGranularityChange(21600)}}>
            {`75 Days`}
          </Button>
          <Button
            color='primary'
            variant='outlined'
            onClick={() => {this.handleGranularityChange(86400)}}>
            {`300 Days`}
          </Button>
        </div>
      </div>
      <div className='bands-container'>
        {this.renderBands()}
      </div>
      </>
    )
  }

  componentDidUpdate() {
  }

}