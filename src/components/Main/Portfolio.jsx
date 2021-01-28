import React from 'react'

const websocketAPI = 'wss://ws-feed.pro.coinbase.com'

export default function Portfolio({activeAccounts}) {

  const [socket, setSocket] = React.useState(null)
  const [prices, setPrices] = React.useState({})

  const precise = (float, precision) => Number.parseFloat(float).toPrecision(precision)

  React.useEffect(() => {

    const getProductIds = () => {
      return activeAccounts.map(account => {
        return `${account.currency}-USD`
      })
    }

    if (!socket) {
      setSocket(new WebSocket(websocketAPI))
    }
    if (socket) {
      socket.onopen = () => {
        const subscribe = {
          "type": "subscribe",
          "product_ids": getProductIds(),
          "channels": [
            {
              "name": "ticker",
              "product_ids": getProductIds()
            }
          ]
        }
        socket.send(JSON.stringify(subscribe))
      }

      socket.onmessage = (message) => {
        try {
          const response = JSON.parse(message.data);
          if (response.type === 'ticker'){
            getProductIds().map(id => {
              if (response.product_id === id) {
                return setPrices({...prices, [id]: response.price})
              } else return null
            })
          }
        } catch (e) {
          console.log('Not valid JSON: ', JSON.parse(message.data))
          return
        }
      }

      socket.onerror = (error) => {
        try {
          console.log("There was an error: ", error);
        } catch (e) {
          console.log("There was an error: ", e);
          return
        }
      }

      return function cleanup() {
        socket.onclose = () => {
          const unsubscribe = {
            "type": "unsubscribe",
            "product_ids": getProductIds(),
            "channels": [ "ticker" ]
          }
          socket.send(JSON.stringify(unsubscribe))
          socket.close()
        }
      }
    }

    return function cleanup() {
      if (socket) {
        const unsubscribe = {
          "type": "unsubscribe",
          "product_ids": getProductIds(),
          "channels": [ "ticker" ]
        }
        socket.send(JSON.stringify(unsubscribe))
        socket.close()
      }
    }

  }, [activeAccounts, socket, setSocket, prices, setPrices])

  const renderAssets = () => {
    return activeAccounts.map((account, index) => {
      for (let key in prices) {
        if (key.slice(0, 3) === account.currency || key.slice(0, 4) === account.currency) {
          return (
            <div className='p-price' key={index}>
              <div
                className='p-currency'>
                {`${account.currency}: `}
              </div>
              <div
                className='p-value'>
                {`$${precise(account.balance*prices[key], 5)}`}
              </div>
            </div>
          )
        }
      }
      return null
    })
  }

  return (
    <div className='portfolio-container'>
      <div
        className='portfolio-balance-container'>
        <div className='p-balance-title'>{`Balances`}</div>
        <div className='balances'>
          {renderAssets()}
        </div>
      </div>
      <div
        className='portfolio-assets-container'>
        <div className='p-assets-title'>{`Assets`}</div>
      </div>
    </div>
  )
}
