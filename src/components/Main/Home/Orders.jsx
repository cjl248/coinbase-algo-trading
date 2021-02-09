import React from 'react'
import Loading from '../../Loading.jsx'

const oAPI = 'http://localhost:3000/c_orders'

export default function Orders() {

  const [orders, setOrders] = React.useState([])
  const [requestedOrders, setRequestedOrders] = React.useState(false)
  const [controller] = React.useState(new AbortController())

  const precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  const getOrders = async () => {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      signal: controller.signal
    }
    if (orders.length === 0) {
      try {
        if (requestedOrders) {
          return null
        } else {
          const response = await fetch(oAPI, config)
          response.json().then(data => {
            setRequestedOrders(true)
            return setOrders(data)
          })
        }
      } catch(e) {
        if (e.name === "AbortError") {
          console.warn("Orders fetch aborted!")
        } else {
          console.log(`Error: ${e}`);
        }
      }
    }
  }

  const renderOrders = () => {
    if (orders.length === 0) {
      if (requestedOrders) {
        return (<h3>{`You have no orders...`}</h3>)
      } else {
        return (<Loading />)
      }
    } else if (orders.length > 0) {
      return orders.map(order => {
        return (
          <div key={order.id} className='order'>
            <div>{order.product_id}</div>
            <div>{order.type.toUpperCase()}</div>
            <div>{order.side.toUpperCase()}</div>
            <div>{precise(order.price, 6)}</div>
            <div>{precise(order.size, 4)}</div>
          </div>
        )
      })
    }
  }

  React.useEffect(() => {
    if (orders.length === 0 ) {
      getOrders()
    }
    return function cleanup() {
      if (orders.length > 0) {
        controller.abort()
      }
    }
  })

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
