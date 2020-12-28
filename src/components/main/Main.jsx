import './Main.scss'
import React from 'react'
import Button from '@material-ui/core/Button'

const _KEY = process.env.REACT_APP_API_KEY
const _SECRET = process.env.REACT_APP_API_SECRET
const _PASSPHRASE = process.env.REACT_APP_PASSPHRASE
const timestamp = Date.now()


export default function Main({page}) {

  const handleClick = () => {
    // const response = fetch()
    console.log(_KEY)
    console.log(_SECRET)
    console.log(_PASSPHRASE)
  }

  return (
    <div className='main'>
      <div>{page}</div>
      <Button
        color='primary'
        variant='outlined'
        onClick={handleClick}>
        {`Send Request`}</Button>
    </div>
  )
}
