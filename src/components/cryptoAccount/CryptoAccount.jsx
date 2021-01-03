import React from 'react'
import Button from '@material-ui/core/Button'

const requestPath = "http://localhost:3000/c_products"

const CryptoAccount = ({account, chooseActiveAccount}) => {

  const [price, setPrice] = React.useState()

  const handleClick = (e) => {
    chooseActiveAccount(e)
    if (account) {
      const endpoint = `?product=${account.currency}-USD`
      fetch(requestPath+endpoint)
      .then(r => r.json())
      .then(product => {
        console.log(product)
        setPrice(product.price)
      })
    }
  }
  return (
    <div className='crypto-account'>
      <Button
        className='currency'
        color='primary'
        variant='outlined'
        value={account.currency}
        onClick={handleClick}>
        {account.currency}
      </Button>
      <span>{price ? account.available*price : account.available}</span>
    </div>
  )
}

export default CryptoAccount
