import React from 'react'
import Button from '@material-ui/core/Button'

const Signals = ({ setActivePage }) => {
  return (
    <div className='signals-container'>
      <div className='signals-title'>{`Algorithms`}</div>
      <div className='signals-group'>
        <section className='algo-signal'>
          <div className='title'>{`Bollinger Bands`}</div>
          <Button
            variant='contained'
            color='primary'
            className='button'
            onClick={()=>{setActivePage('algorithms', 'b')}}>
            {`Go`}
          </Button>
        </section>
        <section className='algo-signal'>
          <div className='title'>{`Fibonacci Retracement`}</div>
          <Button
            variant='contained'
            color='primary'
            className='button'
            onClick={()=>{setActivePage('algorithms', 'f')}}>
            {`Go`}
          </Button>
        </section>
        {/*
        <section className='algo-signal'>
          <div className='title'>{`Moving Averages`}</div>
          <Button
            variant='contained'
            color='primary'
            className='button'
            onClick={()=>{setActivePage('algorithms', 'm')}}>
            {`Go`}
          </Button>
        </section>
        */}
      </div>
    </div>
  )

}

export default Signals
