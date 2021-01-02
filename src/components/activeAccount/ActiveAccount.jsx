import React from 'react'

import './ActiveAccount.scss'

const ActiveAccount = ({activeAccount}) => {

  const renderActiveAccountCurrency = () => {
    if (!activeAccount) return "click an account"
    return activeAccount.currency
  }

  const renderActiveAccountAvailable = () => {
    if (!activeAccount) return "click an account"
    return activeAccount.available
  }

  return (
    <div className='active-account'>
      <div>{renderActiveAccountCurrency()}</div>
      <div>{renderActiveAccountAvailable()}</div>
    </div>
  )
}

export default ActiveAccount
