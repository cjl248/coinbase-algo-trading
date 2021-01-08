import  React from 'react'

import MainNavBar from './MainNavBar.jsx'

import Home from './Main/Home.jsx'
import Portfolio from './Main/Portfolio.jsx'
import Prices from './Main/Prices.jsx'
import Algorithms from './Main/Algorithms.jsx'

const aAPI = 'http://localhost:3000/c_accounts'

export default function MainContainer({activePage}) {

  const [modal, setModal] = React.useState(false)
  const [activeAccounts, setActiveAccounts] = React.useState([])

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
        const aAccounts = accounts.filter((account) => {
          return account.balance > 0 && account.currency !== 'USD'
        })
        setActiveAccounts(aAccounts)
      })
    },[setActiveAccounts])

  const renderActivePage = () => {
    switch(activePage) {
      case 'home':
        return (<Home></Home>)
      case 'portfolio':
        return (<Portfolio></Portfolio>)
      case 'prices':
        return (<Prices activeAccounts={activeAccounts}></Prices>)
      case 'algorithms':
        return (<Algorithms></Algorithms>)
      default:
        return (<Home></Home>)
    }
  }

  const mainClass = () => modal ? 'main-container blur' : 'main-container'
  const modalClass = () => modal ? 'modal-show' : 'modal-hide'

  const deactivateModal = () => {
    if (modal) setModal(false)
  }

  const activateModal = () => {
    if (!modal) setModal(true)
  }

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
      <div className='modal-content'>
        <div className='modal-title'>{`BUY/SELL`}</div>
      </div>
    </div>
    </>
  )
}