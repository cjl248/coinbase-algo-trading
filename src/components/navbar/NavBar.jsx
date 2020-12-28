import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './NavBar.scss'

export default function SimpleMenu({setPage}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null)
  };

  const handleChoose = (e) => {
    setAnchorEl(null)
    setPage(e.currentTarget.attributes[4].value)
  }

  return (
    <div className='nav-bar'>
      <Button
        color='primary'
        variant='contained'
        onClick={handleClick}>
        {`Algorithms`}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          value='a1'
          onClick={handleChoose}>
          {`Fibonacci Retracement`}
        </MenuItem>
        <MenuItem
          value='a2'
          onClick={handleChoose}>
          {`Relative Strength Index (RSI)`}
        </MenuItem>
        <MenuItem
          value='a3'
          onClick={handleChoose}>
          {`Bollinger Bands`}
        </MenuItem>
      </Menu>
    </div>
  );
}
