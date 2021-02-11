import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


export default function Fibonacci({ fibonacci, activeAccounts, activeFibonacciCurrency, setActiveFibonacciCurrency }) {

  const precision = (float, p) => Number.parseFloat(float).toPrecision(p)

  const subtract = (n1, n2) => {
    return parseFloat(n1)-parseFloat(n2)
  }
  const add = (n1, n2) => {
    return parseFloat(n1)+parseFloat(n2)
  }

  // const getProductIds = () => {
  //   return activeAccounts.map(account => {
  //     return `${account.currency}-USD`
  //   })
  // }

  const renderMenuItems =  () => {
    return activeAccounts.map((account, index) => {
      if (account.currency !== 'USDC' && account.currency !== 'USD') {
        return (
          <MenuItem key={index}
            value={`${account.currency}-USD`}>
            {account.currency}
          </MenuItem>
        )
      } else return null
    })
  }

  const handleChange = (e) => setActiveFibonacciCurrency(e.target.value)

  // Renders high, last, low stats for the day
  const renderDayStats = () => {
    if (fibonacci && fibonacci.day_stats) {
      return (
        <section>
          <div className='high' key='high'>
            <span className='label'>{`High: `}</span>
            <span className='stat'>{`$${precision(fibonacci.day_stats.high, 7)}`}</span>
          </div>
          <div className='current' key='current'>
            <span className='label'>{`Current: `}</span>
            <span className='stat'>{`$${precision(fibonacci.day_stats.last, 7)}`}</span>
          </div>
          <div className='low' key='low'>
            <span className='label'>{`Low: `}</span>
            <span className='stat'>{`$${precision(fibonacci.day_stats.low, 7)}`}</span>
          </div>
        </section>
      )
    } else {
      return <h1>{`Loading day stats...`}</h1>
    }
  }

  // Renders historical max, mean and min of current time window
  const renderHistoricalStates = () => {
    if (fibonacci && fibonacci.historical_stats) {
      return (
        <section>
          <div className='max' key='max'>
            <span className='label'>{`Max: `}</span>
            <span className='stat'>{`$${precision(fibonacci.historical_stats.max, 7)}`}</span>
          </div>
          <div className='mean' key='mean'>
            <span className='label'>{`Mean: `}</span>
            <span className='stat'>{`$${precision(fibonacci.historical_stats.middle, 7)}`}</span>
          </div>
          <div className='min' key='min'>
            <span className='label'>{`Min: `}</span>
            <span className='stat'>{`$${precision(fibonacci.historical_stats.min, 7)}`}</span>
          </div>
        </section>
      )
    }
    return <h1>{`Loading historical stats...`}</h1>
  }

  /**
  * Fibonacci retracement levels are 23.6%, 38.2%, 61.8%, and 78.6%.
  * Calculates the retracement up after a fall from max and a
  * retracement down after a rise up
  */
  const renderCombinedStats = () => {
    if (fibonacci && fibonacci.historical_stats && fibonacci.day_stats) {
      const fibBreakPoints = [23.6, 38.2, 61.8, 78.6]
      const { max, min } = fibonacci.historical_stats
      const { high, last, low } = fibonacci.day_stats

      const belowHigh = max-low
      const aboveLow = high-min

      const renderBelowHighIndicators = fibBreakPoints.map((bp, index) => {
        const fibonacci = .01*bp*belowHigh
        const sum = add(last, fibonacci)
        return (
          <li className='breakpoint' key={index}>
            <span className='label'>{`${bp}%: `}</span>
            <span className='stat'>{` $${precision(sum, 7)}`}</span>
          </li>
        )
      })
      const renderAboveLowIndicators = fibBreakPoints.map((bp, index) => {
        const fibonacci = .01*bp*aboveLow
        const sum = subtract(last, fibonacci)
        return (
          <li className='breakpoint' key={index}>
            <span className='label'>{`${bp}%: `}</span>
            <span className='stat'>{` $${precision(sum, 7)}`}</span>
          </li>
        )
      })
      return (
        <section className='combined-stats'>
          <p>
            {`Today's LOW is below the historical MAX by $${precision(belowHigh, 6)}. Fibonacci breakpoints on a bounce up are at: `}
          </p>
          <ul className='below-high'>{renderBelowHighIndicators}</ul>
          <p>
            {`Today's HIGH is above the historical MIN by $${precision(aboveLow, 6)}. Fibonacci breakpoints on a drop down are at:`}
          </p>
          <ul className='above-high'>{renderAboveLowIndicators}</ul>

        </section>
      )
    } return <h1>{`Loading combined stats...`}</h1>
  }

  return (
    <>
    <div className='fibonacci-header'>
      <div className='fibonacci-main-title'>{`Fibonacci Retracement`}</div>
      <FormControl variant="outlined" style={{width: '200px'}}>
        <InputLabel id="demo-simple-select-outlined-label">{`Currency`}</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={activeFibonacciCurrency}
          onChange={handleChange}
          label="Age">
          {renderMenuItems()}
        </Select>
      </FormControl>
    </div>
    <div className='fibonacci-container'>
      <h2>{`Statistics`}</h2>
      <section className='fibonacci-stats'>
        <div className='day-stats' key='day'>
          <h3>{`Day Stats`}</h3>
          {renderDayStats()}
        </div>
        <div className='historical-stats' key='historical'>
          <h3>{`Historical Stats`}</h3>
          {renderHistoricalStates()}
        </div>
        </section>
        <section className='combined-stats-container'>
          <h2>{`Fibonacci Breakpoints`}</h2>
          {renderCombinedStats()}
        </section>
    </div>
    </>
  )


}
