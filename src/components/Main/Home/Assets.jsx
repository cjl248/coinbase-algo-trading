import React from 'react'

import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';

import Loading from '../../Loading.jsx'

export default function Assets({accounts, prices, calculatePortfolioBalance, dollarBalance}) {

  React.useEffect(() => {
    if (dollarValues.length <= prices.length - 1) {
      getDollarValue()
    }
  })

  const [dollarValues, setDollarValues] = React.useState([])
  const [sum, setSum] = React.useState(0)

  const precise = float => Number.parseFloat(float).toPrecision(6)

  const getDollarValue = () => {
    if (prices) {
      let sum = 0
      const myComponents = prices.map(price => {
        for (let key in price){
          const cryptoPrice = price[key]
          const crypto = accounts.find((entry) => {
            return entry.currency === cryptoPrice.currency
          })
          if (crypto) {
            sum += cryptoPrice.price*crypto.balance
            setDollarValues([...dollarValues, {[crypto.currency] :precise(cryptoPrice.price*crypto.balance)}])
          }
        }
        return 0
      })
      setSum(sum)
      return myComponents
    } else return (<Loading></Loading>)
  }

  const renderAssets = () => {
    if (accounts) {
      return accounts.map((account, index) => {
        return (
          <div className='asset' key ={index} >
            <span className='icon-currency-group'>
            <CheckCircleOutlinedIcon />
              <span className='currency'>{account.currency}</span>
            </span>
            <span className='balance'>{account.balance}</span>
          </div>
        )
      })
    } else return (<Loading></Loading>)
  }

  const renderDollarValues = () => {
    return dollarValues.map((crypto, index) => {
      for (let key in crypto) {
        return (
          <div className='asset' key ={index} >
            <span className='icon-currency-group'>
            <MonetizationOnOutlinedIcon />
              <span className='currency'>{key}</span>
            </span>
            <span className='balance'>{`$${crypto[key]}`}</span>
          </div>
        )
      }
      return 0
    })
  }

  return (
    <div className='assets-container'>
      <div className='assets-title'>
        {`Assets: $${precise(parseFloat(sum)+parseFloat(dollarBalance))}`}
      </div>
        <div className='assets'>
          <div className='asset-section-titles'>{`Dollar Values`}</div>
          {renderDollarValues()}
        </div>
      <div className='assets'>
        <div className='asset-section-titles'>{`Nominal Values`}</div>
        {renderAssets()}
      </div>
    </div>
  )

}
