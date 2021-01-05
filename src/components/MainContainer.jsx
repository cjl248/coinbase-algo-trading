import  React from 'react'

import MainNavBar from './MainNavBar.jsx'

import Home from './Main/Home.jsx'
import Portfolio from './Main/Portfolio.jsx'
import Prices from './Main/Prices.jsx'
import Algorithms from './Main/Algorithms.jsx'

export default function MainContainer({activePage}) {

  const renderActivePage = () => {
    switch(activePage) {
      case 'home':
        return (<Home></Home>)
      case 'portfolio':
        return (<Portfolio></Portfolio>)
      case 'prices':
        return (<Prices></Prices>)
      case 'algorithms':
        return (<Algorithms></Algorithms>)
      default:
        return (<Home></Home>)
    }
  }

  return (
    <div className='main-container'>
      <div className='main-page-menu'>
        <MainNavBar activePage={activePage}></MainNavBar>
      </div>
      <div className='active-page-container'>
        {renderActivePage()}
      </div>
    </div>
  )
}
