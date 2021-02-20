import React from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

export default function Toggle({
  type,
  buy=null,
  toggleBuy=null,
  marketOrder=null,
  toggleMarketOrder=null,
  setMessage,
}) {

  const handleToggle = () => {
    if (type === 'action') toggleBuy(!buy)
    if (type === 'order') {
      setMessage('')
      toggleMarketOrder(!marketOrder)
    }
  }

  const resolveFalseLabel = () => {
    if (type === 'action') {
      return "Buy"
    }
    if (type === 'order') {
      return "Market"
    }
  }

  const resolveTrueLabel = () => {
    if (type === 'action') {
      return "Sell"
    }
    if (type === 'order') {
      return "Limit"
    }
  }

  const resolveValue = () => {
    if (type === 'action') {
      return buy
    }
    if (type === 'order') {
      return marketOrder
    }
  }

  const resolveFalseStyle = () => {
    if (buy === false || marketOrder === false) {
      return '#0B47E4'
    } else {
      return ''
    }
  }

  const resolveTrueStyle = () => {
    if (buy === true || marketOrder === true) {
      return '#0B47E4'
    } else {
      return ''
    }
  }

  return (
    <Typography component="div">
      <Grid component="label" container alignItems="center" spacing={0}>
        <Grid item className='switch-labels'
          style={{color: resolveFalseStyle()}}>
          {resolveFalseLabel()}
        </Grid>
          <Grid item>
            <Switch
              checked={resolveValue()}
              onChange={handleToggle}
              color='default'>
            </Switch>
          </Grid>
        <Grid item className='switch-labels'
          style={{color: resolveTrueStyle()}}>
          {resolveTrueLabel()}
        </Grid>
      </Grid>
    </Typography>
  )

}
