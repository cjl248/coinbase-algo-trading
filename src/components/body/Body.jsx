import './Body.scss'
import React from 'react'

import Main from '../main/Main.jsx'
import NavBar from '../navbar/NavBar.jsx'

const pages ={
  'a1': 'Fibonacci Retracement',
  'a2': 'Relative Strength Index (RSI)',
  'a3': 'Bollinger Bands',
}

export default function Body() {

  const [page, setPage] = React.useState('a1')

  return(
    <div className='body'>
      <NavBar setPage={setPage}></NavBar>
      <Main page={pages[page]}></Main>
    </div>
  )
}
