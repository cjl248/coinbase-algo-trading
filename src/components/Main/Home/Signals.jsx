import React from 'react'

const Signals = () => {
  return (
    <div className='signals-container'>
      <div className='signals-title'>{`Signals`}</div>
      <div className='signals-group'>
        <div className='algo-signal'>{`Fibonacci Retracement - BUY`}</div>
        <div className='algo-signal'>{`Moving Averages - BUY`}</div>
        <div className='algo-signal'>{`Bollinger Bands - SELL`}</div>
      </div>
    </div>
  )

}

export default Signals
