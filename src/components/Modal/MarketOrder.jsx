import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

/*
* Arguments for market order:
* side, product_id funds
*/

const oAPI = "http://localhost:3000/c_orders/market_order"

export default function MarketOrder({ action, activeAccounts, allAccounts=[], setMessage }) {

  const [productId, setProductId] = React.useState('')
  const [funds, setFunds] = React.useState(0)

  const resolveSide = () => {
    if (!action) {
      return "buy"
    } else {
      return "sell"
    }
  }

  // const getFunds = () => {
  //   return activeAccounts.map(account => {
  //     if (account.currency !== 'USD' && account.currency !== 'USDC') {
  //     } else if (account.currency === 'USD') {
  //       return setFunds(funds + account.value)
  //     } else if (account.currency === 'USDC') {
  //       return setFunds(funds + account.value)
  //     }
  //   })
  // }

  const renderMenuItems =  () => {
    // true is sell
    if (action === true) {
      return activeAccounts.map((account, index) => {
        if (account.currency !== 'USDC' && account.currency !== 'USD') {
          return (
            <MenuItem key={index}
              value={`${account.currency}-USD`}>
              {account.currency}
            </MenuItem>
          )
        } else return null
      })
    } else { // false is buy
      return allAccounts.map((account, index) => {
        if (account.currency !== 'USDC' && account.currency !== 'USD') {
          return (
            <MenuItem key={index}
              value={`${account.currency}-USD`}>
              {account.currency}
            </MenuItem>
          )
        } else return null
      })
    }
  }

  const handleChange = (e) => {
    setMessage(null)
    setProductId(`${e.target.value}`)
  }

  const handleFundsChange = (e) => {
    setMessage(null)
    setFunds(e.target.value)
  }

  const handleOrder = () => {

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json",
      },
      body: JSON.stringify({
        side: resolveSide(),
        productId,
        funds
      })
    }
    fetch(oAPI, config)
    .then(r => r.json())
    .then(data => {
      if (data && data.message) {
        setMessage(data.message)
        setFunds(0)
      } else {
        setMessage(`${data.side.toUpperCase()} order for $${data.funds} of ${data.product_id} placed successfully`)
        setFunds(0)
      }
    })

  }

  resolveSide()
  return (
    <div className='market-order'>
      <div className='market-title'>{`Market Order`}</div>
      <div className='input-group' style={{display: 'flex', flexDirection: 'column'}}>
        <FormControl variant="outlined" style={{width: '200px', margin: '10px 0'}}>
          <InputLabel id="demo-simple-select-outlined-label">{`Asset`}</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={productId}
            onChange={handleChange}
            label="Age">
            {renderMenuItems()}
          </Select>
        </FormControl>
        <TextField
          variant='outlined'
          color='primary'
          label='Funds ($)'
          value={funds}
          onChange={handleFundsChange}>
        </TextField>
        <Button
          style={{marginTop: '10px'}}
          variant='contained'
          color='primary'
          onClick={handleOrder}>
          {`Place Order`}
        </Button>
      </div>
    </div>
  )

}
