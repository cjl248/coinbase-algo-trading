import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

/*
* Arguments for limit order:
* side, product_id, size, price, time_in_force=nil, cancel_after=nil
*/

const oAPI = "http://localhost:3000/c_orders/limit_order"

export default function LimitOrder({ buy, action, activeAccounts, allAccounts, setMessage }) {

  const [productId, setProductId] = React.useState('BTC-USD')
  const [size, setSize] = React.useState(0)
  const [price, setPrice] = React.useState(0)

  const resolveSide = () => {
    if (!action) {
      return "buy"
    } else {
      return "sell"
    }
  }

  const handleChange = (e) => {
    setMessage(null)
    setProductId(`${e.target.value}`)
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value)
  }

  const handleSizeChange = (e) => {
    setMessage(null)
    setSize(e.target.value)
  }

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

  const handleOrder = () => {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      },
      body: JSON.stringify({
        side: resolveSide(),
        productId,
        size,
        price
      })
    }
    fetch(oAPI, config)
    .then(r => r.json())
    .then(data => {
      if (data && data.message) {
        setMessage(data.message)
        setSize(0)
        setPrice(0)
      } else {
        setMessage(`${data.side.toUpperCase()} order st $${price} for ${data.size} of ${data.product_id} placed successfully`)
        setSize(0)
        setPrice(0)
      }
    })
  }

  return (
    <div className='limit-order'>
      <div className='limit-title'>{`Limit Order`}</div>
      <div className='input-group' style={{display: 'flex', flexDirection: 'column'}}>
        <FormControl variant="outlined" style={{width: '200px'}}>
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
          label='Size'
          value={size}
          onChange={handleSizeChange}>
        </TextField>
        <TextField
          variant='outlined'
          color='primary'
          label='Limit Price'
          value={price}
          onChange={handlePriceChange}>
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
