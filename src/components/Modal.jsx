import React from 'react'
import Toggle from './Modal/Toggle.jsx'
import MarketOrder from './Modal/MarketOrder.jsx'
import LimitOrder from './Modal/LimitOrder.jsx'

const aAPI = 'http://localhost:3000/c_accounts'

export default function Modal({ activeAccounts }) {

  const [buy, toggleBuy] = React.useState(false)
  const [marketOrder, toggleMarketOrder] = React.useState(false)
  const [allAccounts, setAllAccounts] = React.useState([])

  const getAllAccounts = () => {
    const config = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      }
    }
    fetch(aAPI, config)
    .then(r => r.json())
    .then(data => {
      setAllAccounts(data)
    })
  }

  const renderMain = () => {
    if (!marketOrder) {
      return (
        <MarketOrder
          action={buy}
          activeAccounts={activeAccounts}
          allAccounts={allAccounts}
        />
      )
    } else {
      return (
        <LimitOrder
          action={buy}
          activeAccounts={activeAccounts}
        />
      )
    }
  }

  React.useEffect(() => {
    getAllAccounts()
  })

  return (
    <div className='modal-content'>
      <div className='modal-title'>{`Place an Order`}</div>
      <div className='switch-group'>
        <Toggle
          type='action'
          buy={buy}
          toggleBuy={toggleBuy}
        />
        <Toggle
          type='order'
          marketOrder={marketOrder}
          toggleMarketOrder={toggleMarketOrder}
        />
      </div>
      <div>
        <div className='order-container'></div>
          {renderMain()}
        </div>
    </div>
  )
}
