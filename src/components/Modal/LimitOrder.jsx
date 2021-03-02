import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'

/*
* Arguments for limit order:
* side, product_id, size, price, time_in_force=nil, cancel_after=nil
*/

const oAPI = "http://localhost:3000/c_orders/limit_order"

export default function LimitOrder({ modal, buy, action, activeAccounts, allAccounts, setMessage, orders, setOrders }) {

  const [productId, setProductId] = React.useState('')
  const [size, setSize] = React.useState(1)
  const [price, setPrice] = React.useState(1)

  const [intendToOrder, setIntendToOrder] = React.useState(false)
  const [pin, setPin] = React.useState('')


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
    if (Math.sign(e.target.value) === -1) {
      setMessage('Price must be positive')
      setPrice(-e.target.value)
    } else if (Math.sign(e.target.value) === 1) {
      setMessage('')
      setPrice(e.target.value)
    } else if (e.target.value.toString().includes('-') || isNaN(e.target.value) === true) {
      setMessage('Please enter a valid number value for price')
      setPrice(1)
    } else {
      setMessage('Size must be af valid number value greater than 0')
      setPrice(1)
    }
  }

  const handleSizeChange = (e) => {
    if (Math.sign(e.target.value) === -1) {
      setMessage('Size must be positive')
      setSize(-e.target.value)
    } else if (Math.sign(e.target.value) === 1) {
      setMessage('')
      setSize(e.target.value)
    } else if (e.target.value.toString().includes('-') || isNaN(e.target.value) === true) {
      setMessage('Please enter a valid number value for size')
      setSize(1)
    } else {
      setMessage('Size must be a valid number value greater than 0')
      setSize(1)
    }
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
    if (productId === '') {
      setMessage('Please choose a product from the dropdown')
      setPin('')
    } else {
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
          price,
          pin
        })
      }
      fetch(oAPI, config)
      .then(r => r.json())
      .then(data => {
        if (data && data.message) {
          setMessage(data.message)
          setPin('')
        } else {
          setMessage(`${data.side.toUpperCase()} order at $${price} for ${data.size} of ${data.product_id} placed successfully`)
          const newOrder = {
            product_id: productId,
            type: 'LIMIT',
            side: resolveSide().toUpperCase(),
            price,
            size,
          }
          setOrders([...orders, newOrder])
          setSize(0)
          setPrice(0)
          setPin('')
          setIntendToOrder(false)
        }
      })
    }
  }

  const handleIntendToOrder = () => {
    setIntendToOrder(true)
  }

  const handlePinInput = (e) => {
    setMessage('')
    setPin(e.target.value)
  }

  const renderPinInput = () => {
    if (intendToOrder) {
      return (
        <>
          <div className='pin-label'>{`Please enter the pin`}</div>
          <Input style={{width: '100px', height: '20px'}}
            value={pin}
            type='password'
            onChange={handlePinInput}
          />
        <Button style={{width: '100%'}}
            color='secondary'
            variant='contained'
            onClick={handleOrder}>
            {`PLACE ORDER`}
          </Button>
        </>
      )
    } else return null
  }

  React.useEffect(() => {

    return function cleanup() {
      if (modal === false) {
        setMessage('')
        setPrice(1)
        setSize(1)
      }
    }
  })

  return (
    <div className='limit-order'>
      <div className='limit-title'>{`Limit Order`}</div>
      <div className='input-group' style={{display: 'flex', flexDirection: 'column'}}>
        <FormControl variant="outlined" style={{width: '200px'}}>
          <InputLabel id="demo-simple-select-outlined-label">{`Product`}</InputLabel>
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
          type='number'
          variant='outlined'
          color='primary'
          label='Size'
          value={size}
          onChange={handleSizeChange}>
        </TextField>
        <TextField
          type='number'
          variant='outlined'
          color='primary'
          label='Limit Price ($)'
          value={price}
          onChange={handlePriceChange}>
        </TextField>
        <Button
          style={{marginTop: '10px'}}
          variant='contained'
          color='primary'
          onClick={handleIntendToOrder}>
          {`Enter Pin`}
        </Button>
      </div>
      <div className='pin-container'>
        {renderPinInput()}
      </div>
    </div>
  )
}
