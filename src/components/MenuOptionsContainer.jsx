import React from 'react'

import MenuOption from './MenuOption.jsx'

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PieChartRoundedIcon from '@material-ui/icons/PieChartRounded';
import ShowChartRoundedIcon from '@material-ui/icons/ShowChartRounded';
import FunctionsRoundedIcon from '@material-ui/icons/FunctionsRounded';

const menuItems = {
  'home': <HomeRoundedIcon />,
  'portfolio': <PieChartRoundedIcon />,
  'prices': <ShowChartRoundedIcon />,
  'algorithms': <FunctionsRoundedIcon />
}

const renderMenuItems = (activePage, setActivePage) => {
  return Object.keys(menuItems).map((item, index) => {
    return (
      <MenuOption
        key={index}
        title={item}
        icon={menuItems[item]}
        activePage={activePage}
        setActivePage={setActivePage}>
      </MenuOption>
    )
  })
}

export default function MenuOptionsContainer({activePage, setActivePage}) {
  return (
    <div className='menu-options-container'>
      {renderMenuItems(activePage, setActivePage)}
    </div>
  )
}
