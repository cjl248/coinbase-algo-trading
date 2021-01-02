import './Body.scss'
import React from 'react'

import Accounts from '../account/Accounts.jsx'
import Algorithms from '../algorithms/Algorithms.jsx'
import NavBar from '../navbar/NavBar.jsx'

const pages ={
  'a1': 'Fibonacci Retracement',
  'a2': 'Relative Strength Index (RSI)',
  'a3': 'Bollinger Bands',
}

export default function Body() {

  const [page, setPage] = React.useState('a1')

  const renderMain = () => {
    if (page === 'account') {
      return (<Accounts page={page}></Accounts>)
    } else {
      return (<Algorithms page={pages[page]}></Algorithms>)
    }
  }

  return(
    <div className='body'>
      <NavBar setPage={setPage}></NavBar>
      {renderMain()}
    </div>
  )
}
