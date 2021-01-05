import React from 'react'

import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';

export default function Assets({accounts, prices, calculatePortfolioBalance}) {

  React.useEffect(() => {
    if (dollarValues.length <= 0) {
      getDollarValue()
    }
  })

  const [dollarValues, setDollarValues] = React.useState([])

  const getDollarValue = () => {
    return prices.map(price => {
      for (let key in price){
        const cryptoPrice = price[key]
        const crypto = accounts.find((entry) => {
          return entry.currency === cryptoPrice.currency
        })
        if (crypto) {
          setDollarValues([...dollarValues, {[crypto.currency] :cryptoPrice.price*crypto.balance}])
        }
      }
    })
  }

  const renderAssets = () => {
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
  }

  const renderDollarValues = () => {
    let sum = 0
    const componentList = dollarValues.map((crypto, index) => {
      for (let key in crypto) {
        sum += crypto[key]
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
    })
    return componentList
  }

  return (
    <div className='assets-container'>
      <div className='assets-title'>{`Assets`}</div>
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
