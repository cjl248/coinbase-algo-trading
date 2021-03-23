import React from 'react'
import Toggle from './Modal/Toggle.jsx'
import MarketOrder from './Modal/MarketOrder.jsx'
import LimitOrder from './Modal/LimitOrder.jsx'

const aAPI = 'https://coinbase-algo-backend.herokuapp.com/c_accounts'

export default function Modal({ modal, activeAccounts, orders, setOrders }) {

  const [buy, toggleBuy] = React.useState(false)
  const [marketOrder, toggleMarketOrder] = React.useState(false)
  const [allAccounts, setAllAccounts] = React.useState([])

  const [message, setMessage] = React.useState(null)

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
          setMessage={setMessage}
          orders={orders}
          setOrders={setOrders}
          modal={modal}
        />
      )
    } else {
      return (
        <LimitOrder
          action={buy}
          activeAccounts={activeAccounts}
          allAccounts={allAccounts}
          setMessage={setMessage}
          orders={orders}
          setOrders={setOrders}
          modal={modal}
        />
      )
    }
  }

  const renderMessage = () => {
    if (message) {
      return (
        <h4>{message}</h4>
      )
    } else {
      return
    }
  }

  React.useEffect(() => {
    if (allAccounts.length === 0) {
      getAllAccounts()
    }

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
          setMessage={setMessage}
        />
      </div>
        <div className='order-container'>
          {renderMain()}
        </div>
        <div className='message-container'>
          {renderMessage()}
        </div>
    </div>
  )
}
