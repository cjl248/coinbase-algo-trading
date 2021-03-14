import  React from 'react'

import MainNavBar from './MainNavBar.jsx'

import Home from './Main/Home.jsx'
import Portfolio from './Main/Portfolio.jsx'
import Prices from './Main/Prices.jsx'
import Algorithms from './Main/Algorithms.jsx'
import Modal from './Modal.jsx'

const aAPI = 'https://coinbase-algo-backend.herokuapp.com/c_accounts'
const oAPI = 'https://coinbase-algo-backend.herokuapp.com/c_orders'

export default function MainContainer({ setActivePage, activePage, activeSection }) {

  const [modal, setModal] = React.useState(false)
  const [activeAccounts, setActiveAccounts] = React.useState([])
  const [orders, setOrders] = React.useState([])

  React.useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json",
      }
    }
    fetch(aAPI, config)
      .then(r => r.json())
      .then(accounts => {
        if (!accounts) return
        const activeAccounts = accounts.filter((account) => {
          return account.balance > 0
        })
        setActiveAccounts(activeAccounts)
      })
      fetch(oAPI, config)
        .then(r => r.json())
        .then(orders => {
          if (!orders) return
          setOrders(orders)
        })
    },[setActiveAccounts, setOrders])

  const renderActivePage = () => {
    switch(activePage) {
      case 'home':
        return (
          <Home
            setActivePage={setActivePage}
            activeAccounts={activeAccounts}
            orders={orders}
            setOrders={setOrders}>
          </Home>
        )
      case 'portfolio':
        return (
          <Portfolio
            activeAccounts ={activeAccounts}>
          </Portfolio>
        )
      case 'prices':
        return (
          <Prices
            activeAccounts={activeAccounts}>
          </Prices>
        )
      case 'algorithms':
        return (
          <Algorithms
            activeAccounts={activeAccounts}
            activeSection={activeSection}>
          </Algorithms>
        )
      default:
        return (
          <Home
            setActivePage={setActivePage}
            activeAccounts={activeAccounts}
            orders={orders}>
          </Home>
        )
    }
  }

  const mainClass = () => modal ? 'main-container blur' : 'main-container'
  const modalClass = () => modal ? 'modal-show' : 'modal-hide'

  const activateModal = () => { if (!modal) setModal(true) }
  const deactivateModal = () => { if (modal) setModal(false) }

  return (
    <>
    <div
      className={mainClass()}
      onClick={deactivateModal}>
      <div className='main-page-menu'>
        <MainNavBar
          activePage={activePage}
          activateModal={activateModal}>
        </MainNavBar>
      </div>
      <div className='active-page-container'>
        {renderActivePage()}
      </div>
    </div>
    <div className={modalClass()}>
      <Modal
        modal={modal}
        activeAccounts={activeAccounts}
        orders={orders}
        setOrders={setOrders}>
      </Modal>
    </div>
    </>
  )
}
