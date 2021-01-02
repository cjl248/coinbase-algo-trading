import React from 'react'
import Button from '@material-ui/core/Button'

const CryptoAccount = ({account, chooseActiveAccount}) => {
  return (
    <div className='crypto-account'>
      <Button
        className='currency'
        color='primary'
        variant='outlined'
        value={account.currency}
        onClick={chooseActiveAccount}>
        {account.currency}
      </Button>
      <span>{account.available}</span>
    </div>
  )
}

export default CryptoAccount
