import React from 'react'
import Button from '@material-ui/core/Button'

import ActiveAccount from '../activeAccount/ActiveAccount.jsx'
import CryptoAccount from '../cryptoAccount/CryptoAccount.jsx'

import './Accounts.scss'


export default function Accounts({page}) {

  const requestPath = "http://localhost:3000/c_accounts"

  const  [accounts, setAccounts] = React.useState(null)
  const  [activeAccount, setActiveAccount] = React.useState(null)

  async function loadAccounts() {
    const config = {
      method: 'GET',
      headers:  {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'

      }
    }
    const response = await fetch(requestPath, config)
    response.json().then(accounts => {
      setAccounts(accounts)
    })
  }

  React.useEffect(()=> {
    loadAccounts()
  }, [])

  const handleClick = () => {
    console.log("clicking")
  }

  const chooseActiveAccount = (e) => {
    const activeAccount =  accounts.find(account => {
      return account.currency === e.target.innerHTML
    })
    setActiveAccount(activeAccount)
  }

  const renderAccounts = () => {
    if (!accounts) return
    return accounts.map((account, index) => {
      return (
        <CryptoAccount
          key={index}
          account={account}
          chooseActiveAccount={chooseActiveAccount}>
        </CryptoAccount>
      )
    })
  }

  return (
    <div className='accounts-container'>
      <div className='account-title'>{`Accounts`}</div>
      <div className='accounts'>
        <div className='crypto-accounts'>{renderAccounts()}</div>
        <ActiveAccount activeAccount={activeAccount}></ActiveAccount>
      </div>
    </div>
  )
}
