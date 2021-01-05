import React from 'react'

import Button from '@material-ui/core/Button'

export default function MainNavBar({activePage}) {

  const formatText = () => activePage[0].toUpperCase()+activePage.slice(1)

  const handleLimitOrder = () => console.log("Limit Order")
  const handleMarketOrder = () => console.log("Market Order")

  return (
    <div className='main-navbar'>
      <div
        className='navbar-active-page'>
        {formatText()}
      </div>
      <div className='navbar-middle-placeholder'></div>
      <div className='navbar-buttons'>
        <Button
          color='primary'
          variant='contained'
          onClick={handleLimitOrder}>
          {`LIMIT ORDER`}
        </Button>
        <Button
          color='secondary'
          variant='contained'
          onClick={handleMarketOrder}>
          {`MARKET ORDER`}
        </Button>
      </div>
    </div>
  )
}
