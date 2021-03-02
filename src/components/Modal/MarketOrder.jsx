import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

/*
* Arguments for market order:
* side, product_id funds
*/

const oAPI = "http://localhost:3000/c_orders/market_order"

export default function MarketOrder({ modal, market, action, activeAccounts, allAccounts=[], setMessage, orders, setOrders}) {

  const [productId, setProductId] = React.useState('')
  const [funds, setFunds] = React.useState(1)

  const [intendToOrder, setIntendToOrder] = React.useState(false)
  const [pin, setPin] = React.useState('')

  const resolveSide = () => {
    if (!action) {
      return "buy"
    } else {
      return "sell"
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

  const handleChange = (e) => {
    setMessage(null)
    setProductId(`${e.target.value}`)
  }

  const handleFundsChange = (e) => {
    if (Math.sign(e.target.value) === -1) {
      setMessage('Funds must be positive')
      setFunds(-e.target.value)
    } else if (Math.sign(e.target.value) === 1) {
      setMessage('')
      setFunds(e.target.value)
    } else if(e.target.value.toString().includes('-') || isNaN(e.target.value) === true) {
      setMessage('Please enter a valid number value for funds')
      setFunds(1)
    } else {
      setMessage('Funds must be a valid number value greater than 0')
      setFunds(1)
    }
  }

  const handleOrder = () => {
    if (productId === '') {
      setMessage('Please choose a product from the dropdown')
      setPin('')
      return null
    } else {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accepts": "application/json",
        },
        body: JSON.stringify({
          side: resolveSide(),
          productId,
          funds,
          pin
        })
      }
      fetch(oAPI, config)
      .then(r => r.json())
      .then(data => {
        if (data && data.message) {
          setMessage(data.message)
          setPin('')
        } else if (data) {
          setMessage(`${data.side.toUpperCase()} order for $${data.funds} of ${data.product_id} placed successfully`)
          setFunds('')
          setPin('')
          setIntendToOrder(false)
        } else {
          setMessage('Something went wrong')
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
    } else {
      return null
    }
  }

  React.useEffect(() => {
    return function cleanup() {
      if (modal === false) {
        setMessage('')
        setFunds(1)
        setIntendToOrder(false)
        setPin('')
      }
    }
  })

  return (
    <div className='market-order'>
      <div className='market-title'>{`Market Order`}</div>
      <div className='input-group' style={{display: 'flex', flexDirection: 'column'}}>
        <FormControl variant="outlined" style={{width: '200px', margin: '10px 0'}}>
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
          label='Funds ($)'
          value={funds}
          onChange={handleFundsChange}>
        </TextField>
        <Button
          style={{marginTop: '10px'}}
          variant='contained'
          color='primary'
          onClick={handleIntendToOrder}>
          {`ENTER PIN`}
        </Button>
      </div>
      <div className='pin-container'>
        {renderPinInput()}
      </div>
    </div>
  )

}
