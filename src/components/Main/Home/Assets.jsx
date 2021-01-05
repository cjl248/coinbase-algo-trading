import React from 'react'

import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';

export default function Assets({accounts}) {

  const renderAssets = () => {
    return accounts.map(account => {
      return (
        <div className='asset'>
          <span className='icon-currency-group'>
          <MonetizationOnRoundedIcon />
            <span className='currency'>{account.currency}</span>
          </span>
          <span className='balance'>{account.balance}</span>
        </div>
      )
    })
  }

  return (
    <div className='assets-container'>
      <div className='assets-title'>{`Assets`}</div>
      <div className='assets'>
        {renderAssets()}
      </div>
    </div>
  )

}
