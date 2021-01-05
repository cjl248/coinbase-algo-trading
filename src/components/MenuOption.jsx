import React from 'react'

export default function MenuOption({title, icon, activePage, setActivePage}) {

  const determineClass = () => {
    return activePage === title ? 'active-menu-option' : 'menu-option'
  }

  const formatText = () => title[0].toUpperCase()+title.slice(1)

  const renderItem = () => {
    return (
      <>
        <span className='item-icon'>{icon}</span>
        <span className='item-text'>{formatText()}</span>
      </>
    )
  }

  const handleClick = () => {
    setActivePage(title)
  }


  return (
    <div
      className={determineClass()}
      onClick={handleClick}>
      {renderItem()}
    </div>
  )
}
