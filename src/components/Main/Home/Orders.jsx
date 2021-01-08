import React from 'react'

export default function Orders({orders}) {

  const precise = float => Number.parseFloat(float).toPrecision(5)

  const renderOrders = () => {
    if (!orders) return
    return orders.map((order, index) => {
      return (
        <div key={index} className='order'>
          <div>{order.product_id}</div>
          <div>{order.type.toUpperCase()}</div>
          <div>{order.side.toUpperCase()}</div>
          <div>{precise(order.price)}</div>
          <div>{precise(order.size)}</div>
        </div>
      )
    })
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
