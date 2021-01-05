import React from 'react'

import MainTitle from './MainTitle.jsx'
import MenuOptionsContainer from './MenuOptionsContainer.jsx'

export default function SideMenuContainer({activePage, setActivePage}) {

  return (
    <div className='side-menu-container'>
      <MainTitle></MainTitle>
      <MenuOptionsContainer
        activePage={activePage}
        setActivePage={setActivePage}>
      </MenuOptionsContainer>
    </div>
  )

}
