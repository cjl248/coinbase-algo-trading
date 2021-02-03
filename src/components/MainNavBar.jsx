import React from 'react'

import Button from '@material-ui/core/Button'

export default function MainNavBar({activePage, activateModal}) {

  const formatText = () => activePage[0].toUpperCase()+activePage.slice(1)

  const handleOrder = () => activateModal()

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
          onClick={handleOrder}>
          {`BUY / SELL`}
        </Button>
      </div>
    </div>
  )
}
