import React from 'react'

/*
* Arguments for limit order:
* side, product_id, size, price, time_in_force=nil, cancel_after=nil
*/

export default function LimitOrder({ buy }) {
  return (
    <div className='limit-order'>
      <h3>{`Limit Order`}</h3>
    </div>
  )
}
