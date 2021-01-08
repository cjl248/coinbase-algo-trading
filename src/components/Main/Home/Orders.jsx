import React from 'react'

import Loading from '../../Loading.jsx'

export default function Orders({orders}) {

  const precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  const renderOrders = () => {
    if (orders) {
      return Object.keys(orders).map(product => {
        return orders[product].map((order, index) => {
          return (
            <div key={index} className='order'>
              <div>{order.product_id}</div>
              <div>{order.type.toUpperCase()}</div>
              <div>{order.side.toUpperCase()}</div>
              <div>{precise(order.price, 6)}</div>
              <div>{precise(order.size, 4)}</div>
            </div>
          )
        })
      })
    } else return (<Loading></Loading>)
  }

  return (
    <div className='orders-container'>
      <div className='orders-title'>{`Orders`}</div>
      <div className='orders-headers'>
        <div>{`Product`}</div>
        <div>{`Type`}</div>
        <div>{`Side`}</div>
        <div>{`Price`}</div>
        <div>{`Size`}</div>
      </div>
      <div className='orders'>{renderOrders()}</div>
    </div>
  )

}
